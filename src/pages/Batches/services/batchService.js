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

            const batchPromises = courses.map(async (course) => {
                const cId = course.courseId || course.id;
                const cName = course.courseName || course.name;
                try {
                    const batches = await batchService.getBatchesByCourseId(cId);
                    // Inject course information into each batch object to ensure UI linking works
                    return batches.map(b => ({
                        ...b,
                        courseId: cId,
                        courseName: cName
                    }));
                } catch (e) {
                    console.error(`Failed to fetch batches for course ${cId}:`, e);
                    return [];
                }
            });

            const results = await Promise.all(batchPromises);
            const flattened = results.flat();
            console.log("✅ Batches Fetched & Enriched with Course Info:", flattened.length);
            return flattened;
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
