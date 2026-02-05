import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
    ClipboardList,
    Calendar,
    CheckCircle,
    AlertTriangle,
    Clock,
    FileText,
    Upload,
    Download,
    Users,
    ChevronRight,
    Search,
    Filter as FilterIcon
} from 'lucide-react';
import './StudentAssignments.css';

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Mock data if service fails or for demo purposes
                const mockAssignments = [
                    {
                        id: 1,
                        title: "Visual Identity & Branding Project",
                        courseName: "Graphic Design Fundamentals",
                        dueDate: "Feb 15, 2024",
                        status: "Pending",
                        totalMarks: 100,
                        instructions: "Create a complete brand guide for a fictional startup, including logo, typography, and color palette.",
                        author: "Sarah Johnson",
                        daysLeft: 5
                    },
                    {
                        id: 2,
                        title: "Advanced React Component Patterns",
                        courseName: "Web Development Masterclass",
                        dueDate: "Jan 30, 2024",
                        status: "Submitted",
                        totalMarks: 100,
                        obtainedMarks: 94,
                        grade: "A+",
                        instructions: "Implement higher-order components and render props pattern in a real-world scenario.",
                        author: "Michael Chen"
                    },
                    {
                        id: 3,
                        title: "Database Normalization Case Study",
                        courseName: "SQL & Data Modeling",
                        dueDate: "Feb 02, 2024",
                        status: "Overdue",
                        totalMarks: 50,
                        instructions: "Normalize the given flat-file data into 3rd Normal Form and provide an ERD diagram.",
                        author: "Robert Wilson"
                    },
                    {
                        id: 4,
                        title: "UX Research: User Interview Synthesis",
                        courseName: "UI/UX Design Masterclass",
                        dueDate: "Mar 05, 2024",
                        status: "Pending",
                        totalMarks: 100,
                        instructions: "Synthesize the provided interview transcripts into affinity maps and user personas.",
                        author: "Sarah Johnson",
                        daysLeft: 30
                    }
                ];

                const data = await studentService.getMyAssignments();
                setAssignments(data && data.length > 0 ? data : mockAssignments);
            } catch (error) {
                console.error("Failed to fetch assignments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const filteredAssignments = filter === 'All'
        ? assignments
        : assignments.filter(a => a.status === filter);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary shadow-glow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="student-assignments-page">
            {/* Extended Header Section */}
            <div className="assignments-header-glass">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <h2 className="fw-bold mb-2">Academic Workspace</h2>
                        <p className="text-secondary mb-0">Manage your submissions, track deadlines, and review faculty feedback.</p>
                    </div>
                    <div className="col-lg-6 text-lg-end mt-4 mt-lg-0">
                        <div className="assignment-filter-pill">
                            {['All', 'Pending', 'Submitted', 'Overdue'].map(tab => (
                                <button
                                    key={tab}
                                    className={`filter-btn ${filter === tab ? 'active' : ''}`}
                                    onClick={() => setFilter(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignments Grid */}
            <div className="row g-4">
                {filteredAssignments.length > 0 ? (
                    filteredAssignments.map(assign => (
                        <div className="col-12 col-xl-6" key={assign.id}>
                            <div className={`assignment-card-premium p-4 ${assign.status.toLowerCase()}`}>
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div className="subject-tag">
                                        <Users size={12} className="me-1" /> {assign.courseName}
                                    </div>
                                    <span className={`status-pill pill-${assign.status.toLowerCase()}`}>
                                        {assign.status}
                                    </span>
                                </div>

                                <h4 className="fw-bold mb-3">{assign.title}</h4>
                                <p className="text-secondary small mb-4 line-clamp-2">
                                    {assign.instructions}
                                </p>

                                {assign.status === 'Submitted' ? (
                                    <div className="d-flex align-items-center gap-4 mb-4">
                                        <div className="grade-circle">
                                            <span className="grade-char">{assign.grade}</span>
                                            <span className="grade-label">Grade</span>
                                        </div>
                                        <div>
                                            <div className="text-secondary x-small mb-1">FINAL SCORE</div>
                                            <div className="fw-bold fs-5">{assign.obtainedMarks} / {assign.totalMarks}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-secondary small d-flex align-items-center gap-2">
                                                <Calendar size={14} className="text-primary" />
                                                Due: <span className="text-white">{assign.dueDate}</span>
                                            </span>
                                            {assign.status === 'Overdue' ? (
                                                <span className="text-danger small fw-bold">Critical Overdue</span>
                                            ) : (
                                                <span className="text-info small fw-bold">{assign.daysLeft} days left</span>
                                            )}
                                        </div>
                                        <div className="assignment-progress-mini">
                                            <div
                                                className="progress-fill-mini"
                                                style={{ width: assign.status === 'Overdue' ? '100%' : '40%', opacity: assign.status === 'Overdue' ? 0.3 : 1 }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="assignment-footer">
                                    <div className="author-info">
                                        <img src={`https://ui-avatars.com/api/?name=${assign.author}&background=6366f1&color=fff`} className="author-avatar" alt="Faculty" />
                                        <div>
                                            <div className="x-small text-secondary">POSTED BY</div>
                                            <div className="small fw-medium">{assign.author}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {assign.status === 'Submitted' ? (
                                            <button className="btn btn-outline-light btn-sm rounded-pill px-3">
                                                <FileText size={14} className="me-2" /> Details
                                            </button>
                                        ) : (
                                            <button className={`btn btn-sm rounded-pill px-4 ${assign.status === 'Overdue' ? 'btn-danger' : 'btn-primary'}`}>
                                                {assign.status === 'Overdue' ? 'Late Submit' : 'Submit Work'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="text-center py-5 glass-card border-dashed">
                            <ClipboardList size={64} className="text-secondary opacity-25 mb-3" />
                            <h4 className="text-secondary">No Assignments Found</h4>
                            <p className="text-secondary small">You don't have any assignments in the "{filter}" category.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAssignments;
