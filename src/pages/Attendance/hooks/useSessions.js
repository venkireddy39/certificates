import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';
import { batchService } from '../../Batches/services/batchService';
import { enrollmentService } from '../../Batches/services/enrollmentService';
import { sessionService } from '../../Batches/services/sessionService';

// --- HELPERS ---

// Helper: Fetch scheduled academic sessions for all batches for a specific date
const fetchAllAcademicSessions = async (batches, dateStr) => {
    if (!batches || batches.length === 0) return [];

    try {
        const results = await Promise.all(
            batches.map(b => sessionService.getSessionsByBatchId(b.batchId).catch(() => []))
        );
        const flat = results.flat();

        // Filter by date
        return flat.filter(s => {
            // Check various date fields
            let d = s.date || s.sessionDate || s.scheduleDate || s.startDate;

            // Handle Java LocalDate Array [YYYY, MM, DD]
            if (Array.isArray(d)) {
                const [y, m, day] = d;
                d = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }

            // Handle string "YYYY-MM-DD" or ISO with T
            if (typeof d === 'string' && d.includes('T')) {
                d = d.split('T')[0];
            }

            return d === dateStr || (s.startTime && String(s.startTime).startsWith(dateStr));
        });
    } catch (e) {
        console.error("Failed to fetch academic sessions", e);
        return [];
    }
};

// Helper: Hydrate attendance sessions with missing duration
const hydrateWithDuration = async (sessions) => {
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) return [];

    const candidates = sessions.map(async (s) => {
        const status = (s.status || '').toUpperCase();
        const isActive = status === 'ACTIVE' || status === 'LIVE';
        const needsDuration = isActive && !s.endTime && !s.duration && (s.classId || s.sessionId);

        if (needsDuration) {
            try {
                const acadId = s.classId || s.sessionId;
                const acadDetails = await sessionService.getSessionById(acadId);

                if (acadDetails) {
                    const foundDuration = acadDetails.duration || acadDetails.durationMinutes || acadDetails.length || acadDetails.sessionDuration;
                    return {
                        ...s,
                        duration: foundDuration,
                        title: acadDetails.sessionName || acadDetails.title || s.title || s.sessionName
                    };
                }
            } catch (e) { }
        }
        return s;
    });

    return await Promise.all(candidates);
};

// Helper: Map ANY session (Attendance or Academic) to UI model
const mapSessionToUI = (s, batchMap, isDataFromAttendanceApi) => {
    // Lookup Batch Info
    let batchInfo = batchMap.get(String(s.batchId));
    if (!batchInfo) {
        batchInfo = batchMap.get(Number(s.batchId));
    }

    // 1. Unify Data Fields
    const uiDate = s.attendanceDate || s.date || s.startDate || new Date().toISOString().split('T')[0];
    const uiStartTime = s.startTime || (s.startedAt ? String(s.startedAt).split('T')[1]?.substring(0, 5) : null);

    // Duration: Prioritize explicit minutes, fallback to 60 for ALL sessions if missing
    let dur = s.duration || s.sessionDuration || s.durationMinutes || s.length;
    // Simplify duration parsing if it's a string like "1h" OR just ensure number
    if (typeof dur === 'string') {
        let clean = dur.toLowerCase().replace(/[()]/g, '');
        let mins = 0;
        let h = clean.match(/(\d+)\s*h/);
        let m = clean.match(/(\d+)\s*m/);
        if (h) mins += parseInt(h[1]) * 60;
        if (m) mins += parseInt(m[1]);
        if (!h && !m) mins = parseFloat(clean);
        dur = isNaN(mins) ? 0 : mins;
    }

    if (!dur) dur = 60; // Universal default to ensure end-time calculation works

    // 2. Calculate End Time & Over Status & Running Status
    let finalEndTime = s.endTime || s.scheduledEndTime;

    // Sanitize finalEndTime: Must be HH:MM format due to backend potentially sending "Ongoing" literal
    if (finalEndTime && !String(finalEndTime).match(/^\d{1,2}:\d{2}/)) {
        finalEndTime = null;
    }

    let isOver = false;
    let isRunning = false; // Logic from ClassesTab (start <= now <= end)

    const now = new Date();

    // Construct Date Objects for precise comparison
    let dateStr = uiDate;
    if (Array.isArray(uiDate)) {
        const [y, m, d] = uiDate;
        dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    } else if (String(uiDate).includes('T')) {
        dateStr = String(uiDate).split('T')[0];
    }

    // Construct Session Start/End Dates
    let sessionStart = null;
    let sessionEnd = null;

    if (uiStartTime) {
        sessionStart = new Date(`${dateStr}T${uiStartTime}`);

        // Handle finalEndTime logic
        if (finalEndTime && finalEndTime !== 'Ongoing') {
            sessionEnd = new Date(`${dateStr}T${finalEndTime}`);
            // Handle Midnight Crossing (End time is smaller than Start time logic can be complex, 
            // but if backend provided endTime that is small, assume next day)
            if (sessionEnd < sessionStart) {
                sessionEnd.setDate(sessionEnd.getDate() + 1);
            }
        } else {
            // Fallback: Add (dur) minutes to start
            sessionEnd = new Date(sessionStart.getTime() + (dur * 60000));

            // Calculate finalEndTime string for display "HH:MM"
            const dh = sessionEnd.getHours();
            const dm = sessionEnd.getMinutes();
            finalEndTime = `${String(dh).padStart(2, '0')}:${String(dm).padStart(2, '0')}`;
        }

        // Check Status
        if (now > sessionEnd) {
            isOver = true;
        } else if (now >= sessionStart && now <= sessionEnd) {
            isRunning = true;
        }
    } else {
        // Fallback: If no time, assume end of day passed
        const todayStr = now.toISOString().split('T')[0];
        if (dateStr < todayStr) isOver = true;
    }


    // Backend Status Normalization
    let status = (s.status || 'SCHEDULED').toUpperCase();
    if (isDataFromAttendanceApi && (status === 'ACTIVE' || status === 'LIVE')) status = 'LIVE';
    if (status === 'ENDED') isOver = true;

    // Academic Logic Overrides
    if (!isDataFromAttendanceApi) {
        if (isOver) {
            status = 'COMPLETED';
        } else if (isRunning) {
            status = 'LIVE';
        }
    }

    // Normalize ID
    const uiId = isDataFromAttendanceApi ? s.id : (s.sessionId || s.id);
    const uniqueKey = isDataFromAttendanceApi ? `att-${uiId}` : `acad-${uiId}`;

    return {
        id: uiId,
        uid: uniqueKey,
        isAttendance: isDataFromAttendanceApi,
        title: s.title || s.sessionName || s.topicName || s.subjectName || `Session #${uiId}`,
        batchName: s.batchName || batchInfo?.batchName || `Batch #${s.batchId}`,
        courseName: s.courseName || batchInfo?.courseName || `Course #${s.courseId}`,
        date: dateStr,
        startTime: uiStartTime || '--:--',
        endTime: finalEndTime || 'Ongoing',
        students: 0,
        status: status,
        classId: s.classId || s.sessionId || s.id,
        courseId: s.courseId,
        batchId: s.batchId,
        isOver: isOver
    };
};

// Shared Logic to Fetch & Merge
const loadSessionsAndMerge = async (dateStr) => {
    // 1. Fetch Parallel
    const [attSessions, allBatches] = await Promise.all([
        attendanceService.getSessions(null, dateStr),
        batchService.getAllBatches().catch(() => [])
    ]);

    // 2. Fetch Academic Sessions (The "Missing" ones)
    const acadSessions = await fetchAllAcademicSessions(allBatches, dateStr);

    // 3. Hydrate Attendance Sessions
    const hydratedAtt = await hydrateWithDuration(attSessions || []);

    const batchMap = new Map(allBatches.map(b => [String(b.batchId), b]));

    // 4. Map Attendance Sessions to UI
    const uiAttSessions = hydratedAtt.map(s => mapSessionToUI(s, batchMap, true));

    // 5. Map Academic Sessions to UI & Filter Duplicates
    // Create a Set of "Covered" classIds from attendance sessions (normalize to String)
    const coveredClassIds = new Set(uiAttSessions.map(u => String(u.classId)));

    const uiAcadSessions = acadSessions.map(s => mapSessionToUI(s, batchMap, false));

    // Keep only academic sessions that DON't have a corresponding attendance record
    // Check strict string quality on IDs
    const uniqueAcadSessions = uiAcadSessions.filter(u => !coveredClassIds.has(String(u.classId)));

    // 6. Return Combined
    return [...uiAttSessions, ...uniqueAcadSessions];
};


// --- HOOKS ---

export const useLiveSessions = () => {
    const [liveSessions, setLiveSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadLiveSessions = useCallback(async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const allSessions = await loadSessionsAndMerge(today);

            // Filter: (Status LIVE) OR (Status SCHEDULED/ACTIVE + Not Over)
            const live = allSessions.filter(s => {
                const st = s.status;
                if (st === 'LIVE' || st === 'ACTIVE') return !s.isOver;
                // Academic "LIVE" (Running) sessions should definitely be kept
                if (st === 'SCHEDULED' || st === 'ONGOING') return !s.isOver;
                return false;
            });

            setLiveSessions(live);
        } catch (error) {
            console.error("Failed to load live sessions", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLiveSessions();
    }, [loadLiveSessions]);

    return { liveSessions, loading, refreshLive: loadLiveSessions };
};

export const useEndedSessions = (filterDate) => {
    const [endedSessions, setEndedSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadEnded = useCallback(async () => {
        setLoading(true);
        try {
            const allSessions = await loadSessionsAndMerge(filterDate);

            // Filter: (Status ENDED or COMPLETED) OR (Any Status + isOver)
            const ended = allSessions.filter(s => {
                const st = s.status;
                if (st === 'ENDED' || st === 'COMPLETED') return true;
                if (s.isOver) return true;
                return false;
            });

            setEndedSessions(ended);

        } catch (error) {
            console.error("Failed to fetch ended sessions", error);
        } finally {
            setLoading(false);
        }
    }, [filterDate]);

    useEffect(() => {
        loadEnded();
    }, [loadEnded]);

    return { endedSessions, loading, refreshEnded: loadEnded };
};

export const useDashboardStats = (liveSessions, pendingSyncCount) => {
    const [stats, setStats] = useState({
        ongoingLive: 0,
        pendingSync: 0,
        absentCount: 0,
        totalStudents: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const enrollments = await enrollmentService.getAllEnrollments().catch(() => []);

            setStats({
                ongoingLive: liveSessions.length,
                pendingSync: pendingSyncCount || 0,
                absentCount: 0,
                totalStudents: enrollments.length || 0,
                avgPresentPct: 0
            });
        };
        fetchStats();
    }, [liveSessions.length, pendingSyncCount]);

    return stats;
};
