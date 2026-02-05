import { useState, useEffect } from 'react';
import { enrollmentService } from '../services/enrollmentService';

export const useEnrichedBatches = (batches) => {
    const [enrichedBatches, setEnrichedBatches] = useState([]);

    useEffect(() => {
        const enrichData = async () => {
            if (!batches || batches.length === 0) {
                setEnrichedBatches([]);
                return;
            }

            try {
                // Fetch students count for each batch in parallel from the REAL service
                const enriched = await Promise.all(batches.map(async (b) => {
                    try {
                        const studentsList = await enrollmentService.getStudentsByBatch(b.batchId);
                        // Filter active students only (exclude TRANSFERRED/INACTIVE)
                        const activeCount = studentsList.filter(s => {
                            if (!s.status) return true; // Default to active if status missing
                            const st = String(s.status).toUpperCase();
                            return st === 'ACTIVE' || st === 'ENROLLED';
                        }).length;

                        return {
                            ...b,
                            students: activeCount
                        };
                    } catch (err) {
                        return { ...b, students: b.students || 0 };
                    }
                }));

                setEnrichedBatches(enriched);
            } catch (e) {
                console.error("Failed to enrich batches:", e);
                setEnrichedBatches(batches);
            }
        };

        enrichData();
    }, [batches]);

    return enrichedBatches;
};
