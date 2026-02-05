import React, { useState, useMemo, useEffect } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import { attendanceService } from '../services/attendanceService';
import { courseService } from '../../Courses/services/courseService';
import { batchService } from '../../Batches/services/batchService';
import { enrollmentService } from '../../Batches/services/enrollmentService';
import { FiSave, FiFilter, FiRefreshCw, FiTrash2, FiUpload, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiX, FiAlertTriangle, FiDownload } from 'react-icons/fi';
import AttendanceStats from '../components/AttendanceStats';
import AttendanceTable from '../components/AttendanceTable';

const OfflineSync = () => {
    // Selectors
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSessionId, setSelectedSessionId] = useState('');

    const [activeTab, setActiveTab] = useState('ENTRY'); // ENTRY | QUEUE | HISTORY

    // Data State
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [students, setStudents] = useState([]);

    // Local Attendance State
    const [attendanceMap, setAttendanceMap] = useState({});
    const [lateMinutesMap, setLateMinutesMap] = useState({});

    const downloadTemplate = () => {
        const headers = ['studentId', 'status', 'remarks'];

        // Use real student IDs if a batch is selected and students are loaded
        const rows = students.length > 0
            ? students.map(s => [s.studentId, 'PRESENT', ''])
            : [];

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_template_${selectedBatch || 'sample'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // CSV Preview State
    const [csvPreview, setCsvPreview] = useState(null); // { rows: [], summary: { total, valid, errors, warnings: [] } }
    const [uploadJob, setUploadJob] = useState(null); // { id, status, message }
    const [uploadJobs, setUploadJobs] = useState([]); // List of jobs for the batch
    const [isUploading, setIsUploading] = useState(false);

    // Store Access
    const { queueOfflineAttendance, attendanceList, clearOfflineQueue } = useAttendanceStore();

    // Fetch Courses
    useEffect(() => {
        courseService.getCourses().then(setCourses).catch(console.error);
    }, []);

    // Fetch Batches
    useEffect(() => {
        if (selectedCourse) {
            batchService.getBatchesByCourseId(selectedCourse).then(setBatches).catch(console.error);
        } else {
            setBatches([]);
        }
    }, [selectedCourse]);

    // Fetch Sessions (Available Sessions)
    useEffect(() => {
        if (selectedBatch && selectedDate) {
            // Assuming getSessions can filter by batch and date
            // Note: getSessions might return all sessions, so we might need to filter or backend handles it.
            // Our implementation sends params.
            attendanceService.getSessions(selectedBatch, selectedDate).then(data => {
                // Filter for 'Live Class' or ensure backend does it. 
                // Let's assume returned sessions are valid for attendance.
                setSessions(data || []);
            }).catch(console.error);
        } else {
            setSessions([]);
        }
    }, [selectedBatch, selectedDate]);

    // Fetch Students
    useEffect(() => {
        if (selectedBatch) {
            enrollmentService.getStudentsByBatch(selectedBatch).then(data => {
                const mapped = Array.isArray(data) ? data.map(s => ({
                    id: s.studentId,
                    studentId: s.studentId,
                    name: s.studentName || s.name || `Student ${s.studentId}`,
                    email: s.studentEmail || s.email || ''
                })) : [];
                setStudents(mapped);
            }).catch(console.error);
        } else {
            setStudents([]);
        }
    }, [selectedBatch]);

    // Fetch Upload Jobs History
    useEffect(() => {
        if (selectedBatch) {
            attendanceService.getUploadJobsByBatch(selectedBatch)
                .then(setUploadJobs)
                .catch(err => console.error("Failed to fetch upload jobs", err));
        } else {
            setUploadJobs([]);
        }
    }, [selectedBatch]);

    // Auto-init attendance or clear on session change
    useEffect(() => {
        if (selectedSessionId && students.length > 0) {
            const initial = {};
            students.forEach(s => {
                initial[s.id] = 'UNMARKED'; // Default to UNMARKED instead of PRESENT
            });
            setAttendanceMap(initial);
        } else {
            setAttendanceMap({});
        }
    }, [selectedSessionId, students]);

    // Stats Calculation
    const stats = useMemo(() => {
        const total = students.length;
        if (total === 0) return { total: 0, present: 0, absent: 0, late: 0, percentage: 0 };

        const vals = Object.values(attendanceMap);
        const present = vals.filter(s => s === 'PRESENT').length;
        const absent = vals.filter(s => s === 'ABSENT').length;
        const late = vals.filter(s => s === 'LATE').length;

        return {
            total,
            present,
            absent,
            late,
            percentage: total > 0 ? Math.round((present / total) * 100) : 0
        };
    }, [students, attendanceMap]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    };

    // Backend-driven CSV Upload Job
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!['.csv', '.xls', '.xlsx'].includes(ext)) {
            alert('❌ Invalid File Type. Only .csv, .xls, and .xlsx files are allowed.');
            e.target.value = null;
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5 MB
            alert('❌ File too large. Max 5MB allowed.');
            e.target.value = null;
            return;
        }

        setIsUploading(true);
        try {
            // Get current user ID
            const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
            const uploadedBy = authUser.id || 1;

            const job = await attendanceService.uploadCsvJob(
                selectedCourse,
                selectedBatch,
                selectedSessionId,
                selectedDate,
                uploadedBy,
                file
            );

            console.log("Upload Job Created:", job);
            setUploadJob(job);
            setActiveTab('HISTORY');

            // Refresh history
            if (selectedBatch) {
                attendanceService.getUploadJobsByBatch(selectedBatch)
                    .then(setUploadJobs)
                    .catch(console.error);
            }

            if (window.confirm(`File uploaded successfully (ID: ${job.id}). Do you want to apply this data now?`)) {
                await handleProcessJob(job.id);
            }

        } catch (err) {
            console.error("Upload failed", err);
            alert(`❌ Upload failed: ${err.message}`);
        } finally {
            setIsUploading(false);
            e.target.value = null;
        }
    };

    const handleProcessJob = async (jobId) => {
        setIsUploading(true);
        try {
            await attendanceService.processCsvJob(jobId);
            alert("✅ Data applied to database successfully.");

            // Refresh history to see updated status
            if (selectedBatch) {
                const refreshedJobs = await attendanceService.getUploadJobsByBatch(selectedBatch);
                setUploadJobs(refreshedJobs);
                const currentJob = refreshedJobs.find(j => j.id === jobId);
                if (currentJob) setUploadJob(currentJob);
            }
        } catch (err) {
            console.error("Processing failed", err);
            alert(`❌ Application failed: ${err.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = () => {
        if (!selectedSessionId) return;

        let markedCount = 0;
        Object.entries(attendanceMap).forEach(([sid, status]) => {
            // Skip unmarked records
            if (!status || status === 'UNMARKED') return;

            const meta = status === 'LATE' && lateMinutesMap[sid] ? { minutesLate: lateMinutesMap[sid] } : {};

            // Normalize ID usage: Ensure we pass the selectedSessionId clearly
            queueOfflineAttendance(sid, status, selectedDate, selectedSessionId, meta);
            markedCount++;
        });

        if (markedCount === 0) {
            alert("No changes to save. Please mark at least one student.");
            return;
        }

        alert(`Attendance for ${markedCount} students queued locally.`);
        setActiveTab('QUEUE');
    };

    // Queue Logic
    const [queue, setQueue] = useState([]);

    const loadQueue = () => {
        try {
            const stored = JSON.parse(localStorage.getItem('offline_attendance') || '[]');
            setQueue(stored);
        } catch (e) {
            console.error("Failed to parse offline_attendance queue, clearing.", e);
            setQueue([]);
            localStorage.removeItem('offline_attendance');
        }
    };

    useEffect(() => { loadQueue(); }, [activeTab]);

    const handleSync = async () => {
        // 1. Group by Session ID to batch requests
        const grouped = queue.reduce((acc, curr) => {
            // Normalized key: prefer attendanceSessionId, fall back to sessionId
            const sid = curr.attendanceSessionId || curr.sessionId;
            if (!acc[sid]) acc[sid] = [];
            acc[sid].push(curr);
            return acc;
        }, {});

        let successCount = 0;
        let failCount = 0;
        const successfulSessionIds = new Set();

        for (const [sid, records] of Object.entries(grouped)) {
            // Validation
            if (!sid || sid === 'undefined' || sid === 'null' || isNaN(Number(sid))) {
                console.warn(`Skipping invalid session ID in sync queue: ${sid}`, records);
                continue; // Skip invalid, don't delete yet (or should we?)
            }
            const numericSessionId = Number(sid);

            try {
                // 2. DEDUPLICATION Logic
                const uniqueRecords = new Map();
                records.forEach(r => {
                    // Composite Key: StudentID - SessionID - Date
                    const dateStr = r.timestamp ? r.timestamp.split('T')[0] : selectedDate; // or today
                    // We use the date stored in the record
                    const recordDate = r.timestamp ? r.timestamp.split('T')[0] : new Date().toISOString().split('T')[0];

                    const key = `${r.studentId}-${numericSessionId}-${recordDate}`;

                    // Upsert: Last writer wins (or first? let's use last to get latest status)
                    uniqueRecords.set(key, { ...r, attendanceDate: recordDate });
                });

                const payload = Array.from(uniqueRecords.values()).map(r => ({
                    studentId: Number(r.studentId),
                    status: (r.status || 'PRESENT').toUpperCase(),
                    source: 'MANUAL',
                    remarks: r.remarks || '',
                    attendanceDate: r.attendanceDate
                }));

                // 3. Send
                if (payload.length > 0) {
                    await attendanceService.saveAttendance(numericSessionId, payload);
                    successCount += records.length; // Count original records as synced
                    successfulSessionIds.add(sid);
                }

            } catch (err) {
                console.error(`Failed to sync session ${numericSessionId}`, err);
                failCount += records.length;
                // We do NOT remove failed records from local storage, so user can retry
            }
        }

        // 4. Cleanup: Remove ONLY successfully synced records from LocalStorage
        if (successCount > 0) {
            const currentQueue = JSON.parse(localStorage.getItem('offline_attendance') || '[]');
            const remainingHelper = currentQueue.filter(r => {
                const rSid = String(r.attendanceSessionId || r.sessionId);
                // If this record's session was successfully synced, FILTER IT OUT (return false)
                // Wait, what if we only synced *some* sessions?
                // Simple approach: If session X succeeded, remove all records for session X.
                // This assumes batch save is all-or-nothing per session. 
                // If saveAttendance throws, we assume nothing saved for that session.
                return !successfulSessionIds.has(rSid);
            });

            localStorage.setItem('offline_attendance', JSON.stringify(remainingHelper));
            loadQueue(); // Refresh UI
            alert(`✅ Synced ${successCount} records successfully!`);
        }

        if (failCount > 0) {
            alert(`⚠️ Failed to sync ${failCount} records. They remain in the queue.`);
        }
    };

    const handleClearQueue = () => {
        if (window.confirm("Are you sure you want to delete all pending records in the sync queue?")) {
            clearOfflineQueue();
            loadQueue();
        }
    };

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0 px-2">Batch Attendance Manager</h4>
                <div className="btn-group">
                    <button
                        className={`btn btn-sm ${activeTab === 'ENTRY' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('ENTRY')}
                    >
                        Manual Entry
                    </button>
                    <button
                        className={`btn btn-sm ${activeTab === 'QUEUE' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('QUEUE')}
                    >
                        Sync Queue ({queue.length})
                    </button>
                    <button
                        className={`btn btn-sm ${activeTab === 'HISTORY' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('HISTORY')}
                    >
                        Upload History ({uploadJobs.length})
                    </button>
                </div>
            </div>

            {/* Global Context Selectors - Always Visible */}
            <div className="card border-0 shadow-sm mb-4 bg-light">
                <div className="card-body py-3">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-5">
                            <label className="form-label small fw-bold text-secondary mb-1">Select Course</label>
                            <select
                                className="form-select"
                                value={selectedCourse}
                                onChange={e => { setSelectedCourse(e.target.value); setSelectedBatch(''); setSelectedSessionId(''); }}
                            >
                                <option value="">-- Select Course --</option>
                                {courses.map(c => (
                                    <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label small fw-bold text-secondary mb-1">Select Batch</label>
                            <select
                                className="form-select"
                                value={selectedBatch}
                                onChange={e => { setSelectedBatch(e.target.value); setSelectedSessionId(''); }}
                                disabled={!selectedCourse}
                            >
                                <option value="">-- Select Batch --</option>
                                {batches.map(b => (
                                    <option key={b.batchId} value={b.batchId}>{b.batchName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 text-end">
                            {/* Optional: Add a clear or refresh button here if needed */}
                        </div>
                    </div>
                </div>
            </div>

            {activeTab === 'ENTRY' && (
                <>
                    {/* Manual Entry Specific Filters (Date & Upload) */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="row g-3 align-items-end">
                                <div className="col-md-4">
                                    <label className="form-label small fw-bold text-secondary">Attendance Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={selectedDate}
                                        onChange={e => { setSelectedDate(e.target.value); setSelectedSessionId(''); }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    {/* CSV Upload Button - Only active if session selected */}
                                    <label className="form-label small fw-bold text-secondary">Bulk Upload (Optional)</label>
                                    <div className="w-100 d-flex gap-2">
                                        <div className="flex-grow-1">
                                            <input
                                                type="file"
                                                accept=".csv,.xlsx"
                                                id="csv-upload"
                                                className="d-none"
                                                onChange={handleFileUpload}
                                                disabled={!selectedSessionId || isUploading}
                                            />
                                            <label
                                                htmlFor="csv-upload"
                                                className={`btn btn-outline-secondary w-100 ${(!selectedSessionId || isUploading) ? 'disabled' : ''}`}
                                            >
                                                {isUploading ? (
                                                    <><span className="spinner-border spinner-border-sm me-2" /> Uploading...</>
                                                ) : (
                                                    <><FiUpload className="me-2" /> Upload CSV/Excel to Session</>
                                                )}
                                            </label>
                                        </div>
                                        <button
                                            className="btn btn-outline-info d-flex align-items-center gap-1"
                                            title="Download CSV Template"
                                            onClick={downloadTemplate}
                                        >
                                            <FiDownload />
                                            <span className="small">Template</span>
                                        </button>
                                    </div>
                                    <div className="text-muted mt-1">
                                        <small style={{ fontSize: '0.75rem' }}>
                                            Required columns: <code>studentId</code>, <code>status</code> (PRESENT/ABSENT/LATE)
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Session Selection */}
                    {selectedBatch && selectedDate && !selectedSessionId && (
                        <div className="mb-4 fade-in">
                            <h6 className="fw-bold text-muted mb-3">Select Scheduled Class for {selectedDate}:</h6>
                            {sessions.length > 0 ? (
                                <div className="row g-3">
                                    {sessions.map(sess => (
                                        <div className="col-md-4" key={sess.id}>
                                            <div
                                                className="card h-100 border-0 shadow-sm hover-shadow cursor-pointer"
                                                onClick={() => setSelectedSessionId(sess.id)}
                                            >
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="badge bg-primary bg-opacity-10 text-primary">Class ID: {sess.sessionId}</span>
                                                        <FiClock className="text-muted" />
                                                    </div>
                                                    <h6 className="fw-bold mb-1">{sess.title || 'Untitled Session'}</h6>
                                                    <p className="text-muted small mb-0">{sess.startTime} - {sess.endTime}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-info border-0 shadow-sm">
                                    <FiCalendar className="me-2" /> No classes found linked to this batch on this date.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload Job Status */}
                    {uploadJob && (
                        <div className="mb-4 fade-in">
                            <div className={`card border-0 shadow-sm border-start border-4 ${uploadJob.status === 'FAILED' ? 'border-danger' : uploadJob.status === 'PROCESSED' ? 'border-success' : 'border-info'}`}>
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            {uploadJob.status === 'PENDING' && <><FiClock className="me-2 text-info" /> File Uploaded (Action Required)</>}
                                            {uploadJob.status === 'PROCESSED' && <><FiCheckCircle className="me-2 text-success" /> Attendance Updated Successfully</>}
                                            {uploadJob.status === 'FAILED' && <><FiAlertCircle className="me-2 text-danger" /> Processing Failed</>}
                                        </h6>
                                        <p className="small text-muted mb-0">Job ID: {uploadJob.id} | The file is saved, but attendance records are not updated yet.</p>
                                    </div>
                                    <div>
                                        {uploadJob.status === 'PENDING' && (
                                            <button
                                                className="btn btn-warning btn-sm fw-bold shadow-sm"
                                                onClick={() => handleProcessJob(uploadJob.id)}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? 'Applying...' : 'Apply Data to DB'}
                                            </button>
                                        )}
                                        <button className="btn btn-link btn-sm text-secondary" onClick={() => setUploadJob(null)}>Dismiss</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CSV PREVIEW MODAL / SECTION */}
                    {csvPreview && (
                        <div className="mb-4 fade-in">
                            <div className="card border-0 shadow-sm border-start border-primary border-4">
                                <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                                        <FiUpload className="me-2 text-primary" />
                                        Confirm CSV Import
                                    </h5>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-secondary btn-sm" onClick={handleCancelPreview}>
                                            <FiX className="me-1" /> Cancel
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            disabled={csvPreview.summary.errors > 0 || csvPreview.summary.valid === 0}
                                            onClick={handleConfirmImport}
                                        >
                                            <FiCheckCircle className="me-1" />
                                            Import {csvPreview.summary.valid} Valid Rows
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body bg-light p-3">

                                    {/* Suspicious Warnings */}
                                    {csvPreview.summary.warnings && csvPreview.summary.warnings.length > 0 && (
                                        <div className="alert alert-warning d-flex align-items-center mb-3">
                                            <FiAlertTriangle className="me-2 text-warning fs-4" />
                                            <div>
                                                <strong>Suspicious Pattern Detected:</strong>
                                                <ul className="mb-0 ps-3">
                                                    {csvPreview.summary.warnings.map((w, i) => (
                                                        <li key={i}>{w}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Summary Stats */}
                                    <div className="d-flex gap-3 mb-3">
                                        <div className="badge bg-white text-dark shadow-sm p-2 border">Total: {csvPreview.summary.total}</div>
                                        <div className="badge bg-success bg-opacity-10 text-success p-2 border border-success">Valid: {csvPreview.summary.valid}</div>
                                        <div className={`badge p-2 border ${csvPreview.summary.errors > 0 ? 'bg-danger bg-opacity-10 text-danger border-danger' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                            Errors: {csvPreview.summary.errors}
                                        </div>
                                    </div>

                                    <div className="table-responsive bg-white border rounded" style={{ maxHeight: '300px' }}>
                                        <table className="table table-sm table-hover mb-0 sticky-top-header">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Line</th>
                                                    <th>Student ID</th>
                                                    <th>Status</th>
                                                    <th>Remark</th>
                                                    <th>Validation</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {csvPreview.rows.map((row, i) => (
                                                    <tr key={i} className={!row.isValid ? 'table-danger' : ''}>
                                                        <td className="text-muted small">{row.line}</td>
                                                        <td>{row.studentId}</td>
                                                        <td>
                                                            <span className={`badge ${!row.isValid ? 'bg-secondary' : row.status === 'PRESENT' ? 'bg-success' : 'bg-warning'} bg-opacity-25 text-dark`}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td className="small text-muted text-truncate" style={{ maxWidth: '150px' }} title={row.remark}>{row.remark}</td>
                                                        <td>
                                                            {row.isValid ? (
                                                                <span className="text-success small fw-bold">
                                                                    <FiCheckCircle /> OK
                                                                </span>
                                                            ) : (
                                                                <div className="text-danger small fw-bold">
                                                                    <FiAlertCircle className="me-1" />
                                                                    {row.errors.join(', ')}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-2 text-muted small fst-italic">
                                        * Only rows marked "OK" will be imported. Any error blocks the entire upload for better data integrity.
                                        <br />
                                        <span className="fw-bold text-danger">Strict Mode: Import button disabled if ANY error exists.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Attendance Table */}
                    {selectedSessionId && !csvPreview ? (
                        <div className="fade-in">
                            <div className="d-flex justify-content-between mb-3">
                                <h5 className="fw-bold">Marking for: {sessions.find(s => s.id === selectedSessionId)?.title}</h5>
                                <button className="btn btn-dark btn-sm" onClick={() => setSelectedSessionId('')}>Change Session</button>
                            </div>

                            {/* Stats */}
                            <div className="mb-4">
                                <AttendanceStats stats={stats} />
                            </div>

                            {/* Table */}
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body p-0">
                                    <AttendanceTable
                                        students={students.map(s => {
                                            // Check if student is already marked in the store (e.g. Online)
                                            // attendanceList from useAttendanceStore might be for the LIVE session only if we are in that context.
                                            // But OfflineSync might be used outside of a "started" live session context if we just want to upload data.
                                            // We should check if attendanceList actually pertains to selectedSessionId.
                                            const existingRecord = attendanceList.filter(r => r.sessionId === selectedSessionId).find(r => r.studentId === s.id);
                                            const isOnline = existingRecord?.mode === 'ONLINE';

                                            return {
                                                ...s,
                                                studentId: s.id,
                                                // If Online, use store status. Else use local map (defaulting to UNMARKED if missing, though we init to PRESENT)
                                                status: isOnline ? existingRecord.status : (attendanceMap[s.id] || 'UNMARKED'),
                                                mode: isOnline ? 'ONLINE' : 'OFFLINE',
                                                lateMinutes: lateMinutesMap[s.id],
                                                remarks: ''
                                            };
                                        })}
                                        onStatusChange={handleStatusChange}
                                        onLateMinutesChange={(id, mins) => setLateMinutesMap(prev => ({ ...prev, [id]: mins }))}
                                        onRemarkChange={() => { }}
                                        isEditable={true}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-success btn-lg w-100 rounded-pill shadow-sm"
                                onClick={handleSave}
                            >
                                <FiSave className="me-2" /> Save Offline Attendance
                            </button>
                        </div>
                    ) : null}
                </>
            )}

            {/* Queue Tab */}
            {activeTab === 'QUEUE' && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold">Pending Records ({queue.length})</h5>
                        <div>
                            <button className="btn btn-outline-danger btn-sm me-2" onClick={handleClearQueue}>
                                <FiTrash2 /> Clear
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={handleSync}>
                                <FiRefreshCw /> Sync Now
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Student ID</th>
                                    <th>Status</th>
                                    <th>Session</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queue.map((r, i) => (
                                    <tr key={i}>
                                        <td className="ps-4 fw-medium">{r.studentId}</td>
                                        <td>
                                            <span className={`badge bg-${r.status === 'PRESENT' ? 'success' : r.status === 'LATE' ? 'warning' : 'danger'} bg-opacity-10 text-${r.status === 'PRESENT' ? 'success' : r.status === 'LATE' ? 'warning' : 'danger'}`}>
                                                {r.status}
                                            </span>
                                            {r.status === 'LATE' && r.minutesLate && (
                                                <div className="small text-danger fw-bold mt-1" style={{ fontSize: '0.7rem' }}>
                                                    +{r.minutesLate} min
                                                </div>
                                            )}
                                        </td>
                                        <td className="small text-muted">{r.attendanceSessionId || r.sessionId}</td>
                                        <td className="text-muted small">
                                            {r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {queue.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">Queue is empty</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* History Tab */}
            {activeTab === 'HISTORY' && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold">Upload Job History ({uploadJobs.length})</h5>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                                if (selectedBatch) {
                                    attendanceService.getUploadJobsByBatch(selectedBatch).then(setUploadJobs);
                                }
                            }}
                        >
                            <FiRefreshCw className="me-1" /> Refresh
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Job ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Session ID</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...uploadJobs].reverse().map((job) => (
                                    <tr key={job.id}>
                                        <td className="ps-4 fw-medium text-primary">#{job.id}</td>
                                        <td className="small">{job.attendanceDate}</td>
                                        <td>
                                            <span className={`badge bg-${job.status === 'PROCESSED' ? 'success' : job.status === 'FAILED' ? 'danger' : 'info'} bg-opacity-10 text-${job.status === 'PROCESSED' ? 'success' : job.status === 'FAILED' ? 'danger' : 'info'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="small text-muted">{job.sessionId || 'N/A'}</td>
                                        <td>
                                            {job.status === 'PENDING' && (
                                                <button
                                                    className="btn btn-primary btn-xs py-0 px-2"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={() => handleProcessJob(job.id)}
                                                    disabled={isUploading}
                                                >
                                                    Apply Data
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {uploadJobs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">No upload history found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
export default OfflineSync;
