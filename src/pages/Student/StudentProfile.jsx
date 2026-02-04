import React, { useState, useEffect } from 'react';
import { useAuth } from '../Library/context/AuthContext';
import { useToast } from '../Library/context/ToastContext';
import { studentService } from '../../services/studentService';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Save,
    Shield,
    Key,
    Bell,
    Globe,
    Smartphone,
    Monitor,
    Laptop,
    ShieldCheck,
    History,
    LogOut
} from 'lucide-react';
import './StudentProfile.css';

const StudentProfile = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Personal');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        bio: 'Enthusiastic learner exploring the world of technology and design.'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '+91 98765 43210',
                address: user.address || 'LMS Learning Campus, Bangalore',
                bio: user.bio || 'Enthusiastic learner exploring the world of technology and design.'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await studentService.updateProfile(formData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['Personal', 'Security', 'Notifications', 'Preferences'];

    return (
        <div className="student-profile-page container-fluid px-0">
            <div className="profile-header mb-4">
                <h3 className="fw-bold text-white mb-1">Account Settings</h3>
                <p className="text-secondary small">Manage your profile and account preferences</p>
            </div>

            <div className="row g-4">
                {/* Left Side: Avatar & Summary */}
                <div className="col-12 col-lg-4">
                    <div className="glass-card p-4 text-center sticky-top" style={{ top: '2rem' }}>
                        <div className="profile-avatar-wrapper mx-auto mb-3">
                            <div className="profile-avatar-large">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" />
                                ) : (
                                    <User size={64} className="text-white opacity-50" />
                                )}
                            </div>
                            <button className="avatar-edit-btn">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h4 className="text-white fw-bold mb-1">{formData.firstName} {formData.lastName}</h4>
                        <p className="text-secondary small mb-3">Student • ID: {user?.studentId || 'STU2024001'}</p>

                        <div className="profile-stats-mini d-flex justify-content-center gap-3 py-3 border-top border-bottom border-white border-opacity-10 mb-3">
                            <div>
                                <span className="d-block text-white fw-bold">12</span>
                                <span className="x-small text-secondary">Courses</span>
                            </div>
                            <div className="border-start border-white border-opacity-10"></div>
                            <div>
                                <span className="d-block text-white fw-bold">750</span>
                                <span className="x-small text-secondary">XP Points</span>
                            </div>
                            <div className="border-start border-white border-opacity-10"></div>
                            <div>
                                <span className="d-block text-white fw-bold">5</span>
                                <span className="x-small text-secondary">Certs</span>
                            </div>
                        </div>

                        <div className="text-start">
                            <h6 className="x-small fw-bold text-secondary text-uppercase mb-2">Short Bio</h6>
                            <p className="small text-white opacity-75">{formData.bio}</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tabbed Forms */}
                <div className="col-12 col-lg-8">
                    <div className="glass-card h-100">
                        {/* Tabs Navigation */}
                        <div className="profile-tabs-nav p-2 d-flex gap-2 border-bottom border-white border-opacity-10">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`profile-tab-btn ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'Personal' && <User size={16} />}
                                    {tab === 'Security' && <Shield size={16} />}
                                    {tab === 'Notifications' && <Bell size={16} />}
                                    {tab === 'Preferences' && <Globe size={16} />}
                                    <span>{tab}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-4">
                            {activeTab === 'Personal' && (
                                <form onSubmit={handleSave} className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-secondary fw-bold">First Name</label>
                                        <div className="input-group-glass">
                                            <User size={18} />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Ajay"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-secondary fw-bold">Last Name</label>
                                        <div className="input-group-glass">
                                            <User size={18} />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Kumar"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-secondary fw-bold">Email Address</label>
                                        <div className="input-group-glass">
                                            <Mail size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="ajay@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small text-secondary fw-bold">Phone Number</label>
                                        <div className="input-group-glass">
                                            <Phone size={18} />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">Campus Address</label>
                                        <div className="input-group-glass">
                                            <MapPin size={18} />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="LMS Learning Campus, Bangalore"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">About Me</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="form-control bg-transparent border-white border-opacity-10 text-white small"
                                            rows="4"
                                            style={{ resize: 'none' }}
                                        />
                                    </div>
                                    <div className="col-12 pt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary d-flex align-items-center gap-2 px-4"
                                            disabled={loading}
                                        >
                                            <Save size={18} />
                                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'Security' && (
                                <div className="security-settings-v2">
                                    <div className="security-section-header mb-4">
                                        <h5 className="text-white fw-bold mb-1">Sign In & Security</h5>
                                        <p className="text-secondary small">Manage your password and 2-step verification.</p>
                                    </div>

                                    {/* 2FA Section */}
                                    <div className="security-item-card mb-4">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="icon-wrapper-security">
                                                    <ShieldCheck size={20} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h6 className="text-white fw-bold mb-0">Two-Factor Authentication</h6>
                                                    <p className="x-small text-secondary mb-0">Add an extra layer of security to your account.</p>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch p-0 m-0 d-flex align-items-center">
                                                <input className="form-check-input" type="checkbox" style={{ width: '40px', height: '20px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Section */}
                                    <div className="security-item-card mb-4">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="icon-wrapper-security">
                                                    <History size={20} className="text-info" />
                                                </div>
                                                <div>
                                                    <h6 className="text-white fw-bold mb-0">Last Password Change</h6>
                                                    <p className="x-small text-secondary mb-0">3 months ago</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-outline-light btn-sm rounded-pill px-3">Change Password</button>
                                        </div>
                                    </div>

                                    {/* Active Sessions */}
                                    <div className="active-sessions-section mb-4">
                                        <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                                            Active Sessions
                                            <span className="badge bg-primary bg-opacity-10 text-primary x-small">3 Devices</span>
                                        </h6>
                                        <p className="text-secondary small mb-3">Manage devices where you're currently logged in.</p>

                                        <div className="sessions-list d-flex flex-column gap-2">
                                            <div className="session-item">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="session-device-icon">
                                                        <Laptop size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="text-white small fw-bold">MacBook Pro</span>
                                                            <span className="badge bg-success bg-opacity-10 text-success x-small">Current Session</span>
                                                        </div>
                                                        <div className="x-small text-secondary">San Francisco, US • Active Now</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="session-item">
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="session-device-icon">
                                                            <Smartphone size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="text-white small fw-bold">iPhone 13</span>
                                                            <div className="x-small text-secondary">San Francisco, US • Active 2h ago</div>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-link text-danger text-decoration-none x-small p-0">Revoke</button>
                                                </div>
                                            </div>

                                            <div className="session-item">
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="session-device-icon">
                                                            <Monitor size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="text-white small fw-bold">Windows PC</span>
                                                            <div className="x-small text-secondary">Seattle, US • Active 5 days ago</div>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-link text-danger text-decoration-none x-small p-0">Revoke</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer buttons */}
                                    <div className="security-footer pt-3 d-flex gap-3 justify-content-end">
                                        <button className="btn btn-outline-light rounded-pill px-4">Cancel</button>
                                        <button className="btn btn-primary rounded-pill px-4">Save Changes</button>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'Personal' && activeTab !== 'Security' && (
                                <div className="text-center py-5">
                                    <Bell size={48} className="text-secondary opacity-25 mb-3" />
                                    <h5 className="text-secondary">{activeTab} settings coming soon</h5>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
