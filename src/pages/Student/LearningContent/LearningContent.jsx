import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { studentService } from '../../../services/studentService';
import { useToast } from '../../Library/context/ToastContext';
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
import '../StudentDashboard.css';
import './LearningContent.css';

const LearningContent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

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

    const handleShare = async (item = null) => {
        const title = item?.title || currentLesson?.title || courseInfo?.title || "LMS Resource";
        const shareData = {
            title: title,
            text: `Check out this lesson: ${title}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } else {
                await navigator.clipboard.writeText(`${shareData.text} Link: ${shareData.url}`);
                toast.success("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleDownload = (resource = null) => {
        const name = resource?.name || currentLesson?.title || "resource";
        toast.info(`Download starting for ${name}...`);
        setTimeout(() => {
            toast.success("Download completed successfully!");
        }, 2000);
    };

    const currentLesson = lessons[activeLesson] || {
        contentTitle: "Introduction to the Course",
        duration: "10:30",
        type: "video",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop"
    };

    const courseProgress = courseInfo?.progress || 65;

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
        <div className="learning-content-container animate-fade-in text-body">
            {/* Navigation Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                        <ChevronLeft size={16} className="cursor-pointer" onClick={() => navigate('/student/courses')} />
                        <span>{courseInfo?.courseName || 'My Courses'}</span>
                        <ChevronRight size={14} />
                        <span className="text-body fw-bold">Active Session</span>
                    </div>
                    <h3 className="fw-bold m-0 text-body">{currentLesson.contentTitle || currentLesson.title}</h3>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-secondary rounded-pill px-3 py-2 small d-flex align-items-center gap-2 transition-all hover-translate-y"
                        onClick={() => handleShare()}
                    >
                        <Share2 size={16} /> Share
                    </button>
                    <button
                        className="btn btn-primary rounded-pill px-4 py-2 small fw-bold d-flex align-items-center gap-2 shadow-primary transition-all active-scale"
                        onClick={() => setActiveLesson(prev => Math.min(lessons.length - 1, prev + 1))}
                    >
                        Next Lesson <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Main Content Area */}
                <div className="col-12 col-xl-8">
                    {/* Content Display based on Type */}
                    <div className="learning-content-main-viewer mb-4">
                        {currentLesson.type === 'video' ? (
                            <div className="video-player-wrapper overflow-hidden position-relative rounded-4 shadow-lg" style={{ background: '#000' }}>
                                <img
                                    src={currentLesson.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop"}
                                    className="w-100 h-100 object-fit-cover opacity-50"
                                    alt="Preview"
                                />
                                <div className="player-overlay d-flex align-items-center justify-content-center">
                                    <div className="play-btn-large bg-primary rounded-circle d-flex align-items-center justify-content-center shadow-primary cursor-pointer transition-all">
                                        <Play size={32} fill="white" />
                                    </div>
                                </div>

                                {/* Custom Player Controls */}
                                <div className="custom-player-bar px-4 py-3">
                                    <div className="progress mb-3" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                                        <div className="progress-bar bg-primary" style={{ width: '35%' }}></div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center text-white">
                                        <div className="d-flex align-items-center gap-4">
                                            <Play size={20} fill="currentColor" stroke="none" className="cursor-pointer" />
                                            <RotateCcw size={18} className="cursor-pointer text-white-50 hover-white" />
                                            <span className="opacity-75 tracking-wider fw-bold">04:20 / {currentLesson.duration || '12:40'}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <Settings size={18} className="cursor-pointer text-white-50 hover-white" />
                                            <Maximize size={18} className="cursor-pointer text-white-50 hover-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="generic-viewer p-5 text-center rounded-4 border shadow-lg d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '480px', background: 'var(--surface)' }}>
                                {currentLesson.type === 'pdf' ? <FileText size={64} className="text-danger mb-4 opacity-50" /> : <ExternalLink size={64} className="text-primary mb-4 opacity-50" />}
                                <h4 className="fw-bold text-body mb-2">{currentLesson.contentTitle || currentLesson.title}</h4>
                                <p className="text-muted mb-4">{currentLesson.type === 'pdf' ? 'This resource is a PDF document' : 'External learning resource'}</p>
                                <button className="btn btn-primary px-5 py-3 rounded-pill fw-bold" onClick={() => currentLesson.type === 'pdf' ? handleDownload() : window.open(currentLesson.fileUrl, '_blank')}>
                                    {currentLesson.type === 'pdf' ? 'Download PDF' : 'Open Resource'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content Tabs */}
                    <div className="card border-0 shadow-sm p-4 rounded-4" style={{ background: 'var(--surface)' }}>
                        <div className="nav nav-pills gap-2 mb-4">
                            {['Overview', 'Discussion', 'Resources', 'Transcript'].map(tab => (
                                <button
                                    key={tab}
                                    className={`btn rounded-pill px-4 py-2 transition-all fw-bold ${activeTab === tab ? 'btn-primary' : 'btn-light border-0'}`}
                                    style={activeTab !== tab ? { background: 'var(--hover-bg)', color: 'var(--muted)' } : {}}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="tab-body mt-4">
                            {activeTab === 'Overview' && (
                                <div className="animate-fade-in">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary">
                                            <Info size={24} />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold m-0 text-body">Lesson Description</h5>
                                            <span className="smaller text-muted">Topic: Deep Dive into Modern Concepts</span>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-5 lh-lg fs-6">
                                        In this session, we cover the core principles that drive excellence in this field.
                                        Learn how to master the techniques for maximum engagement and scalability.
                                        This lesson is essential for understanding the underlying architectures.
                                    </p>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="p-4 border d-flex align-items-center gap-3 rounded-4 transition-all" style={{ background: 'var(--hover-bg)' }}>
                                                <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary shadow-sm">
                                                    <Target size={20} />
                                                </div>
                                                <div className="fw-bold text-body small">Master Foundations</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-4 border d-flex align-items-center gap-3 rounded-4 transition-all" style={{ background: 'var(--hover-bg)' }}>
                                                <div className="p-2 bg-success bg-opacity-10 rounded-3 text-success shadow-sm">
                                                    <Target size={20} />
                                                </div>
                                                <div className="fw-bold text-body small">Advanced Visual Design</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'Discussion' && (
                                <div className="text-center py-5">
                                    <div className="mb-4 d-inline-block p-4 bg-primary bg-opacity-5 rounded-circle">
                                        <MessageSquare size={48} className="text-primary opacity-50" />
                                    </div>
                                    <h5 className="text-body fw-bold">Community Discussion</h5>
                                    <p className="text-muted small mx-auto" style={{ maxWidth: '400px' }}>Join the conversation with other students currently contemplating this topic.</p>
                                    <button className="btn btn-primary rounded-pill px-5 mt-4 fw-bold">Post a Question</button>
                                </div>
                            )}
                            {activeTab === 'Resources' && (
                                <div className="animate-fade-in">
                                    <h5 className="fw-bold text-body mb-4">Downloadable Assets</h5>
                                    <div className="d-flex flex-column gap-2 mt-3">
                                        {[
                                            { name: 'Lecture Notes.pdf', size: '2.4 MB', type: 'pdf', icon: FileText, color: 'danger' },
                                            { name: 'Practical Guide.pdf', size: '1.8 MB', type: 'pdf', icon: FileText, color: 'danger' },
                                            { name: 'Resource Sandbox', size: 'Link', type: 'link', icon: ExternalLink, color: 'info' }
                                        ].map((asset, i) => (
                                            <div key={i} className="p-3 border rounded-4 d-flex align-items-center justify-content-between transition-all" style={{ background: 'var(--hover-bg)' }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className={`p-2 bg-${asset.color} bg-opacity-10 rounded-3 text-${asset.color}`}>
                                                        <asset.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-body small fw-bold text-truncate">{asset.name}</div>
                                                        <div className="smaller text-muted">{asset.size}</div>
                                                    </div>
                                                </div>
                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => asset.type === 'pdf' ? handleDownload(asset) : window.open('#', '_blank')}>
                                                    <Download size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="col-12 col-xl-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 flex-column overflow-hidden" style={{ background: 'var(--surface)' }}>
                        <div className="p-4 border-bottom">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold m-0 text-body">Course Content</h6>
                                <span className="smaller text-primary fw-bold">{lessons.length} LESSONS</span>
                            </div>
                            <div className="progress-status">
                                <div className="d-flex justify-content-between align-items-center smaller mb-2 text-muted">
                                    <span>{courseProgress}% Overall Progress</span>
                                    <span className="text-body fw-bold">8/12 Done</span>
                                </div>
                                <div className="progress rounded-pill shadow-inner" style={{ height: '6px', background: 'var(--hover-bg)' }}>
                                    <div className="progress-bar bg-primary" style={{ width: `${courseProgress}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="lessons-list flex-grow-1 overflow-auto p-2" style={{ maxHeight: '50vh' }}>
                            {lessons.map((lesson, idx) => (
                                <div
                                    key={lesson.id || idx}
                                    className={`p-3 mb-1 rounded-3 d-flex align-items-center gap-3 cursor-pointer transition-all ${activeLesson === idx ? 'bg-primary bg-opacity-10' : 'hover-bg-secondary'}`}
                                    style={activeLesson !== idx ? { background: 'transparent' } : {}}
                                    onClick={() => setActiveLesson(idx)}
                                >
                                    <div className={`lesson-icon d-flex align-items-center justify-content-center flex-shrink-0 ${activeLesson === idx ? 'text-primary' : 'text-muted'}`}>
                                        {idx < 2 ? <Check size={18} className="text-success" /> : <Play size={14} fill={activeLesson === idx ? "currentColor" : "none"} />}
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className={`text-truncate small fw-bold ${activeLesson === idx ? 'text-primary' : 'text-body'}`}>
                                            {lesson.contentTitle || lesson.title}
                                        </div>
                                        <div className="smaller text-muted opacity-75 d-flex align-items-center gap-1">
                                            <Clock size={10} /> {lesson.duration || '12:30'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-top mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold m-0 small text-body">Personal Notes</h6>
                                <span className="smaller text-primary cursor-pointer fw-bold">Export PDF</span>
                            </div>
                            <textarea
                                className="form-control border-0 rounded-4 p-3 smaller"
                                style={{ background: 'var(--hover-bg)', color: 'var(--text-color)' }}
                                rows="3"
                                placeholder="Write down key takeaways..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <div className="row g-2 mt-3">
                                <div className="col-6">
                                    <div className="p-2 text-center rounded-3 smaller transition-all cursor-pointer border" style={{ background: 'var(--hover-bg)' }}>
                                        <Calendar size={14} className="mb-1 d-block mx-auto text-primary" /> Planner
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-2 text-center rounded-3 smaller transition-all cursor-pointer border" style={{ background: 'var(--hover-bg)' }}>
                                        <Target size={14} className="mb-1 d-block mx-auto text-success" /> Goals
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningContent;
