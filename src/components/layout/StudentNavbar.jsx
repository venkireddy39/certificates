/* src/components/layout/StudentNavbar.jsx */
import React from 'react';
import { Search, Bell, User, LogOut, ChevronDown, Bus, Home, MessageCircle, Menu } from 'lucide-react';
import { useAuth } from '../../pages/Library/context/AuthContext';
import { useToast } from '../../pages/Library/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import './StudentNavbar.css';

const StudentNavbar = ({ toggleSidebar, isSidebarCollapsed }) => {
    const { user, logout } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMockAction = (feature) => {
        toast.info(`${feature} feature is coming soon!`);
    };

    return (
        <header className="student-navbar px-4 d-flex align-items-center justify-content-between">
            <div className="navbar-left d-flex align-items-center flex-grow-1" style={{ maxWidth: '600px' }}>
                <button className={`nav-icon-btn btn border-0 me-3 toggle-sidebar-btn ${isSidebarCollapsed ? 'is-collapsed' : ''}`} onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <div className="navbar-search position-relative flex-grow-1 me-4 d-none d-lg-block" onClick={() => handleMockAction('Search')} style={{ cursor: 'pointer' }}>
                    <Search size={18} className="text-muted position-absolute top-50 start-0 translate-middle-y ms-3" />
                    <input
                        type="text"
                        placeholder="Search courses, lessons, resources..."
                        className="form-control bg-light border-0 text-body rounded-3 ps-5 py-2 shadow-none"
                        readOnly
                    />
                </div>
            </div>

            <div className="navbar-right d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 d-none d-sm-flex pe-3 border-end">
                    <button className="nav-icon-btn btn border-0" onClick={() => navigate('/student/communication')} title="Messages">
                        <MessageCircle size={20} />
                    </button>

                    <button className="nav-icon-btn btn border-0" onClick={() => navigate('/student/transport')} title="Transport">
                        <Bus size={20} />
                    </button>

                    <button className="nav-icon-btn btn border-0" onClick={() => navigate('/student/hostel')} title="Hostel">
                        <Home size={20} />
                    </button>
                </div>

                <div className="position-relative">
                    <button className="nav-icon-btn btn border-0" onClick={() => navigate('/student/notifications')}>
                        <Bell size={20} />
                    </button>
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-2 rounded-circle" style={{ marginTop: '8px', marginRight: '8px', borderColor: 'var(--surface)' }}></span>
                </div>

                <div className="user-profile-dropdown d-flex align-items-center gap-2 ps-3 border-start">
                    <div className="user-info d-none d-md-flex flex-column align-items-end me-1">
                        <span className="user-name fw-bold small">{user?.firstName || 'Ajay'} {user?.lastName || ''}</span>
                        <span className="user-role text-muted x-small opacity-75">Student</span>
                    </div>
                    <div className="avatar-wrapper d-flex align-items-center gap-2 bg-light p-1 pe-2 rounded-pill shadow-sm">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="avatar-img rounded-circle" style={{ width: '32px', height: '32px' }} />
                        ) : (
                            <div className="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                <User size={16} />
                            </div>
                        )}
                        <ChevronDown size={14} className="text-muted opacity-75" />
                    </div>

                    <div className="dropdown-menu-custom shadow-lg">
                        <button className="dropdown-item-custom btn border-0 w-100 text-start d-flex align-items-center gap-2" onClick={() => navigate('/student/profile')}>
                            <User size={16} />
                            <span>My Profile</span>
                        </button>
                        <hr className="dropdown-divider opacity-10" />
                        <button className="dropdown-item-custom logout btn border-0 w-100 text-start d-flex align-items-center gap-2 text-danger" onClick={handleLogout}>
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default StudentNavbar;
