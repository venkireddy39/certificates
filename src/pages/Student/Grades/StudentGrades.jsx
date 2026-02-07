import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import {
    Award,
    TrendingUp,
    BookOpen,
    Download,
    ChevronDown,
    ChevronUp,
    Search,
    Filter
} from 'lucide-react';
import { useToast } from '../../Library/context/ToastContext';
import '../StudentDashboard.css';
import './StudentGrades.css';

const StatCardBootstrap = ({ title, value, icon: Icon, iconBg, iconColor, trend, trendLabel }) => (
    <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h6 className="text-secondary small fw-bold text-uppercase ls-1 mb-1">{title}</h6>
                    <h3 className="mb-0 fw-bold">{value}</h3>
                </div>
                <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: iconBg, color: iconColor }}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="d-flex align-items-center">
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 small fw-bold d-flex align-items-center gap-1">
                    <TrendingUp size={12} /> {trend}
                </span>
                <span className="text-muted small ms-2">{trendLabel}</span>
            </div>
        </div>
    </div>
);

const StudentGrades = () => {
    const toast = useToast();
    const [gradesData, setGradesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const data = await studentService.getMyGrades();
                setGradesData(data);
            } catch (error) {
                console.error("Failed to fetch grades", error);
                toast.error("Failed to load grades.");
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    const handleDownloadTranscript = () => {
        toast.info("Generating your official transcript...");
        setTimeout(() => {
            toast.success("Transcript downloaded successfully!");
        }, 2000);
    };

    const toggleExpand = (id) => {
        setExpandedCourse(expandedCourse === id ? null : id);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!gradesData) return (
        <div className="p-5 text-center">
            <Award size={48} className="text-muted opacity-25 mb-3" />
            <h5 className="text-muted">Grade data unavailable</h5>
        </div>
    );

    const filteredCourses = gradesData.courses.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid p-4 student-grades-container animate-fade-in text-body">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-8">
                    <h2 className="fw-bold mb-1 text-body">Grade Point Average</h2>
                    <p className="text-muted mb-0 fw-medium">Detailed analysis of your academic performance and credit history.</p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                    <button
                        className="btn btn-primary rounded-pill px-4 py-2 small fw-bold shadow-sm d-inline-flex align-items-center gap-2 transition-all hover-scale"
                        onClick={handleDownloadTranscript}
                    >
                        <Download size={16} /> Official Transcript
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                    <StatCardBootstrap
                        title="Cumulative GPA"
                        value={gradesData.gpa}
                        icon={Award}
                        iconBg="rgba(99, 102, 241, 0.1)"
                        iconColor="#6366f1"
                        trend="Top 5%"
                        trendLabel="In Class"
                    />
                </div>
                <div className="col-12 col-md-4">
                    <StatCardBootstrap
                        title="Credits Earned"
                        value={gradesData.totalCredits}
                        icon={TrendingUp}
                        iconBg="rgba(16, 185, 129, 0.1)"
                        iconColor="#10b981"
                        trend="+12"
                        trendLabel="This semester"
                    />
                </div>
                <div className="col-12 col-md-4">
                    <StatCardBootstrap
                        title="Modules Graded"
                        value={gradesData.courses.length}
                        icon={BookOpen}
                        iconBg="rgba(245, 158, 11, 0.1)"
                        iconColor="#f59e0b"
                        trend="100%"
                        trendLabel="Evaluated"
                    />
                </div>
            </div>

            {/* Performance Ledger Map */}
            <div className="card border-0 shadow-sm overflow-hidden mb-4">
                <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <h5 className="fw-bold m-0 text-body">Performance Ledger</h5>
                    <div className="d-flex gap-2">
                        <div className="input-group input-group-sm" style={{ maxWidth: '250px' }}>
                            <span className="input-group-text bg-light border-end-0 text-muted">
                                <Search size={14} />
                            </span>
                            <input
                                type="text"
                                className="form-control bg-light border-start-0 shadow-none border-light"
                                placeholder="Filter courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 rounded-3" onClick={() => toast.info("Filter functionality coming soon!")}>
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 text-secondary small text-uppercase fw-bold border-0 py-3">Course Details</th>
                                <th className="text-secondary small text-uppercase fw-bold border-0 py-3">Semester</th>
                                <th className="text-center text-secondary small text-uppercase fw-bold border-0 py-3">Credits</th>
                                <th className="text-center text-secondary small text-uppercase fw-bold border-0 py-3">Grade</th>
                                <th className="text-center text-secondary small text-uppercase fw-bold border-0 py-3">Status</th>
                                <th className="pe-4 text-end text-secondary small text-uppercase fw-bold border-0 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map(course => (
                                    <React.Fragment key={course.id}>
                                        <tr
                                            className={`grade-row-premium ${expandedCourse === course.id ? 'table-active' : ''}`}
                                            onClick={() => toggleExpand(course.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="ps-4 py-3 border-bottom-0">
                                                <div className="fw-bold text-dark small">{course.courseName}</div>
                                                <div className="smaller text-muted font-monospace opacity-75">{course.id.toUpperCase()}</div>
                                            </td>
                                            <td className="text-muted small border-bottom-0">{course.semester}</td>
                                            <td className="text-center text-dark small border-bottom-0 fw-bold">{course.credits}</td>
                                            <td className="text-center border-bottom-0">
                                                <span className={`badge rounded-pill px-3 py-2 ${course.grade.startsWith('A') ? 'bg-success bg-opacity-10 text-success' :
                                                        course.grade.startsWith('B') ? 'bg-primary bg-opacity-10 text-primary' :
                                                            'bg-warning bg-opacity-10 text-warning'
                                                    }`}>
                                                    <span className="fw-bold">{course.grade}</span>
                                                    <span className="smaller opacity-75 ms-1">({course.percentage}%)</span>
                                                </span>
                                            </td>
                                            <td className="text-center border-bottom-0">
                                                <span className={`badge rounded-pill fw-medium ${course.status === 'Completed' ? 'bg-success-subtle text-success' :
                                                        'bg-info-subtle text-info'
                                                    }`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className="pe-4 text-end border-bottom-0">
                                                <button className="btn btn-sm btn-light border rounded-circle p-1 text-muted transition-all">
                                                    {expandedCourse === course.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedCourse === course.id && (
                                            <tr className="bg-light bg-opacity-10">
                                                <td colSpan="6" className="p-0 border-0">
                                                    <div className="p-4 border-top">
                                                        <div className="d-flex align-items-center gap-2 mb-3">
                                                            <TrendingUp size={16} className="text-primary" />
                                                            <span className="small fw-bold text-muted text-uppercase ls-1">Modular Breakdown</span>
                                                        </div>
                                                        <div className="row g-3">
                                                            {course.breakdown.map((item, idx) => (
                                                                <div className="col-12 col-md-4" key={idx}>
                                                                    <div className="card h-100 border-0 shadow-sm p-3 bg-white">
                                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                                            <span className="smaller fw-bold text-muted">{item.name}</span>
                                                                            <span className={`small fw-bold ${item.score >= 90 ? 'text-success' : 'text-primary'}`}>{item.score}/100</span>
                                                                        </div>
                                                                        <div className="progress mb-2" style={{ height: '6px' }}>
                                                                            <div
                                                                                className={`progress-bar rounded-pill ${item.score >= 90 ? 'bg-success' : item.score >= 80 ? 'bg-primary' : 'bg-warning'}`}
                                                                                role="progressbar"
                                                                                style={{ width: `${item.score}%` }}
                                                                                aria-valuenow={item.score}
                                                                                aria-valuemin="0"
                                                                                aria-valuemax="100"
                                                                            ></div>
                                                                        </div>
                                                                        <div className="text-end">
                                                                            <span className="smaller text-muted opacity-75">Weight: {item.weight}</span>
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-5 text-muted">
                                        No courses found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentGrades;
