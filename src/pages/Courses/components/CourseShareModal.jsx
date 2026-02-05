import React from "react";
import { FiX, FiCopy } from "react-icons/fi";
import { FaWhatsapp, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { courseService } from "../services/courseService";

const CourseShareModal = ({ isOpen, onClose, course }) => {
    const [enabled, setEnabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        if (course) {
            setEnabled(course.shareEnabled !== false);
            setError("");
        }
    }, [course]);

    if (!isOpen || !course) return null;

    const isCourseDisabled = course.status === "DISABLED";

    const baseUrl = window.location.origin;

    const shareUrl = course.shareCode
        ? `${baseUrl}/share/${course.shareCode}`
        : `${baseUrl}/course-overview/${course.id}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
        } catch {
            console.warn("Clipboard copy failed");
        }
    };

    const handleSocialShare = (platform) => {
        if (!enabled || isCourseDisabled) return;

        const desc = course.desc || course.description || "";
        const text = `Check out this course: ${course.name || "Course"}${desc ? ` - ${desc}` : ""}`;
        let url = "";

        if (platform === "whatsapp") {
            url = `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`;
        }
        if (platform === "telegram") {
            url = `https://t.me/share/url?url=${encodeURIComponent(
                shareUrl
            )}&text=${encodeURIComponent(text)}`;
        }
        if (platform === "email") {
            url = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(
                shareUrl
            )}`;
        }

        if (url) window.open(url, "_blank");
    };

    const handleToggle = async (e) => {
        if (isCourseDisabled) return;

        const nextState = e.target.checked;
        setLoading(true);
        setError("");

        try {
            await courseService.updateCourse(course.id, {
                shareEnabled: nextState,
            });
            setEnabled(nextState);
        } catch (err) {
            console.error("Share toggle failed", err);
            setError("Failed to update sharing status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content shadow-lg p-0" style={{ width: 420, borderRadius: '16px', overflow: 'hidden' }}>
                <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
                    <h5 className="m-0 fw-bold text-dark">Share Course</h5>
                    <button className="btn btn-sm btn-icon text-muted" onClick={onClose} style={{ background: 'none', border: 'none' }}>
                        <FiX size={20} />
                    </button>
                </div>

                <div className="modal-body p-4 d-flex flex-column align-items-center gap-4">
                    {/* Status Warning */}
                    {isCourseDisabled && (
                        <div className="alert alert-danger w-100 py-2 text-center mb-0 text-small">
                            Sharing disabled: Course is inactive.
                        </div>
                    )}

                    {/* Toggle */}
                    <div className="d-flex align-items-center gap-3 w-100 justify-content-between px-3 py-2 bg-light rounded-3 border">
                        <span className="fw-semibold text-secondary">Enable Public Sharing</span>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={enabled}
                                disabled={isCourseDisabled || loading}
                                onChange={handleToggle}
                                style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                            />
                        </div>
                    </div>

                    {enabled && !isCourseDisabled ? (
                        <>
                            <div className="p-3 bg-white border rounded-3 shadow-sm" style={{ opacity: loading ? 0.5 : 1 }}>
                                <QRCodeCanvas value={shareUrl} size={180} />
                            </div>

                            <div className="w-100">
                                <label className="form-label text-muted small fw-bold text-uppercase">Public Share Link</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control bg-light text-secondary"
                                        value={shareUrl}
                                        readOnly
                                        style={{ fontSize: '13px' }}
                                    />
                                    <button className="btn btn-outline-secondary" type="button" onClick={handleCopy}>
                                        <FiCopy /> Copy
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex gap-3 justify-content-center w-100">
                                <button className="btn btn-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }} onClick={() => handleSocialShare("whatsapp")} title="Share on WhatsApp">
                                    <FaWhatsapp size={20} />
                                </button>
                                <button className="btn btn-info text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }} onClick={() => handleSocialShare("telegram")} title="Share on Telegram">
                                    <FaTelegramPlane size={20} />
                                </button>
                                <button className="btn btn-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }} onClick={() => handleSocialShare("email")} title="Share via Email">
                                    <FaEnvelope size={20} />
                                </button>
                            </div>

                            <p className="text-muted small m-0 text-center">
                                Scan the QR code or copy the link to share this course.
                            </p>
                        </>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <div className="mb-2" style={{ fontSize: '2rem', opacity: 0.3 }}>🚫</div>
                            <p className="m-0">Sharing is currently disabled.</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-danger small mt-2">{error}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(CourseShareModal);
