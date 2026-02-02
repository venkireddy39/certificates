import { apiFetch } from "../services/api";

const API_BASE_URL = "/api/student";

export const studentService = {
    getMyCourses: async () => {
        try {
            return await apiFetch(`${API_BASE_URL}/courses`, {
                headers: { "Cache-Control": "no-cache" }
            });
        } catch (error) {
            console.error("Failed to fetch student courses", error);
            return [];
        }
    },

    getMyBatches: async () => {
        try {
            return await apiFetch(`${API_BASE_URL}/batches`, {
                headers: { "Cache-Control": "no-cache" }
            });
        } catch (error) {
            console.error("Failed to fetch student batches", error);
            return [];
        }
    },

    getMyAttendance: async () => {
        try {
            return await apiFetch(`${API_BASE_URL}/attendance`, {
                headers: { "Cache-Control": "no-cache" }
            });
        } catch (error) {
            console.error("Failed to fetch student attendance", error);
            return [];
        }
    },

    getMyLibraryBooks: async () => {
        try {
            return await apiFetch(`${API_BASE_URL}/library/books`, {
                headers: { "Cache-Control": "no-cache" }
            });
        } catch (error) {
            console.error("Failed to fetch student library books", error);
            return [];
        }
    }
};
