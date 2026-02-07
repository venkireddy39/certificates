import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import {
    Bell,
    Check,
    Trash2,
    Info,
    AlertTriangle,
    CheckCircle,
    AlertOctagon,
    Clock,
    Filter,
    MoreHorizontal,
    Settings
} from 'lucide-react';
import '../StudentDashboard.css';
import './StudentNotifications.css';

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await studentService.getNotifications();
                setNotifications(data || []);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <div className="icon-pill success shadow-glow-sm"><CheckCircle size={18} /></div>;
            case 'warning': return <div className="icon-pill warning shadow-glow-sm"><AlertTriangle size={18} /></div>;
            case 'alert': return <div className="icon-pill danger shadow-glow-sm"><AlertOctagon size={18} /></div>;
            default: return <div className="icon-pill info shadow-glow-sm"><Info size={18} /></div>;
        }
    };

    const filteredNotifications = filter === 'All'
        ? notifications
        : filter === 'Unread'
            ? notifications.filter(n => !n.read)
            : notifications;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="student-notifications-container animate-fade-in">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-6">
                    <h2 className="fw-bold mb-1">Incident Broadcasts</h2>
                    <p className="text-secondary mb-0">Crucial updates on your academic progress and campus activity.</p>
                </div>
                <div className="col-12 col-md-6 text-md-end">
                    <div className="d-inline-flex gap-2">
                        <button className="btn btn-outline-light border-opacity-10 rounded-pill px-4 py-2 smaller d-flex align-items-center gap-2" onClick={markAllAsRead}>
                            <Check size={16} /> Bulk Dismiss
                        </button>
                        <button className="btn btn-icon-glass rounded-circle"><Settings size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="d-flex gap-2 mb-4">
                {['All', 'Unread', 'Critical', 'System'].map(tab => (
                    <button
                        key={tab}
                        className={`pill-btn border-0 ${filter === tab ? 'active' : ''}`}
                        onClick={() => setFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    {filteredNotifications.length > 0 ? (
                        <div className="notification-vertical-stream d-flex flex-column gap-3">
                            {filteredNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`glass-card notification-box-v2 p-4 transition-all d-flex gap-4 border-opacity-5 ${!notification.read ? 'is-unread bg-primary bg-opacity-2' : 'is-read opacity-75'}`}
                                >
                                    <div className="flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="fw-bold text-white mb-0 small">{notification.title}</h6>
                                            <span className="smaller text-secondary font-monospace opacity-50 d-flex align-items-center gap-1">
                                                <Clock size={12} /> {notification.time}
                                            </span>
                                        </div>
                                        <p className="text-secondary smaller mb-0 leading-relaxed pe-5">{notification.message}</p>
                                    </div>
                                    <div className="flex-shrink-0 d-flex flex-column gap-2 notification-hover-actions">
                                        {!notification.read && (
                                            <button
                                                className="btn-circle-action text-primary shadow-glow-sm"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                        <button
                                            className="btn-circle-action text-danger shadow-glow-sm"
                                            onClick={() => deleteNotification(notification.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 glass-card border-dashed">
                            <div className="p-5">
                                <Bell size={64} className="text-secondary opacity-15 mb-4" />
                                <h4 className="fw-bold">Broadcast Silence</h4>
                                <p className="text-secondary mb-0">No new updates or alerts synchronized to your workspace.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentNotifications;
