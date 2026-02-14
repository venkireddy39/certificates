import { apiFetch } from "../../../services/api";

const BASE_URL = "/api/student-batch-transfers";

export const transferService = {
    // Matches @PostMapping("/transfer")
    // Needs params: studentId, courseId, toBatchId, reason
    transferStudent: (studentId, courseId, toBatchId, reason) => {
        const params = new URLSearchParams({
            studentId, courseId, toBatchId, reason
        });
        return apiFetch(`${BASE_URL}/transfer?${params.toString()}`, {
            method: 'POST'
        });
    },

    // Matches @GetMapping("/student/{studentId}")
    getTransfersByStudent: (studentId) => apiFetch(`${BASE_URL}/student/${studentId}`),

    // Matches @GetMapping("/course/{courseId}")
    getTransfersByCourse: (courseId) => apiFetch(`${BASE_URL}/course/${courseId}`)
};
