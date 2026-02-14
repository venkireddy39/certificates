import { apiFetch } from "./api";

// Matches Java Controller @RequestMapping("/api/exams")
const BASE_URL = "/api/exams";

export const examService = {
    // Matches @GetMapping("")
    getAllExams: async () => {
        try {
            // The controller has @GetMapping returning List<Exam> directly on '/'
            const data = await apiFetch(BASE_URL);
            return Array.isArray(data) ? data : (data || []);
        } catch (error) {
            console.error("Exam fetch error:", error);
            return [];
        }
    },

    // Matches @GetMapping("/{examId}")
    getExamById: (id) => apiFetch(`${BASE_URL}/${id}`),

    // Matches @GetMapping("/course/{courseId}")
    getExamsByCourseId: (courseId) => apiFetch(`${BASE_URL}/course/${courseId}`),

    // Matches @GetMapping("/batch/{batchId}")
    getExamsByBatchId: (batchId) => apiFetch(`${BASE_URL}/batch/${batchId}`),

    // Matches @PostMapping("")
    createExam: (examData) => apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(examData),
    }),

    // Matches @PutMapping("/{examId}/publish")
    publishExam: (id) => apiFetch(`${BASE_URL}/${id}/publish`, { method: "PUT" }),

    // Matches @PutMapping("/{examId}/close")
    closeExam: (id) => apiFetch(`${BASE_URL}/${id}/close`, { method: "PUT" }),

    // Matches @DeleteMapping("/{examId}") - SOFT DELETE
    deleteExam: (id) => apiFetch(`${BASE_URL}/${id}`, { method: "DELETE" }),

    // Matches @PutMapping("/{examId}/restore")
    restoreExam: (id) => apiFetch(`${BASE_URL}/${id}/restore`, { method: "PUT" }),

    // Matches @DeleteMapping("/{examId}/hard")
    hardDeleteExam: (id) => apiFetch(`${BASE_URL}/${id}/hard`, { method: "DELETE" })
};
