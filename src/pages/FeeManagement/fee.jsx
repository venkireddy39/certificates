import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiList, FiDollarSign, FiUsers, FiPieChart, FiTrendingUp,
    FiMoreVertical, FiFilter, FiDownload, FiPlus, FiSearch, FiCalendar,
    FiSettings, FiCreditCard, FiActivity, FiTag, FiAward, FiRefreshCcw,
    FiFileText, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import './FeeManagement.css';
import FeePayments from './FeePayments';
import FeeReports from './FeeReports';
import FeeRefunds from './FeeRefunds';
import FeeSettings from './FeeSettings';

// --- FeeDashboard Component ---
const FeeDashboard = () => {
    const kpiData = [
        { title: "Total Collection", value: "₹24,50,000", icon: <FiDollarSign />, color: "linear-gradient(135deg, #10b981 0%, #059669 100%)", subtitle: "This Year" },
        { title: "Pending Amount", value: "₹4,20,500", icon: <FiAlertCircle />, color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", subtitle: "125 Students" },
        { title: "Overdue Amount", value: "₹1,15,000", icon: <FiActivity />, color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", subtitle: "Action Required" },
        { title: "Monthly Revenue", value: "₹3,45,000", icon: <FiTrendingUp />, color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", subtitle: "Jan 2026" },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filters Row */}
            <div className="controls-row">
                <select className="form-select" style={{ maxWidth: 200 }}>
                    <option>All Courses</option>
                    <option>Full Stack Dev</option>
                    <option>Data Science</option>
                </select>
                <select className="form-select" style={{ maxWidth: 200 }}>
                    <option>All Batches</option>
                    <option>Jan 2026</option>
                    <option>Feb 2026</option>
                </select>
                <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 300 }}>
                    <FiSearch color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                    />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                {kpiData.map((kpi, index) => (
                    <motion.div
                        key={index}
                        className="glass-card stat-item"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: kpi.color }}>{kpi.icon}</div>
                            <button className="btn-icon"><FiMoreVertical /></button>
                        </div>
                        <div className="stat-value">{kpi.value}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="stat-label">{kpi.title}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{kpi.subtitle}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section Placeholder */}
            <div className="charts-grid" style={{ marginBottom: 32 }}>
                <div className="glass-card" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Revenue Trends</h3>
                        <select className="form-select" style={{ padding: '4px 8px', fontSize: 12 }}><option>Yearly</option></select>
                    </div>
                    <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12, paddingBottom: 12 }}>
                        {[35, 55, 45, 70, 65, 85, 60, 75, 50, 60, 80, 90].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05 }}
                                style={{ flex: 1, background: i === 11 ? '#6366f1' : '#e2e8f0', borderRadius: 4 }}
                            />
                        ))}
                    </div>
                </div>
                <div className="glass-card" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h3 style={{ alignSelf: 'flex-start', margin: '0 0 20px 0', fontSize: '18px' }}>Payment Methods</h3>
                    <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'conic-gradient(#10b981 0% 40%, #3b82f6 40% 70%, #f59e0b 70% 100%)', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 30, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span style={{ fontSize: 12, color: '#64748b' }}>Total</span>
                            <span style={{ fontSize: 18, fontWeight: 700 }}>1.2K</span>
                            <span style={{ fontSize: 12, color: '#64748b' }}>Txns</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', marginTop: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></span> Online (UPI/Card)</span>
                            <span>40%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%' }}></span> Net Banking</span>
                            <span>30%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, background: '#f59e0b', borderRadius: '50%' }}></span> Cash / Cheque</span>
                            <span>30%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Table */}
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3>Recent Transactions</h3>
                    <button className="btn-icon"><FiFilter /></button>
                </div>
                <div className="table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Fee Type</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 12 }}>AU</div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>Student Name {i}</div>
                                                <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: 202600{i}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Tuition Fee</td>
                                    <td>Jan {i + 5}, 2026</td>
                                    <td>₹12,000</td>
                                    <td>
                                        <span className={`status-badge ${i % 2 === 0 ? 'paid' : 'pending'}`}>
                                            {i % 2 === 0 ? <FiCheckCircle /> : <FiAlertCircle />}
                                            {i % 2 === 0 ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td><button className="btn-icon"><FiMoreVertical /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Layout ---

const FeeManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
        { id: 'pricing', label: 'Fee Structures', icon: <FiList /> }, // Renamed from Pricing Plans
        { id: 'payments', label: 'Payments', icon: <FiCreditCard /> },
        { id: 'reports', label: 'Reports', icon: <FiPieChart /> },
        { id: 'refunds', label: 'Refunds', icon: <FiRefreshCcw /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings /> },
    ];

    return (
        <div className="fee-container">
            {/* Header */}
            <header className="fee-header">
                <div className="fee-title">
                    <h1>Fee Management</h1>
                    <div className="fee-subtitle">Manage payments, structures, and financial reports</div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiSearch color="#64748b" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            style={{ border: 'none', background: 'transparent', outline: 'none', minWidth: '200px' }}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => navigate('/fee/create')}>
                        <FiPlus /> Create Fee
                    </button>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="nav-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <FeeDashboard />}
                    {activeTab === 'payments' && <FeePayments />}
                    {activeTab === 'reports' && <FeeReports />}
                    {activeTab === 'refunds' && <FeeRefunds />}

                    {activeTab === 'settings' && <FeeSettings />}

                    {['pricing'].includes(activeTab) && (
                        <div className="glass-card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                <FiSettings size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <h3>{tabs.find(t => t.id === activeTab)?.label} Module</h3>
                                <p>This module is currently under development.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FeeManagement;