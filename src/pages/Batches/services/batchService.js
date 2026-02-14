import { apiFetch } from "../../../services/api";

// Matches Java Controller @RequestMapping("/api/batches")
const BASE_URL = "/api/batches";

export const batchService = {
    getAllBatches: async () => {
        try {
            // BACKEND LIMITATION: No endpoint for "Get All Batches".
            // WORKAROUND: Fetch all courses -> Fetch batches for each course.
            const { courseService } = await import('../../Courses/services/courseService');
            const courses = await courseService.getCourses();

            if (!courses || courses.length === 0) return [];

            const batchPromises = courses.map(course =>
                batchService.getBatchesByCourseId(course.courseId || course.id)
                    .catch(e => []) // If one course fails, ignore it
            );

            const results = await Promise.all(batchPromises);
            // Flatten the array of arrays
            return results.flat();
        } catch (e) {
            console.error("Batch fetch failed (Workaround):", e);
            return [];
        }
    },

    // Matches @GetMapping("/course/{courseId}")
    getBatchesByCourseId: (courseId) => apiFetch(`${BASE_URL}/course/${courseId}`),

    // Matches @GetMapping("/{batchId}")
    getBatchById: (batchId) => apiFetch(`${BASE_URL}/${batchId}`),

    // Matches @PostMapping("/course/{courseId}")
    // Note: The controller expects courseId in path but you also send it in body
    // Updated to match the controller signature
    createBatch: (batchData) => {
        // We need to extract courseId to call the correct endpoint
        const { courseId, ...rest } = batchData;
        return apiFetch(`${BASE_URL}/course/${courseId}`, {
            method: 'POST',
            body: JSON.stringify(rest)
        });
    },

    updateBatch: (batchId, batchData) => apiFetch(`${BASE_URL}/${batchId}`, {
        method: 'PUT',
        body: JSON.stringify(batchData)
    }),

    deleteBatch: (batchId) => apiFetch(`${BASE_URL}/${batchId}`, {
        method: 'DELETE'
    })
};
