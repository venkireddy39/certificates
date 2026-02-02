import { apiFetch } from "../../../services/api";
import { courseService } from '../../Courses/services/courseService';

export const API_BASE_URL = "/api/batches";

export const batchService = {
    getAllBatches: async () => {
        try {
            const courses = await courseService.getCourses();
            if (!courses || courses.length === 0) return [];

            // Fetch sequentially or in small chunks to avoid overwhelming the backend
            // and causing 500 errors.
            const results = [];
            for (const course of courses) {
                try {
                    const batches = await batchService.getBatchesByCourseId(course.courseId);
                    if (Array.isArray(batches)) {
                        results.push(...batches);
                    }
                } catch (err) {
                    // Suppress 500 errors for individual courses so we don't spam console
                    // console.warn(`Skipping batches for course ${course.courseId} due to error.`);
                }
            }
            return results;
        } catch (error) {
            console.error("Failed to aggregate batches", error);
            return [];
        }
    },

    getBatchesByCourseId: (courseId) =>
        apiFetch(`${API_BASE_URL}/course/${courseId}`, { headers: { "Cache-Control": "no-cache" } }),

    getCourseBatchStats: (courseId) =>
        apiFetch(`/api/course-batch-stats/course/${courseId}`, { headers: { "Cache-Control": "no-cache" } }),

    getBatchById: (batchId) =>
        apiFetch(`${API_BASE_URL}/${batchId}`, { headers: { "Cache-Control": "no-cache" } }),

    createBatch: async (batchData) => {
        const { courseId } = batchData;
        if (!courseId) throw new Error("Course ID is required to create a batch");

        return apiFetch(`${API_BASE_URL}/course/${courseId}`, {
            method: "POST",
            body: JSON.stringify(batchData),
        });
    },

    updateBatch: (batchId, batchData) =>
        apiFetch(`${API_BASE_URL}/${batchId}`, {
            method: "PUT",
            body: JSON.stringify(batchData),
        }),

    deleteBatch: (batchId) =>
        apiFetch(`${API_BASE_URL}/${batchId}`, { method: "DELETE" })
};
