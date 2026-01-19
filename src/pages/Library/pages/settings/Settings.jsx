import React, { useState, useEffect } from 'react';
import { Save, Bell, Shield, BookOpen } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

import RulesSettings from './RulesSettings';
import NotificationSettings from './NotificationSettings';
import SystemSettings from './SystemSettings';

const TABS = {
    RULES: 'RULES',
    NOTIFICATIONS: 'NOTIFICATIONS',
    SYSTEM: 'SYSTEM'
};

const Settings = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState(TABS.RULES);
    const [loading, setLoading] = useState(false);

    // Initial state with multiple categories and fine slabs
    const [rules, setRules] = useState({
        'UG_ENGINEERING': {
            label: 'UG Engineering',
            maxBooks: 4,
            issueDays: 14,
            fineSlabs: [
                { id: 1, from: 1, to: 7, amount: 1 },
                { id: 2, from: 8, to: 30, amount: 5 },
                { id: 3, from: 31, to: 999, amount: 10 }
            ]
        },
        'PG_ENGINEERING': {
            label: 'PG Engineering',
            maxBooks: 6,
            issueDays: 30,
            fineSlabs: [
                { id: 1, from: 1, to: 15, amount: 0 },
                { id: 2, from: 16, to: 30, amount: 2 },
                { id: 3, from: 31, to: 999, amount: 5 }
            ]
        },
        'MBA': {
            label: 'MBA',
            maxBooks: 5,
            issueDays: 14,
            fineSlabs: [
                { id: 1, from: 1, to: 7, amount: 5 },
                { id: 2, from: 8, to: 999, amount: 50 }
            ]
        },
        'PHD': {
            label: 'PhD Scholar',
            maxBooks: 10,
            issueDays: 90,
            fineSlabs: [
                { id: 1, from: 1, to: 999, amount: 1 }
            ]
        },
        'FACULTY': {
            label: 'Faculty',
            maxBooks: 15,
            issueDays: 180,
            fineSlabs: []
        }
    });

    const [notifications, setNotifications] = useState({
        emailIssue: true,
        emailReturn: true,
        emailOverdue: true,
        smsIssue: false,
        smsReturn: false,
        smsOverdue: true
    });

    useEffect(() => {
        setLoading(true);
        // Simulate API load
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleSave = () => {
        // Validation log would handle recursively checking all categories
        console.log("Saving Rules:", rules);
        toast.success('Settings saved successfully');
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Settings</h1>
                    <p className="text-muted">Library configuration</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={loading}
                >
                    <Save size={18} className="me-2" />
                    Save Changes
                </button>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="list-group shadow-sm">
                        <button
                            className={`list-group-item ${activeTab === TABS.RULES ? 'active' : ''}`}
                            onClick={() => setActiveTab(TABS.RULES)}
                        >
                            <BookOpen size={16} className="me-2" /> Rules
                        </button>
                        <button
                            className={`list-group-item ${activeTab === TABS.NOTIFICATIONS ? 'active' : ''}`}
                            onClick={() => setActiveTab(TABS.NOTIFICATIONS)}
                        >
                            <Bell size={16} className="me-2" /> Notifications
                        </button>
                        <button
                            className={`list-group-item ${activeTab === TABS.SYSTEM ? 'active' : ''}`}
                            onClick={() => setActiveTab(TABS.SYSTEM)}
                        >
                            <Shield size={16} className="me-2" /> System
                        </button>
                    </div>
                </div>

                <div className="col-md-9">
                    {activeTab === TABS.RULES && (
                        <RulesSettings rules={rules} setRules={setRules} />
                    )}
                    {activeTab === TABS.NOTIFICATIONS && (
                        <NotificationSettings
                            notifications={notifications}
                            setNotifications={setNotifications}
                        />
                    )}
                    {activeTab === TABS.SYSTEM && <SystemSettings />}
                </div>
            </div>
        </div>
    );
};

export default Settings;
