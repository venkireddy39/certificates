import React, { useState } from "react";
import {
    FiX,
    FiChevronDown,
    FiChevronUp,
    FiImage,
    FiUpload,
    FiBook,
    FiClock,
    FiDollarSign,
    FiTool,
    FiAlignLeft,
    FiAward,
    FiToggleLeft,
    FiToggleRight,
    FiCalendar,
    FiSmartphone,
    FiBookmark,
    FiShare2,
    FiAlertCircle,
} from "react-icons/fi";

// ─── Toggle Switch Component ───────────────────────────────────────────────
const Toggle = ({ checked, onChange, label, id }) => (
    <div className="cm-toggle-row">
        <label className="cm-toggle-label" htmlFor={id}>
            {label}
        </label>
        <button
            type="button"
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`cm-toggle-switch ${checked ? "cm-toggle-on" : "cm-toggle-off"}`}
        >
            <span className="cm-toggle-thumb" />
        </button>
    </div>
);

// ─── Radio Group Component ─────────────────────────────────────────────────
const RadioGroup = ({ name, value, options, onChange }) => (
    <div className="cm-radio-group">
        {options.map((opt) => (
            <label
                key={opt.value}
                className={`cm-radio-pill ${value === opt.value ? "cm-radio-active" : ""}`}
            >
                <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={onChange}
                    className="cm-radio-hidden"
                />
                {opt.label}
            </label>
        ))}
    </div>
);

// ─── Field Wrapper ─────────────────────────────────────────────────────────
const Field = ({ label, children, hint }) => (
    <div className="cm-field">
        <label className="cm-field-label">{label}</label>
        {children}
        {hint && <span className="cm-field-hint">{hint}</span>}
    </div>
);

// ─── Main Modal ────────────────────────────────────────────────────────────
const CourseModal = ({
    isOpen,
    onClose,
    formData,
    handleInputChange,
    handleImageChange,
    handleSave,
    isEdit,
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // Auto-expand advanced if any advanced field is set on edit
    React.useEffect(() => {
        if (isEdit && isOpen) {
            if (
                formData.showValidity ||
                formData.allowOfflineMobile ||
                formData.certificateProvided ||
                formData.allowBookmark
            ) {
                setShowAdvanced(true);
            }
        }
        if (!isOpen) {
            setError("");
            setSaving(false);
        }
    }, [isOpen, isEdit]);

    if (!isOpen) return null;

    const onSave = async () => {
        if (!formData.courseName || !formData.courseName.trim()) {
            setError("Course name is required.");
            return;
        }
        setError("");
        setSaving(true);
        try {
            await handleSave();
        } finally {
            setSaving(false);
        }
    };

    // Helper for generic toggle (boolean fields)
    const handleToggle = (fieldName, value) => {
        handleInputChange({
            target: { name: fieldName, value, type: "toggle" },
        });
    };

    return (
        <>
            {/* Inject scoped styles */}
            <style>{`
                /* ── Overlay ── */
                .cm-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(10, 15, 30, 0.65);
                    backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1100;
                    animation: cmFadeIn 0.2s ease;
                    padding: 16px;
                }
                @keyframes cmFadeIn { from { opacity: 0; } }

                /* ── Dialog ── */
                .cm-dialog {
                    background: #ffffff;
                    border-radius: 20px;
                    width: 640px;
                    max-width: 100%;
                    max-height: 94vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 32px 64px -12px rgba(0,0,0,0.3);
                    animation: cmSlideUp 0.3s cubic-bezier(0.16,1,0.3,1);
                    overflow: hidden;
                }
                @keyframes cmSlideUp {
                    from { transform: translateY(28px); opacity: 0; }
                }

                /* ── Header ── */
                .cm-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 22px 28px;
                    border-bottom: 1px solid #f0f4f8;
                    flex-shrink: 0;
                    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
                }
                .cm-header-info { display: flex; flex-direction: column; gap: 2px; }
                .cm-header h2 {
                    font-size: 19px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.3px;
                }
                .cm-header-sub {
                    font-size: 12px;
                    color: rgba(255,255,255,0.6);
                    margin: 0;
                }
                .cm-close-btn {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 10px;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: rgba(255,255,255,0.8);
                    transition: all 0.2s;
                }
                .cm-close-btn:hover {
                    background: rgba(239,68,68,0.25);
                    color: #fff;
                }

                /* ── Body ── */
                .cm-body {
                    padding: 24px 28px;
                    overflow-y: auto;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                /* ── Error Banner ── */
                .cm-error-banner {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #fff1f2;
                    border: 1px solid #fecdd3;
                    border-radius: 10px;
                    padding: 10px 14px;
                    color: #be123c;
                    font-size: 13px;
                    font-weight: 500;
                    margin-bottom: 20px;
                }

                /* ── Section Divider ── */
                .cm-section-title {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #94a3b8;
                    margin: 24px 0 14px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .cm-section-title::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #f1f5f9;
                }

                /* ── Field ── */
                .cm-field { margin-bottom: 18px; }
                .cm-field-label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 7px;
                }
                .cm-field-label svg { color: #6366f1; font-size: 14px; }
                .cm-field-hint {
                    display: block;
                    font-size: 11px;
                    color: #94a3b8;
                    margin-top: 5px;
                }

                /* ── Inputs ── */
                .cm-input, .cm-textarea {
                    width: 100%;
                    padding: 11px 14px;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 14px;
                    background: #f9fafb;
                    color: #111827;
                    transition: all 0.2s;
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .cm-input:focus, .cm-textarea:focus {
                    outline: none;
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }
                .cm-textarea { resize: vertical; min-height: 90px; }
                .cm-input-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                }

                /* ── Image Uploader ── */
                .cm-img-uploader {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border: 2px dashed #e5e7eb;
                    border-radius: 14px;
                    padding: 20px;
                    background: #f9fafb;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    overflow: hidden;
                    min-height: 120px;
                    gap: 8px;
                }
                .cm-img-uploader:hover {
                    border-color: #6366f1;
                    background: #f5f3ff;
                }
                .cm-img-uploader input[type="file"] {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    cursor: pointer;
                }
                .cm-img-preview {
                    width: 100%;
                    height: 120px;
                    object-fit: cover;
                    border-radius: 10px;
                    display: block;
                }
                .cm-img-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    color: #9ca3af;
                    pointer-events: none;
                }
                .cm-img-placeholder svg { font-size: 28px; color: #c4b5fd; }
                .cm-img-placeholder span {
                    font-size: 13px;
                    font-weight: 500;
                    color: #6366f1;
                }
                .cm-img-placeholder small { font-size: 11px; color: #9ca3af; }

                /* ── Toggle ── */
                .cm-toggle-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 14px;
                    background: #f9fafb;
                    border-radius: 10px;
                    border: 1.5px solid #f1f5f9;
                    transition: border-color 0.2s;
                }
                .cm-toggle-row:hover { border-color: #e0e7ff; }
                .cm-toggle-label { font-size: 13px; font-weight: 500; color: #374151; }
                .cm-toggle-switch {
                    width: 44px;
                    height: 24px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    position: relative;
                    transition: background 0.25s;
                    flex-shrink: 0;
                }
                .cm-toggle-on { background: #6366f1; }
                .cm-toggle-off { background: #d1d5db; }
                .cm-toggle-thumb {
                    position: absolute;
                    width: 18px;
                    height: 18px;
                    background: white;
                    border-radius: 50%;
                    top: 3px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
                }
                .cm-toggle-on .cm-toggle-thumb { left: 23px; }
                .cm-toggle-off .cm-toggle-thumb { left: 3px; }

                /* ── Radio Pills ── */
                .cm-radio-group { display: flex; gap: 8px; flex-wrap: wrap; }
                .cm-radio-pill {
                    padding: 7px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    border: 1.5px solid #e5e7eb;
                    color: #6b7280;
                    background: #f9fafb;
                    transition: all 0.15s;
                    user-select: none;
                }
                .cm-radio-pill:hover { border-color: #a5b4fc; color: #4f46e5; }
                .cm-radio-active {
                    background: #eef2ff;
                    border-color: #6366f1;
                    color: #4338ca;
                    font-weight: 600;
                }
                .cm-radio-hidden { display: none; }

                /* ── Status Pills (special) ── */
                .cm-status-active.cm-radio-active {
                    background: #f0fdf4;
                    border-color: #22c55e;
                    color: #15803d;
                }
                .cm-status-disabled.cm-radio-active {
                    background: #fff7ed;
                    border-color: #f97316;
                    color: #c2410c;
                }

                /* ── Advanced Toggle Btn ── */
                .cm-adv-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: none;
                    color: #6366f1;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 6px 0;
                    margin-top: 4px;
                    margin-bottom: 4px;
                    transition: color 0.2s;
                }
                .cm-adv-btn:hover { color: #4338ca; }

                /* ── Advanced Panel ── */
                .cm-adv-panel {
                    background: #f8fafc;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 14px;
                    padding: 20px;
                    margin-top: 4px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    animation: cmFadeIn 0.2s ease;
                }

                /* ── Validity Days input ── */
                .cm-validity-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 10px;
                }
                .cm-validity-row .cm-input {
                    width: 140px;
                    flex-shrink: 0;
                }
                .cm-validity-row span { font-size: 13px; color: #6b7280; }

                /* ── Share Code Badge ── */
                .cm-share-code {
                    font-family: 'Courier New', monospace;
                    background: #f3f4f6;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 13px;
                    color: #4338ca;
                    font-weight: 600;
                    border: 1px solid #e5e7eb;
                }

                /* ── Footer ── */
                .cm-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding: 18px 28px;
                    border-top: 1px solid #f0f4f8;
                    background: #fff;
                    flex-shrink: 0;
                }
                .cm-btn-cancel {
                    background: #fff;
                    border: 1.5px solid #e5e7eb;
                    padding: 10px 22px;
                    border-radius: 10px;
                    color: #6b7280;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .cm-btn-cancel:hover { border-color: #cbd5e1; background: #f9fafb; }
                .cm-btn-save {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    border: none;
                    padding: 10px 28px;
                    border-radius: 10px;
                    color: #fff;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(99,102,241,0.35);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .cm-btn-save:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
                }
                .cm-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

                /* ── Scrollbar ── */
                .cm-body::-webkit-scrollbar { width: 5px; }
                .cm-body::-webkit-scrollbar-track { background: transparent; }
                .cm-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
            `}</style>

            <div className="cm-overlay" role="dialog" aria-modal="true">
                <div className="cm-dialog">

                    {/* ──────── HEADER ──────── */}
                    <div className="cm-header">
                        <div className="cm-header-info">
                            <h2>{isEdit ? "✏️ Edit Course" : "🚀 Create New Course"}</h2>
                            <p className="cm-header-sub">
                                {isEdit
                                    ? "Update course details below"
                                    : "Fill in the details to publish a new course"}
                            </p>
                        </div>
                        <button className="cm-close-btn" onClick={onClose} aria-label="Close">
                            <FiX size={18} />
                        </button>
                    </div>

                    {/* ──────── BODY ──────── */}
                    <div className="cm-body">

                        {/* Error */}
                        {error && (
                            <div className="cm-error-banner">
                                <FiAlertCircle size={15} />
                                {error}
                            </div>
                        )}

                        {/* ── BASIC INFO ── */}
                        <div className="cm-section-title">
                            <FiBook size={12} /> Basic Information
                        </div>

                        {/* Course Name */}
                        <Field label={<><FiBook />Course Name <span style={{ color: "#ef4444" }}>*</span></>}>
                            <input
                                type="text"
                                className="cm-input"
                                name="courseName"
                                id="courseName"
                                value={formData.courseName || ""}
                                onChange={handleInputChange}
                                placeholder="e.g. Advanced React Patterns"
                                autoFocus
                            />
                        </Field>

                        {/* Description */}
                        <Field
                            label={<><FiAlignLeft />Description</>}
                            hint="Briefly describe what this course is about."
                        >
                            <textarea
                                className="cm-textarea"
                                name="description"
                                id="description"
                                value={formData.description || ""}
                                onChange={handleInputChange}
                                placeholder="This course covers..."
                            />
                        </Field>

                        {/* Tools Covered */}
                        <Field
                            label={<><FiTool />Tools Covered</>}
                            hint="Comma-separated list of tools/technologies"
                        >
                            <input
                                type="text"
                                className="cm-input"
                                name="toolsCovered"
                                id="toolsCovered"
                                value={formData.toolsCovered || ""}
                                onChange={handleInputChange}
                                placeholder="React, Node.js, Docker, Git"
                            />
                        </Field>

                        {/* Fee + Duration row */}
                        <div className="cm-input-row">
                            <Field label={<><FiDollarSign />Course Fee (₹)</>}>
                                <input
                                    type="number"
                                    className="cm-input"
                                    name="courseFee"
                                    id="courseFee"
                                    value={formData.courseFee ?? ""}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0 for Free"
                                />
                            </Field>
                            <Field label={<><FiClock />Duration</>}>
                                <input
                                    type="text"
                                    className="cm-input"
                                    name="duration"
                                    id="duration"
                                    value={formData.duration || ""}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 3 Months / 40 Hours"
                                />
                            </Field>
                        </div>

                        {/* Course Status */}
                        <Field label={<><FiToggleRight />Course Status</>}>
                            <div className="cm-radio-group">
                                {["ACTIVE", "DISABLED"].map((s) => (
                                    <label
                                        key={s}
                                        className={`cm-radio-pill ${s === "ACTIVE" ? "cm-status-active" : "cm-status-disabled"} ${formData.status === s ? "cm-radio-active" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            value={s}
                                            checked={formData.status === s}
                                            onChange={handleInputChange}
                                            className="cm-radio-hidden"
                                        />
                                        {s === "ACTIVE" ? "✅ Active" : "⛔ Disabled"}
                                    </label>
                                ))}
                            </div>
                        </Field>

                        {/* ── COVER IMAGE ── */}
                        <div className="cm-section-title">
                            <FiImage size={12} /> Cover Image
                        </div>

                        <Field label={<><FiUpload />Upload Course Thumbnail</>} hint="PNG / JPG / WEBP – recommended 800×450px">
                            <div className="cm-img-uploader">
                                {formData.imgPreview ? (
                                    <img
                                        src={formData.imgPreview}
                                        alt="Course Preview"
                                        className="cm-img-preview"
                                    />
                                ) : (
                                    <div className="cm-img-placeholder">
                                        <FiImage />
                                        <span>Click to upload image</span>
                                        <small>PNG, JPG or WEBP</small>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="courseImageFile"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </Field>

                        {/* ── ADVANCED SETTINGS TOGGLE ── */}
                        <button
                            type="button"
                            className="cm-adv-btn"
                            onClick={() => setShowAdvanced((prev) => !prev)}
                        >
                            {showAdvanced ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
                            {showAdvanced ? "Hide" : "Show"} Advanced Settings
                        </button>

                        {/* ── ADVANCED PANEL ── */}
                        {showAdvanced && (
                            <div className="cm-adv-panel">

                                {/* Certificate */}
                                <Toggle
                                    id="certificateProvided"
                                    label={<><FiAward style={{ marginRight: 6, color: "#f59e0b" }} />Certificate on Completion</>}
                                    checked={!!formData.certificateProvided}
                                    onChange={(val) => handleToggle("certificateProvided", val)}
                                />

                                {/* Course Validity */}
                                <Toggle
                                    id="showValidity"
                                    label={<><FiCalendar style={{ marginRight: 6, color: "#3b82f6" }} />Show Course Validity</>}
                                    checked={!!formData.showValidity}
                                    onChange={(val) => handleToggle("showValidity", val)}
                                />

                                {formData.showValidity && (
                                    <div className="cm-validity-row">
                                        <input
                                            type="number"
                                            className="cm-input"
                                            name="validityInDays"
                                            id="validityInDays"
                                            value={formData.validityInDays || ""}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 365"
                                            min="1"
                                        />
                                        <span>days validity</span>
                                    </div>
                                )}

                                {/* Offline Mobile */}
                                <Toggle
                                    id="allowOfflineMobile"
                                    label={<><FiSmartphone style={{ marginRight: 6, color: "#8b5cf6" }} />Allow Offline / Mobile Access</>}
                                    checked={!!formData.allowOfflineMobile}
                                    onChange={(val) => handleToggle("allowOfflineMobile", val)}
                                />

                                {/* Bookmark */}
                                <Toggle
                                    id="allowBookmark"
                                    label={<><FiBookmark style={{ marginRight: 6, color: "#ec4899" }} />Allow Bookmark</>}
                                    checked={!!formData.allowBookmark}
                                    onChange={(val) => handleToggle("allowBookmark", val)}
                                />

                                {/* Share */}
                                <Toggle
                                    id="shareEnabled"
                                    label={<><FiShare2 style={{ marginRight: 6, color: "#10b981" }} />Enable Course Sharing</>}
                                    checked={formData.shareEnabled !== false}
                                    onChange={(val) => handleToggle("shareEnabled", val)}
                                />

                                {/* Share code badge (only on edit) */}
                                {isEdit && formData.shareCode && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280" }}>
                                        <FiShare2 size={13} />
                                        Share Code:&nbsp;
                                        <span className="cm-share-code">{formData.shareCode}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ──────── FOOTER ──────── */}
                    <div className="cm-footer">
                        <button className="cm-btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="cm-btn-save" onClick={onSave} disabled={saving}>
                            {saving
                                ? "Saving…"
                                : isEdit
                                    ? "💾 Update Course"
                                    : "🚀 Create Course"}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default React.memo(CourseModal);
