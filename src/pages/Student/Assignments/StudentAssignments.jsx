import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import {
    ClipboardList,
    Calendar,
    CheckCircle,
    AlertTriangle,
    FileText,
    Users
} from 'lucide-react';
import '../StudentDashboard.css';

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
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Submitted': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
            case 'Overdue': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
            default: return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
        }
    };

    return (
        <div className="container-fluid py-4">
            {/* Header Section */}
            <div className="row mb-5 align-items-center">
                <div className="col-lg-6">
                    <h2 className="fw-bold mb-1 text-white">Academic Assignments</h2>
                    <p className="text-secondary mb-0">Track your progress, deadlines, and grades.</p>
                </div>
                <div className="col-lg-6 text-lg-end mt-3 mt-lg-0">
                    <div className="btn-group" role="group">
                        {['All', 'Pending', 'Submitted', 'Overdue'].map(tab => (
                            <button
                                key={tab}
                                type="button"
                                className={`btn btn-sm px-3 rounded-pill me-2 ${filter === tab ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
                                onClick={() => setFilter(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Assignments Grid */}
            <div className="row g-4">
                {filteredAssignments.length > 0 ? (
                    filteredAssignments.map(assign => (
                        <div className="col-12 col-xl-6" key={assign.id}>
                            <div className={`card h-100 bg-dark text-white border-secondary border-opacity-25 shadow-sm ${assign.status === 'Overdue' ? 'border-danger' : ''}`}>
                                <div className="card-body p-4 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 py-2 px-3 rounded-pill">
                                            <Users size={14} className="me-1" /> {assign.courseName}
                                        </span>
                                        <span className={`badge rounded-pill py-2 px-3 ${getStatusBadgeClass(assign.status)}`}>
                                            {assign.status}
                                        </span>
                                    </div>

                                    <h4 className="card-title fw-bold mb-2">{assign.title}</h4>
                                    <p className="card-text text-secondary small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {assign.instructions}
                                    </p>

                                    {assign.status === 'Submitted' ? (
                                        <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-white bg-opacity-10 rounded">
                                            <div className="bg-primary bg-opacity-25 rounded p-3 text-center" style={{ width: '60px', height: '60px' }}>
                                                <h5 className="mb-0 fw-bold">{assign.grade}</h5>
                                                <small className="text-white-50" style={{ fontSize: '10px' }}>GRADE</small>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="text-uppercase text-secondary" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Score Obtained</div>
                                                <div className="h5 fw-bold mb-0">{assign.obtainedMarks} <span className="text-secondary fw-normal fs-6">/ {assign.totalMarks}</span></div>
                                            </div>
                                            <div className="text-success">
                                                <CheckCircle size={24} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-2 small fw-bold">
                                                <span className="text-secondary d-flex align-items-center gap-2">
                                                    <Calendar size={14} className="text-primary" />
                                                    Due: <span className="text-white">{assign.dueDate}</span>
                                                </span>
                                                {assign.status === 'Overdue' ? (
                                                    <span className="text-danger d-flex align-items-center gap-1">
                                                        <AlertTriangle size={14} /> Critical Overdue
                                                    </span>
                                                ) : (
                                                    <span className="text-info">{assign.daysLeft} days left</span>
                                                )}
                                            </div>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div
                                                    className={`progress-bar ${assign.status === 'Overdue' ? 'bg-danger' : 'bg-primary'}`}
                                                    role="progressbar"
                                                    style={{ width: assign.status === 'Overdue' ? '100%' : '35%' }}
                                                    aria-valuenow={assign.status === 'Overdue' ? 100 : 35}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src={`https://ui-avatars.com/api/?name=${assign.author}&background=6366f1&color=fff`} className="rounded-circle" width="32" height="32" alt="Faculty" />
                                            <div>
                                                <div className="text-secondary" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Instructor</div>
                                                <div className="small fw-bold">{assign.author}</div>
                                            </div>
                                        </div>
                                        <div>
                                            {assign.status === 'Submitted' ? (
                                                <button className="btn btn-outline-light btn-sm rounded-pill px-3">
                                                    <FileText size={14} className="me-2" /> View Feedback
                                                </button>
                                            ) : (
                                                <button className={`btn btn-sm rounded-pill px-4 fw-bold ${assign.status === 'Overdue' ? 'btn-danger' : 'btn-primary'}`}>
                                                    {assign.status === 'Overdue' ? 'Submit Late' : 'Submit Now'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="text-center py-5 border border-secondary border-opacity-25 rounded-3" style={{ borderStyle: 'dashed' }}>
                            <ClipboardList size={48} className="text-secondary mb-3 opacity-50" />
                            <h4 className="text-white">No Assignments Found</h4>
                            <p className="text-secondary">You don't have any assignments in the "{filter}" category.</p>
                            <button className="btn btn-primary mt-3 rounded-pill px-4" onClick={() => setFilter('All')}>Clear Filter</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAssignments;
