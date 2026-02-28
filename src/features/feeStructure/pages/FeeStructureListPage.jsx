import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { feeStructureService } from '../api';
import {
    Plus, Search, BookOpen, Layers, Edit2, Eye,
    IndianRupee, Calendar, TrendingUp, FileText,
    AlertCircle, CheckCircle, Archive, RefreshCw,
    ChevronRight, LayoutGrid, List, ArrowUpRight
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   SCOPED STYLES — no external CSS dependency beyond root vars
═══════════════════════════════════════════════════════════════ */
const CSS = `
    .fsl-page {
        background: #f1f5f9;
        min-height: 100vh;
        padding: 32px;
        font-family: 'Inter', 'Outfit', system-ui, sans-serif;
    }
    .fsl-wrap { max-width: 1280px; margin: 0 auto; }

    /* ── Hero Banner ── */
    .fsl-hero {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #312e81 100%);
        border-radius: 22px;
        padding: 32px 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        margin-bottom: 28px;
        position: relative;
        overflow: hidden;
    }
    .fsl-hero::before {
        content: '';
        position: absolute;
        width: 340px; height: 340px;
        background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
        top: -80px; right: -80px;
        border-radius: 50%;
        pointer-events: none;
    }
    .fsl-hero::after {
        content: '';
        position: absolute;
        width: 200px; height: 200px;
        background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
        bottom: -60px; left: 120px;
        border-radius: 50%;
        pointer-events: none;
    }
    .fsl-hero-left { position: relative; z-index: 1; }
    .fsl-hero-eyebrow {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(99,102,241,0.25); color: #a5b4fc;
        font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
        text-transform: uppercase; padding: 4px 12px; border-radius: 20px;
        border: 1px solid rgba(99,102,241,0.3); margin-bottom: 12px;
    }
    .fsl-hero h1 {
        font-size: 30px; font-weight: 900; color: #fff;
        margin: 0 0 8px; letter-spacing: -0.5px; line-height: 1.2;
    }
    .fsl-hero p { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; font-weight: 500; }
    .fsl-hero-right { display: flex; gap: 12px; align-items: center; position: relative; z-index: 1; flex-shrink: 0; }

    /* ── Search ── */
    .fsl-search-wrap { position: relative; }
    .fsl-search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.4); }
    .fsl-search {
        background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.15);
        color: #fff; border-radius: 12px; padding: 10px 16px 10px 38px;
        font-size: 13.5px; font-weight: 500; width: 240px;
        transition: all 0.2s; outline: none;
    }
    .fsl-search::placeholder { color: rgba(255,255,255,0.4); }
    .fsl-search:focus { background: rgba(255,255,255,0.15); border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }

    /* ── New Plan Button ── */
    .fsl-new-btn {
        display: inline-flex; align-items: center; gap: 8px;
        background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
        border: none; border-radius: 12px; padding: 10px 22px;
        font-size: 14px; font-weight: 700; cursor: pointer;
        box-shadow: 0 4px 16px rgba(99,102,241,0.45);
        transition: all 0.2s; white-space: nowrap;
    }
    .fsl-new-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.5); }

    /* ── Stats Row ── */
    .fsl-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .fsl-stat-card {
        background: #fff; border-radius: 16px; padding: 18px 20px;
        border: 1.5px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        display: flex; align-items: center; gap: 14px;
        transition: all 0.2s;
    }
    .fsl-stat-card:hover { border-color: #c7d2fe; box-shadow: 0 4px 12px rgba(99,102,241,0.1); transform: translateY(-1px); }
    .fsl-stat-icon {
        width: 44px; height: 44px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .fsl-stat-val { font-size: 22px; font-weight: 900; color: #0f172a; line-height: 1; margin-bottom: 3px; }
    .fsl-stat-label { font-size: 12px; color: #64748b; font-weight: 600; }

    /* ── Table Card ── */
    .fsl-table-card {
        background: #fff; border-radius: 20px;
        border: 1.5px solid #e5e7eb;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        overflow: hidden;
    }
    .fsl-table-card-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 18px 24px; border-bottom: 1.5px solid #f1f5f9;
    }
    .fsl-table-title { font-size: 14px; font-weight: 800; color: #0f172a; letter-spacing: -0.2px; }
    .fsl-table-count { font-size: 12px; color: #64748b; font-weight: 600; }

    /* ── Table ── */
    .fsl-table { width: 100%; border-collapse: collapse; }
    .fsl-table thead tr { background: #f8fafc; }
    .fsl-table th {
        padding: 13px 20px; font-size: 10.5px; font-weight: 800;
        text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8;
        text-align: left; white-space: nowrap;
        border-bottom: 1.5px solid #f1f5f9;
    }
    .fsl-table th:last-child { text-align: right; }
    .fsl-table tbody tr {
        border-bottom: 1px solid #f8fafc;
        transition: background 0.15s;
    }
    .fsl-table tbody tr:last-child { border-bottom: none; }
    .fsl-table tbody tr:hover { background: #fafafe; }
    .fsl-table td { padding: 16px 20px; vertical-align: middle; }
    .fsl-table td:last-child { text-align: right; }

    /* ── Name cell ── */
    .fsl-name { font-size: 14.5px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
    .fsl-ay {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 11px; color: #94a3b8; font-weight: 600;
    }

    /* ── Target cell ── */
    .fsl-course-chip {
        display: inline-flex; align-items: center; gap: 6px;
        background: #eef2ff; color: #4338ca; padding: 4px 10px;
        border-radius: 8px; font-size: 12px; font-weight: 600; max-width: 200px;
    }
    .fsl-batch-chip {
        display: inline-flex; align-items: center; gap: 5px; margin-top: 5px;
        background: #f0fdf4; color: #15803d; padding: 3px 9px;
        border-radius: 6px; font-size: 11px; font-weight: 600;
    }

    /* ── Financial cell ── */
    .fsl-amount { font-size: 16px; font-weight: 900; color: #4f46e5; line-height: 1; margin-bottom: 3px; }
    .fsl-inst-count { font-size: 11.5px; color: #94a3b8; font-weight: 600; }

    /* ── Status badge ── */
    .fsl-badge {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 5px 12px; border-radius: 20px;
        font-size: 11.5px; font-weight: 700; white-space: nowrap;
    }
    .fsl-badge.active { background: #ecfdf5; color: #065f46; }
    .fsl-badge.inactive { background: #fef3c7; color: #92400e; }
    .fsl-badge-dot { width: 6px; height: 6px; border-radius: 50%; }
    .active .fsl-badge-dot { background: #10b981; }
    .inactive .fsl-badge-dot { background: #f59e0b; }

    /* ── Action buttons ── */
    .fsl-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .fsl-action-btn {
        width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid #e5e7eb;
        background: #fff; display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: #64748b; transition: all 0.15s;
    }
    .fsl-action-btn:hover.edit { background: #eef2ff; border-color: #c7d2fe; color: #4f46e5; }
    .fsl-action-btn:hover.view { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }

    /* ── Empty State ── */
    .fsl-empty {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; padding: 80px 24px; gap: 16px; text-align: center;
    }
    .fsl-empty-icon {
        width: 80px; height: 80px; border-radius: 24px; background: #eef2ff;
        display: flex; align-items: center; justify-content: center; color: #6366f1;
        margin-bottom: 8px;
    }
    .fsl-empty h3 { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0 0 8px; }
    .fsl-empty p { font-size: 14px; color: #64748b; margin: 0; max-width: 320px; line-height: 1.6; }
    .fsl-empty-btn {
        display: inline-flex; align-items: center; gap: 8px;
        background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
        border: none; border-radius: 12px; padding: 11px 24px;
        font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 8px;
        box-shadow: 0 4px 12px rgba(99,102,241,0.35); transition: all 0.2s;
    }
    .fsl-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.45); }

    /* ── Loading ── */
    .fsl-loading {
        display: flex; align-items: center; justify-content: center;
        padding: 80px; gap: 12px; color: #64748b; font-weight: 600; font-size: 14px;
    }
    .fsl-spinner {
        width: 24px; height: 24px; border-radius: 50%;
        border: 3px solid #e5e7eb; border-top-color: #6366f1;
        animation: fslSpin 0.7s linear infinite;
    }
    @keyframes fslSpin { to { transform: rotate(360deg); } }

    /* ── Animations ── */
    @keyframes fslFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
    .fsl-animate { animation: fslFadeUp 0.35s cubic-bezier(0.4,0,0.2,1) both; }
    .fsl-animate:nth-child(2) { animation-delay: 0.05s; }
    .fsl-animate:nth-child(3) { animation-delay: 0.1s; }
    .fsl-animate:nth-child(4) { animation-delay: 0.15s; }

    /* ── Refresh btn ── */
    .fsl-refresh-btn {
        width: 32px; height: 32px; border-radius: 9px; border: 1.5px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s;
    }
    .fsl-refresh-btn:hover { background: rgba(255,255,255,0.18); color: #fff; }
    .fsl-refresh-btn.spinning svg { animation: fslSpin 0.7s linear infinite; }

    @media (max-width: 768px) {
        .fsl-page { padding: 16px; }
        .fsl-hero { flex-direction: column; align-items: flex-start; padding: 24px; }
        .fsl-hero-right { width: 100%; }
        .fsl-search { width: 100%; }
        .fsl-stats-row { grid-template-columns: repeat(2, 1fr); }
        .fsl-new-btn { width: 100%; justify-content: center; }
    }
`;

/* ═══════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════ */
const StatCard = ({ icon, label, value, iconBg, iconColor, delay }) => (
    <div className="fsl-stat-card fsl-animate" style={{ animationDelay: delay }}>
        <div className="fsl-stat-icon" style={{ background: iconBg, color: iconColor }}>
            {icon}
        </div>
        <div>
            <div className="fsl-stat-val">{value}</div>
            <div className="fsl-stat-label">{label}</div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
const FeeStructureListPage = () => {
    const navigate = useNavigate();
    const [structures, setStructures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchStructures = async (silent = false) => {
        try {
            if (silent) setRefreshing(true);
            else setIsLoading(true);
            const response = await feeStructureService.getAll();
            setStructures(response.data || []);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch fee structures');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchStructures(); }, []);

    /* Derived stats */
    const totalStructures = structures.length;
    const activeCount = structures.filter(s => s.active).length;
    const totalRevenue = structures.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const courseCount = new Set(structures.map(s => s.courseId).filter(Boolean)).size;

    /* Search filter */
    const filtered = useMemo(() => {
        if (!search.trim()) return structures;
        const q = search.toLowerCase();
        return structures.filter(s =>
            s.name?.toLowerCase().includes(q) ||
            s.courseName?.toLowerCase().includes(q) ||
            s.batchName?.toLowerCase().includes(q) ||
            s.academicYear?.toLowerCase().includes(q)
        );
    }, [structures, search]);

    return (
        <>
            <style>{CSS}</style>
            <div className="fsl-page">
                <div className="fsl-wrap">

                    {/* ── Hero Banner ── */}
                    <div className="fsl-hero fsl-animate">
                        <div className="fsl-hero-left">
                            <div className="fsl-hero-eyebrow">
                                <FileText size={11} /> Fee Management
                            </div>
                            <h1>Fee Architecture</h1>
                            <p>Manage and configure fee plans across all academic offerings</p>
                        </div>
                        <div className="fsl-hero-right">
                            <div className="fsl-search-wrap">
                                <Search className="fsl-search-icon" size={15} />
                                <input
                                    type="text"
                                    className="fsl-search"
                                    placeholder="Search structures..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <button
                                className={`fsl-refresh-btn ${refreshing ? 'spinning' : ''}`}
                                onClick={() => fetchStructures(true)}
                                title="Refresh"
                            >
                                <RefreshCw size={14} />
                            </button>
                            <button
                                className="fsl-new-btn"
                                onClick={() => navigate('/admin/fee-structures/new')}
                            >
                                <Plus size={16} /> New Plan
                            </button>
                        </div>
                    </div>

                    {/* ── Stats Row ── */}
                    <div className="fsl-stats-row">
                        <StatCard
                            icon={<FileText size={20} />}
                            label="Total Structures"
                            value={totalStructures}
                            iconBg="#eef2ff" iconColor="#6366f1"
                            delay="0.05s"
                        />
                        <StatCard
                            icon={<CheckCircle size={20} />}
                            label="Active Plans"
                            value={activeCount}
                            iconBg="#ecfdf5" iconColor="#10b981"
                            delay="0.1s"
                        />
                        <StatCard
                            icon={<BookOpen size={20} />}
                            label="Courses Covered"
                            value={courseCount}
                            iconBg="#eff6ff" iconColor="#3b82f6"
                            delay="0.15s"
                        />
                        <StatCard
                            icon={<IndianRupee size={20} />}
                            label="Total Fee Value"
                            value={`₹${(totalRevenue / 1000).toFixed(0)}K`}
                            iconBg="#fffbeb" iconColor="#f59e0b"
                            delay="0.2s"
                        />
                    </div>

                    {/* ── Table Card ── */}
                    <div className="fsl-table-card fsl-animate" style={{ animationDelay: '0.25s' }}>
                        <div className="fsl-table-card-header">
                            <div>
                                <div className="fsl-table-title">All Fee Structures</div>
                                {!isLoading && (
                                    <div className="fsl-table-count">
                                        {filtered.length} structure{filtered.length !== 1 ? 's' : ''} found
                                    </div>
                                )}
                            </div>
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="fsl-loading">
                                <div className="fsl-spinner" />
                                Loading fee structures…
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="fsl-empty">
                                <div className="fsl-empty-icon">
                                    <FileText size={36} />
                                </div>
                                <h3>
                                    {search ? 'No matches found' : 'No fee structures yet'}
                                </h3>
                                <p>
                                    {search
                                        ? `No structures match "${search}". Try a different search term.`
                                        : 'Create your first fee structure to define tuition, installments, and penalty rules for your courses.'}
                                </p>
                                {!search && (
                                    <button
                                        className="fsl-empty-btn"
                                        onClick={() => navigate('/admin/fee-structures/new')}
                                    >
                                        <Plus size={16} /> Create First Plan
                                    </button>
                                )}
                            </div>
                        ) : (
                            <table className="fsl-table">
                                <thead>
                                    <tr>
                                        <th>Structure Name</th>
                                        <th>Target</th>
                                        <th>Financials</th>
                                        <th>Penalty</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((row) => (
                                        <tr key={row.id}>
                                            {/* Name */}
                                            <td>
                                                <p className="fsl-name">{row.name}</p>
                                                <span className="fsl-ay">
                                                    <Calendar size={10} />
                                                    AY {row.academicYear}
                                                </span>
                                            </td>

                                            {/* Target */}
                                            <td>
                                                <div className="fsl-course-chip">
                                                    <BookOpen size={12} />
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {row.courseName || `Course #${row.courseId}`}
                                                    </span>
                                                </div>
                                                {row.batchName && (
                                                    <div>
                                                        <span className="fsl-batch-chip">
                                                            <Layers size={10} />
                                                            {row.batchName}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Financials */}
                                            <td>
                                                <div className="fsl-amount">₹{(row.totalAmount || 0).toLocaleString()}</div>
                                                <div className="fsl-inst-count">
                                                    {row.installmentCount || 0} installment{row.installmentCount !== 1 ? 's' : ''}
                                                </div>
                                            </td>

                                            {/* Penalty type */}
                                            <td>
                                                {!row.penaltyType || row.penaltyType === 'NONE' ? (
                                                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>—</span>
                                                ) : (
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                                        fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
                                                        background: row.penaltyType === 'SLAB' ? '#eef2ff'
                                                            : row.penaltyType === 'FIXED' ? '#fffbeb' : '#ecfdf5',
                                                        color: row.penaltyType === 'SLAB' ? '#4338ca'
                                                            : row.penaltyType === 'FIXED' ? '#b45309' : '#065f46',
                                                    }}>
                                                        {row.penaltyType === 'SLAB' ? '⚡ Slab'
                                                            : row.penaltyType === 'FIXED' ? '₹ Fixed'
                                                                : '% Rate'}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <span className={`fsl-badge ${row.active ? 'active' : 'inactive'}`}>
                                                    <span className="fsl-badge-dot" />
                                                    {row.active ? 'Active' : 'Archived'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <div className="fsl-actions">
                                                    <button
                                                        className="fsl-action-btn edit"
                                                        onClick={() => navigate(`/admin/fee-structures/${row.id}/edit`)}
                                                        title="Edit Structure"
                                                        style={{ '--hover-bg': '#eef2ff' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = '#4f46e5'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        className="fsl-action-btn view"
                                                        onClick={() => navigate(`/admin/fee-structures/${row.id}`)}
                                                        title="View Details"
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#bbf7d0'; e.currentTarget.style.color = '#15803d'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                                                    >
                                                        <Eye size={14} />
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

export default FeeStructureListPage;
