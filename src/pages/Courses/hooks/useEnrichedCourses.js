import { useState, useEffect } from "react";
// Dynamic imports moved to inside the effect to avoid circular dependencies if any,
// or we can import them here if we are sure. 
// Given the existing code used dynamic imports, we will stick to that to be safe, 
// or better, try static import if we can verify no circular dependency.
// batchService imports courseService. So courseService cannot import batchService.
// Thus, we MUST use dynamic import or injection for batchService in course module.

export const useEnrichedCourses = (filteredCourses) => {
    const [enrichedCourses, setEnrichedCourses] = useState([]);
    const [loadingEnrichment, setLoadingEnrichment] = useState(false);

    useEffect(() => {
        const enrichCourses = async () => {
            if (!filteredCourses) {
                setEnrichedCourses([]);
                return;
            }

            setLoadingEnrichment(true);

            try {
                // Dynamic import to avoid circular dependencies
                // batchService imports courseService, so we can't import batchService at top level here
                // if this file is used by components that courseService might use (unlikely but safe).
                const { batchService } = await import('../../Batches/services/batchService');
                const { enrollmentService } = await import('../../Batches/services/enrollmentService');

                const updated = await Promise.all(filteredCourses.map(async (course) => {
                    try {
                        // Support both ID formats just in case
                        const courseId = course.courseId || course.id;

                        // 1. Get batches for this specific course
                        const batches = await batchService.getBatchesByCourseId(courseId);

                        if (!batches || !Array.isArray(batches) || batches.length === 0) {
                            return { ...course, learnersCount: 0 };
                        }

                        // 2. Get students for each batch
                        const studentPromises = batches.map(b =>
                            enrollmentService.getStudentsByBatch(b.batchId).catch(() => [])
                        );

                        const studentsResults = await Promise.all(studentPromises);

                        // 3. Flatten and Count Unique
                        const allStudents = studentsResults.flat();
                        const uniqueStudents = new Set(
                            allStudents
                                .filter(s => {
                                    if (!s || !s.studentId) return false;
                                    if (!s.status) return true;
                                    const st = String(s.status).toUpperCase();
                                    return st === 'ACTIVE' || st === 'ENROLLED';
                                })
                                .map(s => String(s.studentId))
                        );

                        return {
                            ...course,
                            learnersCount: uniqueStudents.size
                        };

                    } catch (err) {
                        console.warn(`Failed to enrich course ${course.courseId || course.id}`, err);
                        return { ...course, learnersCount: 0 }; // Fallback
                    }
                }));

                setEnrichedCourses(updated);

            } catch (err) {
                console.error("Failed to load services for learner count", err);
                setEnrichedCourses(filteredCourses);
            } finally {
                setLoadingEnrichment(false);
            }
        };

        enrichCourses();
    }, [filteredCourses]);

    return { enrichedCourses, loadingEnrichment };
};
