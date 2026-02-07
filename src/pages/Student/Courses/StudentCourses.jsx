import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../../services/studentService';
import { StatCard } from '../components/StudentDashboardComponents';
import {
    Search,
    Filter,
    BookOpen,
    Play,
    Clock,
    MoreVertical,
    CheckCircle,
    User,
    Star,
    ArrowRight,
    Trophy,
    LayoutGrid,
    List,
    TrendingUp,
    Bookmark
} from 'lucide-react';
import '../StudentDashboard.css';
import './StudentCourses.css';

const StudentCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const tabs = ['All', 'In Progress', 'Completed', 'Waitlisted'];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await studentService.getMyCourses();
                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesFilter = filter === 'All' ||
                (filter === 'In Progress' && course.progress > 0 && course.progress < 100) ||
                (filter === 'Completed' && course.progress === 100);

            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.instructor?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [courses, filter, searchQuery]);

    const stats = useMemo(() => {
        return {
            total: courses.length,
            completed: courses.filter(c => c.progress === 100).length,
            inProgress: courses.filter(c => c.progress > 0 && c.progress < 100).length,
            avgProgress: courses.length ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length) : 0
        };
    }, [courses]);

    const continueLearning = useMemo(() => {
        return courses.find(c => c.lastAccessed === 'Just now') ||
            courses.find(c => c.progress > 0 && c.progress < 100);
    }, [courses]);

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
        <div className="student-courses-container animate-fade-in text-body">
            {/* Page Header */}
            <div className="mb-4">
                <div className="row align-items-center g-3">
                    <div className="col-12 col-lg-7">
                        <h2 className="fw-bold mb-1 text-body">My Digital Library</h2>
                        <p className="text-muted mb-0">You have completed {stats.completed} out of {stats.total} courses. Keep it up!</p>
                    </div>
                    <div className="col-12 col-lg-5">
                        <div className="d-flex gap-2 justify-content-lg-end">
                            <div className="search-wrapper px-3 py-2 flex-grow-1">
                                <Search size={18} className="text-muted me-2" />
                                <input
                                    type="text"
                                    placeholder="Search your courses..."
                                    className="text-body"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="icon-btn text-muted">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-3">
                    <StatCard
                        label="Total Enrolled"
                        value={stats.total}
                        icon={BookOpen}
                        color="99, 102, 241"
                    />
                </div>
                <div className="col-12 col-md-3">
                    <StatCard
                        label="Completed"
                        value={stats.completed}
                        icon={CheckCircle}
                        color="16, 185, 129"
                    />
                </div>
                <div className="col-12 col-md-3">
                    <StatCard
                        label="In Progress"
                        value={stats.inProgress}
                        icon={TrendingUp}
                        color="245, 158, 11"
                    />
                </div>
                <div className="col-12 col-md-3">
                    <StatCard
                        label="Avg. Progress"
                        value={`${stats.avgProgress}%`}
                        icon={Trophy}
                        color="139, 92, 246"
                    />
                </div>
            </div>

            {/* Continue Learning Banner */}
            {continueLearning && filter === 'All' && !searchQuery && (
                <div className="continue-learning-banner p-4 mb-5 overflow-hidden">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-3 mb-3 mb-md-0">
                            <div className="banner-img-wrapper rounded-3 overflow-hidden shadow-sm">
                                <img src={continueLearning.thumbnail} alt="" className="w-100 h-100 object-fit-cover" />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill fw-bold">Continue where you left off</span>
                            <h3 className="fw-bold mb-2 text-body">{continueLearning.title}</h3>
                            <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                                <span className="d-flex align-items-center gap-1"><User size={14} /> {continueLearning.instructor}</span>
                                <span className="d-flex align-items-center gap-1"><BookOpen size={14} /> {continueLearning.completedLessons}/{continueLearning.totalLessons} Lessons</span>
                            </div>
                            <div className="progress-minimal mb-1">
                                <div className="progress-bar" style={{ width: `${continueLearning.progress}%` }}></div>
                            </div>
                            <span className="small text-muted">{continueLearning.progress}% complete</span>
                        </div>
                        <div className="col-12 col-md-3 text-md-end">
                            <button
                                className="btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 ms-md-auto fw-bold"
                                onClick={() => navigate(`/student/content/${continueLearning.id}`)}
                            >
                                <Play size={16} fill="white" stroke="white" /> Resume Course
                            </button>
                        </div>
                    </div>
                    <div className="banner-decoration"></div>
                </div>
            )}

            {/* Filters and View Toggle */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="nav nav-pills gap-2 bg-light bg-opacity-10 p-1 rounded-pill nav-pills-custom">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`btn rounded-pill px-4 py-2 small fw-bold transition-all border-0 ${filter === tab ? 'btn-primary shadow-sm' : 'text-muted hover-bg-glass'}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="d-flex gap-2">
                    <button
                        className={`btn border-0 d-flex align-items-center justify-content-center p-2 rounded-3 transition-all ${viewMode === 'grid' ? 'btn-primary shadow-sm' : 'btn-light text-muted'}`}
                        onClick={() => setViewMode('grid')}
                        style={{ width: '42px', height: '42px', background: viewMode === 'grid' ? '' : 'var(--hover-bg)' }}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={`btn border-0 d-flex align-items-center justify-content-center p-2 rounded-3 transition-all ${viewMode === 'list' ? 'btn-primary shadow-sm' : 'btn-light text-muted'}`}
                        onClick={() => setViewMode('list')}
                        style={{ width: '42px', height: '42px', background: viewMode === 'list' ? '' : 'var(--hover-bg)' }}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Course Grid/List */}
            <div className={viewMode === 'grid' ? 'row g-4' : 'd-flex flex-column gap-3'}>
                {filteredCourses.map((course) => (
                    <div className={viewMode === 'grid' ? 'col-12 col-md-6 col-xl-4' : 'col-12'} key={course.id}>
                        <div className={`course-card-custom h-100 overflow-hidden d-flex ${viewMode === 'grid' ? 'flex-column' : 'flex-row'}`}>
                            <div className={`position-relative overflow-hidden ${viewMode === 'grid' ? 'w-100' : 'flex-shrink-0'}`} style={{ height: viewMode === 'grid' ? '200px' : 'auto', width: viewMode === 'grid' ? '100%' : '260px' }}>
                                <img src={course.thumbnail} alt={course.title} className="w-100 h-100 object-fit-cover card-thumb-img" />
                                <div className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill bg-dark bg-opacity-60 blur-8 smaller fw-bold text-white shadow-sm">
                                    {course.category}
                                </div>
                                <button className="btn btn-dark bg-opacity-40 border-0 rounded-circle position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center p-2 hover-bg-primary transition-all shadow-sm">
                                    <Bookmark size={16} className="text-white" />
                                </button>
                            </div>
                            <div className="p-4 flex-grow-1 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="text-muted smaller d-flex align-items-center gap-2">
                                        <div className="d-flex align-items-center gap-1">
                                            <Star size={14} className="text-warning fill-warning" />
                                            <span className="fw-bold text-body">{course.rating}</span>
                                        </div>
                                        <span className="opacity-25 text-body">|</span>
                                        <span className="fw-bold uppercase tracking-wider">{course.level}</span>
                                    </div>
                                    <button className="btn btn-link p-0 text-muted opacity-50 hover-text-primary transition-all">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                                <h5 className="fw-bold text-body mb-2 line-clamp-2" style={{ minHeight: '3rem' }}>{course.title}</h5>
                                <p className="text-muted smaller mb-4 line-clamp-2 opacity-75">{course.description}</p>

                                <div className="mt-auto">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <div className="p-1 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                                            <User size={14} className="text-primary" />
                                        </div>
                                        <span className="smaller text-muted fw-bold">{course.instructor}</span>
                                    </div>

                                    <div className="pt-3 border-top" style={{ borderColor: 'var(--border)' }}>
                                        <div className="d-flex justify-content-between smaller text-muted mb-2 fw-bold">
                                            <span className="uppercase tracking-wider">Progress</span>
                                            <span className="text-body">{course.progress}%</span>
                                        </div>
                                        <div className="progress rounded-pill" style={{ height: '6px', background: 'var(--hover-bg)' }}>
                                            <div
                                                className="progress-bar bg-primary rounded-pill shadow-glow-sm"
                                                role="progressbar"
                                                style={{ width: `${course.progress}%` }}
                                                aria-valuenow={course.progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div className="d-flex align-items-center gap-1 text-muted smaller fw-bold">
                                                <Clock size={12} className="text-primary" /> {course.duration}
                                            </div>
                                            <button
                                                className="btn btn-sm btn-link p-0 text-primary text-decoration-none fw-bold d-flex align-items-center gap-1 hover-translate-x transition-all"
                                                onClick={() => navigate(`/student/content/${course.id}`)}
                                            >
                                                {course.progress === 100 ? 'View Details' : 'Continue'} <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredCourses.length === 0 && (
                    <div className="text-center py-5 card border-dashed w-100" style={{ background: 'var(--hover-bg)' }}>
                        <BookOpen size={64} className="text-muted opacity-25 mb-3" />
                        <h4 className="fw-bold text-muted">No Courses Found</h4>
                        <p className="text-muted">We couldn't find any courses matching your current filter.</p>
                        <button className="btn btn-outline-primary rounded-pill px-4 mt-2 fw-bold" onClick={() => setFilter('All')}>
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCourses;
