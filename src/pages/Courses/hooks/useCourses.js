import { useState, useEffect } from 'react';
import { INITIAL_FORM_DATA } from '../constants/courseConstants';
import { validateCourseForm } from '../utils/validators';
import { courseService } from '../services/courseService';

export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    // Fetch courses on mount
    useEffect(() => {
        loadCourses();
    }, []);

    // Helper to format image URL
    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) return url;

        // If relative path, prepend backend origin
        // We use the same target as configured in vite.config.js
        const BACKEND_URL = "http://192.168.1.23:5151";
        return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const loadCourses = async () => {
        try {
            const data = await courseService.getCourses();
            // Map backend data to frontend model
            const mappedCourses = data.map(c => ({
                id: c.courseId,
                name: c.courseName,
                // Split description if we combined them, or just use as is
                description: c.description || "",
                overview: unescape(c.description || ""),
                toolsCovered: c.toolsCovered,
                duration: c.duration,
                price: c.courseFee,
                img: getFullImageUrl(c.courseImageUrl) || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
                showValidity: c.showValidity,
                validityDuration: c.validityInDays,
                allowOffline: c.allowOfflineMobile,
                certificateEnabled: c.certificateProvided,
                contentAccessEnabled: c.enableContentAccess,
                status: c.status || "ACTIVE", // Default to ACTIVE if null
                shareCode: c.shareCode,
                shareLink: c.shareLink,
                shareEnabled: c.shareEnabled,
                accessPlatforms: ['Website'] // Default or map if you had a field
            }));
            setCourses(mappedCourses);
        } catch (error) {
            console.error("Failed to load courses", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let val = value;

        if (type === 'checkbox') {
            val = (name === 'accessPlatforms') ? value : checked;
        } else if (value === 'true') val = true;
        else if (value === 'false') val = false;

        // Handle Status specifically if needed (though it's string so likely handled by default)

        if (name === 'accessPlatforms') {
            setFormData(prev => {
                const current = prev.accessPlatforms || [];
                if (checked) return { ...prev, accessPlatforms: [...current, value] };
                return { ...prev, accessPlatforms: current.filter(item => item !== value) };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                img: file,
                imgPreview: URL.createObjectURL(file)
            }));
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setCurrentCourseId(null);
        setEditIndex(null);
        setStep(1);
    };

    const openModal = (index = null) => {
        if (index !== null) {
            const c = courses[index];
            setCurrentCourseId(c.id);
            setEditIndex(index);
            // Map course data back to form data
            setFormData({
                name: c.name,
                description: c.description,
                overview: c.overview,
                toolsCovered: c.toolsCovered,
                duration: c.duration,
                price: c.price,
                img: null,
                imgPreview: c.img,
                showValidity: c.showValidity,
                validityDuration: c.validityDuration,
                allowOffline: c.allowOffline,
                certificateEnabled: c.certificateEnabled,
                contentAccessEnabled: c.contentAccessEnabled,
                status: c.status || "ACTIVE",
                accessPlatforms: c.accessPlatforms || ['Website']
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        // Sanitize numeric values
        const fee = formData.price ? parseFloat(formData.price) : 0.0;
        const validity = (formData.showValidity && formData.validityDuration)
            ? parseInt(formData.validityDuration)
            : null;

        // Construct Backend Payload
        const payload = {
            courseName: formData.name || "Untitled Course",
            description: formData.description || formData.overview || "No Description",
            duration: formData.duration || "Self Paced",
            toolsCovered: formData.toolsCovered || "",
            courseFee: fee,
            // Note: courseImageUrl is intentionally omitted for creation to allow 2-step process
            // or handled via update if preserved.

            certificateProvided: formData.certificateEnabled === true,
            status: formData.status || "ACTIVE",
            showValidity: formData.showValidity === true,
            validityInDays: validity,
            allowOfflineMobile: formData.allowOffline === true,
            enableContentAccess: formData.contentAccessEnabled === true,
            shareEnabled: true
        };

        // If editing and no new file, preserve current image URL if needed
        if (currentCourseId && !formData.img && formData.imgPreview) {
            payload.courseImageUrl = formData.imgPreview;
        }

        try {
            let savedCourse;
            if (currentCourseId) {
                savedCourse = await courseService.updateCourse(currentCourseId, payload);
            } else {
                savedCourse = await courseService.createCourse(payload);
            }

            // Step 2: Upload Image if file exists
            if (formData.img) {
                const targetId = savedCourse?.courseId || currentCourseId;
                if (targetId) {
                    await courseService.uploadCourseImage(targetId, formData.img);
                }
            }

            await loadCourses();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save course. Check console.");
        }
    };

    const handleDelete = async (index) => {
        const c = courses[index];
        if (!c || !c.id) return;

        if (window.confirm("Delete this course?")) {
            try {
                await courseService.deleteCourse(c.id);
                loadCourses();
            } catch (error) {
                console.error("Delete failed", error);
                const msg = error.message || "";
                if (msg.includes("foreign key constraint") || msg.includes("ConstraintViolationException")) {
                    alert("Cannot delete this course because it has associated Content/Topics.\n\nPlease delete the course content first.");
                } else {
                    alert("Failed to delete course: " + msg);
                }
            }
        }
    };

    return {
        courses,
        showModal,
        setShowModal,
        openModal,
        handleDelete,
        handleSave,
        handleInputChange,
        handleImageChange,
        formData,
        step,
        setStep,
        editIndex,
        setFormData
    };
};
