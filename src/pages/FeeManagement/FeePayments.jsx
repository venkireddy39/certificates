import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiDownload, FiMoreVertical, FiCheckCircle, FiAlertCircle, FiClock, FiFileText, FiPlus, FiX } from 'react-icons/fi';
import './FeeManagement.css';

const FeePayments = () => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
        studentId: '',
        amount: '',
        mode: 'UPI',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        remarks: ''
    });

    const transactions = [
        { id: 1, student: "Alice Johnson", fee: "Tuition Fee", amount: "₹12,000", date: "Jan 05, 2026", status: "Paid", method: "Online" },
        { id: 2, student: "Bob Smith", fee: "Exam Fee", amount: "₹500", date: "Jan 04, 2026", status: "Paid", method: "Cash" },
        { id: 3, student: "Charlie Brown", fee: "Tuition Fee", amount: "₹6,000", date: "Jan 03, 2026", status: "Partial", method: "Online" },
        { id: 4, student: "David Lee", fee: "Library Fee", amount: "₹200", date: "-", status: "Pending", method: "-" },
        { id: 5, student: "Eve Adams", fee: "Tuition Fee", amount: "₹12,000", date: "-", status: "Overdue", method: "-" },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="status-badge paid"><FiCheckCircle /> Paid</span>;
            case 'Pending': return <span className="status-badge pending"><FiClock /> Pending</span>;
            case 'Overdue': return <span className="status-badge overdue"><FiAlertCircle /> Overdue</span>;
            case 'Partial': return <span className="status-badge pending" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}><FiClock /> Partial</span>;
            default: return null;
        }
    };

    const handleRecordPayment = (e) => {
        e.preventDefault();
        // Here you would add the API call
        console.log("Payment Recorded:", paymentForm);
        alert("Payment Recorded Successfully!");
        setShowRecordModal(false);
        setPaymentForm({ studentId: '', amount: '', mode: 'UPI', transactionId: '', date: new Date().toISOString().split('T')[0], remarks: '' });
    };

    const openInvoice = (txn) => {
        setSelectedTransaction(txn);
        setShowInvoiceModal(true);
    }

    const filteredData = transactions.filter(t =>
        (filter === 'All' || t.status === filter) &&
        (t.student.toLowerCase().includes(searchTerm.toLowerCase()) || t.fee.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Portal Helper
    const ModalPortal = ({ children }) => {
        return ReactDOM.createPortal(children, document.body);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Controls */}
            <div className="controls-row">
                <div className="controls-left" style={{ display: 'flex', gap: 12 }}>
                    {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
                        <button
                            key={f}
                            className={`nav-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="controls-right" style={{ display: 'flex', gap: 12 }}>
                    <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiSearch color="#64748b" />
                        <input
                            type="text"
                            placeholder="Search student or fee..."
                            style={{ border: 'none', background: 'transparent', outline: 'none' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => setShowRecordModal(true)} style={{ padding: '8px 16px' }}>
                        <FiPlus /> Record Payment
                    </button>
                    <button className="btn-icon"><FiFilter /></button>
                    <button className="btn-icon"><FiDownload /></button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Fee Type</th>
                            <th>Amount</th>
                            <th>Payment Date</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(txn => (
                            <tr key={txn.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{txn.student}</div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>ID: STD-{100 + txn.id}</div>
                                </td>
                                <td>{txn.fee}</td>
                                <td>{txn.amount}</td>
                                <td>{txn.date}</td>
                                <td>{txn.method}</td>
                                <td>{getStatusBadge(txn.status)}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {txn.status === 'Paid' && (
                                            <button
                                                className="btn-icon"
                                                title="View Receipt"
                                                style={{ width: 32, height: 32 }}
                                                onClick={() => openInvoice(txn)}
                                            >
                                                <FiFileText size={14} />
                                            </button>
                                        )}
                                        <button className="btn-icon" style={{ width: 32, height: 32 }}>
                                            <FiMoreVertical size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                        No records found.
                    </div>
                )}
            </div>

            {/* Record Payment Modal */}
            <ModalPortal>
                <AnimatePresence>
                    {showRecordModal && (
                        <div className="modal-overlay">
                            <motion.div
                                className="modal-content"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                            >
                                <div className="modal-header">
                                    <h3 style={{ margin: 0 }}>Record Manual Payment</h3>
                                    <button className="btn-icon" onClick={() => setShowRecordModal(false)}><FiX /></button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group" style={{ marginBottom: 16 }}>
                                        <label className="form-label">Search Student ID / Name</label>
                                        <input type="text" className="form-input" placeholder="Enter student details..." value={paymentForm.studentId} onChange={e => setPaymentForm({ ...paymentForm, studentId: e.target.value })} />
                                    </div>
                                    <div className="form-grid" style={{ marginBottom: 16 }}>
                                        <div className="form-group">
                                            <label className="form-label">Amount (₹)</label>
                                            <input type="number" className="form-input" placeholder="0.00" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Payment Date</label>
                                            <input type="date" className="form-input" value={paymentForm.date} onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-grid" style={{ marginBottom: 16 }}>
                                        <div className="form-group">
                                            <label className="form-label">Payment Mode</label>
                                            <select className="form-select" value={paymentForm.mode} onChange={e => setPaymentForm({ ...paymentForm, mode: e.target.value })}>
                                                <option>UPI</option>
                                                <option>Cash</option>
                                                <option>Bank Transfer</option>
                                                <option>Cheque</option>
                                                <option>Card</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Transaction ID / Ref</label>
                                            <input type="text" className="form-input" placeholder="Optional" value={paymentForm.transactionId} onChange={e => setPaymentForm({ ...paymentForm, transactionId: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Remarks</label>
                                        <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Notes..." value={paymentForm.remarks} onChange={e => setPaymentForm({ ...paymentForm, remarks: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn-icon" style={{ borderRadius: 8, width: 'auto', padding: '0 16px' }} onClick={() => setShowRecordModal(false)}>Cancel</button>
                                    <button className="btn-primary" onClick={handleRecordPayment}>Record Payment</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Invoice Preview Modal */}
                <AnimatePresence>
                    {showInvoiceModal && selectedTransaction && (
                        <div className="modal-overlay">
                            <motion.div
                                className="modal-content"
                                style={{ maxWidth: 600 }}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="modal-header">
                                    <h3 style={{ margin: 0 }}>Payment Receipt</h3>
                                    <button className="btn-icon" onClick={() => setShowInvoiceModal(false)}><FiX /></button>
                                </div>
                                <div className="modal-body" style={{ background: '#f8fafc' }}>
                                    <div className="invoice-preview">
                                        <div className="invoice-header">
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: 24, marginBottom: 4 }}>WAC LMS</div>
                                                <div style={{ fontSize: 12, color: '#64748b' }}>Receipt #{1000 + selectedTransaction.id}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 600 }}>Date</div>
                                                <div>{selectedTransaction.date}</div>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: 20 }}>
                                            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>To</div>
                                            <div style={{ fontWeight: 600, fontSize: 16 }}>{selectedTransaction.student}</div>
                                            <div>Student ID: STD-{100 + selectedTransaction.id}</div>
                                        </div>

                                        <div className="invoice-row" style={{ borderBottom: '2px solid #e2e8f0', fontWeight: 600, fontSize: 12, color: '#64748b' }}>
                                            <span>DESCRIPTION</span>
                                            <span>AMOUNT</span>
                                        </div>
                                        <div className="invoice-row">
                                            <span>{selectedTransaction.fee}</span>
                                            <span>{selectedTransaction.amount}</span>
                                        </div>
                                        <div className="invoice-row">
                                            <span>Transaction Charge (0%)</span>
                                            <span>₹0.00</span>
                                        </div>

                                        <div className="invoice-total">
                                            <span>TOTAL PAID</span>
                                            <span>{selectedTransaction.amount}</span>
                                        </div>

                                        <div style={{ marginTop: 20, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                                            Thank you for your payment. This is a computer generated receipt.
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        <FiDownload /> Download PDF
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </ModalPortal>
        </motion.div>
    );
};

export default FeePayments;
