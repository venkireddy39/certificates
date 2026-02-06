import React, { useState, useEffect } from 'react';
import { useAuth } from '../Library/context/AuthContext';
import { useToast } from '../Library/context/ToastContext';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Save,
    Shield,
    Bell,
    Globe,
    Smartphone,
    Monitor,
    Laptop,
    ShieldCheck,
    History
} from 'lucide-react';
import './AdminProfile.css';

const AdminProfile = () => {
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
        bio: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || 'Class X 360 Headquarters',
                bio: user.bio || 'System Administrator for Class X 360 Learning Management System.'
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['Personal', 'Security', 'Notifications', 'Preferences'];

    return (
        <div className="admin-profile-page container-fluid px-0">
            <div className="profile-header mb-4">
                <h2 className="fw-bold text-dark mb-1">My Profile</h2>
                <p className="text-secondary">Manage your administrator account and personal information</p>
            </div>

            <div className="row g-4">
                {/* Left Side: Avatar & Summary */}
                <div className="col-12 col-lg-4">
                    <div className="profile-glass-card p-4 text-center">
                        <div className="profile-avatar-wrapper mx-auto mb-3">
                            <div className="profile-avatar-large">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {(user?.firstName?.[0] || 'A')}{(user?.lastName?.[0] || 'D')}
                                    </div>
                                )}
                            </div>
                            <button className="avatar-edit-btn">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h4 className="fw-bold mb-1">{formData.firstName} {formData.lastName}</h4>
                        <p className="text-primary small mb-3">{user?.role?.replace(/_/g, ' ') || 'Super Admin'}</p>

                        <div className="profile-stats-mini d-flex justify-content-center gap-3 py-3 border-top border-bottom mb-3">
                            <div>
                                <span className="d-block text-dark fw-bold">Admin</span>
                                <span className="x-small text-secondary">Role</span>
                            </div>
                            <div className="border-start"></div>
                            <div>
                                <span className="d-block text-dark fw-bold">Active</span>
                                <span className="x-small text-secondary">Status</span>
                            </div>
                        </div>

                        <div className="text-start">
                            <h6 className="x-small fw-bold text-secondary text-uppercase mb-2">Short Bio</h6>
                            <p className="small text-muted">{formData.bio}</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tabbed Forms */}
                <div className="col-12 col-lg-8">
                    <div className="profile-glass-card h-100">
                        {/* Tabs Navigation */}
                        <div className="profile-tabs-nav p-2 d-flex gap-2 border-bottom">
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
                                        <label className="form-label small fw-bold">First Name</label>
                                        <div className="input-group-custom">
                                            <User size={18} className="icon" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small fw-bold">Last Name</label>
                                        <div className="input-group-custom">
                                            <User size={18} className="icon" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small fw-bold">Email Address</label>
                                        <div className="input-group-custom">
                                            <Mail size={18} className="icon" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small fw-bold">Phone Number</label>
                                        <div className="input-group-custom">
                                            <Phone size={18} className="icon" />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Office Address</label>
                                        <div className="input-group-custom">
                                            <MapPin size={18} className="icon" />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">About Me</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="form-control"
                                            rows="4"
                                            style={{ resize: 'none' }}
                                        />
                                    </div>
                                    <div className="col-12 pt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm"
                                            disabled={loading}
                                        >
                                            <Save size={18} />
                                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'Security' && (
                                <div className="security-settings">
                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-1">Sign In & Security</h5>
                                        <p className="text-secondary small">Manage your password and security settings.</p>
                                    </div>

                                    <div className="security-card p-3 mb-3 border rounded-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="icon-box bg-primary-subtle text-primary">
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0">Two-Factor Authentication</h6>
                                                    <p className="x-small text-secondary mb-0">High security protection for your account.</p>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch p-0">
                                                <input className="form-check-input" type="checkbox" style={{ width: '40px', height: '20px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="security-card p-3 mb-4 border rounded-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="icon-box bg-info-subtle text-info">
                                                    <History size={20} />
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0">Password Status</h6>
                                                    <p className="x-small text-secondary mb-0">Last updated 1 month ago</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-light btn-sm rounded-pill px-3">Update</button>
                                        </div>
                                    </div>

                                    <div className="pt-3 d-flex gap-2 justify-content-end">
                                        <button className="btn btn-outline-secondary rounded-pill px-4">Cancel</button>
                                        <button className="btn btn-primary rounded-pill px-4 shadow-sm">Save Changes</button>
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'Notifications' || activeTab === 'Preferences') && (
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

export default AdminProfile;
