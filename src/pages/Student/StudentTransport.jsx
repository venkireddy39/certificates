import React, { useState } from 'react';
import { Bus, MapPin, Clock, Phone, User, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import './StudentTransport.css';

const StudentTransport = () => {
    const [transportInfo] = useState({
        busNumber: "KA-01-F-1234",
        routeName: "Route 42 - HSR Layout to Campus",
        driverName: "Robert Wilson",
        driverPhone: "+91 98765 43210",
        status: "Running",
        nextStop: "Silk Board Junction",
        eta: "12 mins",
        feeStatus: "Paid",
        stops: [
            { id: 1, name: "HSR Layout Sector 1", time: "07:30 AM", reached: true },
            { id: 2, name: "Silk Board", time: "07:45 AM", reached: true },
            { id: 3, name: "BTM Layout", time: "08:00 AM", reached: false },
            { id: 4, name: "Bannerghatta Road", time: "08:15 AM", reached: false },
            { id: 5, name: "Main Campus", time: "08:45 AM", reached: false },
        ]
    });

    return (
        <div className="student-transport-container">
            <div className="mb-4">
                <h3 className="fw-bold">Transport Details</h3>
                <p className="text-secondary small">Track your shuttle and manage transport services</p>
            </div>

            <div className="row g-4">
                {/* Main Tracking Card */}
                <div className="col-12 col-lg-8">
                    <div className="glass-card transport-header-card p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <span className="bus-status-badge status-active mb-3 d-inline-block">
                                    <Bus size={14} className="me-2" />
                                    {transportInfo.status}
                                </span>
                                <h4 className="fw-bold mb-1">{transportInfo.routeName}</h4>
                                <p className="text-secondary mb-0">Bus Number: <span className="text-white">{transportInfo.busNumber}</span></p>
                            </div>
                            <div className="text-end">
                                <div className="text-secondary small mb-1">Next Stop</div>
                                <div className="fw-bold text-primary">{transportInfo.nextStop}</div>
                                <div className="small text-secondary">ETA: {transportInfo.eta}</div>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-dark bg-opacity-50 rounded-3">
                                    <div className="text-secondary small mb-1">Driver</div>
                                    <div className="small fw-medium">{transportInfo.driverName}</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-dark bg-opacity-50 rounded-3">
                                    <div className="text-secondary small mb-1">Fee Status</div>
                                    <div className="small fw-medium text-success">{transportInfo.feeStatus}</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-dark bg-opacity-50 rounded-3">
                                    <div className="text-secondary small mb-1">Vehicle Type</div>
                                    <div className="small fw-medium">AC Shuttle</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-dark bg-opacity-50 rounded-3">
                                    <div className="text-secondary small mb-1">Capacity</div>
                                    <div className="small fw-medium">45 Seater</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center">
                            <MapPin size={20} className="text-primary me-2" />
                            Route Schedule
                        </h5>
                        <div className="ps-2">
                            {transportInfo.stops.map((stop) => (
                                <div key={stop.id} className="route-stop">
                                    <div className={`stop-indicator ${stop.reached ? 'reached' : ''}`}></div>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className={`fw-medium ${stop.reached ? 'text-white' : 'text-secondary'}`}>
                                                {stop.name}
                                            </div>
                                            {stop.reached && <span className="x-small text-success">Passed</span>}
                                        </div>
                                        <div className="text-secondary small">
                                            <Clock size={12} className="me-1" />
                                            {stop.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="col-12 col-lg-4">
                    <div className="glass-card p-4 mb-4">
                        <h5 className="fw-bold mb-4">Driver Details</h5>
                        <div className="d-flex align-items-center mb-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${transportInfo.driverName}&background=6366f1&color=fff`}
                                alt="Driver"
                                className="driver-avatar me-3"
                            />
                            <div>
                                <div className="fw-bold">{transportInfo.driverName}</div>
                                <div className="text-secondary small">Primary Driver</div>
                            </div>
                        </div>
                        <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 mb-3">
                            <Phone size={18} />
                            Contact Driver
                        </button>
                        <div className="p-3 bg-white bg-opacity-5 rounded-3">
                            <div className="d-flex align-items-center gap-2 text-success small">
                                <ShieldCheck size={16} />
                                Verified Personnel
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-4 mb-4">
                        <h5 className="fw-bold mb-3">Quick Actions</h5>
                        <div className="list-group list-group-flush bg-transparent">
                            <button className="list-group-item bg-transparent border-white border-opacity-10 text-white d-flex justify-content-between align-items-center px-0 py-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-primary bg-opacity-10 rounded text-primary">
                                        <CreditCard size={18} />
                                    </div>
                                    <span>Pay Transport Fee</span>
                                </div>
                                <ChevronRight size={16} className="text-secondary" />
                            </button>
                            <button className="list-group-item bg-transparent border-white border-opacity-10 text-white d-flex justify-content-between align-items-center px-0 py-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-info bg-opacity-10 rounded text-info">
                                        <MapPin size={18} />
                                    </div>
                                    <span>Change Stop</span>
                                </div>
                                <ChevronRight size={16} className="text-secondary" />
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-4 border-primary border-opacity-25" style={{ background: 'linear-gradient(rgba(99, 102, 241, 0.1), transparent)' }}>
                        <div className="text-primary small fw-bold mb-2">Notice</div>
                        <p className="small text-secondary mb-0">
                            Shuttle timings may vary by 5-10 minutes due to traffic conditions. Please reach your stop 5 minutes early.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTransport;
