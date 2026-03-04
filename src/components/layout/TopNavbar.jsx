import React from 'react';
import { Layers, Award } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import './TopNavbar.css';

const TopNavbar = () => {
    const navigate = useNavigate();

    return (
        <header className="global-top-navbar is-scrolled">
            <div className="navbar-container">
                <div className="nav-left">
                    <div className="navbar-brand" onClick={() => navigate('/admin/certificates')} style={{ cursor: 'pointer' }}>
                        <Layers size={28} className="brand-icon" />
                        <span className="brand-name">LMS Certificates</span>
                    </div>
                </div>

                <nav className="nav-center d-none d-lg-flex">
                    <ul className="nav-links">
                        <li className="nav-item">
                            <NavLink to="/admin/certificates" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                                <Award size={18} />
                                <span>Certificates</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="nav-right">
                    <div className="user-account-menu">
                        <button className="profile-trigger" style={{ cursor: 'pointer' }}>
                            <div className="u-avatar">
                                <div className="avatar-initials">AD</div>
                                <div className="online-status"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
