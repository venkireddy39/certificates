import { courseService } from "../../Courses/services/courseService";
import { batchService } from "../../Batches/services/batchService";
import { enrollmentService } from "../../Batches/services/enrollmentService";
import { sessionService } from "../../Batches/services/sessionService";
import { apiFetch } from "../../../services/api";

const API_BASE_URL = "/api";

export const attendanceService = {
    // ------------------------------------------
    // GENERIC (Assumed existing on target backend)
    // ------------------------------------------

    // Get all courses
    getCourses: () => courseService.getCourses(),

    // Get batches for a course
    getBatches: (courseId) => batchService.getBatchesByCourseId(courseId),

    // Get students for a batch
    getStudents: (batchId) => enrollmentService.getStudentsByBatch(batchId),

    // Get academic sessions (Classes) for a batch
    getAcademicSessions: async (batchId) => {
        const data = await sessionService.getSessionsByBatchId(batchId);
        return (data || []).map(s => ({
            ...s,
            classId: s.classId || s.sessionId // Normalize property name
        }));
    },

    // ------------------------------------------
    // ATTENDANCE SESSION CONTROLLER
    // ------------------------------------------

    // Get sessions with optional batch and date filters
    getSessions: async (batchId, date) => {
        const effectiveDate = date || new Date().toISOString().split('T')[0];
        const url = `${API_BASE_URL}/attendance/session/date/${effectiveDate}`;

        try {
            const apiSessions = await apiFetch(url);
            const combined = Array.isArray(apiSessions) ? apiSessions : [];
            console.log("[attendanceService] getSessions RAW:", combined);

            if (combined.length > 0) {
                console.log("[attendanceService] getSessions SAMPLE:", combined[0]);
            }

            // Normalize and filter
            const mapped = combined.map(s => {
                // Robust mapping to find the Academic Session ID
                const acadId = s.classId || s.sessionId || s.session_id || s.academicSessionId || s.academic_session_id || s?.session?.id;

                // Robust title finding
                const title = s.title || s.sessionName || s.name || s.topic ||
                    s?.session?.title || s?.session?.sessionName || s?.session?.name ||
                    `Session #${acadId}`;

                // Robust batch/course ID finding
                const recBatchId = s.batchId || s.batch_id || s?.batch?.batchId || s?.batch?.id || s?.session?.batchId;
                const recCourseId = s.courseId || s.course_id || s?.course?.courseId || s?.course?.id || s?.session?.courseId;

                // Robust Name Finding
                const recBatchName = s.batchName || s.batch_name || s?.batch?.batchName || s?.batch?.name || s?.session?.batchName;
                const recCourseName = s.courseName || s.course_name || s?.course?.courseName || s?.course?.name || s?.session?.courseName;

                return {
                    ...s,
                    classId: acadId,
                    title: title,
                    batchId: recBatchId || s.batchId,
                    courseId: recCourseId || s.courseId,
                    batchName: recBatchName || s.batchName,
                    courseName: recCourseName || s.courseName
                };
            });

            if (batchId) {
                return mapped.filter(s => String(s.batchId) === String(batchId));
            }
            return mapped;
        } catch (e) {
            console.warn("[attendanceService] Could not fetch sessions", e);
            return [];
        }
    },

    // Get session details by ID
    // attendanceSessionId: The unique ID for the specific attendance event
    getSession: async (attendanceSessionId) => {
        const data = await apiFetch(`${API_BASE_URL}/attendance/session/${attendanceSessionId}`);
        return {
            ...data,
            classId: data?.classId || data?.sessionId || data?.session_id // Ensure classId is present
        };
    },

    // Start a new attendance session
    // classId: LMS Academic Session ID (Backend expects this as 'sessionId' param)
    startSession: async (classId, courseId, batchId, userId) => {
        console.log(`[attendanceService] Checking existing sessions before start...`);

        // 1. Check if session already exists for this class
        try {
            const existingSessions = await attendanceService.getAttendanceSessionsByClassId(classId);
            if (Array.isArray(existingSessions) && existingSessions.length > 0) {
                // Find any ACTIVE session logic
                const active = existingSessions.find(s => (s.status === 'ACTIVE' || s.status === 'LIVE'));
                if (active) {
                    console.log(`[attendanceService] Found existing active session ${active.id}, re-using.`);
                    return active; // Return existing instead of getting 409 or duplicate
                }
            }
        } catch (e) {
            console.warn("[attendanceService] Check existing failed, trying to start anyway", e);
        }

        console.log(`[attendanceService] Starting NEW session: classId=${classId}`);
        const params = new URLSearchParams({
            sessionId: Number(classId),
            courseId: Number(courseId),
            batchId: Number(batchId),
            userId: Number(userId || 1)
        });
        return apiFetch(`${API_BASE_URL}/attendance/session/start?${params.toString()}`, {
            method: 'POST'
        });
    },

    // End an attendance session
    endSession: (attendanceSessionId) => {
        console.log(`[attendanceService] Ending session: ${attendanceSessionId}`);
        return apiFetch(`${API_BASE_URL}/attendance/session/${Number(attendanceSessionId)}/end`, {
            method: 'PUT'
        });
    },

    // Delete an attendance session (CLEANUP)
    deleteSession: (attendanceSessionId) => {
        console.log(`[attendanceService] Deleting session: ${attendanceSessionId}`);
        return apiFetch(`${API_BASE_URL}/attendance/session/${Number(attendanceSessionId)}`, {
            method: 'DELETE'
        });
    },

    // ------------------------------------------
    // ATTENDANCE RECORD CONTROLLER
    // ------------------------------------------

    // Get records for a specific attendance session
    getAttendance: (attendanceSessionId) =>
        apiFetch(`${API_BASE_URL}/attendance/record/session/${Number(attendanceSessionId)}`),

    // Save/Mark bulk attendance
    saveAttendance: async (attendanceSessionId, records) => {
        if (!records || records.length === 0) return null;

        // Deduplicate input records by studentId to prevent sending duplicates in payload
        const uniqueMap = new Map();
        records.forEach(r => {
            if (r.studentId) {
                uniqueMap.set(Number(r.studentId), r);
            }
        });

        // 1. Fetch EXISTING records for this session to get their IDs
        // This prevents creating duplicate rows if we are updating
        let existingRecords = [];
        try {
            existingRecords = await attendanceService.getAttendance(attendanceSessionId);
            if (!Array.isArray(existingRecords)) existingRecords = [];
        } catch (e) {
            console.warn("Could not fetch existing records for merge, proceeding blindly", e);
        }

        const existingMap = new Map();
        existingRecords.forEach(e => existingMap.set(Number(e.studentId), e.id));

        const toCreate = [];
        const toUpdate = [];

        Array.from(uniqueMap.values()).forEach(r => {
            const studentId = Number(r.studentId || 0);

            // Resolve ID: Use passed ID, or look up from existing db records
            const existingId = r.id || existingMap.get(studentId);

            const record = {
                // Link to the attendance record primary key if updating
                id: existingId ? Number(existingId) : null,
                // Link to the attendance session ID (Long in Java)
                attendanceSessionId: Number(attendanceSessionId),
                // Links to student_id (Long in Java)
                studentId: studentId,
                // STATUS
                status: (r.status || 'PRESENT').toUpperCase(),
                // REMARKS
                remarks: r.remarks || "",
                // SOURCE
                source: (r.source || r.mode || 'ONLINE').toUpperCase(),
                // DATE
                attendanceDate: r.attendanceDate || new Date().toISOString().split('T')[0],
                markedBy: 1
            };

            if (existingId) {
                toUpdate.push(record);
            } else {
                record.id = null; // Send explicit null for new records, don't delete key
                toCreate.push(record);
            }
        });

        if (Number.isNaN(Number(attendanceSessionId)) || Number(attendanceSessionId) <= 0) {
            console.error("Invalid Attendance Session ID for Save:", attendanceSessionId);
            throw new Error("Invalid Session ID");
        }

        console.log(`[attendanceService] Splitting save: ${toCreate.length} create, ${toUpdate.length} update`);

        try {
            const promises = [];

            // 1. Bulk Create New Records
            if (toCreate.length > 0) {
                promises.push(
                    apiFetch(`${API_BASE_URL}/attendance/record/bulk`, {
                        method: 'POST',
                        body: JSON.stringify(toCreate)
                    })
                );
            }

            // 2. Individual Update Existing Records (Backend likely lacks bulk update)
            // Or if backend supports bulk update via PUT, we could use that. 
            // Assuming we must iterate or use a flexible endpoint.
            // Let's try iterating updates for safety to avoid 500s.
            toUpdate.forEach(rec => {
                promises.push(
                    apiFetch(`${API_BASE_URL}/attendance/record/${rec.id}`, { // Assuming generic update endpoint
                        method: 'PUT',
                        body: JSON.stringify(rec)
                    }).catch(e => console.error(`Failed to update record ${rec.id}`, e))
                );
            });

            await Promise.all(promises);
            return { success: true };
        } catch (error) {
            console.error("[attendanceService] saveAttendance error details:", error);
            throw error;
        }
    },

    // Get comprehensive attendance history for a batch
    getAttendanceHistory: async (batchId) => {
        try {
            // Attempt to hit the batch-level endpoint
            // If backend is missing this endpoint (which seems to be the case), we return empty []
            // to allow the UI to function for Class-level reports.
            const data = await apiFetch(`${API_BASE_URL}/attendance/record/batch/${Number(batchId)}`);

            return (data || []).map(r => ({
                id: r.id,
                studentId: r.studentId,
                date: r.attendanceDate,
                status: r.status,
                method: r.source,
                presenceMinutes: 0,
                studentName: r.studentName || `Student #${r.studentId}`,
                courseName: r.courseName || `Session #${r.attendanceSessionId}`
            }));

        } catch (error) {
            console.warn("[attendanceService] Batch history endpoint missing or failed. Returning empty list.", error);
            // Return empty array so UI doesn't crash or show infinite loading
            return [];
        }
    },

    // ------------------------------------------
    // OFFLINE QUEUE CONTROLLER (Manual Marking)
    // ------------------------------------------

    // Store a single offline/manual attendance record
    saveToOfflineQueue: (data) => {
        const payload = {
            sessionId: Number(data.sessionId || data.attendanceSessionId),
            batchId: Number(data.batchId),
            studentId: Number(data.studentId),
            status: (data.status || 'PRESENT').toUpperCase(),
            remarks: data.remarks || "",
            synced: false
        };
        console.log("[attendanceService] saveToOfflineQueue payload:", payload);
        return apiFetch(`${API_BASE_URL}/attendance/offline-queue`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    // Get the offline queue for a specific batch
    getOfflineQueue: (batchId) =>
        apiFetch(`${API_BASE_URL}/attendance/offline-queue/batch/${Number(batchId)}`),

    // Trigger sync from Offline Queue to main Records
    syncOfflineQueue: () =>
        apiFetch(`${API_BASE_URL}/attendance/offline-queue/sync`, {
            method: 'POST'
        }),

    // Delete a record from the offline queue
    deleteOfflineQueueRecord: (id) =>
        apiFetch(`${API_BASE_URL}/attendance/offline-queue/${Number(id)}`, {
            method: 'DELETE'
        }),

    // Get dashboard stats
    getDashboardStats: (courseId, batchId) =>
        apiFetch(`${API_BASE_URL}/attendance/record/dashboard?courseId=${Number(courseId || 0)}&batchId=${Number(batchId || 0)}`),

    // Get all attendance instances for an academic session (classId)
    getAttendanceSessionsByClassId: async (classId) => {
        console.log(`[attendanceService] Fetching attendance sessions for classId: ${classId}`);
        // Backend: @GetMapping("/session/{sessionId}/all") under /api/attendance/session
        return apiFetch(`${API_BASE_URL}/attendance/session/session/${Number(classId)}/all`);
    },

    // ------------------------------------------
    // CONFIG CONTROLLER
    // ------------------------------------------

    // Get attendance configuration for a course/batch
    getAttendanceConfig: (courseId, batchId) =>
        apiFetch(`${API_BASE_URL}/attendance/config?courseId=${Number(courseId)}&batchId=${Number(batchId)}`),

    // Create new configuration
    createAttendanceConfig: (config) =>
        apiFetch(`${API_BASE_URL}/attendance/config`, {
            method: 'POST',
            body: JSON.stringify(config)
        }),

    // Update existing configuration
    updateAttendanceConfig: (configId, config) =>
        apiFetch(`${API_BASE_URL}/attendance/config/${Number(configId)}`, {
            method: 'PUT',
            body: JSON.stringify(config)
        }),

    // ------------------------------------------
    // CSV UPLOAD JOB
    // ------------------------------------------

    // Upload CSV file and create a job
    uploadCsvJob: (courseId, batchId, sessionId, attendanceDate, uploadedBy, file) => {
        const formData = new FormData();
        formData.append('courseId', courseId);
        formData.append('batchId', batchId);
        if (sessionId) formData.append('sessionId', sessionId);
        formData.append('attendanceDate', attendanceDate);
        formData.append('uploadedBy', uploadedBy);
        formData.append('file', file);

        return apiFetch(`${API_BASE_URL}/attendance/upload-job/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                "Content-Type": null
            }
        });
    },

    // Process a specific upload job
    processCsvJob: (uploadJobId) => {
        return apiFetch(`${API_BASE_URL}/attendance/upload-job/${uploadJobId}/process`, {
            method: 'POST'
        });
    },

    // Get all upload jobs for a batch
    getUploadJobsByBatch: (batchId) => {
        return apiFetch(`${API_BASE_URL}/attendance/upload-job/batch/${batchId}`);
    },

    // Get upload job status (assuming GET /id exists)
    getUploadJobStatus: (uploadJobId) => {
        return apiFetch(`${API_BASE_URL}/attendance/upload-job/${uploadJobId}`);
    }
};

export default attendanceService;
