import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiSave, FiLayers, FiUsers, FiCreditCard,
    FiCalendar, FiDollarSign, FiBell, FiSettings, FiSearch, FiX, FiPlus
} from 'react-icons/fi';
import './FeeManagement.css';

const CreateFee = () => {
    const navigate = useNavigate();

    // Form States
    const [basicDetails, setBasicDetails] = useState({
        name: '',
        type: 'Tuition Fee',
        amount: '',
        description: '',
        taxEnabled: false,
        taxPercentage: 18
    });

    const [assignment, setAssignment] = useState({
        course: '',
        batch: '',
        category: 'Normal',
        targetType: 'group', // 'group' or 'individual'
        selectedStudents: []
    });

    const [paymentConfig, setPaymentConfig] = useState({
        schedule: 'Monthly',
        installments: [
            { id: 1, name: 'Installment 1', percent: 100, due: '' }
        ],
        lateFeeEnabled: false,
        lateFeeType: 'amount', // 'amount' or 'percentage'
        lateFeeValue: '',
        autoApplyDiscounts: false
    });

    const [paymentMethods, setPaymentMethods] = useState({
        online: { upi: true, card: true, netbanking: true },
        manual: { cash: true, bankTransfer: true },
        allowManualRecording: true
    });

    const [notifications, setNotifications] = useState({
        autoUpdateStatus: true,
        notifyStudent: true,
        notifyParent: false,
        notifyMentor: false,
        triggers: {
            onCreation: true,
            onPending: true,
            onOverdue: true
        }
    });

    // Mock student search
    const [studentSearch, setStudentSearch] = useState('');
    const mockStudents = [
        { id: 1, name: 'Alice Johnson' },
        { id: 2, name: 'Bob Smith' },
        { id: 3, name: 'Charlie Brown' },
        { id: 4, name: 'David Lee' },
    ];

    const handleStudentSearchAdd = (student) => {
        if (!assignment.selectedStudents.find(s => s.id === student.id)) {
            setAssignment(prev => ({ ...prev, selectedStudents: [...prev.selectedStudents, student] }));
        }
    };

    const removeStudent = (id) => {
        setAssignment(prev => ({ ...prev, selectedStudents: prev.selectedStudents.filter(s => s.id !== id) }));
    };

    const handleBasicChange = (e) => setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
    const handleAssignChange = (e) => setAssignment({ ...assignment, [e.target.name]: e.target.value });

    const addInstallment = () => {
        setPaymentConfig(prev => ({
            ...prev,
            installments: [...prev.installments, { id: Date.now(), name: `Installment ${prev.installments.length + 1}`, percent: 0, due: '' }]
        }));
    };

    const updateInstallment = (id, field, value) => {
        setPaymentConfig(prev => ({
            ...prev,
            installments: prev.installments.map(inst => inst.id === id ? { ...inst, [field]: value } : inst)
        }));
    };

    const removeInstallment = (id) => {
        setPaymentConfig(prev => ({
            ...prev,
            installments: prev.installments.filter(inst => inst.id !== id)
        }));
    };

    // Toggle helper for nested objects
    const toggleNested = (stateSetter, parentKey, childKey) => {
        stateSetter(prev => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: !prev[parentKey][childKey]
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ basicDetails, assignment, paymentConfig, paymentMethods, notifications });
        // Add API call here
        alert('Fee Structure Created Successfully (Demo)');
        navigate('/fee');
    };

    return (
        <motion.div
            className="fee-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', overflowX: 'hidden' }}
        >
            {/* Header */}
            <header className="fee-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/fee')} className="btn-icon">
                        <FiArrowLeft />
                    </button>
                    <div className="fee-title">
                        <h1>Create New Fee</h1>
                        <div className="fee-subtitle">Define fee structure, pricing plans, and payment schedules</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={() => navigate('/fee')} style={{
                        background: 'transparent', border: '1px solid #cbd5e1',
                        padding: '10px 24px', borderRadius: '10px', fontWeight: 600, color: '#64748b', cursor: 'pointer'
                    }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="btn-primary">
                        <FiSave /> Save Fee Structure
                    </button>
                </div>
            </header>

            {/* Main Form Content */}
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Section 1: Basic Details */}
                <motion.div
                    className="glass-card form-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="section-title">
                        <div className="stat-icon" style={{ width: 32, height: 32, fontSize: 16 }}><FiLayers /></div>
                        Basic Details
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Fee Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="e.g. Annual Tuition Fee 2026"
                                value={basicDetails.name}
                                onChange={handleBasicChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fee Type *</label>
                            <select name="type" className="form-select" value={basicDetails.type} onChange={handleBasicChange}>
                                <option value="Tuition Fee">Tuition Fee</option>
                                <option value="Admission Fee">Admission Fee</option>
                                <option value="Exam Fee">Exam Fee</option>
                                <option value="Library Fee">Library Fee</option>
                                <option value="Custom Fee">Custom Fee</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Amount (₹) *</label>
                            <div style={{ position: 'relative' }}>
                                <FiDollarSign style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} />
                                <input
                                    type="number"
                                    name="amount"
                                    className="form-input"
                                    style={{ paddingLeft: 36 }}
                                    placeholder="0.00"
                                    value={basicDetails.amount}
                                    onChange={handleBasicChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tax Settings */}
                    <div className="form-group" style={{ marginTop: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Include Tax (GST/VAT)</label>
                            <div
                                className={`toggle-switch ${basicDetails.taxEnabled ? 'active' : ''}`}
                                onClick={() => setBasicDetails({ ...basicDetails, taxEnabled: !basicDetails.taxEnabled })}
                            >
                                <div className="toggle-track"><div className="toggle-thumb"></div></div>
                            </div>
                        </div>
                        {basicDetails.taxEnabled && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <input
                                    type="number"
                                    className="form-input"
                                    style={{ width: 100 }}
                                    value={basicDetails.taxPercentage}
                                    onChange={(e) => setBasicDetails({ ...basicDetails, taxPercentage: e.target.value })}
                                />
                                <span style={{ fontSize: 14, color: '#64748b' }}>% Tax Percentage</span>
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ marginTop: 24 }}>
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            name="description"
                            className="form-textarea"
                            placeholder="Add generic notes about this fee..."
                            value={basicDetails.description}
                            onChange={handleBasicChange}
                        ></textarea>
                    </div>
                </motion.div>

                {/* Section 2: Assign Fee To */}
                <motion.div
                    className="glass-card form-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="section-title">
                        <div className="stat-icon" style={{ width: 32, height: 32, fontSize: 16 }}><FiUsers /></div>
                        Assign Fee To
                    </div>

                    <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
                        <button
                            className={`nav-tab ${assignment.targetType === 'group' ? 'active' : ''}`}
                            onClick={() => setAssignment({ ...assignment, targetType: 'group' })}
                        >
                            Batch / Group
                        </button>
                        <button
                            className={`nav-tab ${assignment.targetType === 'individual' ? 'active' : ''}`}
                            onClick={() => setAssignment({ ...assignment, targetType: 'individual' })}
                        >
                            Specific Students
                        </button>
                    </div>

                    {assignment.targetType === 'group' ? (
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Select Course</label>
                                <select name="course" className="form-select" value={assignment.course} onChange={handleAssignChange}>
                                    <option value="">Select Course...</option>
                                    <option value="Full Stack Dev">Full Stack Web Development</option>
                                    <option value="Data Science">Data Science Bootcamp</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Select Batch</label>
                                <select name="batch" className="form-select" value={assignment.batch} onChange={handleAssignChange} disabled={!assignment.course}>
                                    <option value="">All Batches</option>
                                    <option value="Jan 2026">Jan 2026 Batch</option>
                                    <option value="Feb 2026">Feb 2026 Batch</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Student Category</label>
                                <select name="category" className="form-select" value={assignment.category} onChange={handleAssignChange}>
                                    <option value="Normal">Normal</option>
                                    <option value="Scholarship">Scholarship</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label className="form-label">Search & Add Students</label>
                            <div style={{ position: 'relative', marginBottom: 12 }}>
                                <FiSearch style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search by name or ID..."
                                    style={{ paddingLeft: 36 }}
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                />
                                {studentSearch && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0,
                                        background: 'white', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        zIndex: 10, padding: 8, border: '1px solid #e2e8f0'
                                    }}>
                                        {mockStudents.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())).map(student => (
                                            <div
                                                key={student.id}
                                                onClick={() => { handleStudentSearchAdd(student); setStudentSearch(''); }}
                                                style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: 8, ':hover': { background: '#f1f5f9' } }}
                                            >
                                                {student.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {assignment.selectedStudents.map(student => (
                                    <div key={student.id} className="status-badge" style={{ background: '#e0e7ff', color: '#4338ca', padding: '6px 12px' }}>
                                        {student.name}
                                        <FiX style={{ marginLeft: 6, cursor: 'pointer' }} onClick={() => removeStudent(student.id)} />
                                    </div>
                                ))}
                                {assignment.selectedStudents.length === 0 && <span style={{ color: '#94a3b8', fontSize: 13 }}>No individual students selected.</span>}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Section 3: Payment Configuration (Enhanced with Installments) */}
                <motion.div
                    className="glass-card form-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="section-title">
                        <div className="stat-icon" style={{ width: 32, height: 32, fontSize: 16 }}><FiCreditCard /></div>
                        Payment Schedule & Rules
                    </div>

                    <div className="form-group" style={{ marginBottom: 24 }}>
                        <label className="form-label">Payment Schedule Structure</label>
                        <select
                            className="form-select"
                            value={paymentConfig.schedule}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, schedule: e.target.value })}
                        >
                            <option value="OneTime">One-Time Payment</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="4Months">Every 4 Months</option>
                            <option value="HalfYearly">Half Yearly (6 Months)</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Installments">Custom Installments</option>
                        </select>
                    </div>

                    {paymentConfig.schedule === 'Installments' ? (
                        <div className="timeline-container">
                            {paymentConfig.installments.map((inst, index) => (
                                <div className="timeline-item" key={inst.id}>
                                    <div className="timeline-dot"></div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                                        <div style={{ flex: 2 }}>
                                            <label className="form-label" style={{ fontSize: 11 }}>Installment Name</label>
                                            <input type="text" className="form-input" value={inst.name} onChange={e => updateInstallment(inst.id, 'name', e.target.value)} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="form-label" style={{ fontSize: 11 }}>% of Total</label>
                                            <input type="number" className="form-input" value={inst.percent} onChange={e => updateInstallment(inst.id, 'percent', e.target.value)} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="form-label" style={{ fontSize: 11 }}>Due Date</label>
                                            <input type="date" className="form-input" value={inst.due} onChange={e => updateInstallment(inst.id, 'due', e.target.value)} />
                                        </div>
                                        {index > 0 && (
                                            <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => removeInstallment(inst.id)}><FiX /></button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button className="btn-icon" onClick={addInstallment} style={{ marginLeft: 6, width: 'auto', paddingRight: 12 }}>
                                <FiPlus /> Add Installment
                            </button>
                        </div>
                    ) : (
                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label className="form-label">Due Date</label>
                            <div style={{ position: 'relative' }}>
                                <FiCalendar style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} />
                                <input
                                    type="date"
                                    className="form-input"
                                    style={{ paddingLeft: 36 }}
                                    value={paymentConfig.dueDate}
                                    onChange={(e) => setPaymentConfig({ ...paymentConfig, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="section-divider"></div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" style={{ marginBottom: 12 }}>Late Fee Rules</label>
                            <div
                                className={`toggle-switch ${paymentConfig.lateFeeEnabled ? 'active' : ''}`}
                                onClick={() => setPaymentConfig({ ...paymentConfig, lateFeeEnabled: !paymentConfig.lateFeeEnabled })}
                            >
                                <div className="toggle-track"><div className="toggle-thumb"></div></div>
                                <span className="toggle-label">Enable Late Fee</span>
                            </div>
                        </div>
                        {paymentConfig.lateFeeEnabled && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Calculation Type</label>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button
                                            className={`nav-tab ${paymentConfig.lateFeeType === 'amount' ? 'active' : ''}`}
                                            onClick={() => setPaymentConfig({ ...paymentConfig, lateFeeType: 'amount' })}
                                        >
                                            Fixed Amount
                                        </button>
                                        <button
                                            className={`nav-tab ${paymentConfig.lateFeeType === 'percentage' ? 'active' : ''}`}
                                            onClick={() => setPaymentConfig({ ...paymentConfig, lateFeeType: 'percentage' })}
                                        >
                                            Percentage %
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Value</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Enter value"
                                        value={paymentConfig.lateFeeValue}
                                        onChange={(e) => setPaymentConfig({ ...paymentConfig, lateFeeValue: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Section 4: Payment Methods */}
                <motion.div className="glass-card form-section">
                    <div className="section-title">
                        <div className="stat-icon" style={{ width: 32, height: 32, fontSize: 16 }}><FiSettings /></div>
                        Payment Methods
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" style={{ marginBottom: 10 }}>Online Modes</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={paymentMethods.online.upi} onChange={() => toggleNested(setPaymentMethods, 'online', 'upi')} /> UPI
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={paymentMethods.online.card} onChange={() => toggleNested(setPaymentMethods, 'online', 'card')} /> Credit/Debit Card
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={paymentMethods.online.netbanking} onChange={() => toggleNested(setPaymentMethods, 'online', 'netbanking')} /> Net Banking
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ marginBottom: 10 }}>Manual Modes</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={paymentMethods.manual.cash} onChange={() => toggleNested(setPaymentMethods, 'manual', 'cash')} /> Cash
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={paymentMethods.manual.bankTransfer} onChange={() => toggleNested(setPaymentMethods, 'manual', 'bankTransfer')} /> Bank Transfer/Cheque
                            </label>
                        </div>
                        <div className="form-group" style={{ justifyContent: 'center' }}>
                            <div
                                className={`toggle-switch ${paymentMethods.allowManualRecording ? 'active' : ''}`}
                                onClick={() => setPaymentMethods({ ...paymentMethods, allowManualRecording: !paymentMethods.allowManualRecording })}
                            >
                                <div className="toggle-track"><div className="toggle-thumb"></div></div>
                                <span className="toggle-label">Allow Admin Manual Record</span>
                            </div>

                        </div>
                    </div>
                </motion.div>

                {/* Section 5: Notifications */}
                <motion.div className="glass-card form-section" style={{ marginBottom: 100 }}>
                    <div className="section-title">
                        <div className="stat-icon" style={{ width: 32, height: 32, fontSize: 16 }}><FiBell /></div>
                        Notifications & Automation
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Recipients</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={notifications.notifyStudent} onChange={() => setNotifications({ ...notifications, notifyStudent: !notifications.notifyStudent })} /> Student
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={notifications.notifyParent} onChange={() => setNotifications({ ...notifications, notifyParent: !notifications.notifyParent })} /> Parent
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={notifications.notifyMentor} onChange={() => setNotifications({ ...notifications, notifyMentor: !notifications.notifyMentor })} /> Mentor
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Triggers</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={notifications.triggers.onCreation} onChange={() => toggleNested(setNotifications, 'triggers', 'onCreation')} /> Fee Creation
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={notifications.triggers.onPending} onChange={() => toggleNested(setNotifications, 'triggers', 'onPending')} /> Pending Reminder
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                                <input type="checkbox" checked={notifications.triggers.onOverdue} onChange={() => toggleNested(setNotifications, 'triggers', 'onOverdue')} /> Overdue Alert
                            </label>
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default CreateFee;
