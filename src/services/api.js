import { AUTH_TOKEN_KEY } from "./auth.constants";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const savedUser = localStorage.getItem('auth_user');
    let tenant = null;
    if (savedUser) {
        try {
            const parsed = JSON.parse(savedUser);
            tenant = parsed.tenant || parsed.tenantDb;
        } catch (e) { }
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (tenant) {
        headers["X-Tenant-DB"] = tenant;
    }

    if (options.headers && options.headers["Content-Type"] === null) {
        delete headers["Content-Type"];
    }

    const fullUrl = url.startsWith('http') ? url : (API_BASE + url);

    const res = await fetch(fullUrl, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        console.warn("API 401: Demo mode active - Redirect disabled.");
        // localStorage.removeItem(AUTH_TOKEN_KEY);
        // localStorage.removeItem("auth_user");
        // if (typeof window !== 'undefined') {
        //     window.location.href = "/login";
        // }
        throw new Error("Session expired (401). Please check backend connection.");
    }

    if (res.status === 403) {
        throw new Error("Access Denied: You do not have permission to perform this action.");
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "API error");
    }

    if (res.status === 204) return null;

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }
    return res.text();
}
