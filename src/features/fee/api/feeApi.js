import { apiFetch, getUrl } from '../../../services/api';

/**
 * Fee Module API service
 */
export const feeApi = {
    // --- Configuration (Admin) ---

    getFeeTypes: async () => {
        return await apiFetch(getUrl('/fee-management/fee-types'));
    },

    getActiveFeeTypes: async () => {
        return await apiFetch(getUrl('/fee-management/fee-types/active'));
    },

    // Note: Java controllers map to /api/fee-management/fee-structures and /api/fee for allocations
    createFeeStructure: async (data) => {
        return await apiFetch(getUrl('/fee-management/fee-structures'), {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    getFeeStructuresByCourse: async (courseId) => {
        return await apiFetch(getUrl(`/fee-management/fee-structures/course/${courseId}`));
    },

    getFeeStructuresByBatch: async (batchId) => {
        return await apiFetch(getUrl(`/fee-management/fee-structures/batch/${batchId}`));
    },

    // --- Allocations & Student View ---
    // Mapped in FeeController.java to /api/fee/...

    allocateFee: async (studentId, structureId, installmentAmounts) => {
        return await apiFetch(getUrl('/fee/allocations'), {
            method: 'POST',
            body: JSON.stringify({ studentId, structureId, installmentAmounts })
        });
    },

    getStudentAllocation: async (allocationId) => {
        return await apiFetch(getUrl(`/fee/allocations/${allocationId}`));
    },

    getStudentInstallments: async (allocationId) => {
        return await apiFetch(getUrl(`/fee/allocations/${allocationId}/installments`));
    },

    // --- Actions (Payments, Discounts, Penalties) ---

    recordPayment: async (allocationId, data) => {
        return await apiFetch(getUrl(`/fee/allocations/${allocationId}/payments`), {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    applyDiscount: async (allocationId, data) => {
        return await apiFetch(getUrl(`/fee/allocations/${allocationId}/discount`), {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    applyPenalty: async (allocationId, data) => {
        return await apiFetch(getUrl(`/fee/allocations/${allocationId}/penalty`), {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};
