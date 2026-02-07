import React from 'react';
import { motion } from 'framer-motion';
import {
    Play,
    Award,
    Zap,
    Clock,
    TrendingUp,
    ChevronRight,
    FileText,
    Video,
    Upload,
    BarChart2
} from 'lucide-react';

export const StatCard = ({ label, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass-card stat-card shadow-sm border-0"
    >
        <div className="stat-icon-wrapper" style={{ background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
            <Icon size={24} />
        </div>
        <div>
            <div className="stat-label text-muted smaller tracking-wider fw-bold text-uppercase">{label}</div>
            <div className="stat-value fw-bold h4 mb-0 text-body">{value}</div>
        </div>
    </motion.div>
);

export const QuickAction = ({ icon: Icon, label, color, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="quick-action-btn btn border-0 d-flex flex-column align-items-center gap-2 p-3 w-100 rounded-4 transition-all"
        style={{ background: 'var(--hover-bg)' }}
    >
        <div className="action-icon d-flex align-items-center justify-content-center rounded-3 shadow-sm" style={{ background: `rgba(${color}, 0.15)`, color: `rgb(${color})`, width: '42px', height: '42px' }}>
            <Icon size={20} />
        </div>
        <span className="small fw-bold text-body opacity-75">{label}</span>
    </motion.button>
);

export const CourseCard = ({ course, onNavigate }) => (
    <div className="glass-card course-card-premium h-100 p-4 rounded-4 border-0 shadow-sm" style={{ background: 'var(--surface)' }}>
        <div className="d-flex justify-content-between align-items-start mb-4">
            <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary shadow-sm border border-primary border-opacity-10">
                <Play size={22} fill="currentColor" fillOpacity={0.2} />
            </div>
            <span className={`badge rounded-pill bg-${course.priority === 'High' ? 'danger' : 'success'} bg-opacity-10 text-${course.priority === 'High' ? 'danger' : 'success'} px-3 py-2 fw-bold border border-${course.priority === 'High' ? 'danger' : 'success'} border-opacity-10`}>
                {course.priority || 'Active'}
            </span>
        </div>

        <h5 className="fw-bold mb-1 text-body">{course.title}</h5>
        <p className="text-muted small mb-4 opacity-75">{course.instructor || 'LMS Faculty'}</p>

        <div className="mt-auto">
            <div className="d-flex justify-content-between small text-muted mb-2 fw-medium">
                <span>Course Progress</span>
                <span className="text-body fw-bold">{course.progress}%</span>
            </div>
            <div className="progress rounded-pill shadow-inner" style={{ height: '8px', background: 'var(--hover-bg)' }}>
                <div
                    className="progress-bar bg-primary rounded-pill shadow-sm"
                    role="progressbar"
                    style={{ width: `${course.progress}%` }}
                    aria-valuenow={course.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            </div>

            <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top" style={{ borderColor: 'var(--border)' }}>
                <div className="d-flex align-items-center text-muted small">
                    <Zap size={14} className="text-warning me-2" />
                    <span className="text-truncate fw-medium" style={{ maxWidth: '140px' }}>{course.nextLesson || 'Next: Introduction'}</span>
                </div>
                <button
                    onClick={() => onNavigate(course.id)}
                    className="btn btn-sm btn-link p-0 text-primary text-decoration-none d-flex align-items-center gap-1 transition-all hover-translate-x"
                >
                    <span className="small fw-bold">Continue</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    </div>
);

export const XpWidget = ({ user }) => (
    <div className="card p-4 rounded-4 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', color: '#fff' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-3 text-white">
                    <Award size={24} />
                </div>
                <div>
                    <h6 className="fw-bold mb-0 text-white">Level: {user?.level || '1'}</h6>
                    <span className="text-white-50 small opacity-75">{user?.role || 'Learner'}</span>
                </div>
            </div>
            <div className="text-end">
                <div className="h4 fw-bold mb-0 text-white">{user?.xp || '0'}</div>
                <span className="text-uppercase small text-white-50" style={{ fontSize: '10px', letterSpacing: '1px' }}>Total XP</span>
            </div>
        </div>

        <div className="mb-4">
            <div className="d-flex justify-content-between small text-white text-opacity-75 mb-1">
                <span>Next Rank</span>
                <span>{Math.round((user?.xp || 0) / (user?.nextLevelXp || 1000) * 100)}%</span>
            </div>
            <div className="progress rounded-pill bg-white bg-opacity-20 shadow-inner" style={{ height: '8px' }}>
                <div
                    className="progress-bar bg-warning rounded-pill shadow-sm"
                    style={{ width: `${(user?.xp || 0) / (user?.nextLevelXp || 1000) * 100}%` }}
                />
            </div>
        </div>

        <div className="row g-2">
            {(user?.badges || []).slice(0, 3).map((badge, i) => (
                <div key={i} className="col-4">
                    <div className="bg-white bg-opacity-10 rounded-3 p-2 text-center border border-white border-opacity-10">
                        <div className="fs-4 mb-1">{badge.icon || '⭐'}</div>
                        <div className="text-white-50 opacity-75" style={{ fontSize: '9px' }}>{badge.name}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const ActivityTimeline = ({ items }) => (
    <div className="mt-2">
        {items.map((item, i) => (
            <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="card shadow-sm border-0 p-3 ms-2 mb-3 rounded-4" style={{ background: 'var(--surface)' }}>
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <span className="text-primary small fw-bold d-block mb-1">{item.time}</span>
                            <h6 className="fw-bold mb-1 text-body">{item.title}</h6>
                            <p className="text-muted small mb-0">{item.instructor || item.type}</p>
                        </div>
                        <button className="btn btn-sm btn-link text-muted p-0">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
