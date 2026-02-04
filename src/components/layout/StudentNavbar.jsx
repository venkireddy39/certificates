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
        <header className="student-navbar">
            <div className="navbar-left">
                <button className={`nav-icon-btn me-3 toggle-sidebar-btn ${isSidebarCollapsed ? 'is-collapsed' : ''}`} onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <div className="navbar-search" onClick={() => handleMockAction('Search')} style={{ cursor: 'pointer' }}>
                    <Search size={18} className="text-secondary" />
                    <input
                        type="text"
                        placeholder="Search courses, lessons, resources..."
                        className="search-input"
                        readOnly
                    />
                </div>
            </div>

            <div className="navbar-right">
                <button className="nav-icon-btn d-none d-sm-flex" onClick={() => navigate('/student/communication')} title="Messages">
                    <MessageCircle size={20} />
                </button>

                <button className="nav-icon-btn d-none d-sm-flex" onClick={() => navigate('/student/transport')} title="Transport">
                    <Bus size={20} />
                </button>

                <button className="nav-icon-btn d-none d-sm-flex" onClick={() => navigate('/student/hostel')} title="Hostel">
                    <Home size={20} />
                </button>

                <button className="nav-icon-btn position-relative" onClick={() => navigate('/student/notifications')}>
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>

                <div className="user-profile-dropdown">
                    <div className="user-info d-none d-md-flex">
                        <span className="user-name">{user?.firstName || 'Ajay'} {user?.lastName || ''}</span>
                        <span className="user-role">Student</span>
                    </div>
                    <div className="avatar-wrapper">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="avatar-img" />
                        ) : (
                            <div className="avatar-placeholder">
                                <User size={20} />
                            </div>
                        )}
                        <ChevronDown size={14} className="ms-1 text-secondary" />
                    </div>

                    <div className="dropdown-menu-custom">
                        <button className="dropdown-item-custom" onClick={() => navigate('/student/profile')}>
                            <User size={16} />
                            <span>My Profile</span>
                        </button>
                        <hr className="dropdown-divider" />
                        <button className="dropdown-item-custom logout text-danger" onClick={handleLogout}>
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
