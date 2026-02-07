import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
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
import './StudentDashboard.css';
import './StudentCourses.css';

const StudentCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
        <div className="student-courses-container">
            {/* Page Header */}
            <div className="page-header mb-4">
                <div className="row align-items-center g-3">
                    <div className="col-12 col-lg-7">
                        <h2 className="fw-bold mb-1">My Digital Library</h2>
                        <p className="text-secondary mb-0">You have completed {stats.completed} out of {stats.total} courses. Keep it up!</p>
                    </div>
                    <div className="col-12 col-lg-5">
                        <div className="d-flex gap-2 justify-content-lg-end">
                            <div className="search-wrapper glass-card px-3 py-2 flex-grow-1">
                                <Search size={18} className="text-secondary me-2" />
                                <input
                                    type="text"
                                    placeholder="Search your courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="glass-card icon-btn border-0 text-secondary">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="row g-4 mb-5">
                {[
                    { label: 'Total Enrolled', value: stats.total, icon: BookOpen, color: '#6366f1' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#10b981' },
                    { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: '#f59e0b' },
                    { label: 'Average Progress', value: `${stats.avgProgress}%`, icon: Trophy, color: '#8b5cf6' }
                ].map((stat, idx) => (
                    <div className="col-12 col-md-3" key={idx}>
                        <div className="glass-card p-3 d-flex align-items-center gap-3">
                            <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <h4 className="fw-bold mb-0">{stat.value}</h4>
                                <span className="text-secondary small">{stat.label}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Continue Learning Banner */}
            {continueLearning && filter === 'All' && !searchQuery && (
                <div className="continue-learning-banner glass-card p-4 mb-5 overflow-hidden position-relative">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-3 mb-3 mb-md-0">
                            <div className="banner-img-wrapper rounded-3 overflow-hidden shadow">
                                <img src={continueLearning.thumbnail} alt="" className="w-100 h-100 object-fit-cover" />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <span className="badge bg-primary-subtle text-primary mb-2">Continue where you left off</span>
                            <h3 className="fw-bold mb-2">{continueLearning.title}</h3>
                            <div className="d-flex align-items-center gap-3 text-secondary small mb-3">
                                <span className="d-flex align-items-center gap-1"><User size={14} /> {continueLearning.instructor}</span>
                                <span className="d-flex align-items-center gap-1"><BookOpen size={14} /> {continueLearning.completedLessons}/{continueLearning.totalLessons} Lessons</span>
                            </div>
                            <div className="progress-minimal mb-1">
                                <div className="progress-bar" style={{ width: `${continueLearning.progress}%` }}></div>
                            </div>
                            <span className="small text-secondary">{continueLearning.progress}% complete</span>
                        </div>
                        <div className="col-12 col-md-3 text-md-end">
                            <button
                                className="btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 ms-md-auto"
                                onClick={() => navigate(`/student/content/${continueLearning.id}`)}
                            >
                                <Play size={16} fill="currentColor" /> Resume Course
                            </button>
                        </div>
                    </div>
                    <div className="banner-decoration"></div>
                </div>
            )}

            {/* Filters and View Toggle */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="filter-tabs-pills d-flex gap-2 bg-glass-dark p-1 rounded-pill">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`pill-btn ${filter === tab ? 'active' : ''}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="d-flex gap-2">
                    <button
                        className={`glass-card icon-btn border-0 ${viewMode === 'grid' ? 'text-primary bg-primary-subtle' : 'text-secondary'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={`glass-card icon-btn border-0 ${viewMode === 'list' ? 'text-primary bg-primary-subtle' : 'text-secondary'}`}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Course Grid/List */}
            <div className={viewMode === 'grid' ? 'course-grid-premium' : 'course-list-premium'}>
                {filteredCourses.map((course) => (
                    <div className="glass-card course-card-v2" key={course.id}>
                        <div className="card-thumb-wrapper">
                            <img src={course.thumbnail} alt={course.title} />
                            <div className="card-badge">{course.category}</div>
                            <button className="favorite-btn"><Bookmark size={16} /></button>
                        </div>
                        <div className="card-body-v2">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="text-secondary small d-flex align-items-center gap-1">
                                    <Star size={12} className="text-warning fill-warning" />
                                    <span>{course.rating}</span>
                                    <span className="divider">•</span>
                                    <span>{course.level}</span>
                                </div>
                                <button className="btn-icon-minimal"><MoreVertical size={16} /></button>
                            </div>
                            <h5 className="course-title-v2">{course.title}</h5>
                            <p className="course-desc-v2">{course.description}</p>

                            <div className="course-instructor-v2 mb-3">
                                <div className="instructor-avatar">
                                    <User size={14} />
                                </div>
                                <span className="small text-secondary">{course.instructor}</span>
                            </div>

                            <div className="card-footer-v2">
                                <div className="progress-group w-100">
                                    <div className="d-flex justify-content-between small text-secondary mb-1">
                                        <span>Progress</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="progress-v2">
                                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="small text-secondary d-flex align-items-center gap-1">
                                            <Clock size={12} /> {course.duration}
                                        </span>
                                        <button
                                            className="action-link d-flex align-items-center gap-1"
                                            onClick={() => navigate(`/student/content/${course.id}`)}
                                        >
                                            {course.progress === 100 ? 'View Details' : 'Continue'} <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredCourses.length === 0 && (
                    <div className="empty-state text-center py-5 glass-card w-100">
                        <BookOpen size={64} className="text-secondary opacity-25 mb-3" />
                        <h4 className="fw-bold">No Courses Found</h4>
                        <p className="text-secondary">We couldn't find any courses matching your current filter.</p>
                        <button className="btn btn-outline-primary rounded-pill px-4 mt-2" onClick={() => setFilter('All')}>
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCourses;


