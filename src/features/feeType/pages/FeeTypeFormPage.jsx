import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { feeTypeService } from '../api';
import { ArrowLeft, Tag, Save, Hash, FileText, CheckCircle } from 'lucide-react';

const feeTypeSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    displayOrder: z.coerce.number().min(0, 'Must be a positive number'),
});

const CSS = `
    .ftf-page {
        background: #f1f5f9; min-height: 100vh;
        font-family: 'Inter', 'Outfit', system-ui, sans-serif;
    }
    /* Hero */
    .ftf-hero {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #312e81 100%);
        padding: 22px 36px;
        display: flex; align-items: center; gap: 18px;
        position: relative; overflow: hidden;
    }
    .ftf-hero::before {
        content: ''; position: absolute;
        width: 260px; height: 260px;
        background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
        top: -80px; right: -60px; border-radius: 50%; pointer-events: none;
    }
    .ftf-back-btn {
        width: 40px; height: 40px; border-radius: 11px;
        border: 1.5px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.1); color: #fff;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s; flex-shrink: 0; position: relative; z-index: 1;
    }
    .ftf-back-btn:hover { background: rgba(255,255,255,0.2); }
    .ftf-hero-text { position: relative; z-index: 1; }
    .ftf-eyebrow {
        display: inline-flex; align-items: center; gap: 5px;
        background: rgba(99,102,241,0.25); color: #a5b4fc;
        font-size: 10px; font-weight: 700; letter-spacing: 1px;
        text-transform: uppercase; padding: 3px 10px; border-radius: 20px;
        border: 1px solid rgba(99,102,241,0.3); margin-bottom: 8px;
    }
    .ftf-hero-title { font-size: 22px; font-weight: 900; color: #fff; margin: 0 0 3px; letter-spacing: -0.3px; }
    .ftf-hero-sub { font-size: 12.5px; color: rgba(255,255,255,0.55); margin: 0; font-weight: 500; }

    /* Form card */
    .ftf-body { padding: 36px; display: flex; justify-content: center; }
    .ftf-card {
        background: #fff; border-radius: 22px;
        border: 1.5px solid #e5e7eb;
        box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        padding: 36px 40px; width: 100%; max-width: 540px;
        animation: ftfUp 0.35s cubic-bezier(0.4,0,0.2,1) both;
    }
    @keyframes ftfUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: none; } }

    .ftf-card-title {
        font-size: 18px; font-weight: 900; color: #0f172a; margin: 0 0 6px;
        display: flex; align-items: center; gap: 10px;
    }
    .ftf-card-icon {
        width: 40px; height: 40px; border-radius: 12px;
        background: #eef2ff; color: #6366f1;
        display: flex; align-items: center; justify-content: center;
    }
    .ftf-card-sub { font-size: 13px; color: #64748b; font-weight: 500; margin: 0 0 28px; }

    /* Fields */
    .ftf-field { margin-bottom: 20px; }
    .ftf-label {
        display: flex; align-items: center; gap: 6px;
        font-size: 11.5px; font-weight: 700; color: #374151;
        text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px;
    }
    .ftf-label-icon { color: #6366f1; }
    .ftf-input {
        width: 100%;
        background: #f8fafc; border: 1.5px solid #e2e8f0;
        border-radius: 12px; padding: 11px 14px;
        font-size: 14px; font-weight: 500; color: #0f172a;
        outline: none; transition: all 0.2s;
        box-sizing: border-box;
    }
    .ftf-input:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
    .ftf-input.error { border-color: #f43f5e; background: #fff1f2; }
    .ftf-error { font-size: 11.5px; color: #e11d48; font-weight: 600; margin-top: 5px; }
    textarea.ftf-input { resize: vertical; min-height: 80px; }

    /* Divider */
    .ftf-divider { border: none; border-top: 1.5px solid #f1f5f9; margin: 24px 0; }

    /* Buttons */
    .ftf-actions { display: flex; gap: 10px; justify-content: flex-end; }
    .ftf-btn-cancel {
        padding: 10px 22px; border-radius: 12px;
        border: 1.5px solid #e5e7eb; background: #fff; color: #64748b;
        font-size: 13.5px; font-weight: 700; cursor: pointer; transition: all 0.15s;
    }
    .ftf-btn-cancel:hover { background: #f8fafc; color: #374151; border-color: #cbd5e1; }
    .ftf-btn-save {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 10px 24px; border-radius: 12px;
        background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff;
        border: none; font-size: 13.5px; font-weight: 700; cursor: pointer;
        box-shadow: 0 4px 12px rgba(99,102,241,0.36); transition: all 0.2s;
    }
    .ftf-btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,0.45); }
    .ftf-btn-save:disabled { opacity: 0.65; cursor: not-allowed; }
    .ftf-spin { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; animation: ftfSpin 0.6s linear infinite; }
    @keyframes ftfSpin { to { transform: rotate(360deg); } }

    /* Tip */
    .ftf-tip {
        margin-top: 16px; padding: 12px 16px;
        background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;
        font-size: 12px; color: #15803d; font-weight: 600;
        display: flex; align-items: flex-start; gap: 8px;
    }
`;

const FeeTypeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(feeTypeSchema),
        defaultValues: { name: '', description: '', displayOrder: 0 },
    });

    useEffect(() => {
        if (isEditMode) {
            feeTypeService.getById(id)
                .then(res => {
                    const d = res.data;
                    setValue('name', d.name);
                    setValue('description', d.description || '');
                    setValue('displayOrder', d.displayOrder || 0);
                })
                .catch(() => {
                    toast.error('Failed to load fee type');
                    navigate('/admin/fee-types');
                });
        }
    }, [id]);

    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await feeTypeService.update(id, data);
                toast.success('Fee type updated successfully');
            } else {
                await feeTypeService.create({ ...data, active: true });
                toast.success('Fee type created successfully');
            }
            navigate('/admin/fee-types');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error occurred while saving');
        }
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="ftf-page">
                {/* Hero */}
                <div className="ftf-hero">
                    <button className="ftf-back-btn" onClick={() => navigate('/admin/fee-types')} title="Back">
                        <ArrowLeft size={17} />
                    </button>
                    <div className="ftf-hero-text">
                        <div className="ftf-eyebrow"><Tag size={10} /> Fee Management › Fee Types</div>
                        <div className="ftf-hero-title">{isEditMode ? `✏️ Edit Fee Type` : '✦ New Fee Type'}</div>
                        <div className="ftf-hero-sub">
                            {isEditMode ? `Editing fee type #${id}` : 'Define a new fee category for use in fee structures'}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="ftf-body">
                    <div className="ftf-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                            <div className="ftf-card-icon"><Tag size={20} /></div>
                            <div>
                                <div className="ftf-card-title">{isEditMode ? 'Edit Fee Type' : 'Fee Type Details'}</div>
                            </div>
                        </div>
                        <p className="ftf-card-sub">
                            Fee types are categories like Tuition, Exam, Library, etc. used to classify fee components in a structure.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Name */}
                            <div className="ftf-field">
                                <label className="ftf-label">
                                    <Tag size={12} className="ftf-label-icon" /> Fee Type Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    {...register('name')}
                                    className={`ftf-input ${errors.name ? 'error' : ''}`}
                                    placeholder="e.g. Tuition Fee, Exam Fee, Library Fee"
                                />
                                {errors.name && <div className="ftf-error">⚠ {errors.name.message}</div>}
                            </div>

                            {/* Description */}
                            <div className="ftf-field">
                                <label className="ftf-label">
                                    <FileText size={12} className="ftf-label-icon" /> Description
                                    <span style={{ color: '#94a3b8', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                                </label>
                                <textarea
                                    {...register('description')}
                                    className="ftf-input"
                                    placeholder="Brief description of when this fee applies…"
                                />
                            </div>

                            {/* Display Order */}
                            <div className="ftf-field">
                                <label className="ftf-label">
                                    <Hash size={12} className="ftf-label-icon" /> Display Order
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    {...register('displayOrder')}
                                    className={`ftf-input ${errors.displayOrder ? 'error' : ''}`}
                                    placeholder="0"
                                    style={{ maxWidth: 140 }}
                                />
                                {errors.displayOrder && <div className="ftf-error">⚠ {errors.displayOrder.message}</div>}
                                <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 500, marginTop: 5 }}>
                                    Lower numbers appear first in lists and fee structure forms.
                                </div>
                            </div>

                            <hr className="ftf-divider" />

                            <div className="ftf-actions">
                                <button type="button" className="ftf-btn-cancel" onClick={() => navigate('/admin/fee-types')}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="ftf-btn-save">
                                    {isSubmitting ? <span className="ftf-spin" /> : <Save size={15} />}
                                    {isSubmitting ? 'Saving…' : isEditMode ? 'Update Type' : 'Create Type'}
                                </button>
                            </div>
                        </form>

                        {!isEditMode && (
                            <div className="ftf-tip">
                                <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                                New fee types are set to <strong>Active</strong> by default and immediately available for use in fee structures.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeeTypeFormPage;
