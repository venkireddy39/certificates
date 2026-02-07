import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import {
    Video,
    Calendar,
    Clock,
    Users,
    PlayCircle,
    User,
    MonitorPlay,
    Check,
    Plus,
    Mic,
    Share2,
    Info
} from 'lucide-react';
import '../StudentDashboard.css';
import './StudentWebinars.css';

const StudentWebinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const data = await studentService.getWebinars();
                setWebinars(Array.isArray(data) ? data : []);
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
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="student-webinars-container animate-fade-in text-body">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-8">
                    <h2 className="fw-bold mb-1 text-body">Live Global Stages</h2>
                    <p className="text-muted mb-0 fw-medium">Interact with industry leaders and domain experts in real-time.</p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                    <button className="btn btn-outline-secondary rounded-pill px-4 py-2 border-opacity-25 small fw-bold d-inline-flex align-items-center gap-2">
                        <Share2 size={16} /> Speaker Inquiries
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {webinars.length > 0 ? (
                    webinars.map(webinar => (
                        <div className="col-12 col-md-6 col-xl-4" key={webinar.id}>
                            <div className="card border-0 shadow-sm webinar-card-premium h-100 overflow-hidden" style={{ background: 'var(--surface)', borderRadius: '20px' }}>
                                <div className="card-thumb position-relative" style={{ height: '200px' }}>
                                    <img src={webinar.thumbnail || 'https://images.unsplash.com/photo-1591115765373-520b7a61d12b?w=400&q=80'} className="w-100 h-100 object-fit-cover transition-all" alt={webinar.title} />
                                    <div className="thumb-gradient"></div>
                                    <div className={`status-pill-v2 ${webinar.status.toLowerCase()}`}>
                                        {webinar.status === 'Live' && <span className="live-signal shadow-glow-sm"></span>}
                                        {webinar.status}
                                    </div>
                                    {webinar.status === 'Ended' && (
                                        <div className="playback-overlay d-flex align-items-center justify-content-center">
                                            <div className="play-button-glass shadow-sm"><PlayCircle size={32} /></div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 d-flex flex-column h-100">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <div className="rounded-circle overflow-hidden border border-secondary border-opacity-25" style={{ width: '28px', height: '28px' }}>
                                            <img src={`https://ui-avatars.com/api/?name=${webinar.host}&background=a855f7&color=fff`} className="w-100 h-100" alt={webinar.host} />
                                        </div>
                                        <div className="smaller text-muted fw-bold">{webinar.host}</div>
                                    </div>

                                    <h5 className="fw-bold text-body mb-3 line-clamp-2 leading-tight" style={{ minHeight: '2.7em' }}>{webinar.title}</h5>

                                    <div className="row g-0 mb-4 border-top pt-3 border-opacity-10" style={{ borderColor: 'var(--border)' }}>
                                        <div className="col-6">
                                            <div className="smaller text-muted uppercase fw-bold opacity-50 mb-1">Date</div>
                                            <div className="small text-body fw-bold d-flex align-items-center gap-2">
                                                <Calendar size={14} className="text-secondary" /> {webinar.date}
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="smaller text-muted uppercase fw-bold opacity-50 mb-1">Time</div>
                                            <div className="small text-body fw-bold d-flex align-items-center gap-2">
                                                <Clock size={14} className="text-secondary" /> {webinar.startTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {webinar.status === 'Live' ? (
                                            <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-bold shadow-sm">
                                                <Video size={16} /> Enter Stage
                                            </button>
                                        ) : webinar.status === 'Upcoming' ? (
                                            <button className={`btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-bold transition-all shadow-sm ${webinar.isRegistered ? 'btn-outline-success border-opacity-50' : 'btn-secondary text-white'}`}>
                                                {webinar.isRegistered ? <Check size={16} /> : <Plus size={16} />}
                                                {webinar.isRegistered ? 'Seat Secured' : 'Reserve Spot'}
                                            </button>
                                        ) : (
                                            <button className="btn btn-outline-secondary border-opacity-25 w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 small fw-bold">
                                                <PlayCircle size={16} /> Stream Recording
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 py-5 text-center card border-dashed" style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                        <div className="p-5">
                            <MonitorPlay size={64} className="text-secondary opacity-10 mb-4" />
                            <h4 className="fw-bold text-body">No Scheduled Airings</h4>
                            <p className="text-muted mb-0 fw-medium">The stage is currently undergoing maintenance. Sync back later.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Participation Banner */}
            <div className="card mt-5 p-4 border-0 shadow-sm" style={{ background: 'var(--surface)', borderRadius: '20px' }}>
                <div className="row align-items-center">
                    <div className="col-md-9">
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div className="p-3 bg-secondary bg-opacity-10 rounded-pill text-secondary shadow-sm"><Mic size={24} /></div>
                            <div>
                                <h5 className="fw-bold m-0 text-body">Share Your Expertise</h5>
                                <p className="smaller text-muted m-0 fw-medium mt-1">Interested in hosting a session or sharing a case study? We're always looking for student speakers for global stages.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 text-md-end mt-3 mt-md-0">
                        <button className="btn btn-secondary text-white rounded-pill px-4 py-2 small fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                            Submit Abstract <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Icon
const ArrowRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
);

export default StudentWebinars;
