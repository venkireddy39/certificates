import React, { useState } from 'react';
import {
    LifeBuoy,
    MessageCircle,
    Plus,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Mail,
    Phone,
    Info,
    HelpCircle
} from 'lucide-react';
import './StudentHelpDesk.css';

const StudentHelpDesk = () => {
    const [tickets] = useState([
        { id: 'TKT-1024', subject: 'Difficulty accessing Course Materials', category: 'Academic', status: 'Resolved', date: '2 days ago' },
        { id: 'TKT-1028', subject: 'Hostel Wifi not working in Block A', category: 'Hostel', status: 'Open', date: '5 hours ago' },
        { id: 'TKT-1029', subject: 'Fee Payment Receipt not generated', category: 'Finance', status: 'Pending', date: '1 hour ago' },
    ]);

    const faqs = [
        { q: "How do I reset my portal password?", a: "You can reset your password from the login screen by clicking 'Forgot Password' or through your Profile settings." },
        { q: "Where can I find my course completion certificates?", a: "Go to the 'Certificates' section in the sidebar. Once you complete a course, it will be automatically generated." },
        { q: "Who should I contact for attendance corrections?", a: "Please reach out to your respective Batch Coordinator or file a ticket under the 'Attendance' category." }
    ];

    return (
        <div className="student-helpdesk-container">
            {/* Header / Hero Section */}
            <div className="helpdesk-header-glass">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <h2 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <LifeBuoy size={32} className="text-primary" />
                            Student Support Center
                        </h2>
                        <p className="text-secondary mb-4 fs-5">
                            How can we help you today? Search our knowledge base or create a support ticket.
                        </p>
                        <div className="position-relative" style={{ maxWidth: '500px' }}>
                            <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
                            <input
                                type="text"
                                className="form-control bg-dark border-secondary text-white py-3 ps-5 rounded-pill"
                                placeholder="Search for answers..."
                            />
                        </div>
                    </div>
                    <div className="col-lg-5 d-none d-lg-block">
                        <div className="d-flex flex-column gap-3">
                            <div className="contact-pill shadow-sm">
                                <div className="icon-circle"><Mail size={18} /></div>
                                <div>
                                    <div className="x-small text-secondary">EMAIL US</div>
                                    <div className="small fw-bold">support@lms.edu</div>
                                </div>
                            </div>
                            <div className="contact-pill shadow-sm">
                                <div className="icon-circle"><Phone size={18} /></div>
                                <div>
                                    <div className="x-small text-secondary">CALL US</div>
                                    <div className="small fw-bold">+1 (800) 123-4567</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Active Support Tickets */}
                <div className="col-12 col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold m-0">My Support Tickets</h5>
                        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-4">
                            <Plus size={16} /> New Ticket
                        </button>
                    </div>

                    <div className="d-flex flex-column gap-3 mb-5">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className={`ticket-card ${ticket.status.toLowerCase()}`}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="ticket-id">{ticket.id}</span>
                                            <span className="text-secondary x-small">•</span>
                                            <span className="text-secondary x-small">{ticket.category}</span>
                                        </div>
                                        <h6 className="fw-bold text-white mb-2">{ticket.subject}</h6>
                                        <div className="d-flex align-items-center gap-3 text-secondary x-small">
                                            <span className="d-flex align-items-center gap-1"><Clock size={12} /> {ticket.date}</span>
                                            <span className="d-flex align-items-center gap-1"><MessageCircle size={12} /> 2 Comments</span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <span className={`status-badge-help status-${ticket.status.toLowerCase()} mb-2 d-inline-block`}>
                                            {ticket.status}
                                        </span>
                                        <ChevronRight size={18} className="text-secondary ms-2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h5 className="fw-bold mb-4">Frequently Asked Questions</h5>
                    <div className="row g-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="col-12">
                                <div className="faq-card">
                                    <div className="d-flex gap-3">
                                        <div className="mt-1"><HelpCircle size={18} className="text-primary" /></div>
                                        <div>
                                            <h6 className="fw-bold text-white mb-2">{faq.q}</h6>
                                            <p className="text-secondary small mb-0">{faq.a}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="col-12 col-lg-4">
                    <div className="report-stat-card mb-4" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <Info size={18} className="text-primary" />
                            Support Guidelines
                        </h5>
                        <ul className="list-unstyled mb-0 small text-secondary">
                            <li className="mb-3">• Academic queries should be directed to faculty first.</li>
                            <li className="mb-3">• Tickets are usually responded to within 24 business hours.</li>
                            <li className="mb-3">• For urgent campus issues, please visit the Admin Block.</li>
                            <li className="mb-0">• Ensure you attach screenshots for technical issues.</li>
                        </ul>
                    </div>

                    <div className="report-stat-card">
                        <h5 className="fw-bold mb-4">Popular Topics</h5>
                        <div className="d-grid gap-2">
                            {['Fee Payment Guide', 'Exam Registration', 'Library Rules', 'Hostel Leave Policy'].map(topic => (
                                <button key={topic} className="btn btn-dark bg-opacity-25 border-0 text-start text-secondary small py-3 px-3 d-flex justify-content-between align-items-center">
                                    {topic}
                                    <ChevronRight size={14} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentHelpDesk;
