import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
    Video,
    Calendar,
    Clock,
    Users,
    PlayCircle,
    User,
    MonitorPlay
} from 'lucide-react';
import './StudentWebinars.css';

const StudentWebinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const data = await studentService.getWebinars();
                setWebinars(data || []);
            } catch (error) {
                console.error("Failed to fetch webinars", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWebinars();
    }, []);

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
        <div className="student-webinars-page container-fluid px-0">
            {/* Header */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-8">
                    <h3 className="fw-bold text-white mb-1">Live Webinars</h3>
                    <p className="text-secondary small">Join live sessions and watch past recordings.</p>
                </div>
            </div>

            <div className="row g-4">
                {webinars.length > 0 ? (
                    webinars.map(webinar => (
                        <div className="col-12 col-md-6 col-lg-4" key={webinar.id}>
                            <div className="glass-card h-100 webinar-card">
                                <div className="webinar-thumb position-relative">
                                    <img src={webinar.thumbnail} alt={webinar.title} />
                                    <span className={`status-tag ${webinar.status.toLowerCase()}`}>
                                        {webinar.status === 'Live' && <span className="live-dot"></span>}
                                        {webinar.status}
                                    </span>
                                    {webinar.status === 'Ended' && (
                                        <div className="play-overlay">
                                            <PlayCircle size={48} className="text-white op-80" />
                                        </div>
                                    )}
                                </div>

                                <div className="webinar-body p-4 d-flex flex-column h-100">
                                    <h5 className="fw-bold text-white mb-2">{webinar.title}</h5>
                                    <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
                                        <User size={14} />
                                        <span>Hosted by <span className="text-white">{webinar.host}</span></span>
                                    </div>

                                    <div className="webinar-details mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2 small text-secondary">
                                                <Calendar size={14} /> {webinar.date}
                                            </div>
                                            <div className="d-flex align-items-center gap-2 small text-secondary">
                                                <Clock size={14} /> {webinar.startTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {webinar.status === 'Live' ? (
                                            <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 pulse-btn">
                                                <Video size={16} /> Join Now
                                            </button>
                                        ) : webinar.status === 'Upcoming' ? (
                                            <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                                                <CheckCircleIcon isRegistered={webinar.isRegistered} />
                                                {webinar.isRegistered ? 'Registered' : 'Register Now'}
                                            </button>
                                        ) : (
                                            <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2">
                                                <PlayCircle size={16} /> Watch Recording
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 py-5 text-center">
                        <MonitorPlay size={48} className="text-secondary opacity-25 mb-3" />
                        <h5 className="text-secondary">No webinars scheduled</h5>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for conditional icon
const CheckCircleIcon = ({ isRegistered }) => {
    if (isRegistered) return <span>✓</span>;
    return <span>+</span>;
};

export default StudentWebinars;
