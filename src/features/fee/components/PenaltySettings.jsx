import React, { useState, useEffect } from 'react';
import {
    FiPlus, FiTrash2, FiClock, FiCheckCircle,
    FiAlertTriangle, FiLayers, FiZap, FiPercent,
    FiInfo, FiLink
} from 'react-icons/fi';
import { IndianRupee } from 'lucide-react';

// ─── Penalty type definitions ───────────────────────────────────────────────
const PENALTY_TYPES = [
    {
        key: 'SLAB',
        icon: <FiLayers size={18} />,
        label: 'Daily Slab',
        sublabel: 'Fine per day by range',
        desc: 'Dynamic per-day fines change based on how overdue. Stacks progressively.',
        example: 'e.g. ₹10/day for Days 1–7, ₹20/day for Days 8+',
        color: '#6366f1',
        bg: '#eef2ff',
        border: '#c7d2fe',
        activeBg: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)',
    },
    {
        key: 'FIXED',
        icon: <IndianRupee size={18} />,
        label: 'Flat One-Time',
        sublabel: 'Single fixed charge',
        desc: 'A single fixed penalty added once when payment crosses the due date.',
        example: 'e.g. ₹500 charged once if late',
        color: '#f59e0b',
        bg: '#fffbeb',
        border: '#fde68a',
        activeBg: 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)',
    },
    {
        key: 'PERCENTAGE',
        icon: <FiPercent size={18} />,
        label: 'Percentage (%)',
        sublabel: '% of installment amount',
        desc: 'Calculates penalty as a percentage of the outstanding installment value.',
        example: 'e.g. 5% of installment once overdue',
        color: '#10b981',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        activeBg: 'linear-gradient(135deg,#10b981 0%,#059669 100%)',
    },
];

// ─── PenaltySettings Component ───────────────────────────────────────────────
export default function PenaltySettings({ penaltyConfig, onChange, selectedBatch, selectedBatchName }) {
    const [enabled, setEnabled] = useState(false);
    const [expandedType, setExpandedType] = useState(null);

    useEffect(() => {
        const isActive = penaltyConfig?.penaltyType && penaltyConfig.penaltyType !== 'NONE';
        setEnabled(isActive);
    }, [penaltyConfig?.penaltyType]);

    const handleToggle = () => {
        const next = !enabled;
        setEnabled(next);
        if (!next) {
            onChange({ ...penaltyConfig, penaltyType: 'NONE', fixedPenaltyAmount: 0, penaltyPercentage: 0, maxPenaltyCap: 0, slabs: [] });
        } else {
            onChange({
                ...penaltyConfig,
                penaltyType: 'SLAB',
                slabs: penaltyConfig.slabs?.length > 0 ? penaltyConfig.slabs : [{ fromDay: 1, toDay: 7, amount: 10 }],
            });
        }
    };

    const handleChange = (field, value) => {
        if (field !== 'penaltyType' && Number(value) < 0) value = 0;
        onChange({ ...penaltyConfig, [field]: value });
    };

    const handleSelectType = (typeKey) => {
        let slabs = penaltyConfig.slabs || [];
        if (typeKey === 'SLAB' && slabs.length === 0) slabs = [{ fromDay: 1, toDay: 7, amount: 10 }];
        onChange({ ...penaltyConfig, penaltyType: typeKey, slabs });
    };

    const handleAddSlab = () => {
        const current = penaltyConfig.slabs || [];
        const last = current[current.length - 1];
        const from = last ? Number(last.toDay) + 1 : 1;
        onChange({ ...penaltyConfig, slabs: [...current, { fromDay: from, toDay: from + 6, amount: 0 }] });
    };

    const handleRemoveSlab = (idx) => {
        onChange({ ...penaltyConfig, slabs: penaltyConfig.slabs.filter((_, i) => i !== idx) });
    };

    const handleSlabChange = (idx, field, value) => {
        const slabs = [...penaltyConfig.slabs];
        slabs[idx] = { ...slabs[idx], [field]: Number(value) };
        onChange({ ...penaltyConfig, slabs });
    };

    const activeTypeDef = PENALTY_TYPES.find(t => t.key === penaltyConfig?.penaltyType);

    return (
        <>
            <style>{`
                /* ── Penalty Card ── */
                .ps-card {
                    background: #fff;
                    border-radius: 20px;
                    border: 1.5px solid #e5e7eb;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                    transition: box-shadow 0.2s;
                    margin-bottom: 1.5rem;
                }
                .ps-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

                /* ── Header ── */
                .ps-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1.5px solid #f1f5f9;
                    background: #fff;
                }
                .ps-header-left { display: flex; align-items: center; gap: 14px; }
                .ps-icon-box {
                    width: 46px; height: 46px;
                    border-radius: 13px;
                    display: flex; align-items: center; justify-content: center;
                    background: #eef2ff; color: #6366f1;
                    flex-shrink: 0;
                }
                .ps-title { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.3px; }
                .ps-subtitle { font-size: 13px; color: #64748b; margin: 2px 0 0 0; font-weight: 500; }

                /* ── Custom Toggle ── */
                .ps-toggle-wrap { display: flex; align-items: center; gap: 10px; }
                .ps-toggle-label { font-size: 12px; font-weight: 600; color: #64748b; }
                .ps-toggle-btn {
                    width: 52px; height: 28px; border-radius: 14px; border: none;
                    position: relative; cursor: pointer; transition: background 0.25s;
                    flex-shrink: 0;
                }
                .ps-toggle-btn.on  { background: linear-gradient(135deg, #6366f1, #4f46e5); }
                .ps-toggle-btn.off { background: #d1d5db; }
                .ps-toggle-btn .ps-thumb {
                    position: absolute; width: 20px; height: 20px;
                    background: white; border-radius: 50%;
                    top: 4px; transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
                    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
                }
                .ps-toggle-btn.on  .ps-thumb { left: 28px; }
                .ps-toggle-btn.off .ps-thumb { left: 4px; }

                /* ── Batch Badge ── */
                .ps-batch-banner {
                    display: flex; align-items: center; gap: 10px;
                    padding: 10px 20px;
                    font-size: 12.5px; font-weight: 600;
                }
                .ps-batch-banner.linked {
                    background: linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%);
                    color: #065f46;
                    border-bottom: 1px solid #a7f3d0;
                }
                .ps-batch-banner.unlinked {
                    background: #fffbeb;
                    color: #92400e;
                    border-bottom: 1px solid #fde68a;
                }
                .ps-batch-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    background: rgba(255,255,255,0.75); border-radius: 20px;
                    padding: 3px 10px; border: 1px solid currentColor;
                    font-weight: 700; font-size: 12px;
                }

                /* ── Body ── */
                .ps-body { padding: 1.75rem 2rem; }

                /* ── Type Cards ── */
                .ps-type-grid {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
                    margin-bottom: 1.75rem;
                }
                .ps-type-card {
                    border-radius: 14px; border: 2px solid #e5e7eb;
                    padding: 14px 16px; cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
                    background: #fff; position: relative; overflow: hidden;
                }
                .ps-type-card:hover { transform: translateY(-2px); }
                .ps-type-card.active { border-color: transparent; color: white; }
                .ps-type-card.active .ps-type-desc { color: rgba(255,255,255,0.8); }
                .ps-type-card.active .ps-type-example { color: rgba(255,255,255,0.65); }

                .ps-type-icon {
                    width: 36px; height: 36px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 10px; transition: background 0.2s;
                }
                .ps-type-name { font-size: 13.5px; font-weight: 700; margin: 0 0 2px 0; }
                .ps-type-sub { font-size: 11px; font-weight: 600; opacity: 0.7; margin: 0 0 6px; }
                .ps-type-desc { font-size: 11.5px; color: #64748b; line-height: 1.5; margin: 0 0 5px; }
                .ps-type-example { font-size: 11px; color: #94a3b8; font-style: italic; margin: 0; }
                .ps-type-check {
                    position: absolute; top: 10px; right: 10px;
                    width: 20px; height: 20px; border-radius: 50%;
                    background: rgba(255,255,255,0.3);
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: opacity 0.2s;
                }
                .ps-type-card.active .ps-type-check { opacity: 1; }

                /* ── Slab Section ── */
                .ps-slab-section {
                    background: #f8fafc; border-radius: 16px;
                    border: 1.5px solid #e5e7eb; overflow: hidden;
                    animation: psFadeIn 0.2s ease;
                }
                @keyframes psFadeIn { from { opacity:0; transform:translateY(6px); } }

                .ps-slab-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 14px 20px; background: #fff;
                    border-bottom: 1.5px solid #f1f5f9;
                }
                .ps-slab-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 0; }

                .ps-add-btn {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: white; border: none; border-radius: 20px;
                    padding: 7px 16px; font-size: 12.5px; font-weight: 700;
                    cursor: pointer; box-shadow: 0 2px 8px rgba(99,102,241,0.3);
                    transition: all 0.2s;
                }
                .ps-add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.4); }

                /* ── Slab Table ── */
                .ps-slab-table { width: 100%; border-collapse: collapse; }
                .ps-slab-table thead tr { background: #f8fafc; }
                .ps-slab-table th {
                    padding: 10px 16px; font-size: 10.5px; font-weight: 800;
                    text-transform: uppercase; letter-spacing: 0.8px;
                    color: #94a3b8; text-align: left;
                }
                .ps-slab-table th:last-child { text-align: center; }
                .ps-slab-table tbody tr { border-top: 1px solid #f1f5f9; background: #fff; transition: background 0.15s; }
                .ps-slab-table tbody tr:hover { background: #fafafe; }
                .ps-slab-table td { padding: 10px 16px; vertical-align: middle; }

                .ps-slab-input {
                    width: 90px; padding: 8px 10px; text-align: center;
                    border: 1.5px solid #e5e7eb; border-radius: 9px;
                    font-size: 14px; font-weight: 600; color: #1e293b;
                    background: #f8fafc; transition: all 0.15s;
                    -moz-appearance: textfield;
                }
                .ps-slab-input::-webkit-inner-spin-button,
                .ps-slab-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .ps-slab-input:focus { outline: none; border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }

                .ps-amount-wrap { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 9px; overflow: hidden; background: #f8fafc; width: 120px; transition: all 0.15s; }
                .ps-amount-wrap:focus-within { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
                .ps-amount-prefix { padding: 8px 10px; font-size: 13px; font-weight: 700; color: #94a3b8; background: transparent; border-right: 1.5px solid #e5e7eb; }
                .ps-amount-input { flex: 1; border: none; background: transparent; padding: 8px 10px; font-size: 14px; font-weight: 700; color: #4338ca; outline: none; -moz-appearance: textfield; }
                .ps-amount-input::-webkit-inner-spin-button,
                .ps-amount-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

                .ps-day-label { font-size: 11px; color: #94a3b8; margin-left: 4px; }

                .ps-del-btn {
                    width: 32px; height: 32px; border-radius: 8px; border: none;
                    background: #fff; color: #9ca3af; cursor: pointer; display: flex;
                    align-items: center; justify-content: center; transition: all 0.15s;
                    margin: 0 auto;
                }
                .ps-del-btn:hover { background: #fef2f2; color: #ef4444; }

                .ps-empty-slab {
                    padding: 24px; text-align: center; color: #94a3b8;
                    font-size: 13px; font-weight: 500;
                }

                /* ── Single Value Inputs (FIXED / PERCENTAGE) ── */
                .ps-single-panel {
                    border-radius: 16px; border: 1.5px solid;
                    padding: 28px; text-align: center;
                    animation: psFadeIn 0.2s ease;
                }
                .ps-big-input-wrap {
                    display: flex; align-items: center; justify-content: center;
                    gap: 0; border-radius: 14px; overflow: hidden;
                    border: 2px solid; display: inline-flex;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                    background: #fff;
                }
                .ps-big-prefix {
                    padding: 14px 18px; font-size: 20px; font-weight: 800;
                    border-right: 2px solid; line-height: 1;
                }
                .ps-big-input {
                    border: none; outline: none; background: transparent;
                    width: 140px; padding: 14px 16px;
                    font-size: 28px; font-weight: 900; text-align: center;
                    -moz-appearance: textfield;
                }
                .ps-big-input::-webkit-inner-spin-button,
                .ps-big-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .ps-single-hint { font-size: 12px; margin-top: 12px; font-weight: 500; }

                /* ── Footer row ── */
                .ps-footer-row {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
                    margin-top: 24px; padding-top: 20px;
                    border-top: 1.5px dashed #e5e7eb;
                }
                .ps-max-cap-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 8px; }
                .ps-cap-wrap { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 10px; background: #f8fafc; overflow: hidden; transition: all 0.15s; }
                .ps-cap-wrap:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
                .ps-cap-prefix { padding: 10px 14px; font-weight: 700; color: #94a3b8; border-right: 1.5px solid #e5e7eb; }
                .ps-cap-input { flex: 1; border: none; background: transparent; padding: 10px 14px; font-size: 15px; font-weight: 600; outline: none; }
                .ps-cap-hint { font-size: 11.5px; color: #94a3b8; margin-top: 6px; }

                .ps-autopilot {
                    background: #ecfdf5; border: 1.5px solid #a7f3d0;
                    border-radius: 14px; padding: 16px 18px;
                    display: flex; align-items: flex-start; gap: 12px;
                }
                .ps-autopilot-icon { color: #10b981; margin-top: 1px; flex-shrink: 0; }
                .ps-autopilot-title { font-size: 13px; font-weight: 700; color: #065f46; margin-bottom: 3px; }
                .ps-autopilot-text { font-size: 12px; color: #047857; line-height: 1.5; margin: 0; }

                /* ── Disabled overlay ── */
                .ps-disabled-body { padding: 2rem; text-align: center; color: #94a3b8; }
                .ps-disabled-icon { font-size: 40px; margin-bottom: 10px; }

                @media (max-width: 640px) {
                    .ps-type-grid { grid-template-columns: 1fr; }
                    .ps-footer-row { grid-template-columns: 1fr; }
                    .ps-body { padding: 1.25rem; }
                    .ps-header { padding: 1.25rem; }
                }
            `}</style>

            <div className="ps-card">

                {/* ── Batch Linkage Banner ── */}
                {selectedBatch ? (
                    <div className="ps-batch-banner linked">
                        <FiLink size={13} />
                        Penalty rules below are applied at the&nbsp;<strong>batch level</strong>&nbsp;for:
                        <span className="ps-batch-badge">
                            <FiLayers size={11} />
                            {selectedBatchName || `Batch #${selectedBatch}`}
                        </span>
                    </div>
                ) : (
                    <div className="ps-batch-banner unlinked">
                        <FiAlertTriangle size={13} />
                        No batch selected — penalty rules will apply globally to this fee structure.
                        &nbsp;Select a batch above to link penalties to a specific batch.
                    </div>
                )}

                {/* ── Header ── */}
                <div className="ps-header">
                    <div className="ps-header-left">
                        <div className="ps-icon-box">
                            <FiZap size={20} />
                        </div>
                        <div>
                            <h2 className="ps-title">Penalty &amp; Slab Architecture</h2>
                            <p className="ps-subtitle">Automate late-fee calculations and delinquency rules</p>
                        </div>
                    </div>

                    <div className="ps-toggle-wrap">
                        <span className="ps-toggle-label">{enabled ? 'Enabled' : 'Disabled'}</span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={enabled}
                            className={`ps-toggle-btn ${enabled ? 'on' : 'off'}`}
                            onClick={handleToggle}
                        >
                            <span className="ps-thumb" />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                {!enabled ? (
                    <div className="ps-disabled-body">
                        <div className="ps-disabled-icon">💤</div>
                        <p style={{ fontWeight: 600, fontSize: 14, color: '#64748b', margin: 0 }}>
                            Penalty rules are turned off. Toggle the switch to configure late-fee rules.
                        </p>
                    </div>
                ) : (
                    <div className="ps-body">

                        {/* ── Penalty Type Cards ── */}
                        <div style={{ marginBottom: 8 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', margin: '0 0 10px' }}>
                                Select Penalty Mode
                            </p>
                        </div>
                        <div className="ps-type-grid">
                            {PENALTY_TYPES.map((type) => {
                                const isActive = penaltyConfig.penaltyType === type.key;
                                return (
                                    <div
                                        key={type.key}
                                        className={`ps-type-card ${isActive ? 'active' : ''}`}
                                        style={isActive
                                            ? { background: type.activeBg }
                                            : { background: type.bg, borderColor: type.border }
                                        }
                                        onClick={() => handleSelectType(type.key)}
                                    >
                                        <div
                                            className="ps-type-icon"
                                            style={{
                                                background: isActive ? 'rgba(255,255,255,0.25)' : '#fff',
                                                color: isActive ? '#fff' : type.color,
                                            }}
                                        >
                                            {type.icon}
                                        </div>
                                        <p className="ps-type-name" style={{ color: isActive ? '#fff' : '#1e293b' }}>
                                            {type.label}
                                        </p>
                                        <p className="ps-type-sub" style={{ color: isActive ? 'rgba(255,255,255,0.75)' : type.color }}>
                                            {type.sublabel}
                                        </p>
                                        <p className="ps-type-desc">{type.desc}</p>
                                        <p className="ps-type-example">{type.example}</p>
                                        <div className="ps-type-check">
                                            <FiCheckCircle size={13} color="white" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── SLAB: Table ── */}
                        {penaltyConfig.penaltyType === 'SLAB' && (
                            <div className="ps-slab-section">
                                <div className="ps-slab-header">
                                    <p className="ps-slab-title">⚡ Slab Schedule</p>
                                    <button type="button" className="ps-add-btn" onClick={handleAddSlab}>
                                        <FiPlus size={13} /> Add Slab
                                    </button>
                                </div>

                                <table className="ps-slab-table">
                                    <thead>
                                        <tr>
                                            <th>From Day</th>
                                            <th>To Day</th>
                                            <th>Fine / Day</th>
                                            <th style={{ textAlign: 'center' }}>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(penaltyConfig.slabs || []).length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="ps-empty-slab">
                                                    No slabs defined. Click <strong>+ Add Slab</strong> to begin.
                                                </td>
                                            </tr>
                                        ) : (
                                            (penaltyConfig.slabs || []).map((slab, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <input
                                                                type="number"
                                                                className="ps-slab-input"
                                                                value={slab.fromDay}
                                                                min={1}
                                                                onChange={e => handleSlabChange(idx, 'fromDay', e.target.value)}
                                                            />
                                                            <span className="ps-day-label">days</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <input
                                                                type="number"
                                                                className="ps-slab-input"
                                                                value={slab.toDay}
                                                                min={slab.fromDay}
                                                                onChange={e => handleSlabChange(idx, 'toDay', e.target.value)}
                                                            />
                                                            <span className="ps-day-label">days</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ps-amount-wrap">
                                                            <span className="ps-amount-prefix">₹</span>
                                                            <input
                                                                type="number"
                                                                className="ps-amount-input"
                                                                value={slab.amount}
                                                                min={0}
                                                                placeholder="0"
                                                                onChange={e => handleSlabChange(idx, 'amount', e.target.value)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="ps-del-btn"
                                                            onClick={() => handleRemoveSlab(idx)}
                                                            title="Remove slab"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── FIXED: Single Value ── */}
                        {penaltyConfig.penaltyType === 'FIXED' && (
                            <div className="ps-single-panel" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#92400e', margin: '0 0 16px' }}>
                                    One-Time Fixed Penalty Amount
                                </p>
                                <div className="ps-big-input-wrap" style={{ borderColor: '#fde68a' }}>
                                    <span className="ps-big-prefix" style={{ color: '#d97706', borderColor: '#fde68a' }}>₹</span>
                                    <input
                                        type="number"
                                        className="ps-big-input"
                                        style={{ color: '#d97706' }}
                                        value={penaltyConfig.fixedPenaltyAmount || ''}
                                        min={0}
                                        placeholder="0"
                                        onChange={e => handleChange('fixedPenaltyAmount', e.target.value)}
                                    />
                                </div>
                                <p className="ps-single-hint" style={{ color: '#92400e' }}>
                                    This flat amount is charged once when the payment crosses the due date.
                                </p>
                            </div>
                        )}

                        {/* ── PERCENTAGE: Single Value ── */}
                        {penaltyConfig.penaltyType === 'PERCENTAGE' && (
                            <div className="ps-single-panel" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#065f46', margin: '0 0 16px' }}>
                                    Penalty Rate (% of installment)
                                </p>
                                <div className="ps-big-input-wrap" style={{ borderColor: '#a7f3d0' }}>
                                    <input
                                        type="number"
                                        className="ps-big-input"
                                        style={{ color: '#059669' }}
                                        value={penaltyConfig.penaltyPercentage || ''}
                                        min={0}
                                        max={100}
                                        placeholder="0"
                                        onChange={e => handleChange('penaltyPercentage', e.target.value)}
                                    />
                                    <span className="ps-big-prefix" style={{ color: '#059669', borderColor: '#a7f3d0', borderLeft: '2px solid', borderRight: 'none' }}>%</span>
                                </div>
                                <p className="ps-single-hint" style={{ color: '#047857' }}>
                                    Applied once per installment when it crosses the grace period.
                                </p>
                            </div>
                        )}

                        {/* ── Footer: Max Cap + Auto-Pilot ── */}
                        <div className="ps-footer-row">
                            {/* Max Penalty Ceiling */}
                            <div>
                                <p className="ps-max-cap-label">
                                    <FiInfo size={11} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                                    Max Penalty Ceiling (₹)
                                </p>
                                <div className="ps-cap-wrap">
                                    <span className="ps-cap-prefix">₹</span>
                                    <input
                                        type="number"
                                        className="ps-cap-input"
                                        value={penaltyConfig.maxPenaltyCap || ''}
                                        min={0}
                                        placeholder="No limit"
                                        onChange={e => handleChange('maxPenaltyCap', e.target.value)}
                                    />
                                </div>
                                <p className="ps-cap-hint">Prevents penalties from exceeding this ceiling.</p>
                            </div>

                            {/* Auto-Pilot Notice */}
                            <div className="ps-autopilot">
                                <FiCheckCircle size={18} className="ps-autopilot-icon" />
                                <div>
                                    <p className="ps-autopilot-title">Auto-Pilot Active</p>
                                    <p className="ps-autopilot-text">
                                        Fines are calculated automatically when students pay late — based on the rules you've defined
                                        {selectedBatchName ? ` for "${selectedBatchName}"` : ''}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
