import React, { useState } from 'react';
import { FaRobot, FaTrash, FaCheckCircle, FaEnvelope } from 'react-icons/fa';

const AutomationRules = ({
    autoRules,
    setAutoRules,
    handleAutoRuleSave,
    templates
}) => {
    // Form States
    const [selectedCourseName, setSelectedCourseName] = useState("");
    const [selectedBatchName, setSelectedBatchName] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] = useState("");

    // Conditions State
    const [reqCompletion, setReqCompletion] = useState(false);
    const [completionPercent, setCompletionPercent] = useState(100);
    const [reqExamPassed, setReqExamPassed] = useState(false);
    const [reqFeePaid, setReqFeePaid] = useState(false);

    // Actions State
    const [actIssue, setActIssue] = useState(true);
    const [actEmail, setActEmail] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!selectedCourseName || !selectedTemplateId) {
            alert("Please select a course and a template.");
            return;
        }

        handleAutoRuleSave({
            courseName: selectedCourseName,
            batchName: selectedBatchName || 'All Batches',
            templateId: selectedTemplateId,
            conditions: {
                reqCompletion,
                completionPercent,
                reqExamPassed,
                reqFeePaid
            },
            actions: {
                actIssue,
                actEmail
            }
        });

        // Reset
        setSelectedCourseName("");
        setSelectedBatchName("");
        setSelectedTemplateId("");
        setReqCompletion(false);
        setCompletionPercent(100);
        setReqExamPassed(false);
        setReqFeePaid(false);
        setActIssue(true);
        setActEmail(false);
    };

    return (
        <div className="row g-4 animate-fade-in">
            <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-header bg-white border-0 pt-4 px-4">
                        <h5 className="fw-bold"><FaRobot className="me-2 text-info" />Automation Rules</h5>
                        <p className="text-secondary small">Automatically issue certificates when students complete a course.</p>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Course Name</label>
                                <input
                                    className="form-control"
                                    placeholder="Enter Course Name"
                                    value={selectedCourseName}
                                    onChange={e => setSelectedCourseName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Batch Name (Optional)</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Batch A"
                                    value={selectedBatchName}
                                    onChange={e => setSelectedBatchName(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Certificate Template</label>
                                <select
                                    className="form-select"
                                    value={selectedTemplateId}
                                    onChange={e => setSelectedTemplateId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Template --</option>
                                    {templates.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                                </select>
                            </div>

                            <hr className="my-4" />

                            <h6 className="fw-bold fs-6 mb-3 text-primary">Rule Conditions</h6>

                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="reqCompletion"
                                    checked={reqCompletion}
                                    onChange={e => setReqCompletion(e.target.checked)}
                                />
                                <label className="form-check-label fw-medium small" htmlFor="reqCompletion">
                                    Require Course Completion
                                </label>
                            </div>

                            {reqCompletion && (
                                <div className="mb-3 ps-4" style={{ maxWidth: '200px' }}>
                                    <label className="form-label small text-muted">Completion %</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        min="1" max="100"
                                        value={completionPercent}
                                        onChange={e => setCompletionPercent(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="reqExam"
                                    checked={reqExamPassed}
                                    onChange={e => setReqExamPassed(e.target.checked)}
                                />
                                <label className="form-check-label fw-medium small" htmlFor="reqExam">
                                    Require Final Exam Passed
                                </label>
                            </div>

                            <div className="form-check mb-4">
                                <input
                                    className="form-check-input border-danger"
                                    type="checkbox"
                                    id="reqFee"
                                    checked={reqFeePaid}
                                    onChange={e => setReqFeePaid(e.target.checked)}
                                />
                                <label className="form-check-label fw-bold text-danger small" htmlFor="reqFee">
                                    Require Fee Status = PAID
                                </label>
                            </div>

                            <h6 className="fw-bold fs-6 mb-3 text-success">Automated Actions</h6>

                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input bg-success border-success"
                                    type="checkbox"
                                    id="actIssue"
                                    checked={actIssue}
                                    onChange={e => setActIssue(e.target.checked)}
                                />
                                <label className="form-check-label fw-medium small" htmlFor="actIssue">
                                    <FaCheckCircle className="text-success me-1" /> Issue Certificate to Portal
                                </label>
                            </div>

                            <div className="form-check mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="actEmail"
                                    checked={actEmail}
                                    onChange={e => setActEmail(e.target.checked)}
                                />
                                <label className="form-check-label fw-medium small" htmlFor="actEmail">
                                    <FaEnvelope className="text-warning me-1" /> Send Certificate via Email
                                </label>
                            </div>

                            <button type="submit" className="btn btn-dark w-100 fw-bold pb-2 pt-2 rounded-3 shadow-sm">
                                Create Automation Rule
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-header bg-white border-0 pt-4 px-4">
                        <h6 className="fw-bold">Active Rules</h6>
                    </div>
                    <div className="card-body">
                        {autoRules.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                <FaRobot size={32} className="opacity-25 mb-2" />
                                <p>No automation rules set.</p>
                            </div>
                        ) : (
                            <table className="table table-hover align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 ps-3 rounded-start">Course</th>
                                        <th className="border-0">Template</th>
                                        <th className="border-0">Status</th>
                                        <th className="border-0 rounded-end text-end pe-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {autoRules.map(rule => (
                                        <tr key={rule.id}>
                                            <td className="ps-3">
                                                <div className="fw-bold text-dark">{rule.courseName}</div>
                                                <div className="small text-muted">{rule.batchId ? rule.batchName : 'All Batches'}</div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border p-2">
                                                    {templates.find(t => String(t.id) === String(rule.templateId))?.name || 'Unknown'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column gap-1">
                                                    {rule.conditions?.reqCompletion && <span className="badge bg-info bg-opacity-10 text-info text-start" style={{ width: 'fit-content' }}>Comp: {rule.conditions.completionPercent}%</span>}
                                                    {rule.conditions?.reqExamPassed && <span className="badge bg-purple bg-opacity-10 text-purple text-start" style={{ width: 'fit-content', color: '#6f42c1' }}>Exam Passed</span>}
                                                    {rule.conditions?.reqFeePaid && <span className="badge bg-danger bg-opacity-10 text-danger text-start" style={{ width: 'fit-content' }}>Fee Paid</span>}
                                                    {(!rule.conditions?.reqCompletion && !rule.conditions?.reqExamPassed && !rule.conditions?.reqFeePaid) && <span className="badge bg-secondary bg-opacity-10 text-secondary text-start" style={{ width: 'fit-content' }}>None specified</span>}
                                                </div>
                                            </td>
                                            <td className="text-end pe-3">
                                                <button className="btn btn-sm btn-icon btn-light text-danger" onClick={() => setAutoRules(autoRules.filter(r => r.id !== rule.id))}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomationRules;
