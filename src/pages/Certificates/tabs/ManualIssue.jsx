import React, { useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import CertificateRenderer from '../renderer/CertificateRenderer';

const TARGET_TYPES = ['EXAM', 'COURSE', 'BATCH', 'ASSIGNMENT'];

const ManualIssue = ({
    issueData,
    setIssueData,
    templates,
    onIssue,
    settings
}) => {
    useEffect(() => {
        if (!issueData.selectedTemplateId && templates && templates.length > 0) {
            setIssueData(prev => ({ ...prev, selectedTemplateId: templates[0].id }));
        }
    }, [templates, issueData.selectedTemplateId, setIssueData]);

    const handleChange = (field, value) => {
        setIssueData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="row g-4">
            {/* Form */}
            <div className="col-lg-5">
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-header bg-white border-0 pt-4 px-4">
                        <h5 className="fw-bold mb-0">Issue New Certificate</h5>
                        <small className="text-muted">Fill all fields to generate a certificate</small>
                    </div>
                    <div className="card-body p-4">

                        {/* Student Name */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                Student Name <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-control"
                                placeholder="e.g. Ganesh Kopparthi"
                                value={issueData.studentName || ''}
                                onChange={e => handleChange('studentName', e.target.value)}
                            />
                        </div>

                        {/* Student Email */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                Student Email <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="e.g. student@email.com"
                                value={issueData.studentEmail || ''}
                                onChange={e => handleChange('studentEmail', e.target.value)}
                            />
                        </div>

                        {/* User ID */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                User ID <span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 125239"
                                value={issueData.userId || ''}
                                onChange={e => handleChange('userId', parseInt(e.target.value) || '')}
                            />
                        </div>

                        {/* Target Type + Target ID */}
                        <div className="row g-2 mb-3">
                            <div className="col-7">
                                <label className="form-label small fw-bold">
                                    Target Type <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    value={issueData.targetType || 'EXAM'}
                                    onChange={e => handleChange('targetType', e.target.value)}
                                >
                                    {TARGET_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-5">
                                <label className="form-label small fw-bold">
                                    Target ID <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="e.g. 1"
                                    value={issueData.targetId || ''}
                                    onChange={e => handleChange('targetId', parseInt(e.target.value) || '')}
                                />
                            </div>
                        </div>

                        {/* Event Title */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                Event Title <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-control"
                                placeholder="e.g. Java Final Assessment"
                                value={issueData.eventTitle || ''}
                                onChange={e => handleChange('eventTitle', e.target.value)}
                            />
                        </div>

                        {/* Score */}
                        <div className="mb-4">
                            <label className="form-label small fw-bold">Score</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 85"
                                min="0"
                                max="100"
                                value={issueData.score !== undefined && issueData.score !== '' ? issueData.score : ''}
                                onChange={e => handleChange('score', e.target.value === '' ? '' : parseFloat(e.target.value))}
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100 py-2 fw-bold"
                            onClick={onIssue}
                        >
                            <FaDownload className="me-2" /> Generate &amp; Issue Certificate
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="col-lg-7">
                <div className="text-center text-muted py-5 border rounded-4 bg-white">
                    <div style={{ width: '90%', margin: '0 auto' }}>
                        <CertificateRenderer
                            template={templates.find(t => t.id === issueData.selectedTemplateId)}
                            data={{ ...issueData, ...settings }}
                        />
                    </div>
                    <p className="mt-3 small">Real-time Preview</p>
                </div>
            </div>
        </div>
    );
};

export default ManualIssue;
