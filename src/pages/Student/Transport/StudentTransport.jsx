import React, { useState } from 'react';
import { Bus, MapPin, Clock, Phone, User, ShieldCheck, CreditCard, ChevronRight, Navigation, AlertCircle, Info, Layers } from 'lucide-react';
import '../StudentDashboard.css';
import './StudentTransport.css';

const StudentTransport = () => {
    const transportInfo = {
        route: "Route 42 - HSR Layout to Campus",
        driverName: "Robert Wilson",
        shuttleId: "SH-42B",
        plate: "KA - 01 - F - 1234",
        status: "Running",
        serviceType: "AC Platinum",
        feeStatus: "Paid",
        liveLoad: "28 / 45",
        eta: "12 mins"
    };

    const stops = [
        { name: "HSR Layout Sector 1", time: "07:30 AM", status: "Arrived & Departed" },
        { name: "Silk Board Junction", time: "07:50 AM", status: "Approaching", isCurrent: true },
        { name: "Electronics City Ph 1", time: "08:15 AM", status: "Scheduled" },
        { name: "University Campus", time: "08:35 AM", status: "Scheduled" }
    ];

    return (
        <div className="student-transport-container animate-fade-in text-body">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-8">
                    <h2 className="fw-bold mb-1 text-body">Transit Tracker</h2>
                    <p className="text-muted mb-0 fw-medium">Live shuttle positioning and route schedule management.</p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                    <button className="btn btn-secondary rounded-pill px-4 py-2 small fw-bold shadow-sm d-inline-flex align-items-center gap-2 text-white transition-all hover-scale">
                        <Navigation size={16} /> Live Map View
                    </button>
                </div>
            </div>

            {/* Hero & Brief Section */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-lg overflow-hidden position-relative p-4 p-md-5 h-100" style={{ background: 'var(--surface)', borderRadius: '24px' }}>
                        <div className="hero-glow"></div>
                        <div className="position-relative z-1">
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div className="transit-status-pill running shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ background: 'var(--hover-bg)', border: '1px solid var(--border)' }}>
                                    <div className="pulse-dot bg-success"></div>
                                    <span className="smaller fw-bold text-success uppercase">Running</span>
                                </div>
                                <div className="text-end">
                                    <div className="smaller text-muted uppercase fw-bold opacity-75">Approaching</div>
                                    <div className="h5 fw-bold text-secondary mb-0">Silk Board Junction</div>
                                    <div className="smaller text-muted fw-bold">Arrival in approx. <span className="text-secondary">{transportInfo.eta}</span></div>
                                </div>
                            </div>

                            <h2 className="display-6 fw-bold mb-1 text-body">{transportInfo.route}</h2>
                            <p className="text-muted mb-5 font-monospace smaller uppercase opacity-75">PLATE: {transportInfo.plate}</p>

                            <div className="row g-3 mt-4">
                                {[
                                    { label: 'Service Type', value: transportInfo.serviceType },
                                    { label: 'Fee Status', value: transportInfo.feeStatus, color: 'success' },
                                    { label: 'Shuttle ID', value: transportInfo.shuttleId },
                                    { label: 'Live Load', value: transportInfo.liveLoad }
                                ].map((item, i) => (
                                    <div className="col-6 col-md-3" key={i}>
                                        <div className="p-3 rounded-4 border text-center transition-all hover-translate-y h-100" style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                                            <div className="smaller text-muted uppercase fw-bold opacity-50 mb-1">{item.label}</div>
                                            <div className={`fw-bold text-${item.color || 'body'}`}>{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Driver Section */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm p-4 h-100" style={{ background: 'var(--surface)', borderRadius: '24px' }}>
                        <h6 className="fw-bold mb-4 text-body d-flex align-items-center gap-2">
                            <Info size={18} className="text-secondary" /> Driver Assigned
                        </h6>
                        <div className="d-flex align-items-center p-3 rounded-4 border mb-4" style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                            <img
                                src={`https://ui-avatars.com/api/?name=${transportInfo.driverName}&background=4f46e5&color=fff`}
                                alt="Driver"
                                className="rounded-circle border me-3 shadow-sm"
                                width="64"
                                height="64"
                                style={{ borderColor: 'var(--border)' }}
                            />
                            <div>
                                <div className="fw-bold text-body mb-1">{transportInfo.driverName}</div>
                                <div className="smaller text-muted font-monospace">ID: DR-9921</div>
                                <div className="stars-rating mt-2 smaller">⭐⭐⭐⭐⭐ <span className="opacity-50 ms-1">(120+)</span></div>
                            </div>
                        </div>
                        <button className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 fw-bold shadow-sm text-white transition-all hover-scale mt-auto">
                            <Phone size={18} /> Call Transport Office
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Timeline & Portal */}
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm p-4 p-md-5" style={{ background: 'var(--surface)', borderRadius: '24px' }}>
                        <div className="d-flex align-items-center gap-2 mb-5">
                            <div className="p-2 bg-secondary bg-opacity-10 rounded text-secondary"><MapPin size={24} /></div>
                            <h4 className="fw-bold m-0 text-body">Route Timeline</h4>
                        </div>

                        <div className="timeline-container px-2">
                            {stops.map((stop, idx) => (
                                <div key={idx} className={`timeline-item position-relative mb-4 ps-5 ${stop.isCurrent ? 'active' : ''}`}>
                                    <div className={`timeline-dot position-absolute start-0 translate-middle-x mt-1 ${stop.isCurrent ? 'bg-secondary shadow-glow' : 'bg-muted opacity-25'}`}
                                        style={{ width: '12px', height: '12px', borderRadius: '50%', left: '6px', top: '8px', zIndex: 2 }}></div>
                                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                                        <div>
                                            <h6 className={`fw-bold mb-1 ${stop.isCurrent ? 'text-secondary' : 'text-body'}`}>{stop.name}</h6>
                                            <div className={`smaller fw-bold uppercase px-2 py-1 rounded-pill d-inline-block ${stop.isCurrent ? 'bg-secondary bg-opacity-10 text-secondary' : 'text-muted opacity-50'}`}>
                                                {stop.status}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="small fw-bold font-monospace text-muted">{stop.time}</div>
                                        </div>
                                    </div>
                                    {idx < stops.length - 1 && (
                                        <div className="position-absolute h-100 border-start border-2 border-dashed opacity-10"
                                            style={{ left: '5px', top: '20px', bottom: '0' }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm p-4 mb-4" style={{ background: 'var(--surface)', borderRadius: '24px' }}>
                        <h6 className="fw-bold mb-4 text-body d-flex align-items-center gap-2">
                            <Layers size={18} className="text-secondary" /> Administrative Portal
                        </h6>
                        <div className="d-flex flex-column gap-3">
                            <button className="btn btn-outline-secondary border text-start d-flex justify-content-between align-items-center p-3 rounded-4 transition-all hover-translate-x"
                                style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-secondary bg-opacity-10 rounded text-secondary shadow-sm"><CreditCard size={18} /></div>
                                    <span className="small text-body fw-bold">Settlement History</span>
                                </div>
                                <ChevronRight size={16} className="text-muted" />
                            </button>
                            <button className="btn btn-outline-secondary border text-start d-flex justify-content-between align-items-center p-3 rounded-4 transition-all hover-translate-x"
                                style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-info bg-opacity-10 rounded text-info shadow-sm"><MapPin size={18} /></div>
                                    <span className="small text-body fw-bold">Request Stop Change</span>
                                </div>
                                <ChevronRight size={16} className="text-muted" />
                            </button>
                        </div>
                    </div>

                    <div className="card shadow-sm p-4 border-warning border-opacity-20 position-relative overflow-hidden"
                        style={{ background: 'rgba(245, 158, 11, 0.08)', borderRadius: '24px' }}>
                        <div className="position-absolute top-0 end-0 p-3 opacity-10"><AlertCircle size={48} className="text-warning" /></div>
                        <div className="d-flex align-items-center gap-2 text-warning fw-bold smaller uppercase tracking-wider mb-2 position-relative">
                            <AlertCircle size={16} /> Transit Notice
                        </div>
                        <p className="smaller text-muted m-0 fw-medium leading-relaxed position-relative">
                            Due to city infrastructure work at <span className="text-body fw-bold">Silk Board Junction</span>, expect a potential delay of <span className="text-warning fw-bold">10-15 minutes</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTransport;
