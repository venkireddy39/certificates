
/**
 * Validate course form data
 * @param {Object} formData 
 * @returns {Array} errors
 */
/**
 * Validate course form data — aligned with Course entity fields.
 * @param {Object} formData
 * @returns {Array} errors
 */
export const validateCourseForm = (formData) => {
    const errors = [];
    if (!formData.courseName || !formData.courseName.trim()) {
        errors.push("Course name is required");
    }
    return errors;
};
