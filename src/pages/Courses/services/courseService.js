import { apiFetch } from "../../../services/api";

// Matches Java Controller @RequestMapping("/api/courses")
const BASE_URL = "/api/courses";

export const courseService = {
    // Standard Fetch
    getCourses: async () => {
        try {
            const data = await apiFetch(BASE_URL);
            return Array.isArray(data) ? data : (data || []);
        } catch (e) {
            console.error("Course fetch failed:", e);
            return [];
        }
    },

    getCourseById: (id) => apiFetch(`${BASE_URL}/${id}`),

    createCourse: (data) => apiFetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    updateCourse: (id, data) => apiFetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    updateCourseStatus: (id, status) => courseService.updateCourse(id, { status }),
    updateShareStatus: (id, enabled) => courseService.updateCourse(id, { shareEnabled: enabled }),

    // Matches @DeleteMapping("/{id}/hard")
    deleteCourse: (id) => apiFetch(`${BASE_URL}/${id}/hard`, { method: 'DELETE' }),

    uploadCourseImage: async (courseId, imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        return apiFetch(`${BASE_URL}/${courseId}/image`, {
            method: 'PUT',
            headers: { 'Content-Type': null }, // Let browser set boundary
            body: formData
        });
    },

    getCourseByShareCode: (shareCode) => apiFetch(`${BASE_URL}/share/${shareCode}`)
};
