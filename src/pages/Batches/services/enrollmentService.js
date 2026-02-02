import { apiFetch } from "../../../services/api";

const STORAGE_KEYS = {
    STUDENT_BATCHES: 'lms_student_batches',
    USERS: 'lms_mock_users'
};

const getStorage = (key, defaultVal = []) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
};

const setStorage = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
};

export const API_BASE_URL_SB = "/api/student-batches";

export const enrollmentService = {
    // Get students in a specific batch
    getStudentsByBatch: async (batchId) => {
        try {
            return await apiFetch(`${API_BASE_URL_SB}/batch/${batchId}`, {
                headers: { "Cache-Control": "no-cache" }
            });
        } catch (error) {
            console.error("API failed to get students", error);
            return [];
        }
    },

    // Add student to a batch (Enroll)
    addStudentToBatch: async (enrollmentData) => {
        return apiFetch(`${API_BASE_URL_SB}/enroll`, {
            method: "POST",
            body: JSON.stringify(enrollmentData)
        });
    },

    // Remove student from batch (Unenroll)
    removeStudentFromBatch: async (studentBatchId) => {
        return apiFetch(`${API_BASE_URL_SB}/${studentBatchId}`, { method: "DELETE" });
    },

    // Get all enrollments
    getAllEnrollments: async () => {
        try {
            return await apiFetch(API_BASE_URL_SB);
        } catch (e) {
            console.warn("API failed to get all enrollments", e);
            return [];
        }
    },

    // ================= TRANSFERS =================

    transferStudent: async (transferData) => {
        try {
            // Remove from old batch
            const originalBatchId = transferData.studentBatchId || transferData.fromStudentBatchId;
            if (originalBatchId) {
                await enrollmentService.removeStudentFromBatch(originalBatchId);
            }

            // Enroll in new batch
            const enrollPayload = {
                studentId: transferData.studentId,
                studentName: transferData.studentName,
                studentEmail: transferData.studentEmail,
                courseId: transferData.courseId,
                batchId: transferData.targetBatchId || transferData.toBatchId
            };
            return await enrollmentService.addStudentToBatch(enrollPayload);
        } catch (error) {
            console.error("Transfer Failed in Service:", error);
            throw error;
        }
    },

    // ================= USERS =================

    getAllUsers: async () => {
        try {
            const { userService } = await import('../../Users/services/userService');
            const students = await userService.getAllStudents();

            if (!students || students.length === 0) return [];

            return students.map(s => ({
                userId: s.user?.userId,
                studentId: s.studentId,
                firstName: s.user?.firstName,
                lastName: s.user?.lastName,
                email: s.user?.email,
                role: 'Student',
                name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim()
            }));
        } catch (e) {
            console.warn("Failed to fetch students via userService", e);
            return [];
        }
    },

    getInstructors: async () => {
        const users = await enrollmentService.getAllUsers();
        return users.filter(u =>
            u.role === 'Instructor' ||
            u.role === 'INSTRUCTOR' ||
            u.role?.name === 'Instructor'
        );
    }
};
