import React from "react";
import {
    FiImage, FiInfo, FiUsers, FiLayers, FiMoreVertical,
    FiEdit2, FiTrash2, FiShare2, FiBookmark, FiPlus,
    FiCalendar, FiClock, FiArrowRight
} from "react-icons/fi";

const PALETTE = [
    { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', light: '#eef2ff' },
    { bg: 'linear-gradient(135deg,#0ea5e9,#6366f1)', light: '#e0f2fe' },
    { bg: 'linear-gradient(135deg,#10b981,#0ea5e9)', light: '#ecfdf5' },
    { bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', light: '#fef3c7' },
    { bg: 'linear-gradient(135deg,#ec4899,#8b5cf6)', light: '#fdf2f8' },
    { bg: 'linear-gradient(135deg,#14b8a6,#6366f1)', light: '#f0fdfa' },
];

const CourseCard = ({
    course = {},
    index,
    onEdit,
    onDelete,
    onManageContent,
    onViewLearners,
    onShowDetails,
    onShare,
    onBookmark,
    onCreateBatch
}) => {
    const [imgError, setImgError] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80";
    const imageUrl = course?.courseImageUrl || course?.imageUrl || course?.img || course?.image;
    const displayImage = imgError || !imageUrl?.trim() ? DEFAULT_IMAGE : imageUrl;

    const palette = PALETTE[(Number(index) || 0) % PALETTE.length];
    const statusActive = course?.status === 'ACTIVE' || course?.active !== false;

    return (
        <div className="cc-card">
            {/* Image */}
            <div
                className="cc-img-wrap"
                onClick={() => onCreateBatch?.(course.courseId || course.id, course.courseName || course.name)}
                title="Click to Create Batch"
            >
                <img
                    src={displayImage}
                    alt={course?.courseName || course?.name || "Course"}
                    onError={() => setImgError(true)}
                    className="cc-img"
                />
                {/* Gradient overlay always visible at bottom */}
                <div className="cc-img-gradient" />

                {/* Status badge */}
                <div className={`cc-status-badge ${statusActive ? 'cc-status-active' : 'cc-status-inactive'}`}>
                    <span className="cc-status-dot" />
                    {statusActive ? 'Active' : 'Inactive'}
                </div>


                {/* Hover overlay */}
                <div className="cc-hover-overlay">
                    <div className="cc-hover-cta">
                        <FiPlus size={20} />
                        <span>Create Batch</span>
                    </div>
                </div>
            </div>

            {/* Top-right action buttons */}
            <div className="cc-badge-row">
                <button
                    className="cc-icon-btn"
                    onClick={e => { e.stopPropagation(); onBookmark?.(course.courseId || course.id); }}
                    title={course.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                >
                    <FiBookmark
                        size={15}
                        fill={course.isBookmarked ? "#f59e0b" : "none"}
                        color={course.isBookmarked ? "#f59e0b" : "#64748b"}
                    />
                </button>
                <div className="cc-menu-wrap">
                    <button
                        className="cc-icon-btn"
                        onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
                    >
                        <FiMoreVertical size={15} />
                    </button>
                    {menuOpen && (
                        <div className="cc-dropdown">
                            <button className="cc-dd-item" onClick={() => { onShowDetails?.(course); setMenuOpen(false); }}>
                                <FiInfo size={13} className="cc-dd-icon blue" /> View Details
                            </button>
                            <button className="cc-dd-item" onClick={() => { onShare?.(course); setMenuOpen(false); }}>
                                <FiShare2 size={13} className="cc-dd-icon teal" /> Share
                            </button>
                            <button className="cc-dd-item" onClick={() => { onEdit?.(course.courseId || course.id); setMenuOpen(false); }}>
                                <FiEdit2 size={13} className="cc-dd-icon slate" /> Edit
                            </button>
                            <div className="cc-dd-divider" />
                            <button className="cc-dd-item danger" onClick={() => { onDelete?.(course.courseId || course.id); setMenuOpen(false); }}>
                                <FiTrash2 size={13} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="cc-body">
                {/* Color accent bar */}
                <div className="cc-accent-bar" style={{ background: palette.bg }} />

                {/* Title + learners */}
                <div className="cc-title-row">
                    <h3 className="cc-title">{course?.courseName || course?.name || "Untitled Course"}</h3>
                    <button
                        className="cc-learners-chip"
                        onClick={() => onViewLearners?.(course.courseId || course.id)}
                        title="View Learners"
                    >
                        <FiUsers size={12} />
                        <span>{course?.learnersCount || 0} Learners</span>
                    </button>
                </div>

                {/* Meta row */}
                <div className="cc-meta-row">
                    {course?.duration && (
                        <span className="cc-meta-chip">
                            <FiClock size={11} /> {course.duration}
                        </span>
                    )}
                    {course?.courseFee && (
                        <span className="cc-meta-chip green">
                            ₹{Number(course.courseFee).toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="cc-desc">
                    {course?.description || course?.desc || "No description provided for this course."}
                </p>

                {/* Footer */}
                <div className="cc-footer">
                    <button className="cc-btn ghost" onClick={() => onManageContent?.(course.courseId || course.id)}>
                        <FiLayers size={13} /> Course Builder
                    </button>
                    <button className="cc-btn primary" onClick={() => onCreateBatch?.(course.courseId || course.id, course.courseName || course.name)}>
                        <FiPlus size={13} /> Create Batch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(CourseCard);
