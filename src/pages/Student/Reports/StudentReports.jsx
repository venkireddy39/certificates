import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Award,
    Clock,
    Download,
    Filter,
    Calendar,
    Search,
    FileText,
    Zap,
    ExternalLink
} from 'lucide-react';
import { useToast } from '../../Library/context/ToastContext';
import '../StudentDashboard.css';
import './StudentReports.css';

const StudentReports = () => {
    const [activeCategory, setActiveCategory] = useState('Academic Performance');
    const toast = useToast();

    const handleComingSoon = (feature) => {
        toast.info(`${feature} feature coming soon!`);
    };

    const subjectReports = [
        { id: 1, subject: 'UI/UX Design Masterclass', score: '92/100', grade: 'A+', date: 'Feb 2, 2024', status: 'Completed' },
        { id: 2, subject: 'Advanced React patterns', score: '88/100', grade: 'A', date: 'Jan 28, 2024', status: 'Completed' },
        { id: 3, subject: 'Database Management', score: '75/100', grade: 'B', date: 'Jan 15, 2024', status: 'In Review' },
        { id: 4, subject: 'Business Communication', score: '95/100', grade: 'A+', date: 'Jan 10, 2024', status: 'Completed' },
    ];

    return (
        <div className="container-fluid p-4 student-reports-container animate-fade-in text-body">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-7">
                    <h2 className="fw-bold mb-1 text-body">Performance Intelligence</h2>
                    <p className="text-muted mb-0 fw-medium">Deep dive into your academic metrics, behavioral growth, and credit history.</p>
                </div>
                <div className="col-12 col-md-5 text-md-end">
                    <div className="d-inline-flex gap-2">
                        <button className="btn btn-outline-secondary rounded-pill px-4 py-2 small fw-bold d-flex align-items-center" onClick={() => handleComingSoon('Year Filter')}>
                            <Calendar size={14} className="me-2" /> AY 2023-24
                        </button>
                        <button className="btn btn-secondary rounded-pill px-4 py-2 small fw-bold shadow-sm text-white d-flex align-items-center" onClick={() => handleComingSoon('Export')}>
                            <Download size={16} className="me-2" /> Export Transcript
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-4 mb-5">
                {[
                    { label: 'GPA', value: '3.8', icon: Award, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', trend: '+0.2', trendClass: 'text-success bg-success bg-opacity-10' },
                    { label: 'Attendance', value: '94%', icon: Clock, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', trend: '+1.5%', trendClass: 'text-success bg-success bg-opacity-10' },
                    { label: 'Completed', value: '12', icon: FileText, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', trend: 'Courses', trendClass: 'text-primary bg-primary bg-opacity-10' },
                    { label: 'Skill Points', value: '2.4k', icon: Zap, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', trend: 'Top 5%', trendClass: 'text-warning bg-warning bg-opacity-10' }
                ].map((stat, i) => (
                    <div className="col-12 col-md-6 col-lg-3" key={i}>
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="p-2 rounded-3" style={{ background: stat.bg, color: stat.color }}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className={`badge rounded-pill fw-bold ${stat.trendClass}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <div className="small text-uppercase fw-bold text-muted mb-1">{stat.label}</div>
                                <h3 className="fw-bold mb-0 text-dark">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-5">
                {/* Visual Analytics */}
                <div className="col-12 col-xl-8">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <h5 className="fw-bold m-0 d-flex align-items-center gap-2 text-dark">
                                    <BarChart3 size={20} className="text-secondary" />
                                    Growth Momentum
                                </h5>
                                <div className="btn-group btn-group-sm" role="group">
                                    <button type="button" className="btn btn-secondary text-white fw-bold">Monthly</button>
                                    <button type="button" className="btn btn-outline-secondary fw-bold" onClick={() => handleComingSoon('View Mode')}>Semesterly</button>
                                </div>
                            </div>

                            <div className="d-flex align-items-end justify-content-between px-4 pb-2" style={{ height: '240px' }}>
                                {[
                                    { month: 'Sep', value: 65 },
                                    { month: 'Oct', value: 78 },
                                    { month: 'Nov', value: 72 },
                                    { month: 'Dec', value: 85 },
                                    { month: 'Jan', value: 92 },
                                    { month: 'Feb', value: 88 }
                                ].map((data, i) => (
                                    <div key={i} className="d-flex flex-column align-items-center gap-2" style={{ width: '40px' }}>
                                        <div className="w-100 bg-secondary rounded-top" style={{ height: `${data.value * 2}px`, opacity: 0.8 }}></div>
                                        <span className="small fw-bold text-muted">{data.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm overflow-hidden">
                        <div className="card-header bg-white p-4 d-flex justify-content-between align-items-center border-bottom">
                            <h5 className="fw-bold m-0 small text-dark">Modular Grade Registry</h5>
                            <div className="d-flex gap-2">
                                <div className="input-group input-group-sm" style={{ width: '200px' }}>
                                    <span className="input-group-text bg-light border-end-0">
                                        <Search size={14} className="text-muted" />
                                    </span>
                                    <input type="text" className="form-control bg-light border-start-0 shadow-none" placeholder="Filter subjects..." />
                                </div>
                                <button className="btn btn-outline-secondary btn-sm rounded-circle p-2" onClick={() => handleComingSoon('Filter')}><Filter size={14} /></button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4 border-bottom py-3">Module Code / Title</th>
                                        <th className="text-center border-bottom py-3">Raw Score</th>
                                        <th className="text-center border-bottom py-3">Grade</th>
                                        <th className="border-bottom py-3">Evaluation Date</th>
                                        <th className="pe-4 text-end border-bottom py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjectReports.map(report => (
                                        <tr key={report.id}>
                                            <td className="ps-4 py-3">
                                                <div className="small fw-bold text-dark">{report.subject}</div>
                                                <div className="smaller text-muted">MOD-{(report.id + 1000).toString()}</div>
                                            </td>
                                            <td className="text-center small text-dark fw-bold">{report.score}</td>
                                            <td className="text-center">
                                                <span className={`badge rounded-pill px-3 py-1 ${report.grade.startsWith('A') ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                                    {report.grade}
                                                </span>
                                            </td>
                                            <td className="text-muted small fw-medium">{report.date}</td>
                                            <td className="pe-4 text-end">
                                                <button className="btn btn-sm btn-outline-secondary rounded-circle p-1 shadow-sm" onClick={() => handleComingSoon('View Report')}>
                                                    <ExternalLink size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Categories & Insights */}
                <div className="col-12 col-xl-4">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                                <TrendingUp size={18} className="text-secondary" /> Report Segmentation
                            </h6>
                            <div className="list-group list-group-flush rounded-3">
                                {['Academic Performance', 'Attendance Analytics', 'Soft Skill Matrix', 'Technical Assessment'].map(cat => (
                                    <button
                                        key={cat}
                                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${activeCategory === cat ? 'active bg-secondary border-secondary' : 'bg-light text-muted'}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        <span className="small fw-bold">{cat}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="p-2 bg-secondary bg-opacity-10 rounded-circle text-secondary"><Zap size={18} /></div>
                                    <h6 className="fw-bold m-0 text-dark small text-uppercase">Intelligence Insight</h6>
                                </div>
                                <button className="btn btn-link text-secondary p-0 text-decoration-none fw-bold small" onClick={() => handleComingSoon('More Insights')}>View More</button>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span className="text-muted fw-bold">Syntactic Coding Speed</span>
                                    <span className="text-secondary fw-bold">95th Percentile</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-secondary" style={{ width: '95%' }}></div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span className="text-muted fw-bold">Verbal Articulation</span>
                                    <span className="text-warning fw-bold">78th Percentile</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-warning" style={{ width: '78%' }}></div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span className="text-muted fw-bold">Logic & Algorithms</span>
                                    <span className="text-success fw-bold">88th Percentile</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-success" style={{ width: '88%' }}></div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top">
                                <p className="small text-muted m-0 fst-italic fw-medium">"Your logical analysis is exceptional. Focus on articulating complex concepts to improve your overall behavioral score."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentReports;
