import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';

const StudentLibrary = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentService.getMyLibraryBooks().then(data => {
            setBooks(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-4 text-center">Loading library records...</div>;

    return (
        <div className="container-fluid p-0">
            <h2 className="fw-bold mb-4">My Library Books</h2>

            <div className="alert alert-info border-0 shadow-sm d-flex align-items-center gap-3">
                <i className="bi bi-info-circle-fill fs-4"></i>
                <div>
                    <strong>Library Policy:</strong> You can issue up to 3 books at a time. Please return books on time to avoid fines.
                </div>
            </div>

            <h5 className="mb-3 text-secondary">Currently Issued</h5>
            <div className="row g-4 mb-5">
                {books.map(book => (
                    <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={book.id}>
                        <div className="card h-100 border-0 shadow-sm overflow-hidden">
                            <div className="row g-0 h-100">
                                <div className="col-4 bg-light d-flex align-items-center justify-content-center">
                                    <img src={book.cover} alt={book.title} className="img-fluid p-2" style={{ maxHeight: '140px' }} />
                                </div>
                                <div className="col-8">
                                    <div className="card-body p-3 d-flex flex-column h-100">
                                        <h6 className="card-title fw-bold mb-1 text-truncate" title={book.title}>{book.title}</h6>
                                        <div className="text-secondary small mb-2 text-truncate">{book.author}</div>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between small text-muted mb-1">
                                                <span>Issued:</span>
                                                <span>{book.issueDate}</span>
                                            </div>
                                            <div className="d-flex justify-content-between small fw-bold text-danger mb-2">
                                                <span>Due:</span>
                                                <span>{book.dueDate}</span>
                                            </div>
                                            <span className={`badge w-100 ${book.status === 'Overdue' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                                                {book.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {books.length === 0 && (
                <div className="text-center py-5 text-muted border rounded-3 bg-white">
                    <i className="bi bi-book fs-1 d-block mb-3"></i>
                    You have no books currently issued.
                </div>
            )}
        </div>
    );
};

export default StudentLibrary;
