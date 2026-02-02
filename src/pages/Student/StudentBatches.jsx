import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';

const StudentBatches = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentService.getMyBatches().then(data => {
            setBatches(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-4 text-center">Loading batches...</div>;

    return (
        <div className="container-fluid p-0">
            <h2 className="fw-bold mb-4">My Batches</h2>

            <div className="row g-4">
                {batches.map(batch => (
                    <div className="col-12 col-lg-6" key={batch.id}>
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 className="fw-bold mb-1">{batch.name}</h5>
                                        <div className="text-secondary small">Instructor: {batch.instructor}</div>
                                    </div>
                                    <span className={`badge ${batch.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} rounded-pill`}>
                                        {batch.status}
                                    </span>
                                </div>

                                <div className="d-flex flex-column gap-2 mb-4">
                                    <div className="d-flex align-items-center gap-3 text-secondary">
                                        <i className="bi bi-clock"></i>
                                        <span>{batch.timing}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 text-secondary">
                                        <i className="bi bi-calendar3"></i>
                                        <span>
                                            {batch.days.map(day => (
                                                <span key={day} className="badge bg-light text-dark border me-1 fw-normal">{day}</span>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 text-secondary">
                                        <i className="bi bi-flag"></i>
                                        <span>Starts: {batch.startDate}</span>
                                    </div>
                                </div>

                                <div className="d-grid">
                                    <button className="btn btn-outline-primary">View Schedule</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {batches.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-people fs-1 d-block mb-3"></i>
                    You have not joined any batches.
                </div>
            )}
        </div>
    );
};

export default StudentBatches;
