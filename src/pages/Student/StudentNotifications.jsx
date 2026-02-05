import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
    Bell,
    Check,
    Trash2,
    Info,
    AlertTriangle,
    CheckCircle,
    AlertOctagon,
    Clock
} from 'lucide-react';
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
            case 'success': return <CheckCircle size={20} className="text-success" />;
            case 'warning': return <AlertTriangle size={20} className="text-warning" />;
            case 'alert': return <AlertOctagon size={20} className="text-danger" />;
            default: return <Info size={20} className="text-info" />;
        }
    };

    const filteredNotifications = filter === 'All'
        ? notifications
        : filter === 'Unread'
            ? notifications.filter(n => !n.read)
            : notifications;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-70">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="student-notifications-page container-fluid px-0">
            {/* Header */}
            <div className="row mb-4 align-items-end">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <h3 className="fw-bold text-white mb-1">Notifications</h3>
                    <p className="text-secondary small mb-0">Stay updated with your latest activities.</p>
                </div>
                <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
                    <div className="glass-card px-3 py-2 d-flex gap-2">
                        <button
                            className={`btn btn-sm ${filter === 'All' ? 'btn-primary' : 'btn-ghost-light'}`}
                            onClick={() => setFilter('All')}
                        >
                            All
                        </button>
                        <button
                            className={`btn btn-sm ${filter === 'Unread' ? 'btn-primary' : 'btn-ghost-light'}`}
                            onClick={() => setFilter('Unread')}
                        >
                            Unread
                        </button>
                    </div>
                    <button
                        className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                        onClick={markAllAsRead}
                    >
                        <Check size={16} /> Mark all read
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    {filteredNotifications.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                            {filteredNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`glass-card p-3 notification-item ${!notification.read ? 'unread' : ''}`}
                                >
                                    <div className="d-flex gap-3">
                                        <div className="notification-icon-wrapper pt-1">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className={`mb-0 fw-bold ${!notification.read ? 'text-white' : 'text-white-50'}`}>
                                                    {notification.title}
                                                </h6>
                                                <span className="text-secondary x-small d-flex align-items-center gap-1">
                                                    <Clock size={12} /> {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-secondary small mb-0">{notification.message}</p>
                                        </div>
                                        <div className="d-flex flex-column gap-2 opacity-0 action-buttons">
                                            {!notification.read && (
                                                <button
                                                    className="btn btn-icon-xs text-primary"
                                                    title="Mark as read"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-icon-xs text-danger"
                                                title="Delete"
                                                onClick={() => deleteNotification(notification.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <Bell size={48} className="text-secondary opacity-25 mb-3" />
                            <h5 className="text-secondary">No new notifications</h5>
                            <p className="text-secondary small">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentNotifications;
