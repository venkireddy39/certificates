import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Award,
    Clock,
    Download,
    Filter,
    Calendar,
    ChevronRight,
    Search,
    FileText,
    PieChart,
    Zap
} from 'lucide-react';
import './StudentReports.css';

const StudentReports = () => {
    const [activeCategory, setActiveCategory] = useState('Academic');

    const stats = [
        { label: 'GPA', value: '3.8', icon: Award, color: '#6366f1', trend: '+0.2' },
        { label: 'Attendance', value: '94%', icon: Clock, color: '#10b981', trend: '+1.5%' },
        { label: 'Completed Courses', value: '12', icon: FileText, color: '#3b82f6', trend: 'Last: UI Designer' },
        { label: 'Skill Points', value: '2.4k', icon: Zap, color: '#f59e0b', trend: 'Top 5%' }
    ];

    const performanceData = [
        { month: 'Sep', value: 65 },
        { month: 'Oct', value: 78 },
        { month: 'Nov', value: 72 },
        { month: 'Dec', value: 85 },
        { month: 'Jan', value: 92 },
        { month: 'Feb', value: 88 }
    ];

    const subjectReports = [
        { id: 1, subject: 'UI/UX Design Masterclass', score: '92/100', grade: 'A+', date: 'Feb 2, 2024', status: 'Completed' },
        { id: 2, subject: 'Advanced React patterns', score: '88/100', grade: 'A', date: 'Jan 28, 2024', status: 'Completed' },
        { id: 3, subject: 'Database Management', score: '75/100', grade: 'B', date: 'Jan 15, 2024', status: 'In Review' },
        { id: 4, subject: 'Business Communication', score: '95/100', grade: 'A+', date: 'Jan 10, 2024', status: 'Completed' },
    ];

    return (
        <div className="student-reports-container">
            {/* Header Area */}
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Performance Intelligence</h3>
                    <p className="text-secondary small">Comprehensive analysis of your academic journey</p>
                </div>
                <div className="d-flex gap-3">
                    <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 rounded-pill px-3">
                        <Calendar size={14} /> Academic Year 2023-24
                    </button>
                    <button className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-4">
                        <Download size={14} /> Download PDF Report
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="row g-4 mb-5">
                {stats.map((stat, i) => (
                    <div className="col-12 col-md-6 col-lg-3" key={i}>
                        <div className="report-stat-card">
                            <div className="report-icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                                <stat.icon size={24} />
                            </div>
                            <div className="text-secondary small mb-1">{stat.label}</div>
                            <div className="d-flex align-items-baseline gap-2">
                                <h2 className="fw-bold m-0">{stat.value}</h2>
                                <span className={`x-small ${stat.trend.startsWith('+') ? 'text-success' : 'text-secondary'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Main Performance Chart */}
                <div className="col-12 col-lg-8">
                    <div className="performance-chart-container">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <TrendingUp size={20} className="text-primary" />
                                Growth Progress
                            </h5>
                            <div className="d-flex gap-2">
                                <button className="btn btn-link p-0 text-primary text-decoration-none small">Monthly</button>
                                <button className="btn btn-link p-0 text-secondary text-decoration-none small mx-2">Weekly</button>
                            </div>
                        </div>

                        <div className="chart-bars-wrapper">
                            {performanceData.map((data, i) => (
                                <div key={i} className="chart-bar-item">
                                    <div
                                        className="bar-fill"
                                        style={{ height: `${data.value}%` }}
                                        data-value={data.value}
                                    ></div>
                                    <span className="x-small text-secondary">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="report-table-card">
                        <div className="p-4 border-bottom border-white border-opacity-5 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold m-0">Detailed Grades</h5>
                            <button className="btn btn-icon-sm text-secondary"><Search size={18} /></button>
                        </div>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Subject / Course</th>
                                    <th>Score</th>
                                    <th>Grade</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectReports.map(report => (
                                    <tr key={report.id}>
                                        <td className="fw-medium">{report.subject}</td>
                                        <td>{report.score}</td>
                                        <td>
                                            <span className={`grade-badge ${report.grade.startsWith('A') ? 'grade-a' : 'grade-b'}`}>
                                                {report.grade}
                                            </span>
                                        </td>
                                        <td className="text-secondary">{report.date}</td>
                                        <td className="text-end">
                                            <button className="download-btn border-0"><Download size={14} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Categories Selector */}
                <div className="col-12 col-lg-4">
                    <div className="report-stat-card mb-4">
                        <h5 className="fw-bold mb-4">Report Categories</h5>
                        <div className="d-grid gap-2">
                            {['Academic', 'Attendance', 'Skill Matrix', 'Behavioral'].map(cat => (
                                <button
                                    key={cat}
                                    className={`btn text-start d-flex justify-content-between align-items-center py-3 px-4 rounded-4 transition-all ${activeCategory === cat ? 'btn-primary shadow-lg' : 'btn-dark bg-opacity-25'}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    <span>{cat}</span>
                                    <ChevronRight size={16} opacity={activeCategory === cat ? 1 : 0.3} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="report-stat-card">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <PieChart size={20} className="text-info" />
                            <h5 className="fw-bold m-0">Strength Area</h5>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between small mb-2">
                                <span className="text-secondary">Technical Proficiency</span>
                                <span className="text-info">95%</span>
                            </div>
                            <div className="progress" style={{ height: 6, background: 'rgba(255,255,255,0.05)' }}>
                                <div className="progress-bar bg-info shadow-glow" style={{ width: '95%' }}></div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between small mb-2">
                                <span className="text-secondary">Communication</span>
                                <span className="text-warning">78%</span>
                            </div>
                            <div className="progress" style={{ height: 6, background: 'rgba(255,255,255,0.05)' }}>
                                <div className="progress-bar bg-warning shadow-glow" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                        <div className="mb-0">
                            <div className="d-flex justify-content-between small mb-2">
                                <span className="text-secondary">Problem Solving</span>
                                <span className="text-success">88%</span>
                            </div>
                            <div className="progress" style={{ height: 6, background: 'rgba(255,255,255,0.05)' }}>
                                <div className="progress-bar bg-success shadow-glow" style={{ width: '88%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentReports;
