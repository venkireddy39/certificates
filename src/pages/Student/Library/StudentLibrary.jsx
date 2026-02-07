import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import {
    Book,
    Clock,
    Info,
    Search,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Bookmark,
    Filter,
    Layers,
    ExternalLink
} from 'lucide-react';
import '../StudentDashboard.css';
import './StudentLibrary.css';

const StudentLibrary = () => {
    const [books, setBooks] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Issued');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksData, historyData] = await Promise.all([
                    studentService.getMyLibraryBooks(),
                    studentService.getLibraryHistory()
                ]);
                setBooks(Array.isArray(booksData) ? booksData : []);
                setHistory(Array.isArray(historyData) ? historyData : []);
            } catch (error) {
                console.error("Failed to fetch library data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = {
        issued: books.length,
        reserved: 0,
        dueSoon: books.filter(b => b.status === 'Overdue' || b.status === 'Due Today').length
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const renderBookCard = (book) => (
        <div className="col-12 col-xl-6" key={book.id}>
            <div className="card border-0 shadow-sm p-0 overflow-hidden d-flex flex-row transition-all hover-translate-y" style={{ background: 'var(--surface)' }}>
                <div className="book-thumbnail position-relative" style={{ width: '160px', height: '220px', flexShrink: 0 }}>
                    <img src={book.cover || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80`} className="w-100 h-100 object-fit-cover" alt={book.title} />
                    <div className={`status-ribbon position-absolute top-0 start-0 px-3 py-1 smaller fw-bold text-white ${book.status === 'Overdue' ? 'bg-danger' : book.status === 'Returned' ? 'bg-secondary' : 'bg-success'}`}>
                        {book.status}
                    </div>
                </div>
                <div className="flex-grow-1 p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 className="fw-bold mb-1 text-body line-clamp-2">{book.title}</h5>
                            <p className="text-muted smaller mb-0 fw-bold">{book.author || 'Academic Authors'}</p>
                        </div>
                        <button className="btn btn-icon-glass border-0 text-muted p-0"><Bookmark size={18} /></button>
                    </div>

                    <div className="mt-4 row g-3">
                        <div className="col-6">
                            <div className="smaller text-muted uppercase fw-bold opacity-50">Issued On</div>
                            <div className="small text-body fw-bold font-monospace mt-1">{book.issueDate || '12 Jan 2024'}</div>
                        </div>
                        <div className="col-6">
                            <div className="smaller text-muted uppercase fw-bold opacity-50">
                                {book.status === 'Returned' ? 'Returned On' : 'Due Date'}
                            </div>
                            <div className={`small fw-bold font-monospace mt-1 ${book.status === 'Overdue' ? 'text-danger' : book.status === 'Returned' ? 'text-muted' : 'text-primary'}`}>
                                {book.status === 'Returned' ? book.returnDate : book.dueDate || '26 Jan 2024'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto d-flex gap-2">
                        {book.status === 'Returned' ? (
                            <button className="btn btn-outline-secondary rounded-pill flex-grow-1 smaller fw-bold py-2">Re-issue Request</button>
                        ) : (
                            <button className="btn btn-secondary rounded-pill flex-grow-1 smaller fw-bold py-2 shadow-sm text-white">Request Renewal</button>
                        )}
                        <button className="btn btn-outline-secondary rounded-pill px-3 py-2 smaller d-flex align-items-center justify-content-center" style={{ borderColor: 'var(--border)' }}>
                            <ExternalLink size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="student-library-container animate-fade-in text-body">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-7">
                    <h2 className="fw-bold mb-1 text-body">Knowledge Repository</h2>
                    <p className="text-muted mb-0 fw-medium">Access over 50,000+ digital resources and track your borrows.</p>
                </div>
                <div className="col-12 col-md-5 text-md-end">
                    <div className="search-box-premium-v2 card flex-row rounded-pill px-4 py-2 d-flex align-items-center shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <Search size={18} className="text-muted me-3" />
                        <input type="text" placeholder="Search titles, authors, ISBN..." className="bg-transparent border-0 text-body smaller outline-none w-100 fw-medium" />
                        <button className="btn btn-link text-muted p-0 ms-2 hover-scale"><Filter size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="row g-4 mb-5">
                {[
                    { label: 'Books Issued', value: stats.issued, icon: Book, color: 'secondary' },
                    { label: 'Reserved', value: stats.reserved, icon: Bookmark, color: 'warning' },
                    { label: 'Overdue / Priority', value: stats.dueSoon, icon: AlertCircle, color: 'danger' }
                ].map((stat, i) => (
                    <div className="col-12 col-md-4" key={i}>
                        <div className="card border-0 shadow-sm p-4 d-flex flex-row align-items-center gap-4 h-100" style={{ background: 'var(--surface)' }}>
                            <div className={`p-3 bg-${stat.color} bg-opacity-10 text-${stat.color} rounded-4`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <div className="smaller text-muted uppercase fw-bold tracking-wider opacity-75">{stat.label}</div>
                                <div className="h3 fw-bold text-body mb-0">{stat.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* System Notification */}
            <div className="card mb-5 p-3 d-flex flex-row align-items-center gap-3 border-secondary border-opacity-20 shadow-sm" style={{ background: 'rgba(168, 85, 247, 0.05)' }}>
                <div className="p-2 bg-secondary bg-opacity-10 rounded-pill text-secondary"><Info size={20} /></div>
                <div className="smaller text-muted fw-bold">
                    <strong className="text-body">Active Borrowing Limit:</strong> You have used <span className="text-secondary">{stats.issued}/3</span> of your physical book slots.
                </div>
                <button className="btn btn-link smaller text-secondary ms-auto text-decoration-none fw-bold p-0">View Terms</button>
            </div>

            {/* Content Explorer Sections */}
            <div className="explorer-tabs mb-4 d-flex gap-4 border-bottom" style={{ borderColor: 'var(--border)' }}>
                {['Issued', 'History', 'Reserved', 'Collections'].map(tab => (
                    <button
                        key={tab}
                        className={`explorer-tab-btn pb-3 position-relative bg-transparent border-0 smaller fw-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'text-secondary active' : 'text-muted opacity-50'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                        {activeTab === tab && <div className="active-line shadow-sm" style={{ background: 'var(--student-secondary)', height: '3px', position: 'absolute', bottom: '-1px', left: 0, right: 0 }}></div>}
                    </button>
                ))}
            </div>

            <div className="row g-4 pt-2">
                {activeTab === 'Issued' && (
                    <>
                        {books.map(renderBookCard)}
                        {books.length === 0 && (
                            <div className="col-12 py-5 text-center card border-dashed" style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                                <div className="p-5 text-muted">
                                    <Layers size={64} className="opacity-10 mb-4" />
                                    <h4 className="fw-bold m-0 text-body">No Active Borrows</h4>
                                    <p className="mt-2 mb-4 fw-medium text-muted">You currently have no books issued to your ID.</p>
                                    <button className="btn btn-secondary rounded-pill px-5 py-2 fw-bold shadow-sm text-white" onClick={() => setActiveTab('Collections')}>Browse Digital Library</button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'History' && (
                    <>
                        {history.map(renderBookCard)}
                        {history.length === 0 && (
                            <div className="col-12 py-5 text-center card border-0 shadow-sm" style={{ background: 'var(--surface)' }}>
                                <div className="p-5 text-muted">
                                    <Clock size={64} className="opacity-10 mb-4" />
                                    <h4 className="fw-bold m-0 text-body">No History Yet</h4>
                                    <p className="mt-2 mb-0 fw-medium text-muted">Borrowing records will appear here as you return books.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {(activeTab === 'Reserved' || activeTab === 'Collections') && (
                    <div className="col-12 py-5 text-center">
                        <div className="card p-5 border-0 shadow-sm" style={{ background: 'var(--surface)' }}>
                            <div className="spinner-border text-secondary mx-auto mb-4" role="status"></div>
                            <h5 className="text-muted opacity-50 fw-normal">Section: <span className="text-body fw-bold">{activeTab}</span> is being indexed...</h5>
                            <p className="smaller text-muted mt-2 fw-medium">Connecting to institutional digital servers.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentLibrary;
