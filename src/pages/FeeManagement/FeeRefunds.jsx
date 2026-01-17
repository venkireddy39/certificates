import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCcw, FiCheck, FiX, FiEye, FiMoreHorizontal } from 'react-icons/fi';
import './FeeManagement.css';

const FeeRefunds = () => {
    const [activeTab, setActiveTab] = useState('Pending');

    const refunds = [
        { id: 101, student: "Michael Scott", amount: "₹5,000", reason: "Course Withdrawal", date: "Jan 06, 2026", status: "Pending" },
        { id: 102, student: "Jim Halpert", amount: "₹1,200", reason: "Double Payment", date: "Jan 04, 2026", status: "Approved" },
        { id: 103, student: "Dwight Schrute", amount: "₹12,000", reason: "Not Satisfied", date: "Jan 01, 2026", status: "Rejected" },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return { background: '#dcfce7', color: '#166534' };
            case 'Rejected': return { background: '#fee2e2', color: '#991b1b' };
            case 'Pending': return { background: '#fef3c7', color: '#92400e' };
            default: return {};
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                {['Pending', 'Approved', 'Rejected'].map(t => (
                    <button
                        key={t}
                        className={`nav-tab ${activeTab === t ? 'active' : ''}`}
                        onClick={() => setActiveTab(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="glass-card table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Student</th>
                            <th>Amount</th>
                            <th>Reason</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refunds.filter(r => r.status === activeTab).map(refund => (
                            <tr key={refund.id}>
                                <td>#REF-{refund.id}</td>
                                <td style={{ fontWeight: 600 }}>{refund.student}</td>
                                <td>{refund.amount}</td>
                                <td>{refund.reason}</td>
                                <td>{refund.date}</td>
                                <td>
                                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, ...getStatusStyle(refund.status) }}>
                                        {refund.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {refund.status === 'Pending' && (
                                            <>
                                                <button className="btn-icon" title="Approve" style={{ color: '#10b981' }}>
                                                    <FiCheck />
                                                </button>
                                                <button className="btn-icon" title="Reject" style={{ color: '#ef4444' }}>
                                                    <FiX />
                                                </button>
                                            </>
                                        )}
                                        <button className="btn-icon"><FiEye /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {refunds.filter(r => r.status === activeTab).length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                        No records in this category.
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default FeeRefunds;
