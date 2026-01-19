import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import RulesSettings from '../settings/RulesSettings';

const CirculationRules = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    // Initial state matching what was in Settings.jsx
    // In a real app, this would come from an API
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

    useEffect(() => {
        setLoading(true);
        // Simulate API load
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleSave = () => {
        console.log("Saving Circulation Rules:", rules);
        toast.success('Circulation rules saved successfully');
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 d-flex align-items-center">
                        <ShieldCheck className="me-2 text-primary" />
                        Circulation Rules & Policies
                    </h1>
                    <p className="text-muted">Define access limits, fine slabs, and issue durations for each member role.</p>
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

            {/* Reusing the robust RulesSettings component */}
            <RulesSettings rules={rules} setRules={setRules} />
        </div>
    );
};

export default CirculationRules;
