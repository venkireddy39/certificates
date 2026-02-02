import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await studentService.getMyCourses();
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div className="p-4 text-center">Loading your courses...</div>;

    return (
        <div className="container-fluid p-0">
            <h2 className="fw-bold mb-4">My Courses</h2>

            <div className="row g-4">
                {courses.map(course => (
                    <div className="col-12 col-md-6 col-xl-4" key={course.id}>
                        <div className="card h-100 border-0 shadow-sm overflow-hidden">
                            <div className="position-relative">
                                <img src={course.thumbnail} alt={course.title} className="w-100 object-fit-cover" style={{ height: '180px' }} />
                                <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 p-2 px-3 text-white d-flex justify-content-between align-items-center">
                                    <small><i className="bi bi-person me-1"></i> {course.instructor}</small>
                                </div>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3 text-truncate" title={course.title}>{course.title}</h5>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span className="text-secondary">Progress</span>
                                        <span className="fw-bold">{course.progress}%</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div className="small text-muted">
                                        {course.completedLessons} / {course.totalLessons} Lessons
                                    </div>
                                    <button className="btn btn-primary btn-sm rounded-pill px-3">
                                        {course.progress > 0 ? 'Continue' : 'Start Now'}
                                    </button>
                                </div>
                            </div>
                            {course.nextLesson && (
                                <div className="card-footer bg-light border-0 py-2">
                                    <small className="text-muted d-block text-truncate">
                                        <i className="bi bi-play-circle-fill text-primary me-2"></i>
                                        Next: {course.nextLesson}
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-journal-x fs-1 d-block mb-3"></i>
                    Your are not enrolled in any courses yet.
                </div>
            )}
        </div>
    );
};

export default StudentCourses;
