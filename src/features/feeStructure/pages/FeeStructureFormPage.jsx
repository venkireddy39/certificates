import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import FeeConfigForm from '../../fee/components/FeeConfigForm';
import '../../fee/FeeManagement.css';

/**
 * FeeStructureFormPage
 * Shell page that wraps FeeConfigForm — ensuring /admin/fee-structures/new
 * and /admin/fee (via the dashboard tab) use EXACTLY the same form.
 */
const FeeStructureFormPage = ({ viewOnly = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    return (
        <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
            {/* ── Page Header ── */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #312e81 100%)',
                padding: '24px 36px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
            }}>
                <button
                    onClick={() => navigate('/admin/fee-structures')}
                    style={{
                        width: 42, height: 42, borderRadius: 12,
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    title="Back to Fee Structures"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(99,102,241,0.25)', color: '#a5b4fc',
                        fontSize: 11, fontWeight: 700, letterSpacing: '1px',
                        textTransform: 'uppercase', padding: '3px 10px',
                        borderRadius: 20, border: '1px solid rgba(99,102,241,0.3)',
                        marginBottom: 6,
                    }}>
                        Fee Management
                        <span style={{ opacity: 0.5 }}>›</span>
                        Fee Structures
                        <span style={{ opacity: 0.5 }}>›</span>
                        {viewOnly ? 'View' : isEditMode ? 'Edit' : 'New'}
                    </div>
                    <h1 style={{
                        fontSize: 22, fontWeight: 900, color: '#fff',
                        margin: 0, letterSpacing: '-0.3px',
                        display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        {viewOnly
                            ? <><Eye size={20} style={{ color: '#a5b4fc' }} /> View Fee Architecture</>
                            : isEditMode
                                ? `✏️ Edit Fee Architecture — Plan #${id}`
                                : '✦ Architect New Fee Plan'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500, margin: '4px 0 0' }}>
                        {viewOnly
                            ? 'Read-only view of this fee structure'
                            : 'Configure pricing, installments, penalty rules, and batch linking'}
                    </p>
                </div>
            </div>

            {/* ── Shared Form ── */}
            <FeeConfigForm structureId={id} viewOnly={viewOnly} />
        </div>
    );
};

export default FeeStructureFormPage;
