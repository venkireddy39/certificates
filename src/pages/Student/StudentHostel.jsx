import React, { useState } from 'react';
import { Home, Coffee, Users, MessageSquare, AlertCircle, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import './StudentHostel.css';

const StudentHostel = () => {
    const [hostelData] = useState({
        roomInfo: {
            block: "Block A",
            roomNumber: "302",
            type: "2 Sharing, AC",
            floor: "3rd Floor",
            hostelName: "North Campus Residency"
        },
        roommates: [
            { id: 1, name: "Arjun Mehta", department: "Computer Science", year: "3rd Year" },
            { id: 2, name: "Rahul Sharma", department: "Mechanical Engg", year: "2nd Year" }
        ],
        messMenu: [
            { day: "Today", breakfast: "Poha, Tea, Fruit", lunch: "Paneer Curry, Dal, Roti, Rice", dinner: "Veg Pulao, Curd, Sweet" },
            { day: "Tomorrow", breakfast: "Idli, Sambar, Coffee", lunch: "Mix Veg, Dal Tadka, Rice", dinner: "Chana Masala, Paratha, Salad" }
        ],
        recentRequests: [
            { id: 1, type: "Maintenance", title: "AC Repair", status: "Resolved", date: "2 Feb 2024" },
            { id: 2, type: "Leave", title: "Weekend Leave Request", status: "Pending", date: "4 Feb 2024" }
        ]
    });

    return (
        <div className="student-hostel-container">
            <div className="mb-4">
                <h3 className="fw-bold">My Hostel</h3>
                <p className="text-secondary small">Manage your accommodation and mess services</p>
            </div>

            <div className="row g-4">
                {/* Accommodation Overview */}
                <div className="col-12 col-lg-8">
                    <div className="glass-card hostel-header-card p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(30, 41, 59, 0.4))' }}>
                        <div className="row align-items-center">
                            <div className="col-md-7">
                                <h4 className="fw-bold text-primary mb-2">{hostelData.roomInfo.hostelName}</h4>
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="text-white">
                                        <span className="text-secondary small d-block">Room No.</span>
                                        <span className="fw-bold fs-5">{hostelData.roomInfo.roomNumber}</span>
                                    </div>
                                    <div className="bg-white bg-opacity-10" style={{ width: '1px', height: '30px' }}></div>
                                    <div className="text-white">
                                        <span className="text-secondary small d-block">Block</span>
                                        <span className="fw-bold fs-5">{hostelData.roomInfo.block}</span>
                                    </div>
                                    <div className="bg-white bg-opacity-10" style={{ width: '1px', height: '30px' }}></div>
                                    <div className="text-white">
                                        <span className="text-secondary small d-block">Type</span>
                                        <span className="fw-bold fs-5">{hostelData.roomInfo.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="p-3 bg-dark bg-opacity-50 rounded-3 border border-white border-opacity-10">
                                    <div className="d-flex align-items-center gap-2 mb-2 text-info">
                                        <Info size={16} />
                                        <span className="small fw-bold">Warden Contact</span>
                                    </div>
                                    <div className="fw-medium small">Mr. Sahil Varma</div>
                                    <div className="text-secondary small mt-1">+91 91234 56789</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mess Menu */}
                    <div className="glass-card p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <Coffee size={20} className="text-warning" />
                                Today's Mess Menu
                            </h5>
                            <button className="btn btn-link text-primary p-0 text-decoration-none small">View Weekly Menu</button>
                        </div>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="mess-menu-item">
                                    <div className="text-warning small fw-bold mb-1">Breakfast</div>
                                    <div className="small text-secondary">{hostelData.messMenu[0].breakfast}</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mess-menu-item active">
                                    <div className="text-primary small fw-bold mb-1">Lunch</div>
                                    <div className="small text-white">{hostelData.messMenu[0].lunch}</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mess-menu-item">
                                    <div className="text-info small fw-bold mb-1">Dinner</div>
                                    <div className="small text-secondary">{hostelData.messMenu[0].dinner}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Roommates */}
                    <div className="glass-card p-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <Users size={20} className="text-success" />
                            My Roommates
                        </h5>
                        <div className="row g-3">
                            {hostelData.roommates.map(roommate => (
                                <div key={roommate.id} className="col-md-6">
                                    <div className="roommate-item">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${roommate.name}&background=10b981&color=fff`}
                                            alt={roommate.name}
                                            className="roommate-avatar"
                                        />
                                        <div>
                                            <div className="fw-bold small">{roommate.name}</div>
                                            <div className="text-secondary x-small">{roommate.department}</div>
                                            <div className="text-secondary x-small">{roommate.year}</div>
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
                        <h5 className="fw-bold mb-4">Hostel Actions</h5>
                        <div className="d-grid gap-3">
                            <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2">
                                <MessageSquare size={18} />
                                File Complaint
                            </button>
                            <button className="btn btn-outline-info d-flex align-items-center justify-content-center gap-2 py-2">
                                <AlertCircle size={18} />
                                Leave Application
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-4 mb-4">
                        <h5 className="fw-bold mb-3">Recent Requests</h5>
                        {hostelData.recentRequests.map(request => (
                            <div key={request.id} className="py-3 border-bottom border-white border-opacity-10 last-child-noborder">
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                    <div className="fw-medium small">{request.title}</div>
                                    <span className={`complaint-badge ${request.status === 'Resolved' ? 'status-resolved' : 'status-pending'}`}>
                                        {request.status}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between text-secondary x-small">
                                    <span>{request.type}</span>
                                    <span>{request.date}</span>
                                </div>
                            </div>
                        ))}
                        <button className="btn btn-link text-primary w-100 text-center mt-3 p-0 text-decoration-none small">View All Requests</button>
                    </div>

                    <div className="glass-card p-4">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <CheckCircle2 size={18} className="text-success" />
                            Rules & Guidelines
                        </h5>
                        <ul className="list-unstyled mb-0 small text-secondary">
                            <li className="mb-2">• Main gate closes at 10:00 PM</li>
                            <li className="mb-2">• Silent hours: 11:00 PM - 06:00 AM</li>
                            <li className="mb-2">• Visitors strictly for common areas</li>
                            <li className="mb-0">• Electricity limit: 50 units/month</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentHostel;
