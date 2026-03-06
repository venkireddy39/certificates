import { apiFetch } from "./api";

const API_BASE_URL = "/api/certificate-templates";

/**
 * Maps backend CertificateTemplate entity to frontend template object
 */
const mapBackendToFrontend = (backend) => {
    let design = {
        page: { width: 842, height: 595, padding: 40 },
        theme: {
            primaryColor: "#4f46e5",
            backgroundImage: backend.backgroundImageUrl || "",
            fontFamily: "Outfit"
        },
        elements: []
    };

    if (backend.layoutConfigJson) {
        // Prevent fatal crash if DB accidentally stored raw HTML strings instead of JSON configurations
        if (typeof backend.layoutConfigJson === 'string' && !backend.layoutConfigJson.trim().toLowerCase().startsWith('<html')) {
            try {
                const parsed = JSON.parse(backend.layoutConfigJson);
                // Normalize elements to ensure consistent properties for the frontend editor
                const normalizedElements = (parsed.elements || []).map(el => {
                    const rawValue = el.content || el.value || "";
                    // For image elements, convert absolute URLs to relative paths (Vite proxy)
                    const safeValue = (el.type === 'image' && !rawValue.startsWith('{{'))
                        ? (() => {
                            try {
                                if (rawValue.startsWith('http')) {
                                    const u = new URL(rawValue);
                                    return u.pathname + u.search;
                                }
                            } catch { /* ignore */ }
                            return rawValue;
                        })()
                        : rawValue;

                    return {
                        ...el,
                        id: el.id || String(Math.random()),
                        type: el.type || 'text',
                        content: safeValue,
                        value: safeValue,
                        w: el.w || el.width || (el.type === 'image' ? 200 : 300),
                        h: el.h || el.height || (el.type === 'image' ? 200 : 50),
                        style: {
                            fontSize: "20px",
                            color: "#000000",
                            textAlign: "left",
                            ...(el.style || {}),
                            ...(el.fontSize ? { fontSize: `${el.fontSize}px` } : {}),
                            ...(el.color ? { color: el.color } : {}),
                            ...(el.textAlign ? { textAlign: el.textAlign } : {}),
                        }
                    };
                });

                design = {
                    page: parsed.page || design.page,
                    theme: { ...design.theme, ...parsed.theme },
                    elements: normalizedElements
                };
            } catch (e) {
                console.error("Error parsing layoutConfigJson:", e);
                // Ensure elements exists even on failure
                design.elements = [];
            }
        } else {
            console.warn(`Ignoring invalid layout JSON for template ${backend.id}`);
            design.elements = [];
        }
    } else {
        design.elements = [];
    }

    /**
     * Converts an absolute backend URL → relative path so it goes through the Vite proxy.
     * e.g. "http://192.168.1.63:5151/uploads/logo.png" → "/uploads/logo.png"
     * Leaves relative paths, base64 strings, and empty values untouched.
     */
    const toRelativeUrl = (url) => {
        if (!url || url.startsWith('data:') || url.startsWith('/') || url.startsWith('{{')) return url;
        try {
            const parsed = new URL(url);
            return parsed.pathname + parsed.search;
        } catch {
            return url; // already relative or invalid — leave as-is
        }
    };

    return {
        id: backend.id,
        name: backend.templateName || backend.template_name,
        logoUrl: toRelativeUrl(backend.logoUrl || backend.logo_url || ""),
        backgroundUrl: toRelativeUrl(backend.backgroundImageUrl || backend.background_image_url || backend.backgroundUrl || backend.background_url || ""),
        signatureUrl: toRelativeUrl(backend.signatureUrl || backend.signature_url || ""),
        isActive: backend.isActive || backend.is_active || false,
        isDefault: backend.isActive || backend.is_active || false, // Mapping isActive to isDefault for frontend consistency
        createdAt: backend.createdAt || backend.created_at,
        updatedAt: backend.updatedAt || backend.updated_at,
        templateType: backend.templateType || "DESIGNER",
        targetType: backend.targetType || "EXAM",
        page: design.page,
        theme: design.theme,
        elements: design.elements
    };
};

/**
 * Maps frontend template object to backend CertificateTemplate payload
 */
const createFormData = (frontend) => {
    const formData = new FormData();
    const now = new Date().toISOString();

    // Serialise the detailed design object into layoutConfigJson
    const layoutConfigJson = JSON.stringify({
        page: frontend.page || frontend.design?.page || {},
        theme: {
            ...(frontend.theme || frontend.design?.theme || {}),
            backgroundImage: frontend.backgroundUrl || frontend.backgroundImageUrl || (frontend.theme || frontend.design?.theme)?.backgroundImage
        },
        elements: frontend.elements || frontend.design?.elements || []
    });

    // Required fields in FormData as text
    formData.append("templateName", frontend.name || "New Template");
    formData.append("isActive", String(frontend.isDefault || frontend.isActive || false));
    formData.append("layoutConfigJson", layoutConfigJson);

    // New fields based on backend requirements
    formData.append("templateType", frontend.templateType || "DESIGNER");
    formData.append("targetType", frontend.targetType || "EXAM");

    if (frontend.templateFile) {
        formData.append("templateFile", frontend.templateFile);
    }

    // Image helper: checks if it's a base64 string and converts to a File object
    const appendImageIfBase64 = (base64Str, fieldName, filename) => {
        if (base64Str && base64Str.startsWith('data:image')) {
            try {
                // Extracts exactly the base64 part, e.g data:image/jpeg;base64,.....
                const [header, base64Data] = base64Str.split(',');
                // Need to extract the extension from header
                const mimeTypePart = header.split(':')[1];
                const mimeType = mimeTypePart.split(';')[0];
                const ext = mimeType.split('/')[1] || 'png';

                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });
                formData.append(fieldName, new File([blob], `${filename}.${ext}`, { type: mimeType }));
            } catch (err) {
                console.error(`Error converting ${fieldName} to blob:`, err);
            }
        }
    };

    appendImageIfBase64(frontend.logoUrl, 'logoFile', 'logo');
    appendImageIfBase64(frontend.backgroundUrl, 'backgroundFile', 'background');
    appendImageIfBase64(frontend.signatureUrl, 'signatureFile', 'signature');

    return formData;
};

export const templateService = {
    getAll: async () => {
        const data = await apiFetch(API_BASE_URL);
        return (data || []).map(mapBackendToFrontend);
    },

    getById: async (id) => {
        const data = await apiFetch(`${API_BASE_URL}/${id}`);
        return mapBackendToFrontend(data);
    },

    create: async (templateData) => {
        const formData = createFormData(templateData);
        // Do NOT pass Content-Type: application/json here; api.js interceptor will strip it 
        // when body is FormData, allowing the browser to set Content-Type: multipart/form-data 
        const data = await apiFetch(API_BASE_URL, {
            method: "POST",
            body: formData,
        });
        return mapBackendToFrontend(data);
    },

    update: async (id, templateData) => {
        const formData = createFormData(templateData);
        const data = await apiFetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            body: formData,
        });
        return mapBackendToFrontend(data);
    },

    /**
     * Lightweight toggle — sends only isActive + required fields via PUT.
     * Pass the existing template object so name/targetType are preserved in the DB.
     */
    setActive: async (id, isActive, template = {}) => {
        const fd = new FormData();
        fd.append("isActive", String(isActive));
        fd.append("templateName", template.name || "Certificate Template");
        fd.append("targetType", template.targetType || "EXAM");
        return apiFetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            body: fd,
        });
    },

    delete: async (id) => {
        return apiFetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
    }
};
