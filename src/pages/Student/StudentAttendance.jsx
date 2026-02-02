import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';

const StudentAttendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentService.getMyAttendance().then(data => {
            setRecords(data);
            setLoading(false);
        });
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Present': return 'bg-success-subtle text-success';
            case 'Absent': return 'bg-danger-subtle text-danger';
            case 'Late': return 'bg-warning-subtle text-warning';
            default: return 'bg-secondary-subtle text-secondary';
        }
    };

    if (loading) return <div className="p-4 text-center">Loading attendance...</div>;

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">My Attendance</h2>
                <div className="bg-white p-2 rounded shadow-sm d-flex gap-3">
                    <div className="text-center px-2 border-end">
                        <div className="small text-muted">Total</div>
                        <div className="fw-bold">{records.length}</div>
                    </div>
                    <div className="text-center px-2 border-end">
                        <div className="small text-muted">Present</div>
                        <div className="fw-bold text-success">{records.filter(r => r.status === 'Present').length}</div>
                    </div>
                    <div className="text-center px-2">
                        <div className="small text-muted">Absent</div>
                        <div className="fw-bold text-danger">{records.filter(r => r.status === 'Absent').length}</div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 ps-4">Date</th>
                                    <th className="border-0">Subject / Class</th>
                                    <th className="border-0">Timing</th>
                                    <th className="border-0 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map(record => (
                                    <tr key={record.id}>
                                        <td className="ps-4 fw-medium">{record.date}</td>
                                        <td>{record.subject}</td>
                                        <td className="text-secondary small">
                                            {record.checkIn} - {record.checkOut}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge rounded-pill fw-normal px-3 ${getStatusBadge(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {records.length === 0 && (
                        <div className="p-5 text-center text-muted">
                            No attendance records found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;
