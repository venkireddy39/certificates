/* src/pages/Student/LearningContent.jsx */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import {
    Play,
    Share2,
    ChevronRight,
    Check,
    Clock,
    Maximize,
    Volume2,
    Settings,
    MessageSquare,
    FileText,
    Download,
    Video,
    ExternalLink,
    ChevronLeft,
    RotateCcw,
    FastForward,
    Info,
    Calendar,
    Target
} from 'lucide-react';
import './LearningContent.css';

const LearningContent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [courseInfo, setCourseInfo] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [activeLesson, setActiveLesson] = useState(0);
    const [activeTab, setActiveTab] = useState('Overview');
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                let courseId = id;
                if (!courseId) {
                    const courses = await studentService.getMyCourses();
                    if (courses && courses.length > 0) {
                        courseId = courses[0].courseId || courses[0].id;
                    }
                }

                if (courseId) {
                    const content = await studentService.getCourseContent(courseId);
                    if (content) {
                        setCourseInfo(content.course || content);
                        setLessons(content.lessons || content.contents || []);
                    }
                }
            } catch (error) {
                console.error("Failed to load learning content", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [id]);

    const currentLesson = lessons[activeLesson] || {
        contentTitle: "Introduction to the Course",
        duration: "10:30",
        type: "video",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop"
    };

    const courseProgress = courseInfo?.progress || 12;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="learning-content-page">
            <header className="content-header-dark">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <div className="breadcrumb-dark">
                            <ChevronLeft size={14} className="me-1" />
                            {courseInfo?.courseName || 'UI/UX Masterclass'} / Module 1
                        </div>
                        <div className="lesson-title-area">
                            <h2>{currentLesson.contentTitle || currentLesson.title}</h2>
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <button className="btn btn-outline-light btn-sm rounded-pill px-3">
                            <Share2 size={16} className="me-2" /> Share
                        </button>
                        <button
                            className="btn btn-primary btn-sm rounded-pill px-4 fw-bold"
                            onClick={() => setActiveLesson(prev => Math.min(lessons.length - 1, prev + 1))}
                        >
                            Next Module <ChevronRight size={16} className="ms-1" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="content-main-layout">
                {/* Main Player Section */}
                <div className="video-player-section">
                    <div className="video-container-premium">
                        <img
                            src={currentLesson.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop"}
                            className="video-preview-img"
                            alt="Lesson Preview"
                        />

                        <div className="video-overlay-controls">
                            <div className="play-button-glow">
                                <Play size={32} fill="white" />
                            </div>
                        </div>

                        {/* Player Bar */}
                        <div className="premium-player-bar">
                            <div className="player-progress-wrapper">
                                <div className="player-progress-fill" style={{ width: '35%' }}>
                                    <div className="player-progerss-handle"></div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between text-white">
                                <div className="d-flex align-items-center gap-4">
                                    <Play size={20} fill="currentColor" stroke="none" className="cursor-pointer" />
                                    <RotateCcw size={20} className="cursor-pointer" />
                                    <FastForward size={20} className="cursor-pointer" />
                                    <div className="d-flex align-items-center gap-2">
                                        <Volume2 size={20} />
                                        <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                                            <div style={{ width: '70%', height: '100%', background: 'white', borderRadius: 2 }}></div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>04:20 / {currentLesson.duration || '10:30'}</span>
                                </div>
                                <div className="d-flex align-items-center gap-4">
                                    <Settings size={20} className="cursor-pointer" />
                                    <Maximize size={20} className="cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Tabs */}
                    <div className="content-tabs-area">
                        <nav className="premium-tab-nav">
                            {['Overview', 'Discussion', 'Resources', 'Transcript'].map(tab => (
                                <button
                                    key={tab}
                                    className={`premium-tab-btn ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        <div className="tab-content-pane">
                            {activeTab === 'Overview' && (
                                <div className="animate-fade-in">
                                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                        <Info size={18} className="text-primary" /> About this lesson
                                    </h5>
                                    <p className="text-secondary">
                                        In this module, we'll dive deep into the fundamental principles of high-resolution digital design.
                                        We'll explore how to balance performance with visual fidelity, and why proper assets matter in professional LMS projects.
                                    </p>
                                    <div className="row g-4 mt-2">
                                        <div className="col-md-4">
                                            <div className="glass-card p-3 rounded-4 border border-white border-opacity-5">
                                                <div className="text-primary small mb-1 fw-bold">CHALLENGE</div>
                                                <div className="small">Design 3 High-Fidelity Mockups</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="glass-card p-3 rounded-4 border border-white border-opacity-5">
                                                <div className="text-success small mb-1 fw-bold">OUTCOME</div>
                                                <div className="small">Master Pixel-Perfect Layouts</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'Discussion' && (
                                <div className="text-center py-5">
                                    <MessageSquare size={48} className="mb-3 opacity-25 text-primary" />
                                    <h6>Student Discussions</h6>
                                    <p className="text-secondary small">Interact with 2.4k students enrolled in this course.</p>
                                    <button className="btn btn-outline-primary btn-sm rounded-pill px-4">Post a question</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Sidebar */}
                <aside className="course-content-sidebar">
                    <div className="sidebar-header-premium">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold m-0">Course Content</h6>
                            <span className="badge bg-primary bg-opacity-20 text-primary rounded-pill">
                                {lessons.length} Modules
                            </span>
                        </div>
                        <div className="progress-info">
                            <div className="d-flex justify-content-between x-small mb-2">
                                <span className="text-secondary">{courseProgress}% Completed</span>
                                <span className="text-white fw-bold">8/12 Lessons</span>
                            </div>
                            <div className="progress" style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                                <div className="progress-bar bg-primary shadow-lg" style={{ width: `${courseProgress}%`, borderRadius: 10 }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-lessons-list">
                        {lessons.length > 0 ? lessons.map((lesson, idx) => (
                            <div
                                key={lesson.id || idx}
                                className={`lesson-item-premium ${activeLesson === idx ? 'active' : ''}`}
                                onClick={() => setActiveLesson(idx)}
                            >
                                <div className="lesson-status-icon shadow-sm">
                                    {idx < 2 ? <Check size={14} strokeWidth={3} className="text-success" /> : <Play size={12} fill={activeLesson === idx ? "white" : "currentColor"} />}
                                </div>
                                <div className="lesson-info-text">
                                    <span className="lesson-name">{lesson.contentTitle || lesson.title}</span>
                                    <div className="lesson-duration">
                                        <Clock size={12} /> {lesson.duration || '12:40'}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            // Mock items if no actual lessons
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className={`lesson-item-premium ${i === 1 ? 'active' : ''}`}>
                                    <div className="lesson-status-icon shadow-sm">
                                        {i === 1 ? <Play size={12} fill="white" /> : <Check size={14} className="text-success" />}
                                    </div>
                                    <div className="lesson-info-text">
                                        <span className="lesson-name">0{i}. Modern Design Principles</span>
                                        <div className="lesson-duration"><Clock size={12} /> 15:00</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="sidebar-footer-notes">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold m-0 small">My Workspace</h6>
                            <button className="btn btn-link p-0 x-small text-decoration-none text-primary">Export</button>
                        </div>
                        <textarea
                            className="notes-editor"
                            placeholder="Take notes while watching..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className="d-flex gap-2 mt-3">
                            <div className="glass-card flex-grow-1 p-2 rounded-3 text-center x-small border border-white border-opacity-5">
                                <Calendar size={14} className="mb-1 d-block mx-auto text-primary" /> Schedule
                            </div>
                            <div className="glass-card flex-grow-1 p-2 rounded-3 text-center x-small border border-white border-opacity-5">
                                <Target size={14} className="mb-1 d-block mx-auto text-success" /> Goals
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LearningContent;
