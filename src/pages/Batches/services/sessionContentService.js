import { apiFetch } from "../../../services/api";

const BASE_URL = "/api/session-contents";

export const sessionContentService = {
    // Matches @GetMapping("/session/{sessionId}")
    getContentsBySessionId: (sessionId) => apiFetch(`${BASE_URL}/session/${sessionId}`),

    // Matches @GetMapping("/{id}")
    getContentById: (contentId) => apiFetch(`${BASE_URL}/${contentId}`),

    // Matches @PostMapping("/session/{sessionId}")
    createContent: (sessionId, contentData) => apiFetch(`${BASE_URL}/session/${sessionId}`, {
        method: 'POST',
        body: JSON.stringify(contentData)
    }),

    // Matches @PutMapping("/{id}")
    updateContent: (contentId, contentData) => apiFetch(`${BASE_URL}/${contentId}`, {
        method: 'PUT',
        body: JSON.stringify(contentData)
    }),

    // Matches @DeleteMapping("/{id}")
    deleteContent: (contentId) => apiFetch(`${BASE_URL}/${contentId}`, {
        method: 'DELETE'
    }),

    // Upload File (Multipart) @PutMapping("/{id}/upload")
    uploadFile: (contentId, file) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiFetch(`${BASE_URL}/${contentId}/upload`, {
            method: 'PUT',
            headers: { 'Content-Type': null }, // Allow boundary
            body: formData
        });
    }
};
