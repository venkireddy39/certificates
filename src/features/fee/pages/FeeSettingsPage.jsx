import React, { useEffect, useState } from 'react';

const API_BASE = '';

export default function FeeSettingsPage() {
    const [days, setDays] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null); // { type, text }

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API_BASE}/api/admin/settings/payment-link-days`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { setDays(String(data.days ?? 3)); setLoading(false); })
            .catch(() => { setDays('3'); setLoading(false); });
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const val = parseInt(days);
        if (isNaN(val) || val < 1 || val > 30) {
            setMsg({ type: 'error', text: 'Please enter a value between 1 and 30.' });
            return;
        }
        setSaving(true);
        setMsg(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/api/admin/settings/payment-link-days`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ days: val })
            });
            if (!res.ok) throw new Error('Save failed');
            setMsg({ type: 'success', text: `✅ Saved! Payment links will be sent ${val} day(s) before due date.` });
        } catch {
            setMsg({ type: 'error', text: '❌ Failed to save. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container-fluid py-4" style={{ maxWidth: 760 }}>
            <h5 className="fw-bold mb-1">Fee Module Settings</h5>
            <p className="text-muted small mb-4">Configure automated payment link behavior and notification timing.</p>

            {/* Payment Link Timing */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-bottom py-3">
                    <h6 className="fw-bold mb-0">📅 Automatic Payment Link</h6>
                    <small className="text-muted">
                        The system automatically generates and emails a payment link to students before their installment due date.
                    </small>
                </div>
                <div className="card-body p-4">
                    {loading ? (
                        <div className="text-center py-3">
                            <span className="spinner-border spinner-border-sm text-primary me-2" />
                            Loading current setting…
                        </div>
                    ) : (
                        <form onSubmit={handleSave}>
                            <div className="row align-items-end g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Send payment link <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            min="1"
                                            max="30"
                                            className="form-control"
                                            value={days}
                                            onChange={e => setDays(e.target.value)}
                                            required
                                        />
                                        <span className="input-group-text bg-light fw-semibold text-muted">
                                            day(s) before due date
                                        </span>
                                    </div>
                                    <small className="text-muted">Valid range: 1 – 30 days. Scheduler runs daily at 9 AM IST.</small>
                                </div>
                                <div className="col-md-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                                            : 'Save Setting'}
                                    </button>
                                </div>
                            </div>
                            {msg && (
                                <div className={`alert mt-3 mb-0 py-2 ${msg.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                                    {msg.text}
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>

            {/* Info Card */}
            <div className="card border-0 bg-light">
                <div className="card-body p-3">
                    <h6 className="fw-bold mb-2">ℹ️ How It Works</h6>
                    <ul className="mb-0 small text-muted ps-3">
                        <li>Every day at <strong>9:00 AM IST</strong>, the system checks for upcoming installments.</li>
                        <li>If a PENDING installment is due within the configured days, a <strong>payment link is created</strong> via Cashfree.</li>
                        <li>The link is <strong>emailed to the student automatically</strong> — no admin action needed.</li>
                        <li>Admin can still manually send links from the <strong>Student Ledger</strong> tab at any time.</li>
                        <li>If a valid link already exists for an installment, a duplicate will <strong>not</strong> be created.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
