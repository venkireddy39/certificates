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
                // Ensure we merge correctly if only parts of the design are in JSON
                design = {
                    page: parsed.page || design.page,
                    theme: { ...design.theme, ...parsed.theme },
                    elements: parsed.elements || []
                };
            } catch (e) {
                console.error("Error parsing layoutConfigJson:", e);
                // Silently fallback instead of crashing the app
            }
        } else {
            console.warn(`Ignoring invalid layout JSON for template ${backend.id}`);
        }
    }

    return {
        id: backend.id,
        name: backend.templateName || backend.template_name,
        logoUrl: backend.logoUrl || backend.logo_url || "",
        backgroundUrl: backend.backgroundImageUrl || backend.background_image_url || backend.backgroundUrl || backend.background_url || "",
        signatureUrl: backend.signatureUrl || backend.signature_url || "",
        isActive: backend.isActive || backend.is_active || false,
        isDefault: backend.isActive || backend.is_active || false, // Mapping isActive to isDefault for frontend consistency
        createdAt: backend.createdAt || backend.created_at,
        updatedAt: backend.updatedAt || backend.updated_at,
        design: design
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
        page: frontend.design?.page || {},
        theme: {
            ...(frontend.design?.theme || {}),
            backgroundImage: frontend.backgroundUrl
        },
        elements: frontend.design?.elements || []
    });

    // Required fields in FormData as text
    formData.append("templateName", frontend.name || "New Template");
    formData.append("isActive", String(frontend.isDefault || frontend.isActive || false));
    formData.append("layoutConfigJson", layoutConfigJson);

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

    delete: async (id) => {
        return apiFetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
    }
};
