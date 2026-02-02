import React from 'react';
import { useAuth } from '../Library/context/AuthContext';
import { studentService } from '../../services/studentService';

const StudentDashboard = () => {
    const { user } = useAuth();

    const [dashboardData, setDashboardData] = React.useState({
        courses: 0,
        batches: 0,
        attendancePercent: 0,
        libraryBooks: 0
    });

    React.useEffect(() => {
        // Parallel data fetching
        const loadStats = async () => {
            try {
                const [myCourses, myBatches, myAttendance, myBooks] = await Promise.all([
                    studentService.getMyCourses(),
                    studentService.getMyBatches(),
                    studentService.getMyAttendance(),
                    studentService.getMyLibraryBooks()
                ]);

                // Calculate Attendance %
                const totalAtt = myAttendance.length;
                const present = myAttendance.filter(a => a.status === 'Present').length;
                const attPercent = totalAtt > 0 ? Math.round((present / totalAtt) * 100) : 0;

                setDashboardData({
                    courses: myCourses.length,
                    batches: myBatches.length,
                    attendancePercent: attPercent,
                    libraryBooks: myBooks.length
                });
            } catch (e) {
                console.error("Failed to load dashboard stats", e);
            }
        };
        loadStats();
    }, []);

    const stats = [
        { label: 'Courses Enrolled', value: dashboardData.courses, icon: 'bi-journal-check', color: 'primary' },
        { label: 'Batches Active', value: dashboardData.batches, icon: 'bi-people', color: 'info' },
        { label: 'Attendance', value: `${dashboardData.attendancePercent}%`, icon: 'bi-calendar-check', color: 'success' },
        { label: 'Library Books', value: dashboardData.libraryBooks, icon: 'bi-book', color: 'warning' }
    ];

    const upcomingClasses = [
        { subject: 'Mathematics', time: '10:00 AM', teacher: 'Dr. Smith', link: '#' },
        { subject: 'Physics', time: '02:00 PM', teacher: 'Prof. Johnson', link: '#' }
    ];

    return (
        <div className="container-fluid p-0">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Welcome back, {user?.name || 'Student'}! 👋</h2>
                    <p className="text-secondary mb-0">Here's what's happening with your learning today.</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2">
                    <i className="bi bi-plus-lg"></i>
                    <span>Enroll Course</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="row g-3 mb-4">
                {stats.map((stat, index) => (
                    <div className="col-12 col-sm-6 col-lg-3" key={index}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3 d-flex align-items-center gap-3">
                                <div className={`rounded-3 bg-${stat.color}-subtle text-${stat.color} d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '48px', height: '48px' }}>
                                    <i className={`bi ${stat.icon} fs-4`}></i>
                                </div>
                                <div>
                                    <div className="text-secondary small fw-medium text-uppercase">{stat.label}</div>
                                    <div className="fw-bold fs-4">{stat.value}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Upcoming Classes */}
                <div className="col-12 col-xl-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Upcoming Classes</h5>
                            <button className="btn btn-light btn-sm text-secondary">View All</button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 ps-4">Subject</th>
                                            <th className="border-0">Time</th>
                                            <th className="border-0">Teacher</th>
                                            <th className="border-0 pe-4 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {upcomingClasses.map((cls, index) => (
                                            <tr key={index}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                                            {cls.subject.charAt(0)}
                                                        </div>
                                                        <span className="fw-medium">{cls.subject}</span>
                                                    </div>
                                                </td>
                                                <td className="text-secondary">{cls.time}</td>
                                                <td>{cls.teacher}</td>
                                                <td className="pe-4 text-end">
                                                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3">Join Class</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Announcements */}
                <div className="col-12 col-xl-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="fw-bold mb-0">Announcements</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex gap-3 mb-3">
                                <div className="vr text-primary opacity-100" style={{ width: '3px' }}></div>
                                <div>
                                    <div className="fw-bold text-dark">Exam Schedule Released</div>
                                    <div className="text-secondary small mt-1">Foundations of Physics - Midterm</div>
                                    <div className="text-muted small mt-2">2 hours ago</div>
                                </div>
                            </div>
                            <div className="d-flex gap-3">
                                <div className="vr text-warning opacity-100" style={{ width: '3px' }}></div>
                                <div>
                                    <div className="fw-bold text-dark">Library Due Date</div>
                                    <div className="text-secondary small mt-1">Return "Introduction to Algorithms"</div>
                                    <div className="text-muted small mt-2">Yesterday</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
