import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiPlus, FiSearch, FiArrowRight, FiUsers,
    FiDollarSign, FiAlertCircle, FiTrendingUp, FiSettings, FiActivity, FiList, FiClock, FiRefreshCcw
} from 'react-icons/fi';
import { apiFetch } from '../../services/apiFetch';

// Sub-module Imports
import FeeBatches from './FeeBatches';
import FeeInstallments from './FeeInstallments';
import FeePayments from './FeePayments';
import FeeRefunds from './FeeRefunds';
import FeeSettings from './FeeSettings';
import FeeAuditLogs from './FeeAuditLogs';

import './FeeManagement.css';

const FeeDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalCollection: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        monthlyRevenue: 0
    });
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'overview') {
            loadDashboardData();
        }
    }, [activeTab]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch allocations for overview list
            const data = await apiFetch('/api/fee/allocations');
            setAllocations(Array.isArray(data) ? data : []);

            // Stats could be computed or fetched from a summary endpoint
            setStats({
                totalCollection: 1250000,
                pendingAmount: 450000,
                overdueAmount: 120000,
                monthlyRevenue: 320000
            });
        } catch (error) {
            console.error("Dashboard load failed:", error);
            setAllocations([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAllocations = allocations.filter(a =>
        (a.student?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.student?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FiTrendingUp /> },
        { id: 'batches', label: 'Batches', icon: <FiUsers /> },
        { id: 'installments', label: 'Installments', icon: <FiList /> },
        { id: 'payments', label: 'Payments', icon: <FiDollarSign /> },
        { id: 'refunds', label: 'Refunds', icon: <FiRefreshCcw /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings /> },
        { id: 'audit', label: 'Audit Log', icon: <FiActivity /> },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'batches': return <FeeBatches />;
            case 'installments': return <FeeInstallments />;
            case 'payments': return <FeePayments />;
            case 'refunds': return <FeeRefunds />;
            case 'settings': return <FeeSettings />;
            case 'audit': return <FeeAuditLogs />;
            default: return (
                <div className="overview-content">
                    {/* KPI Cards */}
                    <div className="stats-grid">
                        {[
                            { label: 'Total Collection', value: stats.totalCollection, icon: <FiDollarSign />, color: 'bg-green-500' },
                            { label: 'Pending Amount', value: stats.pendingAmount, icon: <FiAlertCircle />, color: 'bg-yellow-500' },
                            { label: 'Overdue Amount', value: stats.overdueAmount, icon: <FiAlertCircle />, color: 'bg-red-500' },
                            { label: 'Monthly Revenue', value: stats.monthlyRevenue, icon: <FiTrendingUp />, color: 'bg-blue-500' }
                        ].map((kpi, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={kpi.label}
                                className="glass-card stat-item"
                            >
                                <div className="stat-header">
                                    <div className="stat-icon" style={{ background: kpi.color === 'bg-green-500' ? 'var(--success-gradient)' : kpi.color === 'bg-yellow-500' ? 'var(--warning-gradient)' : kpi.color === 'bg-red-500' ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'var(--primary-gradient)' }}>
                                        {kpi.icon}
                                    </div>
                                </div>
                                <div style={{ marginTop: '16px' }}>
                                    <div className="stat-label">{kpi.label}</div>
                                    <div className="stat-value">₹{kpi.value.toLocaleString()}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Search & List */}
                    <div className="glass-card">
                        <div className="controls-row">
                            <div className="section-title" style={{ marginBottom: 0 }}>
                                <FiUsers /> Recent Student Allocations
                            </div>
                            <div style={{ position: 'relative', width: '280px' }}>
                                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    className="form-input"
                                    style={{ width: '100%', paddingLeft: '36px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Structure</th>
                                        <th>Total Fee</th>
                                        <th>Paid</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading allocations...</td></tr>
                                    ) : filteredAllocations.length > 0 ? filteredAllocations.map(alloc => (
                                        <tr key={alloc.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alloc.student?.firstName} {alloc.student?.lastName}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{alloc.student?.email}</div>
                                            </td>
                                            <td>{alloc.structure?.name}</td>
                                            <td style={{ fontWeight: 600 }}>₹{alloc.totalAmount?.toLocaleString()}</td>
                                            <td style={{ fontWeight: 600, color: '#10b981' }}>₹{alloc.paidAmount?.toLocaleString()}</td>
                                            <td>
                                                <span className={`status-badge ${alloc.status === 'PAID' ? 'paid' :
                                                    alloc.status === 'OVERDUE' ? 'overdue' : 'pending'
                                                    }`}>
                                                    {alloc.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => navigate(`/admin/fee/allocation/${alloc.id}`)}
                                                    style={{ background: 'transparent', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    View Details <FiArrowRight />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No fee allocations found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="fee-container">
            <div className="fee-header">
                <div>
                    <div className="fee-title">
                        <h1>Fee Module</h1>
                    </div>
                    <p className="fee-subtitle">Manage structures, payments, and system configurations</p>
                </div>
                <button
                    onClick={() => navigate('/admin/fee/create')}
                    className="btn-primary"
                >
                    <FiPlus /> New Fee Structure
                </button>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="nav-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderTabContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FeeDashboard;
