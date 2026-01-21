import React from 'react';
import { FiX, FiShare2, FiCopy } from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { courseService } from '../services/courseService';

const CourseShareModal = ({ isOpen, onClose, course }) => {
    const [enabled, setEnabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (course) {
            setEnabled(course.shareEnabled !== false); // Default true
        }
    }, [course]);

    if (!isOpen || !course) return null;

    // Use frontend URL construction to ensure it points to the UI, not the API
    // If course.shareCode exists, build the link. Fallback to /course-overview/id
    const shareUrl = course.shareCode
        ? `${window.location.origin}/share/${course.shareCode}`
        : `${window.location.origin}/course-overview/${course.id || 'preview'}`;


    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('URL copied to clipboard!');
    };

    const handleSocialShare = (platform) => {
        const text = `Check out this course: ${course.name}`;
        let url = '';

        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
                break;
            case 'telegram':
                url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
                break;
            case 'email':
                url = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(shareUrl)}`;
                break;
            default:
                break;
        }

        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleToggle = async (e) => {
        const newState = e.target.checked;
        setEnabled(newState);
        setLoading(true);
        try {
            await courseService.updateCourse(course.id, { shareEnabled: newState });
        } catch (error) {
            console.error("Failed to update share status", error);
            setEnabled(!newState); // Revert on error
            alert("Failed to update share status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '400px', textAlign: 'center' }}>
                <div className="modal-header">
                    <h2>Share Course</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>

                <div className="share-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

                    {/* Share Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', width: '100%' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Enable Sharing</span>
                        <div className="form-check form-switch" style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center' }}>
                            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                                <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={handleToggle}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: enabled ? '#2563eb' : '#ccc', transition: '.4s', borderRadius: '34px'
                                }}>
                                    <span style={{
                                        position: 'absolute', content: "", height: '16px', width: '16px', left: '4px', bottom: '4px',
                                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                        transform: enabled ? 'translateX(16px)' : 'translateX(0)'
                                    }}></span>
                                </span>
                            </label>
                        </div>
                    </div>

                    {enabled ? (
                        <>
                            <div className="qr-container" style={{ padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', opacity: loading ? 0.5 : 1 }}>
                                <QRCodeCanvas value={shareUrl} size={200} />
                            </div>

                            <div className="share-url-box" style={{ width: '100%', display: 'flex', gap: '8px', opacity: loading ? 0.5 : 1 }}>
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    style={{
                                        flex: 1,
                                        padding: '10px 12px',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        fontSize: '13px'
                                    }}
                                />
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        background: '#0f172a',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        width: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FiCopy size={16} />
                                </button>
                            </div>

                            {/* Social Share Buttons */}
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
                                <button
                                    onClick={() => handleSocialShare('whatsapp')}
                                    style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px' }}
                                    title="Share on WhatsApp"
                                >
                                    <FaWhatsapp />
                                </button>
                                <button
                                    onClick={() => handleSocialShare('telegram')}
                                    style={{ background: '#0088cc', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px' }}
                                    title="Share on Telegram"
                                >
                                    <FaTelegramPlane />
                                </button>
                                <button
                                    onClick={() => handleSocialShare('email')}
                                    style={{ background: '#EA4335', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px' }}
                                    title="Share via Email"
                                >
                                    <FaEnvelope />
                                </button>
                            </div>

                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                                Scan QR code or copy URL to share this course.
                            </p>
                        </>
                    ) : (
                        <div style={{ padding: '40px 0', color: '#94a3b8' }}>
                            <p>Sharing is currently disabled for this course.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseShareModal;
