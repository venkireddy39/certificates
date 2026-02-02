import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import { batchService } from '../../Batches/services/batchService';

const StartSessionModal = ({ show, onClose, onSessionStarted }) => {
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [academicSessions, setAcademicSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        courseId: '',
        batchId: '',
        classId: ''
    });

    // 1. Fetch Courses on Mount/Open
    useEffect(() => {
        if (show) {
            attendanceService.getCourses().then(setCourses).catch(console.error);
        }
    }, [show]);

    // 2. Fetch Batches when Course Changes
    useEffect(() => {
        if (formData.courseId) {
            // Using batchService directly as per fix #7 in user request
            batchService.getBatchesByCourseId(formData.courseId)
                .then(setBatches)
                .catch(() => setBatches([]));
        } else {
            setBatches([]);
        }
    }, [formData.courseId]);

    // 3. Fetch Classes when Batch Changes
    useEffect(() => {
        if (formData.batchId) {
            attendanceService.getAcademicSessions(formData.batchId)
                .then(setAcademicSessions)
                .catch(() => setAcademicSessions([]));
        } else {
            setAcademicSessions([]);
        }
    }, [formData.batchId]);

    const handleStart = async () => {
        if (!formData.courseId || !formData.batchId || !formData.classId) {
            alert("Please select Course, Batch, and Class/Topic");
            return;
        }

        setLoading(true);
        // Get auth user ID properly in real app
        const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
        const userId = user.id || 1;

        try {
            await attendanceService.startSession(
                formData.classId,
                formData.courseId,
                formData.batchId,
                userId
            );
            onSessionStarted();
            onClose();
        } catch (error) {
            console.error("Failed to start session:", error);
            // Simple alert for now as requested, but cleaner
            alert(error.message || "Failed to start session.");
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fw-bold">Start New Attendance Session</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Course</label>
                                <select
                                    className="form-select"
                                    value={formData.courseId}
                                    onChange={e => setFormData({ ...formData, courseId: e.target.value, batchId: '', classId: '' })}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Batch</label>
                                <select
                                    className="form-select"
                                    value={formData.batchId}
                                    onChange={e => setFormData({ ...formData, batchId: e.target.value, classId: '' })}
                                    disabled={!formData.courseId}
                                >
                                    <option value="">Select Batch</option>
                                    {batches.map(b => <option key={b.batchId} value={b.batchId}>{b.batchName}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Select Class / Topic</label>
                                <select
                                    className="form-select"
                                    value={formData.classId}
                                    onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                    disabled={!formData.batchId}
                                >
                                    <option value="">Select Class Session</option>
                                    {academicSessions.map(s => (
                                        <option key={s.classId} value={s.classId}>
                                            {s.sessionName} ({s.startDate})
                                        </option>
                                    ))}
                                </select>
                                <small className="text-muted">Pick the scheduled class session from the batch syllabus</small>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer border-top-0">
                        <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
                        <button
                            type="button"
                            className="btn btn-primary px-4"
                            onClick={handleStart}
                            disabled={loading}
                        >
                            {loading ? 'Starting...' : 'Start Session'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartSessionModal;
