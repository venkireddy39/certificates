import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Library/context/AuthContext';
import { useToast } from '../Library/context/ToastContext';
import { studentService } from '../../services/studentService';
import {
    StatCard,
    QuickAction,
    CourseCard,
    XpWidget,
    ActivityTimeline
} from './components/StudentDashboardComponents';
import {
    BookOpen,
    Users,
    Calendar,
    Video,
    BarChart2,
    Bus,
    Home,
    MessageCircle
} from 'lucide-react';

import './StudentDashboard.css';

const StudentDashboard = () => {
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const handleFakeAction = (action) => {
        toast.info(`${action} feature coming soon!`);
    };

    const [dashboardData, setDashboardData] = useState({
        courses: [],
        batches: [],
        attendance: [],
        stats: {
            coursesCount: 0,
            batchesCount: 0,
            attendancePct: 0
        }
    });

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [myCourses, myBatches, myAttendance] = await Promise.all([
                    studentService.getMyCourses() || [],
                    studentService.getMyBatches() || [],
                    studentService.getMyAttendance() || []
                ]);

                // Calculate Attendance %
                const attArray = Array.isArray(myAttendance) ? myAttendance : [];
                const totalAtt = attArray.length;
                const present = attArray.filter(a => (a.status || '').toLowerCase() === 'present').length;
                const attPercent = totalAtt > 0 ? Math.round((present / totalAtt) * 100) : 0;

                setDashboardData({
                    courses: Array.isArray(myCourses) ? myCourses : [],
                    batches: Array.isArray(myBatches) ? myBatches : [],
                    attendance: attArray,
                    stats: {
                        coursesCount: Array.isArray(myCourses) ? myCourses.length : 0,
                        batchesCount: Array.isArray(myBatches) ? myBatches.length : 0,
                        attendancePct: attPercent
                    }
                });
            } catch (e) {
                console.error("Dashboard Load Error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Derived State
    const learnerProfile = {
        level: user?.level || "Learner",
        xp: user?.xp || 0,
        nextLevelXp: user?.nextLevelXp || 1000,
        role: user?.role || "Student",
        badges: user?.badges || [
            { icon: "🏆", name: "Fast Learner" },
            { icon: "⭐", name: "Top Performer" }
        ]
    };

    const scheduleItems = (dashboardData.batches || []).slice(0, 3).map((batch, i) => ({
        time: i === 0 ? "09:00 AM" : (i === 1 ? "11:30 AM" : "02:00 PM"),
        title: batch.batchName || batch.name || "Scheduled Session",
        type: "Batch Session",
        instructor: batch.instructorName || "Faculty"
    }));

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
        <div className="student-dashboard container-fluid px-0">
            {/* Header */}
            <div className="mb-4">
                <h3 className="fw-bold">Dashboard</h3>
                <p className="text-secondary small">Overview of your courses and schedule</p>
            </div>

            {/* Stats Row */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-4">
                    <StatCard label="My Courses" value={dashboardData.stats.coursesCount} icon={BookOpen} color="99, 102, 241" delay={0.1} />
                </div>
                <div className="col-12 col-md-4">
                    <StatCard label="Active Batches" value={dashboardData.stats.batchesCount} icon={Users} color="168, 85, 247" delay={0.2} />
                </div>
                <div className="col-12 col-md-4">
                    <StatCard label="Attendance" value={`${dashboardData.stats.attendancePct}%`} icon={Calendar} color="16, 185, 129" delay={0.3} />
                </div>
            </div>

            <div className="row g-5">
                {/* Main Content Area */}
                <div className="col-12 col-lg-8">
                    <section className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0">Continue Learning</h4>
                            <button className="btn btn-link text-primary p-0 text-decoration-none small fw-bold" onClick={() => navigate('/student/courses')}>
                                View All
                            </button>
                        </div>
                        <div className="row g-4">
                            {dashboardData.courses.length > 0 ? (
                                dashboardData.courses.slice(0, 2).map((course, idx) => (
                                    <div className="col-12 col-md-6" key={course.courseId || idx}>
                                        <CourseCard
                                            course={{
                                                ...course,
                                                progress: course.progress || 0,
                                                priority: idx === 0 ? 'High' : 'Medium'
                                            }}
                                            onNavigate={() => navigate(`/student/courses`)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="glass-card p-5 text-center text-secondary">
                                        <BookOpen size={48} className="mb-3 opacity-25" />
                                        <h5>No courses enrolled yet</h5>
                                        <button className="btn btn-primary mt-3 px-4" onClick={() => navigate('/student/courses')}>Browse Catalog</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0">Today's Schedule</h4>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                                {scheduleItems.length} Sessions
                            </span>
                        </div>
                        <ActivityTimeline items={scheduleItems.length > 0 ? scheduleItems : [
                            { time: "TBD", title: "No classes scheduled", type: "Stay tuned", instructor: "-" }
                        ]} />
                    </section>
                </div>

                {/* Sidebar area */}
                <div className="col-12 col-lg-4">
                    <section className="mb-5">
                        <XpWidget user={learnerProfile} />
                    </section>

                    <section className="mb-5">
                        <h5 className="fw-bold mb-4">Quick Actions</h5>
                        <div className="row g-3">
                            <div className="col-6">
                                <QuickAction icon={Video} label="Join Class" color="239, 68, 68" onClick={() => handleFakeAction('Join Class')} />
                            </div>
                            <div className="col-6">
                                <QuickAction icon={Calendar} label="Attendance" color="16, 185, 129" onClick={() => navigate('/student/attendance')} />
                            </div>
                            <div className="col-6">
                                <QuickAction icon={MessageCircle} label="Messages" color="139, 92, 246" onClick={() => navigate('/student/communication')} />
                            </div>
                            <div className="col-6">
                                <QuickAction icon={BarChart2} label="Reports" color="59, 130, 246" onClick={() => navigate('/student/reports')} />
                            </div>
                            <div className="col-6">
                                <QuickAction icon={BookOpen} label="Library" color="99, 102, 241" onClick={() => navigate('/student/library')} />
                            </div>
                            <div className="col-6">
                                <QuickAction icon={Bus} label="Transport" color="245, 158, 11" onClick={() => navigate('/student/transport')} />
                            </div>
                            <div className="col-6">
                                <QuickAction icon={Home} label="Hostel" color="14, 165, 233" onClick={() => navigate('/student/hostel')} />
                            </div>

                        </div>
                    </section>

                    <div className="glass-card p-4 text-center text-secondary small">
                        Join your scheduled sessions or check your courses for updates.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
