import React, { useState, useEffect } from 'react';
import {
    Home, Coffee, Users, MessageSquare, AlertCircle, Info,
    ChevronRight, CheckCircle2, MapPin, Phone,
    Clock, Calendar, FileText, Download, ShieldCheck,
    Zap, Hammer, Sofa, Droplets, ArrowRight, X, Wind,
    Wifi, Sparkles, HelpCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../Library/context/ToastContext';
import { studentService } from '../../../services/studentService';
import '../StudentDashboard.css';
import './StudentHostel.css';

const StudentHostel = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null);
    const [hostelData, setHostelData] = useState(null);

    const [maintenanceForm, setMaintenanceForm] = useState({
        category: '',
        urgency: 'Normal',
        description: ''
    });

    const [outpassForm, setOutpassForm] = useState({
        destination: '',
        fromDate: '',
        toDate: '',
        reason: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await studentService.getHostelData();
                setHostelData(data);
            } catch (error) {
                toast.error("Failed to load hostel data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmitMaintenance = async (e) => {
        e.preventDefault();
        if (!maintenanceForm.category) return toast.info("Please select a category");

        try {
            await studentService.submitMaintenanceTicket(maintenanceForm);
            toast.success("Maintenance ticket raised successfully!");
            setActiveModal(null);
            setMaintenanceForm({ category: '', urgency: 'Normal', description: '' });
        } catch (error) {
            toast.error("Failed to submit request.");
        }
    };

    const handleSubmitOutpass = async (e) => {
        e.preventDefault();
        try {
            await studentService.submitOutpassApplication(outpassForm);
            toast.success("Outpass application submitted for approval!");
            setActiveModal(null);
            setOutpassForm({ destination: '', fromDate: '', toDate: '', reason: '' });
        } catch (error) {
            toast.error("Failed to submit application.");
        }
    };

    const handleDownloadReceipt = async (month) => {
        toast.info(`Preparing receipt for ${month}...`);
        try {
            await studentService.downloadHostelReceipt(month);
            setTimeout(() => toast.success("Receipt downloaded!"), 1000);
        } catch (error) {
            toast.error("Failed to download receipt.");
        }
    };

    const handleAction = (message) => {
        toast.info(message);
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center min-vh-50">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!hostelData) return null;

    return (
        <div className="container-fluid p-4 student-hostel-container">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-8">
                    <h2 className="fw-bold mb-1">Campus Living</h2>
                    <p className="text-muted mb-0">Manage your residential records, mess menus, and room services.</p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                    <button
                        className="btn btn-outline-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 transition-all shadow-sm"
                        onClick={() => handleAction("Loading Campus Guide map...")}
                    >
                        <MapPin size={16} /> Campus Guide
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Main Content Area */}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm p-5 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--hover-bg) 0%, var(--surface) 100%)', borderRadius: '1.5rem' }}>
                        <div className="position-relative z-1 row align-items-center">
                            <div className="col-md-7">
                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill smaller mb-3 fw-bold text-uppercase tracking-wider border border-primary border-opacity-10">Current Assignment</span>
                                <h3 className="fw-bold mb-2 text-body">{hostelData.roomInfo.hostelName}</h3>
                                <div className="d-flex align-items-center gap-4 mt-4 text-body">
                                    <div className="text-center">
                                        <div className="smaller text-muted text-uppercase tracking-tighter opacity-75 mb-1">Room</div>
                                        <div className="fw-bold h4 mb-0 text-body">{hostelData.roomInfo.roomNumber}</div>
                                    </div>
                                    <div className="vr bg-secondary opacity-25" style={{ height: '2.5rem' }}></div>
                                    <div className="text-center">
                                        <div className="smaller text-muted text-uppercase tracking-tighter opacity-75 mb-1">Block</div>
                                        <div className="fw-bold h4 mb-0 text-body">{hostelData.roomInfo.block}</div>
                                    </div>
                                    <div className="vr bg-secondary opacity-25" style={{ height: '2.5rem' }}></div>
                                    <div className="text-center">
                                        <div className="smaller text-muted text-uppercase tracking-tighter opacity-75 mb-1">Category</div>
                                        <div className="fw-bold h4 mb-0 text-body">{hostelData.roomInfo.type.split(',')[0]}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5 mt-4 mt-md-0">
                                <div className="card bg-white bg-opacity-50 border border-info border-opacity-25 rounded-4 shadow-sm backdrop-filter-blur">
                                    <div className="card-body p-4 text-body">
                                        <div className="d-flex align-items-center gap-2 mb-3 text-info">
                                            <Info size={16} />
                                            <span className="smaller fw-bold text-uppercase tracking-wider">Support Contact</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <img src="https://i.pravatar.cc/150?u=warden" className="rounded-circle border border-info border-opacity-20 shadow-sm" width="56" height="56" alt="Warden" />
                                            <div>
                                                <div className="fw-bold fs-6">Mr. Sahil Varma</div>
                                                <div className="smaller text-muted d-flex align-items-center gap-1 mt-1">
                                                    <Phone size={12} className="text-info" /> +91 91234 56789
                                                </div>
                                                <div className="smaller text-muted opacity-50 mt-1">Hostel Superintendent</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mess Menu & Roommates Row */}
                    <div className="row g-4 mb-4">
                        <div className="col-12 col-xl-6">
                            <div className="card border-0 shadow-sm h-100 rounded-4">
                                <div className="card-body p-4 text-body">
                                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                                        <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                            <Coffee size={20} className="text-warning" />
                                            Today's Culinary
                                        </h5>
                                        <button
                                            className="btn btn-link text-primary p-0 text-decoration-none smaller fw-bold"
                                            onClick={() => handleAction("Opening full weekly mess menu...")}
                                        >
                                            Full Menu
                                        </button>
                                    </div>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="p-3 rounded-4 border transition-all text-body" style={{ background: 'var(--hover-bg)' }}>
                                            <div className="d-flex justify-content-between mb-1 small fw-bold">
                                                <span className="text-warning text-uppercase tracking-wider">Morning</span>
                                                <span className="text-muted opacity-50">08:00 AM</span>
                                            </div>
                                            <div className="small text-body">{hostelData.messMenu[0].breakfast}</div>
                                        </div>
                                        <div className="p-3 rounded-4 border-primary bg-primary bg-opacity-5 border shadow-sm text-body">
                                            <div className="d-flex justify-content-between mb-1 small fw-bold">
                                                <span className="text-primary text-uppercase tracking-wider">Noon - Serving Now</span>
                                                <span className="text-primary opacity-75">Until 02 PM</span>
                                            </div>
                                            <div className="small fw-bold text-body">{hostelData.messMenu[0].lunch}</div>
                                        </div>
                                        <div className="p-3 rounded-4 border transition-all text-body" style={{ background: 'var(--hover-bg)' }}>
                                            <div className="d-flex justify-content-between mb-1 small fw-bold">
                                                <span className="text-info text-uppercase tracking-wider">Evening</span>
                                                <span className="text-muted opacity-50">08:00 PM</span>
                                            </div>
                                            <div className="small text-body">{hostelData.messMenu[0].dinner}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="card border-0 shadow-sm h-100 rounded-4">
                                <div className="card-body p-4 text-body">
                                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-2 border-bottom">
                                        <Users size={20} className="text-success" />
                                        Wing Buddies
                                    </h5>
                                    <div className="d-flex flex-column gap-3">
                                        {hostelData.roommates.map(roommate => (
                                            <div key={roommate.id} className="p-3 border rounded-4 d-flex align-items-center gap-3 transition-all text-body" style={{ background: 'var(--hover-bg)' }}>
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${roommate.name}&background=10b981&color=fff`}
                                                    alt={roommate.name}
                                                    className="rounded-circle shadow-sm"
                                                    width="44" height="44"
                                                />
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <div className="fw-bold small text-truncate text-body">{roommate.name}</div>
                                                    <div className="smaller text-muted text-truncate opacity-75">{roommate.department} • {roommate.year}</div>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary rounded-circle p-2"
                                                    onClick={() => handleAction(`Opening chat with ${roommate.name}...`)}
                                                >
                                                    <MessageSquare size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            className="btn btn-outline-secondary border-dashed w-100 py-3 rounded-4 smaller fw-bold mt-2"
                                            onClick={() => handleAction("Searching for buddies in Block A...")}
                                        >
                                            + Find more in Block A
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hostel Fee History */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4 text-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                    <ShieldCheck size={20} className="text-info" />
                                    Hostel Fee Ledger
                                </h5>
                                <button
                                    className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 smaller fw-bold"
                                    onClick={() => handleAction("Generating annual fee statement...")}
                                >
                                    View Statements
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 text-body">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="smaller text-uppercase text-muted border-0">Billing Month</th>
                                            <th className="smaller text-uppercase text-muted border-0">Paid Date</th>
                                            <th className="smaller text-uppercase text-muted border-0">Amount</th>
                                            <th className="smaller text-uppercase text-muted border-0">Status</th>
                                            <th className="smaller text-uppercase text-muted border-0 text-end">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hostelData.feeHistory.map(fee => (
                                            <tr key={fee.id}>
                                                <td className="py-3">
                                                    <div className="fw-bold small">{fee.month}</div>
                                                    <div className="smaller text-muted font-monospace">{fee.ref}</div>
                                                </td>
                                                <td className="small text-muted">{fee.date}</td>
                                                <td className="fw-bold small text-body">₹{fee.amount}</td>
                                                <td>
                                                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 smaller text-uppercase fw-bold border border-success border-opacity-10">
                                                        {fee.status}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-light border text-body"
                                                        onClick={() => handleDownloadReceipt(fee.month)}
                                                    >
                                                        <Download size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 text-body">
                        <h6 className="fw-bold mb-4 text-uppercase tracking-wider text-muted">Residential Actions</h6>
                        <div className="d-grid gap-3">
                            <button
                                className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 fw-bold shadow-sm transition-all active-scale"
                                onClick={() => setActiveModal('maintenance')}
                            >
                                <Zap size={18} /> Raising Ticket
                            </button>
                            <button
                                className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 smaller fw-bold transition-all"
                                onClick={() => setActiveModal('outpass')}
                            >
                                <ArrowRight size={18} /> Apply Outpass
                            </button>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 text-body">
                        <h6 className="fw-bold mb-4 text-uppercase tracking-wider text-muted">Activity Pulse</h6>
                        <div className="activity-timeline-minimal mt-2">
                            {hostelData.recentRequests.map(request => (
                                <div key={request.id} className="ps-4 position-relative pb-4 border-start ms-2">
                                    <div className={`position-absolute rounded-circle ${request.status === 'Resolved' ? 'bg-success' : 'bg-warning'}`} style={{ width: '10px', height: '10px', left: '-5.5px', top: '4px' }}></div>
                                    <div className="d-flex justify-content-between align-items-start mb-1 text-body">
                                        <span className="small fw-bold">{request.title}</span>
                                        <span className={`badge rounded-pill smaller ${request.status === 'Resolved' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>{request.status}</span>
                                    </div>
                                    <div className="smaller text-muted opacity-75 d-flex align-items-center gap-2 mt-1">
                                        <Clock size={12} className="text-primary opacity-50" />
                                        {request.type} • {request.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-link text-primary w-100 text-center mt-2 p-0 text-decoration-none smaller fw-bold opacity-75"
                            onClick={() => handleAction("Redirecting to full residential audit log...")}
                        >
                            Full Audit History
                        </button>
                    </div>

                    <div className="card border-0 border-start border-4 border-danger shadow-sm p-4 bg-danger bg-opacity-10 rounded-4 shadow-sm position-relative overflow-hidden text-body">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-danger text-uppercase tracking-wider">
                            <CheckCircle2 size={18} />
                            Code of Conduct
                        </h6>
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex gap-2 align-items-start">
                                <div className="bg-danger rounded-circle mt-2 shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                                <p className="smaller text-muted m-0 lh-base">Curfew hours: <span className="fw-bold text-body">10:00 PM</span> (Strict compliance required)</p>
                            </div>
                            <div className="d-flex gap-2 align-items-start">
                                <div className="bg-danger rounded-circle mt-2 shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                                <p className="smaller text-muted m-0 lh-base">Guest prohibition in residential wings after <span className="fw-bold text-body">08:00 PM</span></p>
                            </div>
                            <div className="d-flex gap-2 align-items-start">
                                <div className="bg-danger rounded-circle mt-2 shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                                <p className="smaller text-muted m-0 lh-base">Fire safety: Unauthorized electrical appliances will be confiscated</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {activeModal === 'maintenance' && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="modal-content border-0 shadow-lg text-body"
                            >
                                <div className="modal-header border-bottom-0 p-4">
                                    <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                                        <Hammer size={20} className="text-primary" />
                                        Maintenance Request
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
                                </div>
                                <div className="modal-body p-4 pt-0">
                                    <form onSubmit={handleSubmitMaintenance}>
                                        <div className="mb-3">
                                            <label className="form-label smaller text-muted text-uppercase tracking-wider fw-bold">Issue Category</label>
                                            <div className="row g-2">
                                                {[
                                                    { id: 'plumbing', label: 'Plumbing', icon: Droplets, color: 'text-info' },
                                                    { id: 'electrical', label: 'Electrical', icon: Zap, color: 'text-warning' },
                                                    { id: 'furniture', label: 'Furniture', icon: Sofa, color: 'text-success' },
                                                    { id: 'ac', label: 'AC Repair', icon: Wind, color: 'text-primary' },
                                                    { id: 'wifi', label: 'WiFi/Network', icon: Wifi, color: 'text-info' },
                                                    { id: 'cleaning', label: 'Cleaning', icon: Sparkles, color: 'text-success' },
                                                    { id: 'other', label: 'Other', icon: HelpCircle, color: 'text-secondary' },
                                                ].map(cat => (
                                                    <div className="col-6 mb-2" key={cat.id}>
                                                        <div
                                                            className={`p-3 rounded-3 border transition-all cursor-pointer text-center ${maintenanceForm.category === cat.id ? 'bg-primary bg-opacity-10 border-primary' : 'hover-bg-secondary'}`}
                                                            style={maintenanceForm.category !== cat.id ? { background: 'var(--hover-bg)' } : {}}
                                                            onClick={() => setMaintenanceForm({ ...maintenanceForm, category: cat.id })}
                                                        >
                                                            <cat.icon size={18} className={`mb-1 ${cat.color}`} />
                                                            <div className="smaller fw-bold text-body">{cat.label}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label smaller text-muted text-uppercase tracking-wider fw-bold">Urgency Level</label>
                                            <select
                                                className="form-select rounded-3 py-2 text-body border-0 shadow-none focus-ring"
                                                style={{ background: 'var(--hover-bg)' }}
                                                value={maintenanceForm.urgency}
                                                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, urgency: e.target.value })}
                                            >
                                                <option value="Normal">Normal (2-3 Days)</option>
                                                <option value="High">Priority (24 Hours)</option>
                                                <option value="Emergency">Urgent (Immediate)</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label smaller text-muted text-uppercase tracking-wider fw-bold">Problem Description</label>
                                            <textarea
                                                className="form-control rounded-3 text-body border-0 shadow-none focus-ring"
                                                style={{ background: 'var(--hover-bg)' }}
                                                rows="3"
                                                placeholder="Briefly describe the issue..."
                                                value={maintenanceForm.description}
                                                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                        <button className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-sm">
                                            Raise Ticket
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {activeModal === 'outpass' && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="modal-content border-0 shadow-lg text-body"
                            >
                                <div className="modal-header border-bottom-0 p-4">
                                    <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                                        <Calendar size={20} className="text-info" />
                                        Outpass Application
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
                                </div>
                                <div className="modal-body p-4 pt-0">
                                    <form onSubmit={handleSubmitOutpass}>
                                        <div className="mb-3">
                                            <label className="form-label smaller text-muted text-uppercase tracking-wider fw-bold">Destination</label>
                                            <input
                                                type="text"
                                                className="form-control rounded-3 py-2 text-body border-0 shadow-none focus-ring"
                                                style={{ background: 'var(--hover-bg)' }}
                                                placeholder="e.g. Hometown, Relative's House"
                                                value={outpassForm.destination}
                                                onChange={(e) => setOutpassForm({ ...outpassForm, destination: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="row g-3 mb-3">
                                            <div className="col-6">
                                                <label className="form-label smaller text-muted text-uppercase tracking-wider fw-bold">From</label>
                                                <input
                                                    type="date"
                                                    className="form-control rounded-3 py-2 text-body border-0 shadow-none focus-ring"
                                                    style={{ background: 'var(--hover-bg)' }}
                                                    value={outpassForm.fromDate}
                                                    onChange={(e) => setOutpassForm({ ...outpassForm, fromDate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label smaller text-muted text-uppercase tracking-wider fw-bold">To</label>
                                                <input
                                                    type="date"
                                                    className="form-control rounded-3 py-2 text-body border-0 shadow-none focus-ring"
                                                    style={{ background: 'var(--hover-bg)' }}
                                                    value={outpassForm.toDate}
                                                    onChange={(e) => setOutpassForm({ ...outpassForm, toDate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label smaller text-muted text-uppercase tracking-wider fw-bold">Reason for Leave</label>
                                            <textarea
                                                className="form-control rounded-3 text-body bg-light border-0 shadow-none focus-ring"
                                                rows="3"
                                                placeholder="Please provide a valid reason..."
                                                value={outpassForm.reason}
                                                onChange={(e) => setOutpassForm({ ...outpassForm, reason: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="p-3 bg-info bg-opacity-10 rounded-3 mb-4 border border-info border-opacity-25">
                                            <div className="d-flex gap-2 text-info">
                                                <AlertCircle size={16} className="flex-shrink-0 mt-1" />
                                                <p className="smaller m-0 lh-base">Once submitted, your application will be routed to the Warden and your parents for digital approval.</p>
                                            </div>
                                        </div>
                                        <button className="btn btn-info w-100 py-3 rounded-4 fw-bold shadow-sm">
                                            Submit Application
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentHostel;
