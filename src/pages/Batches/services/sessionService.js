import { apiFetch } from "../../../services/api";

const BASE_URL = "/api/sessions";

export const sessionService = {
    // Matches @GetMapping("/batch/{batchId}")
    getSessionsByBatchId: async (batchId) => {
        try {
            const data = await apiFetch(`${BASE_URL}/batch/${batchId}`);
            return Array.isArray(data) ? data : (data || []);
        } catch (error) {
            console.error("Session fetch error:", error);
            return [];
        }
    },

    // Matches @GetMapping("/{sessionId}")
    getSessionById: (sessionId) => apiFetch(`${BASE_URL}/${sessionId}`),

    // Matches @PostMapping("/batch/{batchId}")
    createSession: (batchId, sessionData) => apiFetch(`${BASE_URL}/batch/${batchId}`, {
        method: 'POST',
        body: JSON.stringify(sessionData)
    }),

    // Matches @PutMapping("/{sessionId}")
    updateSession: (sessionId, sessionData) => apiFetch(`${BASE_URL}/${sessionId}`, {
        method: 'PUT',
        body: JSON.stringify(sessionData)
    }),

    // Matches @DeleteMapping("/{sessionId}")
    deleteSession: (sessionId) => apiFetch(`${BASE_URL}/${sessionId}`, {
        method: 'DELETE'
    })
};
