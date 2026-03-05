import React, { useEffect } from 'react';
import { FaDownload, FaPalette } from 'react-icons/fa';
import CertificateRenderer from '../renderer/CertificateRenderer';

const TARGET_TYPES = ['EXAM', 'COURSE', 'BATCH', 'ASSIGNMENT'];

const ManualIssue = ({
    issueData,
    setIssueData,
    templates,
    onIssue,
    settings
}) => {
    // Auto-select active template when list loads
    useEffect(() => {
        if (!issueData.selectedTemplateId && templates && templates.length > 0) {
            const activeTemp = templates.find(t => t.isActive) || templates[0];
            setIssueData(prev => ({ ...prev, selectedTemplateId: activeTemp.id }));
        }
    }, [templates, issueData.selectedTemplateId, setIssueData]);

    const handleChange = (field, value) => {
        setIssueData(prev => ({ ...prev, [field]: value }));
    };

    const selectedTemplate = templates.find(t => t.id === Number(issueData.selectedTemplateId) || t.id === issueData.selectedTemplateId);

    return (
        <div className="row g-4">
            {/* Form */}
            <div className="col-lg-5">
                <div className="card border-0 shadow-sm rounded-4 cert-issue-card">
                    <div className="card-header bg-white border-0 pt-4 px-4">
                        <h5 className="fw-bold mb-0">Issue New Certificate</h5>
                        <small className="text-muted">Fill all fields to generate a certificate</small>
                    </div>
                    <div className="card-body p-4">

                        {/* Select Template */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                <FaPalette className="me-1 text-primary" />
                                Select Template <span className="text-danger">*</span>
                            </label>
                            {templates && templates.length > 0 ? (
                                <select
                                    className="form-select"
                                    value={issueData.selectedTemplateId || ''}
                                    onChange={e => handleChange('selectedTemplateId', e.target.value)}
                                >
                                    <option value="" disabled>— Choose a template —</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}{t.isActive ? ' (Active)' : ''}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="alert alert-warning py-2 mb-0 small">
                                    No templates available. Please create one in the <strong>Templates</strong> tab first.
                                </div>
                            )}
                        </div>

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
                            disabled={!issueData.selectedTemplateId}
                        >
                            <FaDownload className="me-2" /> Generate &amp; Issue Certificate
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            <div className="col-lg-7">
                <div className="border rounded-4 bg-white overflow-hidden" style={{ minHeight: '300px' }}>
                    {selectedTemplate ? (
                        <>
                            <div className="px-3 pt-3 pb-2 border-bottom d-flex align-items-center gap-2">
                                <FaPalette className="text-primary" />
                                <span className="small fw-semibold text-muted text-truncate">
                                    Preview — <strong className="text-dark">{selectedTemplate.name}</strong>
                                </span>
                            </div>
                            <div className="preview-content-container p-3" style={{ overflowX: 'auto' }}>
                                <div style={{ minWidth: '400px', margin: '0 auto' }}>
                                    <CertificateRenderer
                                        template={selectedTemplate}
                                        data={{
                                            studentName: issueData.studentName || 'Student Name',
                                            courseName: issueData.eventTitle || 'Course / Event Title',
                                            issueDate: new Date().toLocaleDateString('en-GB'),
                                            certificateId: 'PREVIEW',
                                            ...settings
                                        }}
                                        isDesigning={false}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted py-5">
                            <FaPalette size={36} className="mb-3 opacity-25" />
                            <p className="fw-semibold mb-1">No template selected</p>
                            <p className="small">Select a template above to see a live preview</p>
                        </div>
                    )}
                </div>
                <p className="text-center small text-muted mt-2 d-none d-sm-block">
                    Live preview updates as you fill the form
                </p>
            </div>
        </div>
    );
};

export default ManualIssue;
