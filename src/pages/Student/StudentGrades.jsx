import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
    Award,
    TrendingUp,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Download,
    MoreHorizontal
} from 'lucide-react';
import './StudentGrades.css';

const StudentGrades = () => {
    const [gradesData, setGradesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedCourse, setExpandedCourse] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const data = await studentService.getMyGrades();
                setGradesData(data);
            } catch (error) {
                console.error("Failed to fetch grades", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    const toggleExpand = (id) => {
        setExpandedCourse(expandedCourse === id ? null : id);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-70">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!gradesData) return null;

    return (
        <div className="student-grades-page container-fluid px-0">
            {/* Header Stats */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                    <div className="glass-card p-4 d-flex align-items-center gap-3 bg-gradient-primary">
                        <div className="stat-icon-wrapper">
                            <Award size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="mb-0 fw-bold text-white display-5">{gradesData.gpa}</h2>
                            <span className="text-white opacity-75 small">Overall GPA</span>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="glass-card p-4 d-flex align-items-center gap-3">
                        <div className="stat-icon-wrapper bg-success bg-opacity-10">
                            <TrendingUp size={28} className="text-success" />
                        </div>
                        <div>
                            <h3 className="mb-0 fw-bold text-white">{gradesData.totalCredits}</h3>
                            <span className="text-secondary small">Total Credits Earned</span>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="glass-card p-4 d-flex align-items-center gap-3">
                        <div className="stat-icon-wrapper bg-info bg-opacity-10">
                            <BookOpen size={28} className="text-info" />
                        </div>
                        <div>
                            <h3 className="mb-0 fw-bold text-white">{gradesData.courses.length}</h3>
                            <span className="text-secondary small">Courses Graded</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grades List */}
            <div className="glass-card">
                <div className="p-4 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-white mb-0">Course Performance</h5>
                    <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-2">
                        <Download size={14} /> Transcript
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-dark-custom align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Course Name</th>
                                <th>Semester</th>
                                <th className="text-center">Credits</th>
                                <th className="text-center">Grade</th>
                                <th className="text-center">Status</th>
                                <th className="pe-4 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradesData.courses.map(course => (
                                <React.Fragment key={course.id}>
                                    <tr
                                        className={`grade-row ${expandedCourse === course.id ? 'expanded' : ''}`}
                                        onClick={() => toggleExpand(course.id)}
                                    >
                                        <td className="ps-4">
                                            <div className="fw-bold text-white">{course.courseName}</div>
                                            <div className="x-small text-secondary offset-text">ID: {course.id.toUpperCase()}</div>
                                        </td>
                                        <td className="text-secondary">{course.semester}</td>
                                        <td className="text-center text-white">{course.credits}</td>
                                        <td className="text-center">
                                            <div className="grade-badge" data-grade={course.grade.charAt(0)}>
                                                {course.grade}
                                                <span className="grade-pct">({course.percentage}%)</span>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className={`status-badge ${course.status.toLowerCase().replace(' ', '-')}`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <button className="btn btn-icon-sm">
                                                {expandedCourse === course.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedCourse === course.id && (
                                        <tr className="breakdown-row">
                                            <td colSpan="6" className="p-0">
                                                <div className="breakdown-content p-4">
                                                    <h6 className="text-white x-small fw-bold text-uppercase mb-3 opacity-50">Grading Breakdown</h6>
                                                    <div className="row g-3">
                                                        {course.breakdown.map((item, idx) => (
                                                            <div className="col-12 col-md-4" key={idx}>
                                                                <div className="breakdown-card">
                                                                    <div className="d-flex justify-content-between mb-2">
                                                                        <span className="text-secondary small">{item.name}</span>
                                                                        <span className="text-white small fw-bold">{item.score}/100</span>
                                                                    </div>
                                                                    <div className="progress" style={{ height: '6px' }}>
                                                                        <div
                                                                            className="progress-bar"
                                                                            style={{
                                                                                width: `${item.score}%`,
                                                                                backgroundColor: item.score >= 90 ? '#10b981' : item.score >= 80 ? '#3b82f6' : '#f59e0b'
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="mt-1 text-end">
                                                                        <span className="x-small text-secondary">Weight: {item.weight}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentGrades;
