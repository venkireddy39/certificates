import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBell, FiInfo, FiCheckCircle, FiAlertCircle, FiSettings,
    FiMail, FiMessageSquare, FiSmartphone, FiClock, FiActivity,
    FiUserCheck, FiSave, FiList
} from 'react-icons/fi';
import './FeeManagement.css';

const FeeSettings = () => {
    const [notifications, setNotifications] = useState({
        creation: {
            id: 'creation',
            enabled: true,
            title: 'Fee Creation',
            description: 'Trigger when a new fee is created or assigned.',
            channels: { inApp: true, email: true, sms: false },
            recipients: { student: true, parent: true, mentor: true },
            template: "A new fee of {{amount}} has been assigned. Due date: {{dueDate}}."
        },
        pending: {
            id: 'pending',
            enabled: true,
            title: 'Pending Fee Reminder',
            description: 'Remind before the due date arises.',
            channels: { inApp: true, email: true, sms: true },
            recipients: { student: true, parent: true, mentor: false },
            config: { daysBefore: 3, repeat: true },
            template: "Your fee of {{amount}} is due on {{dueDate}}. Please pay to avoid late fees."
        },
        overdue: {
            id: 'overdue',
            enabled: true,
            title: 'Overdue Fee Alert',
            description: 'Trigger when due date is crossed.',
            channels: { inApp: true, email: true, sms: true },
            recipients: { student: true, parent: true, mentor: true },
            config: { autoLateFee: true },
            template: "Your fee is overdue. Default late fee rules will be applied."
        },
        paymentSuccess: {
            id: 'paymentSuccess',
            enabled: true,
            title: 'Payment Successful',
            description: 'Trigger when a payment is successfully recorded.',
            channels: { inApp: true, email: true, sms: false },
            recipients: { student: true, parent: true, mentor: false },
            config: { generateReceipt: true },
            template: "Payment of {{paidAmount}} successful. Transaction ID: {{txnId}}."
        },
        partialPayment: {
            id: 'partialPayment',
            enabled: true,
            title: 'Partial Payment',
            description: 'Trigger when a partial payment is made.',
            channels: { inApp: true, email: false, sms: false },
            recipients: { student: true, parent: true, mentor: false },
            template: "Partial payment of {{paidAmount}} received. Remaining: {{balance}}."
        },
        refundStatus: {
            id: 'refundStatus',
            enabled: true,
            title: 'Refund Status Update',
            description: 'Trigger when a refund is approved or rejected.',
            channels: { inApp: true, email: true, sms: false },
            recipients: { student: true, admin: true }, // Added admin as a concept here, though typically admin is system
            template: "Your refund request for {{amount}} has been {{status}}."
        }
    });

    const handleToggle = (key, field, nestedField = null) => {
        setNotifications(prev => {
            const newState = { ...prev };
            if (nestedField) {
                newState[key][field][nestedField] = !newState[key][field][nestedField];
            } else {
                newState[key][field] = !newState[key][field];
            }
            return newState;
        });
    };

    const handleConfigChange = (key, configKey, value) => {
        setNotifications(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                config: {
                    ...prev[key].config,
                    [configKey]: value
                }
            }
        }));
    };

    const NotificationCard = ({ notifType, data }) => (
        <motion.div
            className="glass-card"
            style={{ padding: 24, borderLeft: data.enabled ? '4px solid #6366f1' : '4px solid #cbd5e1' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{data.title}</h3>
                        <div className={`status-badge ${data.enabled ? 'paid' : 'pending'}`}>
                            {data.enabled ? 'Active' : 'Disabled'}
                        </div>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {data.description}
                    </p>
                </div>
                <div
                    className={`toggle-switch ${data.enabled ? 'active' : ''}`}
                    onClick={() => handleToggle(notifType, 'enabled')}
                >
                    <div className="toggle-track"><div className="toggle-thumb"></div></div>
                </div>
            </div>

            {data.enabled && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                >
                    <div className="section-divider" style={{ margin: '16px 0' }}></div>

                    <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>

                        {/* Recipients */}
                        <div>
                            <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Recipients</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {Object.keys(data.recipients || {}).map(role => (
                                    <label key={role} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={data.recipients[role]}
                                            onChange={() => handleToggle(notifType, 'recipients', role)}
                                        />
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Channels */}
                        <div>
                            <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Channels</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.channels.inApp}
                                        onChange={() => handleToggle(notifType, 'channels', 'inApp')}
                                    />
                                    <FiBell size={14} /> In-App
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.channels.email}
                                        onChange={() => handleToggle(notifType, 'channels', 'email')}
                                    />
                                    <FiMail size={14} /> Email
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.channels.sms}
                                        onChange={() => handleToggle(notifType, 'channels', 'sms')}
                                    />
                                    <FiSmartphone size={14} /> SMS
                                </label>
                            </div>
                        </div>

                        {/* Configuration Specifics */}
                        {(data.config || data.template) && (
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Configuration</label>

                                <div style={{ background: 'rgba(255,255,255,0.5)', padding: 12, borderRadius: 12, border: '1px solid var(--glass-border)' }}>

                                    {/* Specific Config Inputs */}
                                    {notifType === 'pending' && (
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 13 }}>Remind</span>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    style={{ width: 60, padding: '4px 8px' }}
                                                    value={data.config.daysBefore}
                                                    onChange={(e) => handleConfigChange(notifType, 'daysBefore', e.target.value)}
                                                />
                                                <span style={{ fontSize: 13 }}>days before due date</span>
                                            </div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={data.config.repeat}
                                                    onChange={(e) => handleConfigChange(notifType, 'repeat', e.target.checked)}
                                                />
                                                Auto-repeat daily until paid
                                            </label>
                                        </div>
                                    )}

                                    {notifType === 'overdue' && (
                                        <div style={{ marginBottom: 12 }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={data.config.autoLateFee}
                                                    onChange={(e) => handleConfigChange(notifType, 'autoLateFee', e.target.checked)}
                                                />
                                                Auto-apply late fee & update status to 'Overdue'
                                            </label>
                                        </div>
                                    )}

                                    {notifType === 'paymentSuccess' && (
                                        <div style={{ marginBottom: 12 }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={data.config.generateReceipt}
                                                    onChange={(e) => handleConfigChange(notifType, 'generateReceipt', e.target.checked)}
                                                />
                                                Generate PDF Receipt automatically
                                            </label>
                                        </div>
                                    )}

                                    {/* Template Preview */}
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                        <strong>Message Preview:</strong>
                                        <div style={{
                                            marginTop: 4,
                                            fontFamily: 'monospace',
                                            background: 'rgba(0,0,0,0.05)',
                                            padding: 8,
                                            borderRadius: 6
                                        }}>
                                            {data.template}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            )}
        </motion.div>
    );

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Notification Triggers & Automation</h2>
                <button className="btn-primary"><FiSave /> Save Changes</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, alignItems: 'start' }}>
                <NotificationCard notifType="creation" data={notifications.creation} />
                <NotificationCard notifType="pending" data={notifications.pending} />
                <NotificationCard notifType="overdue" data={notifications.overdue} />
                <NotificationCard notifType="paymentSuccess" data={notifications.paymentSuccess} />
                <NotificationCard notifType="partialPayment" data={notifications.partialPayment} />
                <NotificationCard notifType="refundStatus" data={notifications.refundStatus} />
            </div>

            {/* Logs Section Preview */}
            <div className="glass-card" style={{ marginTop: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Review Recent Notification Logs</h3>
                    <button className="btn-icon" style={{ width: 'auto', padding: '0 12px', fontSize: 12, gap: 6 }}>
                        <FiList /> View All Logs
                    </button>
                </div>
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Trigger</th>
                            <th>Recipient</th>
                            <th>Channel</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Today, 10:30 AM</td>
                            <td>Payment Success</td>
                            <td>Student: Alice</td>
                            <td>Email, In-App</td>
                            <td><span className="status-badge paid">Sent</span></td>
                        </tr>
                        <tr>
                            <td>Yesterday, 4:15 PM</td>
                            <td>Pending Reminder</td>
                            <td>Parent: Mr. Smith</td>
                            <td>SMS</td>
                            <td><span className="status-badge paid">Sent</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeeSettings;
