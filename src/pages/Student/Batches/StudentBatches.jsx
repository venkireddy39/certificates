import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import {
    Users,
    Clock,
    Calendar,
    MapPin,
    User,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';
import '../StudentDashboard.css';
import './StudentBatches.css';

const StudentBatches = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const data = await studentService.getMyBatches();
                setBatches(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch batches", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
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
        <div className="student-batches-container animate-fade-in">
            {/* Header */}
            <div className="row mb-4 align-items-end g-3">
                <div className="col-12 col-md">
                    <h2 className="fw-bold mb-1">Active Batches</h2>
                    <p className="text-secondary mb-0">Manage your class schedules and batch details.</p>
                </div>
                <div className="col-12 col-md-auto d-flex gap-2">
                    <div className="glass-card d-flex align-items-center px-3 py-2">
                        <Search size={18} className="text-secondary me-2" />
                        <input type="text" placeholder="Search batches..." className="bg-transparent border-0 text-white small outline-none" style={{ width: '200px' }} />
                    </div>
                    <button className="glass-card p-2 text-secondary hover-primary transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Batch Grid */}
            <div className="row g-4">
                {batches.map((batch, idx) => (
                    <div className="col-12 col-xl-6" key={batch.id || idx}>
                        <div className="glass-card batch-card-v2 p-4 h-100">
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div className="d-flex gap-3 align-items-center">
                                    <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary shadow-glow">
                                        <Users size={28} />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold m-0 text-white">{batch.name || batch.batchName}</h4>
                                        <div className="d-flex align-items-center gap-1 text-secondary small mt-1">
                                            <User size={12} />
                                            <span>{batch.instructorName || batch.instructor || 'Lead Instructor'}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge ${batch.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} px-3 py-2 rounded-pill font-md`}>
                                    {batch.status || 'Active'}
                                </span>
                            </div>

                            <div className="batch-details-grid mb-4">
                                <div className="d-flex align-items-center gap-2 text-secondary small">
                                    <Clock size={16} className="text-primary" />
                                    <span>{batch.timing || '09:00 AM - 11:00 AM'}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-secondary small">
                                    <Calendar size={16} className="text-primary" />
                                    <span>Starts: {batch.startDate || 'N/A'}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-secondary small">
                                    <MapPin size={16} className="text-primary" />
                                    <span>{batch.mode || 'Online / Live'}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-secondary small">
                                    <Users size={16} className="text-primary" />
                                    <span>{batch.studentCount || 24} Learners</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-secondary small mb-2 uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>WEEKLY SCHEDULE</div>
                                <div className="d-flex flex-wrap gap-2">
                                    {(batch.days || ['Mon', 'Wed', 'Fri']).map(day => (
                                        <span key={day} className="pill-badge">{day}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                <button className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2">
                                    View Full Schedule <ChevronRight size={16} />
                                </button>
                                <button className="btn btn-outline-light border-opacity-10 rounded-3 px-4">
                                    Resources
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {batches.length === 0 && (
                    <div className="col-12 py-5 text-center glass-card border-dashed">
                        <div className="p-5">
                            <Users size={64} className="text-secondary opacity-25 mb-4" />
                            <h4 className="fw-bold">No Active Batches</h4>
                            <p className="text-secondary max-w-400 mx-auto">You haven't been assigned to any learning batches yet. Check back once your enrollment is processed.</p>
                            <button className="btn btn-primary mt-4 px-5 rounded-pill" onClick={() => navigate('/student/courses')}>Explore Catalog</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentBatches;
