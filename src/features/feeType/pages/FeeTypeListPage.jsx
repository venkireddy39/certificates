import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { feeTypeService } from '../api';
import {
    Plus, Search, Edit2, Trash2, RefreshCw, Tag,
    ToggleLeft, ToggleRight, ArrowUpDown, CheckCircle,
    XCircle, List, Hash
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   SCOPED STYLES
══════════════════════════════════════════════════════ */
const CSS = `
    .ftl-page {
        background: #f1f5f9;
        min-height: 100vh;
        padding: 32px;
        font-family: 'Inter', 'Outfit', system-ui, sans-serif;
    }
    .ftl-wrap { max-width: 1100px; margin: 0 auto; }

    /* ── Hero ── */
    .ftl-hero {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #312e81 100%);
        border-radius: 22px;
        padding: 28px 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
    }
    .ftl-hero::before {
        content: '';
        position: absolute;
        width: 280px; height: 280px;
        background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%);
        top: -80px; right: -60px;
        border-radius: 50%;
        pointer-events: none;
    }
    .ftl-hero-left { position: relative; z-index: 1; }
    .ftl-hero-eyebrow {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(99,102,241,0.25); color: #a5b4fc;
        font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px;
        text-transform: uppercase; padding: 3px 11px; border-radius: 20px;
        border: 1px solid rgba(99,102,241,0.3); margin-bottom: 10px;
    }
    .ftl-hero h1 {
        font-size: 26px; font-weight: 900; color: #fff;
        margin: 0 0 6px; letter-spacing: -0.4px;
    }
    .ftl-hero p { font-size: 13px; color: rgba(255,255,255,0.55); margin: 0; font-weight: 500; }
    .ftl-hero-right { display: flex; gap: 10px; align-items: center; position: relative; z-index: 1; flex-shrink: 0; }

    /* ── Stat cards ── */
    .ftl-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 22px; }
    .ftl-stat {
        background: #fff; border-radius: 16px; padding: 18px 20px;
        border: 1.5px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        display: flex; align-items: center; gap: 14px;
        transition: all 0.2s;
    }
    .ftl-stat:hover { border-color: #c7d2fe; box-shadow: 0 4px 12px rgba(99,102,241,0.1); transform: translateY(-1px); }
    .ftl-stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ftl-stat-val { font-size: 22px; font-weight: 900; color: #0f172a; line-height: 1; margin-bottom: 3px; }
    .ftl-stat-label { font-size: 12px; color: #64748b; font-weight: 600; }

    /* ── Search ── */
    .ftl-search-wrap { position: relative; }
    .ftl-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.4); pointer-events: none; }
    .ftl-search {
        background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.15);
        color: #fff; border-radius: 12px; padding: 9px 16px 9px 36px;
        font-size: 13px; font-weight: 500; width: 220px; outline: none;
        transition: all 0.2s;
    }
    .ftl-search::placeholder { color: rgba(255,255,255,0.4); }
    .ftl-search:focus { background: rgba(255,255,255,0.16); border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }

    /* ── Buttons ── */
    .ftl-btn-add {
        display: inline-flex; align-items: center; gap: 7px;
        background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
        border: none; border-radius: 12px; padding: 9px 20px;
        font-size: 13.5px; font-weight: 700; cursor: pointer;
        box-shadow: 0 4px 14px rgba(99,102,241,0.42); transition: all 0.2s; white-space: nowrap;
    }
    .ftl-btn-add:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.5); }
    .ftl-refresh-btn {
        width: 36px; height: 36px; border-radius: 10px;
        border: 1.5px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s; flex-shrink: 0;
    }
    .ftl-refresh-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
    .ftl-refresh-btn.spin svg { animation: ftlSpin 0.7s linear infinite; }

    /* ── Table card ── */
    .ftl-card {
        background: #fff; border-radius: 20px;
        border: 1.5px solid #e5e7eb;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        overflow: hidden;
    }
    .ftl-card-hdr {
        display: flex; justify-content: space-between; align-items: center;
        padding: 16px 24px; border-bottom: 1.5px solid #f1f5f9;
    }
    .ftl-card-title { font-size: 13.5px; font-weight: 800; color: #0f172a; }
    .ftl-card-count { font-size: 12px; color: #94a3b8; font-weight: 600; margin-top: 2px; }

    /* ── Table ── */
    .ftl-table { width: 100%; border-collapse: collapse; }
    .ftl-table thead tr { background: #f8fafc; }
    .ftl-table th {
        padding: 12px 20px; font-size: 10.5px; font-weight: 800;
        text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8;
        text-align: left; white-space: nowrap;
        border-bottom: 1.5px solid #f1f5f9;
    }
    .ftl-table th:last-child { text-align: right; }
    .ftl-table tbody tr { border-bottom: 1px solid #f8fafc; transition: background 0.12s; }
    .ftl-table tbody tr:last-child { border-bottom: none; }
    .ftl-table tbody tr:hover { background: #fafafe; }
    .ftl-table td { padding: 15px 20px; vertical-align: middle; }
    .ftl-table td:last-child { text-align: right; }

    /* ── Name cell ── */
    .ftl-name { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
    .ftl-dot { display: inline-flex; align-items: center; gap: 6px; }
    .ftl-dot-circle {
        width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        box-shadow: 0 0 6px currentColor;
    }

    /* ── Description ── */
    .ftl-desc { font-size: 13px; color: #64748b; font-weight: 500; max-width: 260px; }

    /* ── Order badge ── */
    .ftl-order {
        display: inline-flex; align-items: center; gap: 5px;
        background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 700;
        padding: 4px 10px; border-radius: 8px;
    }

    /* ── Status toggle ── */
    .ftl-status-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 13px; border-radius: 20px; border: none;
        font-size: 11.5px; font-weight: 700; cursor: pointer;
        transition: all 0.18s; white-space: nowrap;
    }
    .ftl-status-btn.active { background: #ecfdf5; color: #065f46; }
    .ftl-status-btn.active:hover { background: #d1fae5; }
    .ftl-status-btn.inactive { background: #fef3c7; color: #92400e; }
    .ftl-status-btn.inactive:hover { background: #fde68a; }

    /* ── Action buttons ── */
    .ftl-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .ftl-action-btn {
        width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid #e5e7eb;
        background: #fff; display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: #64748b; transition: all 0.15s;
    }
    .ftl-action-btn.edit:hover { background: #eef2ff; border-color: #c7d2fe; color: #4f46e5; }
    .ftl-action-btn.del:hover { background: #fff1f2; border-color: #fecdd3; color: #e11d48; }

    /* ── Empty ── */
    .ftl-empty {
        display: flex; flex-direction: column; align-items: center;
        padding: 72px 24px; gap: 12px; text-align: center;
    }
    .ftl-empty-icon { width: 72px; height: 72px; border-radius: 20px; background: #eef2ff; display: flex; align-items: center; justify-content: center; color: #6366f1; margin-bottom: 6px; }
    .ftl-empty h3 { font-size: 17px; font-weight: 800; color: #1e293b; margin: 0 0 6px; }
    .ftl-empty p { font-size: 13.5px; color: #64748b; margin: 0; max-width: 280px; line-height: 1.6; }
    .ftl-empty-btn {
        display: inline-flex; align-items: center; gap: 7px;
        background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
        border: none; border-radius: 12px; padding: 10px 22px;
        font-size: 13.5px; font-weight: 700; cursor: pointer; margin-top: 8px;
        box-shadow: 0 4px 12px rgba(99,102,241,0.35); transition: all 0.2s;
    }
    .ftl-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.45); }

    /* ── Loading ── */
    .ftl-loading { display: flex; align-items: center; justify-content: center; padding: 72px; gap: 12px; color: #64748b; font-weight: 600; font-size: 14px; }
    .ftl-spinner { width: 22px; height: 22px; border-radius: 50%; border: 3px solid #e5e7eb; border-top-color: #6366f1; animation: ftlSpin 0.7s linear infinite; }

    /* ── Animations ── */
    @keyframes ftlSpin { to { transform: rotate(360deg); } }
    @keyframes ftlUp { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: none; } }
    .ftl-anim { animation: ftlUp 0.32s cubic-bezier(0.4,0,0.2,1) both; }
    .ftl-anim:nth-child(2) { animation-delay: 0.05s; }
    .ftl-anim:nth-child(3) { animation-delay: 0.1s; }

    @media (max-width: 768px) {
        .ftl-page { padding: 14px; }
        .ftl-hero { flex-direction: column; align-items: flex-start; padding: 22px; }
        .ftl-stats { grid-template-columns: repeat(2, 1fr); }
        .ftl-search { width: 100%; }
    }
`;

const FeeTypeListPage = () => {
    const navigate = useNavigate();
    const [feeTypes, setFeeTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [togglingId, setTogglingId] = useState(null);

    const fetchFeeTypes = async (silent = false) => {
        try {
            if (silent) setRefreshing(true);
            else setIsLoading(true);
            const response = await feeTypeService.getAll();
            setFeeTypes(response.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch fee types');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchFeeTypes(); }, []);

    const handleToggleStatus = async (feeType) => {
        try {
            setTogglingId(feeType.id);
            const updatedStatus = !feeType.active;
            await feeTypeService.update(feeType.id, { ...feeType, active: updatedStatus });
            toast.success(`Fee type ${updatedStatus ? 'activated' : 'deactivated'}`);
            setFeeTypes(prev => prev.map(ft => ft.id === feeType.id ? { ...ft, active: updatedStatus } : ft));
        } catch {
            toast.error('Failed to update status');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
        try {
            await feeTypeService.delete(id);
            toast.success('Fee type deleted');
            setFeeTypes(prev => prev.filter(ft => ft.id !== id));
        } catch {
            toast.error('Failed to delete fee type');
        }
    };

    const filteredData = useMemo(() =>
        feeTypes
            .filter(ft => ft.name?.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
        [feeTypes, searchQuery]
    );

    const activeCount = feeTypes.filter(f => f.active).length;
    const inactiveCount = feeTypes.length - activeCount;

    /* Color palette for name dots */
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
    const getColor = (idx) => COLORS[idx % COLORS.length];

    return (
        <>
            <style>{CSS}</style>
            <div className="ftl-page">
                <div className="ftl-wrap">

                    {/* ── Hero ── */}
                    <div className="ftl-hero ftl-anim">
                        <div className="ftl-hero-left">
                            <div className="ftl-hero-eyebrow">
                                <Tag size={11} /> Fee Management
                            </div>
                            <h1>Fee Types</h1>
                            <p>Define and manage fee categories used across all fee structures</p>
                        </div>
                        <div className="ftl-hero-right">
                            <div className="ftl-search-wrap">
                                <Search className="ftl-search-icon" size={14} />
                                <input
                                    type="text"
                                    className="ftl-search"
                                    placeholder="Search fee types..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                className={`ftl-refresh-btn ${refreshing ? 'spin' : ''}`}
                                onClick={() => fetchFeeTypes(true)}
                                title="Refresh"
                            >
                                <RefreshCw size={14} />
                            </button>
                            <button
                                className="ftl-btn-add"
                                onClick={() => navigate('/admin/fee-types/new')}
                            >
                                <Plus size={16} /> Add Fee Type
                            </button>
                        </div>
                    </div>

                    {/* ── Stats ── */}
                    <div className="ftl-stats">
                        <div className="ftl-stat ftl-anim" style={{ animationDelay: '0.05s' }}>
                            <div className="ftl-stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
                                <List size={20} />
                            </div>
                            <div>
                                <div className="ftl-stat-val">{feeTypes.length}</div>
                                <div className="ftl-stat-label">Total Types</div>
                            </div>
                        </div>
                        <div className="ftl-stat ftl-anim" style={{ animationDelay: '0.1s' }}>
                            <div className="ftl-stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <div className="ftl-stat-val">{activeCount}</div>
                                <div className="ftl-stat-label">Active</div>
                            </div>
                        </div>
                        <div className="ftl-stat ftl-anim" style={{ animationDelay: '0.15s' }}>
                            <div className="ftl-stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                                <XCircle size={20} />
                            </div>
                            <div>
                                <div className="ftl-stat-val">{inactiveCount}</div>
                                <div className="ftl-stat-label">Inactive</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Table Card ── */}
                    <div className="ftl-card ftl-anim" style={{ animationDelay: '0.2s' }}>
                        <div className="ftl-card-hdr">
                            <div>
                                <div className="ftl-card-title">All Fee Types</div>
                                {!isLoading && (
                                    <div className="ftl-card-count">
                                        {filteredData.length} type{filteredData.length !== 1 ? 's' : ''}
                                        {searchQuery && ` matching "${searchQuery}"`}
                                    </div>
                                )}
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Clear filter ×
                                </button>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="ftl-loading">
                                <div className="ftl-spinner" />
                                Loading fee types…
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="ftl-empty">
                                <div className="ftl-empty-icon">
                                    <Tag size={32} />
                                </div>
                                <h3>{searchQuery ? 'No matches found' : 'No fee types yet'}</h3>
                                <p>
                                    {searchQuery
                                        ? `No fee types match "${searchQuery}".`
                                        : 'Create fee type categories like Tuition, Exam, Library, Transport etc. to use in fee structures.'}
                                </p>
                                {!searchQuery && (
                                    <button
                                        className="ftl-empty-btn"
                                        onClick={() => navigate('/admin/fee-types/new')}
                                    >
                                        <Plus size={15} /> Create First Type
                                    </button>
                                )}
                            </div>
                        ) : (
                            <table className="ftl-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <ArrowUpDown size={11} /> Order
                                            </span>
                                        </th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, idx) => (
                                        <tr key={row.id}>
                                            {/* Name */}
                                            <td>
                                                <div className="ftl-dot">
                                                    <div
                                                        className="ftl-dot-circle"
                                                        style={{ color: getColor(idx), background: getColor(idx) }}
                                                    />
                                                    <span className="ftl-name">{row.name}</span>
                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td>
                                                <div className="ftl-desc">
                                                    {row.description || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>No description</span>}
                                                </div>
                                            </td>

                                            {/* Display Order */}
                                            <td>
                                                <span className="ftl-order">
                                                    <Hash size={10} /> {row.displayOrder ?? '—'}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <button
                                                    className={`ftl-status-btn ${row.active ? 'active' : 'inactive'}`}
                                                    onClick={() => handleToggleStatus(row)}
                                                    disabled={togglingId === row.id}
                                                    title="Click to toggle status"
                                                >
                                                    {togglingId === row.id ? (
                                                        <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', display: 'inline-block', animation: 'ftlSpin 0.6s linear infinite' }} />
                                                    ) : row.active ? (
                                                        <ToggleRight size={14} />
                                                    ) : (
                                                        <ToggleLeft size={14} />
                                                    )}
                                                    {row.active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <div className="ftl-actions">
                                                    <button
                                                        className="ftl-action-btn edit"
                                                        onClick={() => navigate(`/admin/fee-types/${row.id}/edit`)}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        className="ftl-action-btn del"
                                                        onClick={() => handleDelete(row.id, row.name)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default FeeTypeListPage;
