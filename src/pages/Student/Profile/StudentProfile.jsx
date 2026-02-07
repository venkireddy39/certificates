import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../pages/Library/context/AuthContext';
import { useToast } from '../../../pages/Library/context/ToastContext';
import { studentService } from '../../../services/studentService';
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
    LogOut,
    ExternalLink
} from 'lucide-react';
import '../StudentDashboard.css';
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
        <div className="student-profile-container animate-fade-in">
            {/* Page Header */}
            <div className="row mb-5 align-items-center g-3">
                <div className="col-12 col-md-8">
                    <h2 className="fw-bold mb-1">Identity Management</h2>
                    <p className="text-secondary mb-0">Control your digital presence and institutional records.</p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                    <button className="btn btn-outline-danger border-opacity-10 rounded-pill px-4 py-2 small fw-bold d-inline-flex align-items-center gap-2">
                        <LogOut size={16} /> Sign Out Session
                    </button>
                </div>
            </div>

            <div className="row g-5">
                {/* Left Side: Avatar & Summary */}
                <div className="col-12 col-xl-4">
                    <div className="glass-card p-5 profile-sidebar-card text-center position-sticky" style={{ top: '2rem' }}>
                        <div className="avatar-master-wrapper mb-4">
                            <div className="avatar-ring-outer">
                                <div className="avatar-ring-inner shadow-glow">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="avatar-img-main" alt="Profile" />
                                    ) : (
                                        <User size={64} className="text-white opacity-40" />
                                    )}
                                </div>
                            </div>
                            <button className="btn-camera-trigger shadow-lg"><Camera size={16} /></button>
                        </div>

                        <h4 className="fw-bold text-white mb-1">{formData.firstName} {formData.lastName}</h4>
                        <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill smaller fw-bold mb-4 uppercase letter-spacing-1">Rank: Gold Learner</div>

                        <div className="d-flex justify-content-center gap-4 py-4 border-top border-bottom border-white border-opacity-5 mb-4">
                            <div className="stat-unit">
                                <span className="d-block text-white fw-bold fs-5">12</span>
                                <span className="smaller text-secondary uppercase opacity-50">Courses</span>
                            </div>
                            <div className="v-divider-v2"></div>
                            <div className="stat-unit">
                                <span className="d-block text-white fw-bold fs-5">750</span>
                                <span className="smaller text-secondary uppercase opacity-50">XP</span>
                            </div>
                            <div className="v-divider-v2"></div>
                            <div className="stat-unit">
                                <span className="d-block text-white fw-bold fs-5">5</span>
                                <span className="smaller text-secondary uppercase opacity-50">Certs</span>
                            </div>
                        </div>

                        <div className="text-start info-footer-v2">
                            <h6 className="smaller fw-bold text-white uppercase letter-spacing-1 mb-2 opacity-50">Institutional Bio</h6>
                            <p className="small text-secondary leading-relaxed m-0 italic">"{formData.bio}"</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tabbed Interface */}
                <div className="col-12 col-xl-8">
                    <div className="glass-card main-profile-form overflow-hidden border-opacity-5">
                        <div className="profile-tabs-header d-flex gap-4 px-4 pt-4 border-bottom border-white border-opacity-5">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`profile-nav-tab pb-3 position-relative smaller fw-bold uppercase letter-spacing-1 ${activeTab === tab ? 'text-primary' : 'text-secondary opacity-50'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="active-glow-line"></div>}
                                </button>
                            ))}
                        </div>

                        <div className="p-5">
                            {activeTab === 'Personal' && (
                                <form onSubmit={handleSave} className="animate-fade-in">
                                    <div className="row g-4 mb-4">
                                        <div className="col-md-6">
                                            <label className="smaller text-secondary uppercase fw-bold mb-2 d-block opacity-50">First Name</label>
                                            <div className="input-glass-premium">
                                                <User size={18} />
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="smaller text-secondary uppercase fw-bold mb-2 d-block opacity-50">Last Name</label>
                                            <div className="input-glass-premium">
                                                <User size={18} />
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="smaller text-secondary uppercase fw-bold mb-2 d-block opacity-50">Email Connection</label>
                                            <div className="input-glass-premium">
                                                <Mail size={18} />
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="smaller text-secondary uppercase fw-bold mb-2 d-block opacity-50">Mobile Directory</label>
                                            <div className="input-glass-premium">
                                                <Phone size={18} />
                                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label className="smaller text-secondary uppercase fw-bold mb-2 d-block opacity-50">Physical Address</label>
                                            <div className="input-glass-premium">
                                                <MapPin size={18} />
                                                <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label className="smaller text-secondary uppercase fw-bold mb-2 d-block opacity-50">About the Learner</label>
                                            <textarea name="bio" value={formData.bio} onChange={handleChange} className="form-control textarea-glass-premium" rows="4" placeholder="Tell us about yourself..." />
                                        </div>
                                    </div>
                                    <div className="pt-4 d-flex justify-content-end gap-3 border-top border-white border-opacity-5">
                                        <button type="button" className="btn btn-outline-light border-opacity-10 rounded-pill px-4 py-2 smaller fw-bold">Discard Changes</button>
                                        <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 small fw-bold shadow-primary d-flex align-items-center gap-2" disabled={loading}>
                                            <Save size={18} /> {loading ? 'Processing...' : 'Sync Profile'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'Security' && (
                                <div className="security-suite animate-fade-in">
                                    <div className="d-flex align-items-center gap-3 mb-5">
                                        <div className="icon-pill-v2 bg-primary bg-opacity-10 text-primary shadow-glow-sm"><ShieldCheck size={28} /></div>
                                        <div>
                                            <h5 className="fw-bold text-white mb-1">Defense & Access</h5>
                                            <p className="smaller text-secondary m-0">Secure your digital campus identity with two-factor protocols.</p>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column gap-3 mb-5">
                                        <div className="glass-card-inset p-4 rounded-4 d-flex justify-content-between align-items-center border border-white border-opacity-5">
                                            <div>
                                                <h6 className="fw-bold text-white mb-1 small">Biometric Login / 2FA</h6>
                                                <p className="smaller text-secondary m-0">Enable advanced multi-factor authentication via authenticator apps.</p>
                                            </div>
                                            <div className="form-check form-switch m-0">
                                                <input className="form-check-input switch-premium" type="checkbox" />
                                            </div>
                                        </div>

                                        <div className="glass-card-inset p-4 rounded-4 d-flex justify-content-between align-items-center border border-white border-opacity-5">
                                            <div>
                                                <h6 className="fw-bold text-white mb-1 small">Institutional Password</h6>
                                                <p className="smaller text-secondary m-0">Last rotation: 92 days ago. It is recommended to change every 180 days.</p>
                                            </div>
                                            <button className="btn btn-outline-primary smaller fw-bold px-4 py-2 rounded-pill">Rotate Keys</button>
                                        </div>
                                    </div>

                                    <h6 className="fw-bold text-white mb-4 small uppercase letter-spacing-1 opacity-75">Authenticated Clusters</h6>
                                    <div className="d-flex flex-column gap-2 mb-4">
                                        {[
                                            { device: 'MacBook Pro 16"', loc: 'Bangalore, IND', status: 'Current', icon: Laptop },
                                            { device: 'iPhone 15 Pro', loc: 'Delhi, IND', status: '2h ago', icon: Smartphone },
                                            { device: 'Windows Lab PC', loc: 'Campus Lab 4', status: '5d ago', icon: Monitor }
                                        ].map((session, i) => (
                                            <div key={i} className="session-card-v2 p-3 rounded-4 bg-white bg-opacity-2 d-flex align-items-center gap-3 border border-white border-opacity-5 hover-bg-glass">
                                                <div className="device-circle bg-white bg-opacity-5 text-secondary"><session.icon size={18} /></div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="small text-white fw-bold">{session.device}</span>
                                                        {session.status === 'Current' && <span className="smaller px-2 py-0 bg-success bg-opacity-10 text-success rounded-pill fw-bold uppercase">Online Now</span>}
                                                    </div>
                                                    <div className="smaller text-secondary font-monospace opacity-50">{session.loc} • {session.status}</div>
                                                </div>
                                                <button className="btn btn-icon-glass circle text-danger"><LogOut size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center pt-3 mt-4 border-top border-white border-opacity-5">
                                        <button className="btn btn-link text-danger smaller fw-bold text-decoration-none">Terminate All Other Session Instances</button>
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'Notifications' || activeTab === 'Preferences') && (
                                <div className="text-center py-5 glass-card-inset border-dashed rounded-5">
                                    <div className="p-5">
                                        <History size={48} className="text-secondary opacity-15 mb-4" />
                                        <h5 className="fw-bold text-white">{activeTab} Convergence</h5>
                                        <p className="smaller text-secondary mb-0">Synchronizing preferences with institutional cloud... coming soon.</p>
                                    </div>
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
