import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Use token from env (VITE_DEV_AUTH_TOKEN in .env.local) or from localStorage
        const envToken = import.meta.env.VITE_DEV_AUTH_TOKEN;
        const token = localStorage.getItem('auth_token') || envToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token.trim()}`;
        }

        // --- CRITICAL FIX FOR MULTIPART FORM DATA ---
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const { response } = error;
        if (response) {
            if (response.status === 401) {
                console.warn("API 401: Session expired or unauthorized.");
            }

            let errorMsg = "An error occurred";
            if (response.data) {
                if (typeof response.data === 'string') {
                    errorMsg = response.data;
                } else {
                    errorMsg = response.data.message || response.data.error || JSON.stringify(response.data);
                }
            }

            return Promise.reject(new Error(errorMsg));
        }
        return Promise.reject(error);
    }
);

/**
 * Backward compatibility wrapper for apiFetch using axios
 */
export async function apiFetch(url, options = {}) {
    const method = options.method || "GET";
    let data = options.body;
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (e) {
            // Keep as string if not JSON
        }
    }

    let reqHeaders = { ...options.headers };
    if (data instanceof FormData) {
        delete reqHeaders['Content-Type'];
    }

    try {
        const response = await api({
            url,
            method,
            data,
            headers: Object.keys(reqHeaders).length > 0 ? reqHeaders : undefined,
            params: options.params
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export default api;
