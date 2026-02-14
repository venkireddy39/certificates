import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiDownload, FiMoreVertical, FiCheckCircle, FiAlertCircle, FiClock, FiFileText, FiPlus, FiX, FiRefreshCcw } from 'react-icons/fi';
import './FeeManagement.css';
import feeService from '../../services/feeService';
import { userService } from '../Users/services/userService';

// Portal Helper moved outside to prevent re-creation on render
const ModalPortal = ({ children }) => {
    return ReactDOM.createPortal(children, document.body);
};

const FeePayments = ({ setActiveTab }) => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    // Data states
    const [transactions, setTransactions] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [paymentForm, setPaymentForm] = useState({
        uuid: '', // Using UUID/search term to find allocation
        allocationId: '',
        amount: '',
        mode: 'UPI',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        remarks: '',
        isThirdParty: false,
        provider: '',
        cardNumber: '',
        tenure: '',
        studentName: '',
        studentEmail: '',
        manualDiscount: ''
    });

    // Loading states
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paymentsRes, allocationsRes, externalStudents] = await Promise.all([
                feeService.getAllPayments(),
                feeService.getAllFeeAllocations(),
                userService.getAllStudents().catch(() => [])
            ]);

            // Create a lookup map for names
            const studentMap = {};
            if (Array.isArray(externalStudents)) {
                externalStudents.forEach(s => {
                    const name = `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim();
                    if (s.user?.userId) studentMap[s.user.userId] = name;
                    if (s.studentId) studentMap[s.studentId] = name;
                });
            }

            // Patch allocations with names from external backend if local name is null/empty
            const patchedAllocations = (allocationsRes || []).map(a => ({
                ...a,
                studentName: (a.studentName && a.studentName !== 'null') ? a.studentName : (studentMap[a.userId] || `Student #${a.userId}`)
            }));

            // Patch transactions as well
            const patchedTransactions = (paymentsRes || []).map(t => {
                const alloc = patchedAllocations.find(a => a.allocationId === t.allocationId);
                return {
                    ...t,
                    studentName: (t.studentName && t.studentName !== 'null') ? t.studentName : (alloc?.studentName || `User #${t.paymentId}`)
                };
            });

            setTransactions(patchedTransactions);
            setAllocations(patchedAllocations);
        } catch (error) {
            console.error("Failed to fetch payments data", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'SUCCESS':
            case 'Paid': return <span className="status-badge paid"><FiCheckCircle /> Paid</span>;
            case 'PENDING':
            case 'Pending': return <span className="status-badge pending"><FiClock /> Pending</span>;
            case 'FAILED':
            case 'Overdue': return <span className="status-badge overdue"><FiAlertCircle /> Overdue</span>;
            case 'PARTIALLY_PAID':
            case 'Partial': return <span className="status-badge pending" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}><FiClock /> Partial</span>;
            default: return null;
        }
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Basic Validation
        if (!paymentForm.allocationId || !paymentForm.amount) {
            alert("Please select a student allocation and enter amount");
            return;
        }

        const params = {
            allocationId: paymentForm.allocationId,
            amount: paymentForm.amount,
            paymentMode: paymentForm.isThirdParty ? 'CARD' : paymentForm.mode.toUpperCase(), // Map appropriately
            transactionRef: paymentForm.transactionId || `MAN-REF-${Date.now()}`,
            recordedBy: 1, // Mock Admin ID or get from Auth
            studentName: paymentForm.studentName,
            studentEmail: paymentForm.studentEmail,
            manualDiscount: paymentForm.manualDiscount || 0
        };

        try {
            await feeService.recordManualPayment(params);

            // Refresh Data
            await fetchData();

            setShowRecordModal(false);
            setPaymentForm({
                uuid: '',
                allocationId: '',
                amount: '',
                mode: 'UPI',
                transactionId: '',
                date: new Date().toISOString().split('T')[0],
                remarks: '',
                isThirdParty: false,
                provider: '',
                cardNumber: '',
                tenure: '',
                studentName: '',
                studentEmail: '',
                manualDiscount: ''
            });

            alert("Payment recorded successfully!");

        } catch (error) {
            console.error("Payment failed", error);
            alert("Failed to record payment: " + (error.response?.data?.message || error.message));
        }
    };

    const openInvoice = (txn) => {
        setSelectedTransaction(txn);
        setShowInvoiceModal(true);
    }

    // Helper to get student name from allocation ID
    const getStudentName = (allocationId) => {
        const alloc = allocations.find(a => a.allocationId === allocationId);
        return alloc ? alloc.studentName : 'Unknown Student';
    };

    // Filter Logic
    const filteredData = transactions.filter(t => {
        const studentName = getStudentName(t.allocationId).toLowerCase();
        const ref = (t.transactionReference || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch = studentName.includes(search) || ref.includes(search);
        const matchesFilter = filter === 'All'
            ? true
            : (t.paymentStatus === filter.toUpperCase() || (filter === 'Paid' && t.paymentStatus === 'SUCCESS'));

        return matchesSearch && matchesFilter;
    });

    // Handle student search in modal
    const searchAllocations = () => {
        if (!paymentForm.uuid) return [];
        const search = paymentForm.uuid.toLowerCase();
        return allocations.filter(a =>
            a.status !== 'COMPLETED' &&
            (
                a.studentName?.toLowerCase().includes(search) ||
                String(a.allocationId).includes(search) ||
                a.courseName?.toLowerCase().includes(search)
            )
        );
    };

    const filteredAllocations = searchAllocations();

    const selectAllocation = (alloc) => {
        setPaymentForm({
            ...paymentForm,
            allocationId: alloc.allocationId,
            uuid: alloc.studentName + ` (ID: ${alloc.allocationId})`, // Display name
            studentName: alloc.studentName,
            studentEmail: alloc.studentEmail || '', // Assuming allocation might have it or we fetch
            amount: alloc.remainingAmount // Pre-fill with remaining?
        });
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
                            placeholder="Search student or txn..."
                            style={{ border: 'none', background: 'transparent', outline: 'none' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => setShowRecordModal(true)} style={{ padding: '8px 16px' }}>
                        <FiPlus /> Record Payment
                    </button>
                    <button className="btn-icon"><FiDownload /></button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Allocation ID</th>
                            <th>Amount</th>
                            <th>Payment Date</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20 }}>Loading payments...</td></tr>
                        ) : (
                            filteredData.map(txn => (
                                <tr key={txn.paymentId}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{getStudentName(txn.allocationId)}</div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>Ref: {txn.transactionReference}</div>
                                    </td>
                                    <td>{txn.allocationId}</td>
                                    <td>₹{txn.paidAmount}</td>
                                    <td>{new Date(txn.paymentDate).toLocaleDateString()}</td>
                                    <td>{txn.paymentMode}</td>
                                    <td>{getStatusBadge(txn.paymentStatus)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                                            {txn.paymentStatus === 'SUCCESS' && (
                                                <button
                                                    className="btn-icon"
                                                    title="View Receipt"
                                                    style={{ width: 32, height: 32 }}
                                                    onClick={() => openInvoice(txn)}
                                                >
                                                    <FiFileText size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && filteredData.length === 0 && (
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
                                    {/* Student Allocation Search */}
                                    <div className="form-group" style={{ marginBottom: 16, position: 'relative' }}>
                                        <label className="form-label">Search Student Name / Allocation ID</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Type to search..."
                                            value={paymentForm.uuid}
                                            onChange={e => setPaymentForm({ ...paymentForm, uuid: e.target.value, allocationId: '' })}
                                        />
                                        {/* Dropdown for results */}
                                        {paymentForm.uuid && !paymentForm.allocationId && filteredAllocations.length > 0 && (
                                            <div className="dropdown-menu show" style={{
                                                position: 'absolute', top: '100%', left: 0, right: 0,
                                                zIndex: 100, maxHeight: 200, overflowY: 'auto',
                                                background: 'white', border: '1px solid #e2e8f0', borderRadius: 8
                                            }}>
                                                {filteredAllocations.map(alloc => (
                                                    <div
                                                        key={alloc.allocationId}
                                                        className="dropdown-item"
                                                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                                                        onClick={() => selectAllocation(alloc)}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ fontWeight: 600 }}>{alloc.studentName}</div>
                                                            <div style={{ fontSize: 11, background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: 4 }}>
                                                                Batch: {alloc.batchId || 'N/A'}
                                                            </div>
                                                        </div>
                                                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                                            {alloc.courseName || 'No Course'} | <span style={{ color: '#ef4444', fontWeight: 600 }}>Due: ₹{alloc.remainingAmount}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {paymentForm.allocationId && (
                                        <div style={{
                                            background: '#fef2f2',
                                            padding: '12px',
                                            borderRadius: 8,
                                            marginBottom: 16,
                                            border: '1px solid #fee2e2',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: 12, color: '#991b1b', textTransform: 'uppercase', fontWeight: 700 }}>Selected Student</div>
                                                <div style={{ fontWeight: 600, color: '#111827' }}>{paymentForm.uuid}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 12, color: '#991b1b', textTransform: 'uppercase', fontWeight: 700 }}>Total Due</div>
                                                <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444' }}>₹{allocations.find(a => a.id === paymentForm.allocationId)?.remainingAmount || 0}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-grid" style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div className="form-group">
                                            <label className="form-label">Amount (₹) <span style={{ fontSize: 10, color: '#64748b' }}>(Actual Pay)</span></label>
                                            <input type="number" className="form-input" placeholder="0.00" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Early Discount (₹)</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                placeholder="0.00"
                                                style={{ border: '1px solid #10b981', background: '#f0fdf4' }}
                                                value={paymentForm.manualDiscount}
                                                onChange={e => setPaymentForm({ ...paymentForm, manualDiscount: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 16 }}>
                                        <label className="form-label">Payment Mode</label>
                                        <select className="form-select" value={paymentForm.mode} onChange={e => setPaymentForm({ ...paymentForm, mode: e.target.value })}>
                                            <option value="UPI">UPI</option>
                                            <option value="CASH">Cash</option>
                                            <option value="BANK_TRANSFER">Bank Transfer</option>
                                            <option value="CHEQUE">Cheque</option>
                                            <option value="CARD">Card</option>
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 16 }}>
                                        <label className="form-label">Transaction Reference</label>
                                        <input type="text" className="form-input" placeholder="Optional (Auto-generated if empty)" value={paymentForm.transactionId} onChange={e => setPaymentForm({ ...paymentForm, transactionId: e.target.value })} />
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
                                                <div style={{ fontSize: 12, color: '#64748b' }}>Receipt #{selectedTransaction.paymentId}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 600 }}>Date</div>
                                                <div>{new Date(selectedTransaction.paymentDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: 20 }}>
                                            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>To</div>
                                            <div style={{ fontWeight: 600, fontSize: 16 }}>{getStudentName(selectedTransaction.allocationId)}</div>
                                        </div>

                                        <div className="invoice-row" style={{ borderBottom: '2px solid #e2e8f0', fontWeight: 600, fontSize: 12, color: '#64748b' }}>
                                            <span>DESCRIPTION</span>
                                            <span>AMOUNT</span>
                                        </div>
                                        <div className="invoice-row">
                                            <span>Fee Payment</span>
                                            <span>₹{selectedTransaction.paidAmount}</span>
                                        </div>

                                        <div className="invoice-total">
                                            <span>TOTAL PAID</span>
                                            <span>₹{selectedTransaction.paidAmount}</span>
                                        </div>
                                    </div>
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
