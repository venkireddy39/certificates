import { courseService } from './courseService'; // Reuse headers implementation if exported, or duplicate

const API_BASE_URL = "/api"; // Adjust base path as needed

const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };

    // 1. Try to get token from Local Storage (Real App Flow)
    let token = localStorage.getItem("authToken");

    // 2. Fallback to Hardcoded Token (For Development/Testing)
    if (!token) {
        token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwicGVybWlzc2lvbnMiOlsiQlVTX1JPVVRFX1ZJRVciLCJIT1NURUxfREVMRVRFIiwiTElCUkFSWV9NRU1CRVJfVklFVyIsIkJPT0tfSVNTVUVfREVMRVRFIiwiU1RPUF9QT0lOVF9DUkVBVEUiLCJCT09LX0NSRUFURSIsIkJPT0tfSVNTVUVfVklFV19DSElMRCIsIkhPU1RFTF9GRUVfVklFV19DSElMRCIsIkRPQ1VNRU5UX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJCVVNfUk9VVEVfVVBEQVRFIiwiSE9TVEVMX1JPT01fREVMRVRFIiwiQlVTX1VQREFURSIsIkhPU1RFTF9BTExPQ0FUSU9OX1ZJRVdfQ0hJTEQiLCJCT09LX0NBVEVHT1JZX1ZJRVciLCJUT1BJQ19WSUVXIiwiTElCUkFSWV9GSU5FX0NSRUFURSIsIlZJRVdfUFJPRklMRSIsIlRPUElDX0NPTlRFTlRfQ1JFQVRFIiwiTElCUkFSWV9NRU1CRVJfQ1JFQVRFIiwiRE9DVU1FTlRfVVBEQVRFIiwiQlVTX1JPVVRFX0NSRUFURSIsIk1BTkFHRV9VU0VSUyIsIkJPT0tfQ0FURUdPUllfREVMRVRFIiwiRE9DVU1FTlRfQUNDRVNTX1ZJRVciLCJIT1NURUxfRkVFX1ZJRVciLCJET0NVTUVOVF9WSUVXIiwiRE9DVU1FTlRfQUNDRVNTX0dSQU5UX1NUVURFTlQiLCJIT1NURUxfQ09NUExBSU5UX0RFTEVURSIsIkxJQlJBUllfTUVNQkVSX1VQREFURSIsIkJPT0tfSVNTVUVfQ1JFQVRFIiwiRE9DVU1FTlRfQ0FURUdPUllfREVMRVRFIiwiRE9DVU1FTlRfQ0FURUdPUllfVVBEQVRFIiwiSE9TVEVMX0FMTE9DQVRJT05fQ1JFQVRFIiwiQk9PS19VUERBVEUiLCJUT1BJQ19DT05URU5UX0RFTEVURSIsIkJVU19ST1VURV9ERUxFVEUiLCJIT1NURUxfRkVFX1VQREFURSIsIlRPUElDX0NPTlRFTlRfVklFVyIsIkNPVVJTRV9WSUVXIiwiQlVTX1BBU1NfREVMRVRFIiwiQk9PS19JU1NVRV9WSUVXX1NFTEYiLCJIT1NURUxfQkxPQ0tfVVBEQVRFIiwiSE9TVEVMX0NSRUFURSIsIkhPU1RFTF9ST09NX0NSRUFURSIsIkxJQlJBUllfRklORV9ERUxFVEUiLCJUT1BJQ19ERUxFVEUiLCJCVVNfREVMRVRFIiwiRE9DVU1FTlRfVkVSU0lPTl9WSUVXIiwiQ09VUlNFX0NSRUFURSIsIkhPU1RFTF9ST09NX1ZJRVciLCJIT1NURUxfVVBEQVRFIiwiQlVTX1BBU1NfVklFV19DSElMRCIsIkRPQ1VNRU5UX0NBVEVHT1JZX0NSRUFURSIsIlRPUElDX0NSRUFURSIsIkxJQlJBUllfU0VUVElOR1NfQ1JFQVRFIiwiSE9TVEVMX0JMT0NLX0RFTEVURSIsIkJPT0tfSVNTVUVfVVBEQVRFIiwiQk9PS19DQVRFR09SWV9DUkVBVEUiLCJCT09LX0lTU1VFX1ZJRVciLCJTVE9QX1BPSU5UX1ZJRVciLCJDT1VSU0VfREVMRVRFIiwiRE9DVU1FTlRfVklFV19DSElMRCIsIkJVU19QQVNTX1ZJRVciLCJST1VURV9VUERBQUkiLCJUT1BJQ19DT05URU5UX0FDQ0VTUyIsIkJVU19WSUVXIiwiSE9TVEVMX1JPT01fVVBEQVRFIiwiTElCUkFSWV9GSU5FX1ZJRVciLCJIT1NURUxfVklFVyIsIkhPU1RFTF9GRUVfQ1JFQVRFIiwiRE9DVU1FTlRfQUNDRVNTX1ZJRVdfQ0hJTEQiLCJCVVNfQ1JFQVRFIiwiRE9DVU1FTlRfQUNDRVNTX0dSQU5UIiwiU1RPUF9QT0lOVF9ERUxFVEUiLCJCVVNfUEFTU19VUERBVEUiLCJCT09LX1ZJRVciLCJST1VURV9DUkVBVEUiLCJWSUVXX0NPTlRFTlQiLCJMSUJSQVJZX1NFVFRJTkdTX1ZJRVciLCJIT1NURUxfQ09NUExBSU5UX0NSRUFURSIsIkxJQlJBUllfRklORV9VUERBVEUiLCJIT1NURUxfQUxMT0NBVElPTl9WSUV3IiwiVE9QSUNfVVBEQVRFIiwiRE9DVU1FTlRfVkVSU0lPTl9DUkVBVEUiLCJNQU5BR0VfQ09VUlNFUyIsIlNUT1BfUE9JTlRfVVBEQVRFIiwiSE9TVEVMX0FMTE9DQVRJT05fREVMRVRFIiwiSE9TVEVMX0NPTVBMQUlOVF9VUERBQUkiLCJIT1NURUxfRkVFX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR1NfVVBEQVRFIiwiSE9TVEVMX0JMT0NLX1ZJRVciLCJIT1NURUxfQUxMT0NBVElPTl9VUERBQUkiLCJMSUJSQVJZX1NFVFRJTkdTX0RFTEVURSIsIkJPT0tfREVMRVRFIiwiSE9TVEVMX0JMT0NLX0NSRUFURSIsIkRPQ1VNRU5UX1NIQVJFIiwiQlVTX1BBU1NfQ1JFQVRFIiwiVE9QSUNfQ09OVEVOVF9VUERBVEUiLCJET0NVTUVOVF9DQVRFR09SWV9WSUVXIiwiRE9DVU1FTlRfU0hBUkVfVklFVyIsIlJPVVRFX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR1NfREVMRVRFIiwiQlVTX1JPVVRFX0RFTEVURSIsIlJPVVRFX1ZJRVciLCJIT1NURUxfQ09NUExBSU5UX1ZJRVciLCJET0NVTUVOVF9ERUxFVEUiLCJET0NVTUVOVF9BQ0NFU1NfVklFV19HUkFOVEVEIiwiQk9PS19DQVRFR09SWV9VUERBVEUiXSwiaWF0IjoxNzY3ODUzMzY0fQ.FHf2fSikFX7FPqpAr3QoX5y9Lc-rV1RzgyADfEBzVBstYBlkwt9k0-kP2A401ekQQaEsCslRD3tIX1kHXQ4DlA";
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const topicService = {
    // ============================
    // TOPICS
    // ============================

    // Create a new topic
    createTopic: async (courseId, topicData) => {
        // Backend expects: { topicName, topicDescription, status: "ACTIVE" }
        // Frontend sends: { title }
        const payload = {
            topicName: topicData.title,
            topicDescription: topicData.description || "",
            status: "ACTIVE"
        };

        // CORRECTION: Path is /api/topics/course/{courseId}
        const response = await fetch(`${API_BASE_URL}/topics/course/${courseId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Create Topic Failed:", response.status, errorText);
            throw new Error(`Failed to create topic: ${response.status} ${errorText}`);
        }
        return await response.json();
    },

    // Update a topic
    updateTopic: async (topicId, topicData) => {
        // Backend expects: { topicName, ... }
        const payload = {
            topicName: topicData.title,
        };

        // CORRECTION: Path is /api/topics/{topicId} (matches assumption, kept for safety)
        const response = await fetch(`${API_BASE_URL}/topics/${topicId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to update topic");
        return await response.json();
    },

    // Delete a topic
    deleteTopic: async (topicId) => {
        const response = await fetch(`${API_BASE_URL}/topics/${topicId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) throw new Error("Failed to delete topic");
        return true;
    },

    // Get Topics for a course (Used in fetching)
    getTopics: async (courseId) => {
        const response = await fetch(`${API_BASE_URL}/topics/course/${courseId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to fetch topics");
        return await response.json();
    },

    // Get Contents for a topic
    getContents: async (topicId) => {
        const response = await fetch(`${API_BASE_URL}/topic-contents/topic/${topicId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to fetch contents");
        return await response.json();
    },

    // ============================
    // CONTENT
    // ============================

    // Get Content by ID
    getContentById: async (contentId) => {
        const response = await fetch(`${API_BASE_URL}/topic-contents/${contentId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Failed to fetch content");
        return await response.json();
    },

    // Create content
    createContent: async (topicId, contentData) => {
        // Frontend data: { type, title, url, description, file, method }
        // Backend expects: { contentType, fileUrl, contentOrder }

        // Map frontend type to backend type (VIDEO, PDF, TEXT?)
        // Assuming backend supports: VIDEO, PDF

        let contentType = "VIDEO";
        if (contentData.type === 'pdf') contentType = "PDF";
        if (contentData.type === 'heading') contentType = "TEXT"; // Or HEADING?

        const payload = {
            contentType: contentType,
            // For HEADINGS: We can still use fileUrl as backup or just rely on title if backend supports it.
            // But let's send title explicitly now.
            title: contentData.title,
            description: contentData.description,
            fileUrl: (contentType === "TEXT" && !contentData.url) ? contentData.title : (contentData.url || ""),
            contentOrder: contentData.order || 0
        };

        // If specific upload logic is needed later, add here.

        // CORRECTION: Path is /api/topic-contents/topic/{topicId}
        const response = await fetch(`${API_BASE_URL}/topic-contents/topic/${topicId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Create Content Failed:", response.status, errorText);
            throw new Error("Failed to create content");
        }
        return await response.json();
    },

    // Update content
    updateContent: async (contentId, contentData) => {
        const payload = {};
        if (contentData.title) payload.title = contentData.title;
        if (contentData.description) payload.description = contentData.description;

        // Still support keeping heading text in fileUrl if needed for backward compatibility
        if (contentData.type === 'heading' && contentData.title) {
            payload.fileUrl = contentData.title;
        } else if (contentData.url) {
            payload.fileUrl = contentData.url;
        }

        if (contentData.order) payload.contentOrder = contentData.order;

        const response = await fetch(`${API_BASE_URL}/topic-contents/${contentId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to update content");
        return await response.json();
    },

    // Delete content
    deleteContent: async (contentId) => {
        // CORRECTION: Path is /api/topic-contents/{contentId}
        const response = await fetch(`${API_BASE_URL}/topic-contents/${contentId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) throw new Error("Failed to delete content");
        return true;
    },

    // Upload Content File
    uploadContentFile: async (contentId, file) => {
        const formData = new FormData();
        formData.append("contentIds", contentId);
        formData.append("files", file);

        // Header handling for Multipart is tricky with fetch if we set Content-Type manually.
        // We reuse getHeaders but REMOVE Content-Type so browser sets boundary.
        const headers = getHeaders();
        delete headers['Content-Type'];

        const response = await fetch(`${API_BASE_URL}/topic-contents/upload-files`, {
            method: 'PUT',
            headers: headers,
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Upload Failed:", response.status, errorText);
            throw new Error("Failed to upload file");
        }
        return true;
    }
};
