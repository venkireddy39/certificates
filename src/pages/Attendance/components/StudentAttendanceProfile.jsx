import React, { useMemo } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiCheckCircle, FiXCircle, FiClock, FiActivity } from 'react-icons/fi';
import { userService } from '../../Users/services/userService';

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="d-flex align-items-start mb-3">
        <div className="bg-light rounded-circle p-2 me-3 text-primary flex-shrink-0">
            <Icon size={16} />
        </div>
        <div className="overflow-hidden">
            <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>{label}</div>
            <div className="fw-medium text-break">{value}</div>
        </div>
    </div>
);

const StatCard = ({ label, value, color, icon: Icon }) => (
    <div className="col-4">
        <div className={`p-2 p-md-3 rounded-3 bg-${color} bg-opacity-10 h-100 text-center d-flex flex-column justify-content-center align-items-center`}>
            {Icon && <Icon className={`text-${color} mb-1 mb-md-2`} size={20} />}
            <div className={`h5 h4-md fw-bold text-${color} mb-0`}>{value}</div>
            <div className={`small text-${color} text-opacity-75`} style={{ fontSize: '0.7rem' }}>{label}</div>
        </div>
    </div>
);



const StudentAttendanceProfile = ({ student, studentHistory = [], onClose }) => {
    const modalRef = React.useRef(null);
    const [showHistory, setShowHistory] = React.useState(false);
    const [extendedDetails, setExtendedDetails] = React.useState(null);

    // Lock body scroll on mount
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Fetch extended user details (e.g. Phone) if studentId exists
        if (student) {
            /*************************************************************************
             * DATA CONNECTION EXPLANATION:
             * The 'student' object passed here comes from Attendance Report.
             * It has 'studentId' which points to the 'students' table.
             * The Student entity has a nested 'user' object with email, phone, etc.
             * 
             * We call getStudentById(studentId) to get the full Student record
             * which includes the nested User data.
             *************************************************************************/

            const sid = student.studentId || student.id;

            if (sid) {
                // Fetch Student record (includes nested user with email, phone)
                userService.getStudentById(sid)
                    .then(data => {
                        console.log("[StudentProfile] Fetched student data:", data);
                        // Extract user data from nested object if present
                        const userData = data?.user || data;
                        setExtendedDetails(prev => ({
                            ...prev,
                            email: userData?.email,
                            phone: userData?.phone || userData?.mobile || userData?.phoneNumber,
                            enrolledDate: data?.enrolledDate || data?.createdAt || data?.joinDate
                        }));
                    })
                    .catch(err => {
                        console.warn("Failed to fetch student details, trying user endpoint", err);
                        // Fallback: Try fetching by userId if we have it
                        const uid = student.userId || student.uid;
                        if (uid) {
                            userService.getUserById(uid)
                                .then(data => {
                                    setExtendedDetails(prev => ({
                                        ...prev,
                                        email: data?.email,
                                        phone: data?.phone || data?.mobile
                                    }));
                                })
                                .catch(() => { });
                        }
                    });
            }

            // Fetch Batch Details (Course/Batch Name)
            const bid = student.batchId || student.studentBatchId;
            if (bid) {
                import('../../Batches/services/batchService').then(({ batchService }) => {
                    batchService.getBatchById(bid)
                        .then(batch => setExtendedDetails(prev => ({
                            ...prev,
                            batchName: batch.batchName,
                            courseName: batch.courseName
                        })))
                        .catch(() => { });
                });
            }
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [student]);

    // Mock stats for the student
    const stats = useMemo(() => {
        if (!student) return { totalClasses: 0, present: 0, absent: 0, percentage: 0 };
        const totalClasses = studentHistory.length;
        const present = studentHistory.filter(h => ['PRESENT', 'LATE', 'PARTIAL'].includes(h.status)).length;
        const absent = totalClasses - present;
        const percentage = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;
        return { totalClasses, present, absent, percentage };
    }, [student?.id, studentHistory]);

    if (!student) return null;

    // Use student's real email or fallback to N/A
    // prioritizing extended fetch
    const studentEmail = extendedDetails?.email || student.email || student.studentEmail || 'No email provided';

    // DEBUG: Check what we are getting
    // console.log("Extended Details:", extendedDetails);

    const studentPhone = extendedDetails?.phone || extendedDetails?.mobile || extendedDetails?.phoneNumber || extendedDetails?.contact || student.phone || student.contact || 'N/A';
    const studentCourse = extendedDetails?.courseName || student.courseName || student.batchName || "N/A";
    const studentEnrolled = extendedDetails?.enrolledDate || student.enrolledDate || student.joinDate;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 overflow-y-auto"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, backdropFilter: 'blur(2px)' }}>

            <div className="d-flex min-vh-100 justify-content-center align-items-center py-4"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

                <div ref={modalRef}
                    className="card border-0 shadow-lg d-flex flex-column transition-all mx-3 position-relative"
                    style={{
                        width: showHistory ? '800px' : '500px',
                        maxWidth: '95vw',
                        // No maxHeight limits - allow full growth
                        transition: 'width 0.3s ease'
                    }}>
                    <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3 px-3 px-md-4 flex-shrink-0">
                        <h5 className="mb-0 fw-bold text-primary text-truncate pe-2">
                            {showHistory ? 'Attendance History' : 'Student Overview'}
                        </h5>
                        <button className="btn btn-light btn-sm rounded-circle p-2 flex-shrink-0" onClick={onClose}>
                            <FiX size={18} />
                        </button>
                    </div>

                    <div className="card-body px-4 pt-2 pb-4 flex-grow-1">
                        {/* Profile Header */}
                        <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fs-3 fw-bold flex-shrink-0"
                                style={{ width: '64px', height: '64px' }}>
                                {student.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="fw-bold mb-1 text-truncate" title={student.name}>{student.name}</h4>
                                <span className="badge bg-light text-secondary border">ID: {student.studentId || student.id}</span>
                            </div>
                        </div>

                        {!showHistory ? (
                            <>
                                {/* Stats Summary */}
                                <div className="row g-3 mb-4">
                                    <StatCard label="Attendance" value={`${stats.percentage}%`} color={stats.percentage >= 75 ? 'success' : 'warning'} icon={FiActivity} />
                                    <StatCard label="Present" value={stats.present} color="success" icon={FiCheckCircle} />
                                    <StatCard label="Absent" value={stats.absent} color="danger" icon={FiXCircle} />
                                </div>

                                {/* Details Grid */}
                                <h6 className="fw-bold text-muted mb-3 small text-uppercase letter-spacing-1">Contact & Academic Info</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <DetailRow icon={FiMail} label="Email Address" value={studentEmail} />
                                        <DetailRow icon={FiPhone} label="Contact Number" value={studentPhone} />
                                    </div>
                                    <div className="col-md-6">
                                        <DetailRow icon={FiBook} label="Course/Batch" value={studentCourse} />
                                        <DetailRow icon={FiCalendar} label="Enrolled Date" value={studentEnrolled ? (new Date(studentEnrolled).toString() !== 'Invalid Date' ? new Date(studentEnrolled).toLocaleDateString() : studentEnrolled) : 'N/A'} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="fade-in">
                                {/* Detailed History Table View (unchanged logic, just layout container) */}
                                <div className="row g-3 mb-4">
                                    {/* Stats Mini Cards ... */}
                                    <div className="col-md-3 col-6">
                                        <div className="p-3 rounded bg-light border text-center h-100">
                                            <div className="h4 mb-0 fw-bold text-primary">{stats.totalClasses}</div>
                                            <div className="small text-muted">Total Classes</div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6">
                                        <div className="p-3 rounded bg-light border text-center h-100">
                                            <div className="h4 mb-0 fw-bold text-success">{stats.present}</div>
                                            <div className="small text-muted">Present</div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6">
                                        <div className="p-3 rounded bg-light border text-center h-100">
                                            <div className="h4 mb-0 fw-bold text-danger">{stats.absent}</div>
                                            <div className="small text-muted">Absent</div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6">
                                        <div className="p-3 rounded bg-light border text-center h-100">
                                            <div className={`h4 mb-0 fw-bold ${stats.percentage >= 75 ? 'text-success' : 'text-warning'}`}>{stats.percentage}%</div>
                                            <div className="small text-muted">Average</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive border rounded">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">Date</th>
                                                <th>Status</th>
                                                <th>Method</th>
                                                <th className="text-center pe-3">Time (Min)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentHistory.length > 0 ? (
                                                studentHistory.map((record, index) => (
                                                    <tr key={index}>
                                                        <td className="fw-medium ps-3">{record.date}</td>
                                                        <td>
                                                            <span className={`badge bg-${record.status === 'PRESENT' ? 'success' :
                                                                record.status === 'LATE' ? 'warning' :
                                                                    'danger'
                                                                }`}>
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                        <td className="text-secondary small">{record.method}</td>
                                                        <td className="text-center pe-3">{record.attendanceInMinutes || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-5 text-muted bg-light">
                                                        <div className="py-3">
                                                            <FiCalendar className="mb-2 text-muted opacity-50" size={24} />
                                                            <div>No attendance history recorded yet.</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card-footer bg-light border-top py-3 px-4 flex-shrink-0">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="text-muted small">
                                Status: <strong>{student.isDeleted ? 'Inactive' : 'Active'}</strong>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-secondary" onClick={onClose}>Close</button>
                                {!showHistory ? (
                                    <button className="btn btn-primary" onClick={() => setShowHistory(true)}>
                                        <FiActivity className="me-2" />
                                        View Full History
                                    </button>
                                ) : (
                                    <button className="btn btn-outline-primary" onClick={() => setShowHistory(false)}>
                                        Back to Overview
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceProfile;
