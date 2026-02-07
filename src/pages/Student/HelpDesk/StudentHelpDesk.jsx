import React, { useState } from 'react';
import {
    LifeBuoy,
    MessageCircle,
    Plus,
    Search,
    Clock,
    ChevronRight,
    Mail,
    Phone,
    Info,
    HelpCircle,
    ArrowRight,
    X,
    Upload,
    Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../StudentDashboard.css';
import './StudentHelpDesk.css';

const StudentHelpDesk = () => {
    const [tickets, setTickets] = useState([
        { id: 'TKT-1024', subject: 'Difficulty accessing Course Materials', category: 'Academic', status: 'Resolved', date: '2 days ago' },
        { id: 'TKT-1028', subject: 'Hostel Wifi not working in Block A', category: 'Hostel', status: 'Open', date: '5 hours ago' },
        { id: 'TKT-1029', subject: 'Fee Payment Receipt not generated', category: 'Finance', status: 'Pending', date: '1 hour ago' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({
        category: '',
        subject: '',
        description: '',
        priority: 'Normal'
    });

    const faqs = [
        { q: "How do I reset my portal password?", a: "You can reset your password from the login screen by clicking 'Forgot Password' or through your Profile settings." },
        { q: "Where can I find my course completion certificates?", a: "Go to the 'Certificates' section in the sidebar. Once you complete a course, it will be automatically generated." },
        { q: "Who should I contact for attendance corrections?", a: "Please reach out to your respective Batch Coordinator or file a ticket under the 'Attendance' category." }
    ];

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
        setTickets([{
            id: ticketId,
            ...newTicket,
            status: 'Open',
            date: 'Just now'
        }, ...tickets]);
        setIsModalOpen(false);
        setNewTicket({ category: '', subject: '', description: '', priority: 'Normal' });
    };

    return (
        <div className="student-helpdesk-container animate-fade-in">
            {/* Hero Support Header */}
            <div className="helpdesk-hero glass-card p-5 mb-5 overflow-hidden position-relative rounded-4">
                <div className="hero-glow"></div>
                <div className="row align-items-center position-relative z-1">
                    <div className="col-12 col-lg-7">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary shadow-glow">
                                <LifeBuoy size={32} />
                            </div>
                            <h2 className="fw-bold m-0 text-white">Support Ecosystem</h2>
                        </div>
                        <p className="text-secondary mb-4 fs-5 opacity-75">
                            Find answers instantly through our knowledge base or get personalized help from our support specialists.
                        </p>
                        <div className="search-bar-premium glass-card rounded-pill p-2 d-flex align-items-center shadow-lg" style={{ maxWidth: '450px' }}>
                            <Search size={20} className="text-secondary ms-3" />
                            <input
                                type="text"
                                className="form-control border-0 bg-transparent text-white py-2 px-3 shadow-none smaller"
                                placeholder="Describe your issue or ask a question..."
                            />
                            <button className="btn btn-primary rounded-pill px-4 smaller fw-bold py-2">Search</button>
                        </div>
                    </div>
                    <div className="col-12 col-lg-5 d-none d-lg-block">
                        <div className="d-flex flex-column gap-3 align-items-end">
                            <div className="support-contact-chip glass-card p-3 rounded-4 d-flex align-items-center gap-3 border-opacity-10 hover-bg-glass w-75">
                                <div className="p-2 bg-info bg-opacity-10 text-info rounded-3"><Mail size={18} /></div>
                                <div>
                                    <div className="smaller text-secondary font-monospace">OFFICIAL EMAIL</div>
                                    <div className="small fw-bold text-white">support@lms.edu</div>
                                </div>
                            </div>
                            <div className="support-contact-chip glass-card p-3 rounded-4 d-flex align-items-center gap-3 border-opacity-10 hover-bg-glass w-75">
                                <div className="p-2 bg-success bg-opacity-10 text-success rounded-3"><Phone size={18} /></div>
                                <div>
                                    <div className="smaller text-secondary font-monospace">24/7 HOTLINE</div>
                                    <div className="small fw-bold text-white">+1 (800) 123-4567</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-5">
                <div className="col-12 col-xl-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold m-0 text-white">My Conversations</h5>
                        <button
                            className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-primary transition-all active-scale"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus size={16} /> Raise New Ticket
                        </button>
                    </div>

                    <div className="d-flex flex-column gap-3 mb-5">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className={`glass-card ticket-item-v2 p-4 border-opacity-5 hover-bg-glass cursor-pointer rounded-4 ${ticket.status.toLowerCase()}`}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="badge bg-white bg-opacity-5 text-secondary smaller font-monospace px-2 py-1">{ticket.id}</span>
                                            <span className="smaller text-secondary opacity-25">|</span>
                                            <span className="smaller text-primary fw-600 uppercase tracking-wider">{ticket.category}</span>
                                        </div>
                                        <h6 className="fw-bold text-white mb-2 text-truncate pe-4">{ticket.subject}</h6>
                                        <div className="d-flex align-items-center gap-3 text-secondary smaller">
                                            <span className="d-flex align-items-center gap-1"><Clock size={12} /> Last activity: {ticket.date}</span>
                                            <span className="d-flex align-items-center gap-1"><MessageCircle size={12} /> 2 responses</span>
                                        </div>
                                    </div>
                                    <div className="text-end flex-shrink-0">
                                        <span className={`badge-status-pill ${ticket.status.toLowerCase()}`}>
                                            {ticket.status}
                                        </span>
                                        <div className="mt-3 text-secondary opacity-50">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h5 className="fw-bold mb-4 text-white">Frequent Knowledge Items</h5>
                    <div className="row g-3 px-1">
                        {faqs.map((faq, i) => (
                            <div key={i} className="col-12 col-md-6 mb-3">
                                <div className="glass-card faq-box-v2 p-4 h-100 border-opacity-5 rounded-4 transition-all">
                                    <div className="d-flex gap-3 mb-2">
                                        <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary h-auto d-flex align-items-center">
                                            <HelpCircle size={18} />
                                        </div>
                                        <h6 className="fw-bold text-white mb-0 small mt-1">{faq.q}</h6>
                                    </div>
                                    <p className="text-secondary smaller mb-0 ps-5 ms-1 opacity-75">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="col-12 col-xl-4">
                    <div className="glass-card p-4 mb-4 border-primary border-opacity-10 bg-primary bg-opacity-2 rounded-4">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-white">
                            <Info size={16} className="text-primary" />
                            Pre-Submission Guidelines
                        </h6>
                        <div className="guidelines-list d-flex flex-column gap-3 mt-3">
                            {[
                                { id: '01', text: 'Check the FAQ section before raising a ticket.' },
                                { id: '02', text: 'Include transaction IDs for finance queries.' },
                                { id: '03', text: 'Official response time is 24-48 business hours.' }
                            ].map(item => (
                                <div className="d-flex gap-3" key={item.id}>
                                    <span className="small text-primary fw-bold font-monospace">{item.id}.</span>
                                    <p className="smaller text-secondary m-0 opacity-75">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-4 rounded-4">
                        <h6 className="fw-bold mb-4 text-white">Service Category Map</h6>
                        <div className="d-flex flex-column gap-2">
                            {['Academics & Grading', 'Financial Services', 'Hostel Maintenance', 'Library Assistance'].map(topic => (
                                <button key={topic} className="btn-category-map w-100 text-start d-flex justify-content-between align-items-center hover-translate-x px-3 py-3 rounded-3">
                                    <span className="smaller">{topic}</span>
                                    <ArrowRight size={14} className="opacity-0 transition-all icon-arrow" />
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-top border-white border-opacity-5 text-center">
                            <p className="smaller text-secondary mb-3">Still don't see what you need?</p>
                            <button className="btn btn-outline-light border-opacity-10 w-100 rounded-pill py-2 smaller transition-all hover-translate-y">Contact Academic Office</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Raise Ticket Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.9)', zIndex: 1100, backdropFilter: 'blur(10px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card p-0 rounded-4 border border-white border-opacity-10 shadow-2xl overflow-hidden"
                            style={{ maxWidth: '600px', width: '100%', background: '#0f172a' }}
                        >
                            <div className="modal-header d-flex justify-content-between align-items-center p-4 border-bottom border-white border-opacity-5">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
                                        <Plus size={20} />
                                    </div>
                                    <h5 className="fw-bold m-0 text-white">Raise a New Ticket</h5>
                                </div>
                                <button
                                    className="btn btn-link p-0 text-secondary hover-white transition-all"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitTicket} className="p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="smaller text-secondary mb-2 fw-600 font-monospace uppercase px-1">Category</label>
                                        <select
                                            className="form-select glass-input shadow-none"
                                            required
                                            value={newTicket.category}
                                            onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Academic">Academics</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Hostel">Hostel</option>
                                            <option value="Technical">Technical Support</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="smaller text-secondary mb-2 fw-600 font-monospace uppercase px-1">Priority</label>
                                        <div className="d-flex gap-2">
                                            {['Normal', 'High', 'Urgent'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    className={`btn btn-sm flex-grow-1 rounded-pill smaller py-2 border border-opacity-10 ${newTicket.priority === p ? 'btn-primary shadow-sm' : 'btn-outline-light opacity-50'}`}
                                                    onClick={() => setNewTicket({ ...newTicket, priority: p })}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="smaller text-secondary mb-2 fw-600 font-monospace uppercase px-1">Subject</label>
                                        <input
                                            type="text"
                                            className="form-control glass-input shadow-none py-2 px-3"
                                            placeholder="What can we help you with?"
                                            required
                                            value={newTicket.subject}
                                            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="smaller text-secondary mb-2 fw-600 font-monospace uppercase px-1">Detailed Description</label>
                                        <textarea
                                            className="form-control glass-input shadow-none py-3 px-3"
                                            rows="4"
                                            placeholder="Please provide details about your issue..."
                                            required
                                            value={newTicket.description}
                                            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <div className="file-upload-mock d-flex align-items-center justify-content-center p-4 rounded-4 border border-dashed border-white border-opacity-10 bg-white bg-opacity-2 cursor-pointer transition-all hover-bg-glass">
                                            <div className="text-center">
                                                <Upload size={24} className="text-primary opacity-50 mb-2 mx-auto" />
                                                <div className="smaller text-secondary fw-bold">Click to upload attachments</div>
                                                <div className="smaller text-secondary opacity-50 mt-1">PDF, JPG, PNG (Max 5MB)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 d-flex gap-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-light border-opacity-10 rounded-pill px-4 py-2 flex-grow-1 smaller transition-all"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-pill px-5 py-2 flex-grow-1 smaller d-flex align-items-center justify-content-center gap-2 shadow-primary transition-all active-scale"
                                    >
                                        Submit Ticket <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentHelpDesk;
