/* src/services/marketingService.js */

export const marketingService = {
    getAllCampaigns: async () => {
        return [
            { id: 1, name: 'Summer Promotion', channel: 'Email', status: 'Active', budget: 500, objective: 'Sales' },
            { id: 2, name: 'Social Reach', channel: 'Social', status: 'Draft', budget: 200, objective: 'Awareness' }
        ];
    },
    getMyCampaigns: async (userId) => {
        return [
            { id: 101, name: 'My Local Campaign', channel: 'Ads', status: 'Pending Approval', budget: 100, objective: 'Leads' }
        ];
    },
    createCampaign: async (data) => {
        console.log("Mock Create Campaign:", data);
        return { success: true, id: Date.now() };
    },
    updateCampaignStatus: async (id, status) => {
        console.log(`Mock Update Status: ${id} -> ${status}`);
        return { success: true };
    }
};
