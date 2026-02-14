import { apiFetch } from "../../../services/api";

export const dashboardService = {
    getStats: async () => {
        return apiFetch("/api/dashboard/stats");
    },
    getRecentActivities: async () => {
        return apiFetch("/api/dashboard/activities");
    }
};
