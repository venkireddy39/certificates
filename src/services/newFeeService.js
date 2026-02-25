import { apiFetch } from './apiFetch';

const BASE_URL = '/api/fee';

export const createFeeStructure = async (structure) => {
    return apiFetch(`${BASE_URL}/structures`, {
        method: 'POST',
        body: JSON.stringify(structure)
    });
};

export const allocateStudentFee = async (studentId, structureId, installmentAmounts) => {
    return apiFetch(`${BASE_URL}/allocations`, {
        method: 'POST',
        body: JSON.stringify({ studentId, structureId, installmentAmounts })
    });
};

export const getRMI = async (allocationId) => {
    return apiFetch(`${BASE_URL}/allocations/${allocationId}/rmi`);
};

export const applyDiscount = async (allocationId, type, value, reason) => {
    return apiFetch(`${BASE_URL}/allocations/${allocationId}/discount`, {
        method: 'POST',
        body: JSON.stringify({ type, value, reason })
    });
};

export const applyPenalty = async (allocationId, amount, reason) => {
    return apiFetch(`${BASE_URL}/allocations/${allocationId}/penalty`, {
        method: 'POST',
        body: JSON.stringify({ amount, reason })
    });
};

export const recordPayment = async (allocationId, installmentId, amount, mode, reference) => {
    return apiFetch(`${BASE_URL}/allocations/${allocationId}/payments`, {
        method: 'POST',
        body: JSON.stringify({ installmentId, amount, mode, reference })
    });
};

export const getAllocationDetails = async (allocationId) => {
    return apiFetch(`${BASE_URL}/allocations/${allocationId}`);
};

export const getInstallments = async (allocationId) => {
    return apiFetch(`${BASE_URL}/allocations/${allocationId}/installments`);
};

export const getPaymentHistory = async (allocationId) => {
    return apiFetch(`${BASE_URL}/allocations/${allocationId}/payments`);
};
