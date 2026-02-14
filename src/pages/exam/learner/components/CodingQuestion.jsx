import React from 'react';

const CodingQuestion = ({
    question,
    answer,
    onAnswerChange,
    onRunCode,
    executing,
    executionResults,
    testCases = []
}) => {
    return (
        <div className="coding-wrapper mt-3">
            {/* Custom Toolbar */}
            <div className="coding-toolbar border rounded-top bg-light px-3 py-2 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <label className="small fw-bold text-muted mb-0">Language:</label>
                    <select
                        className="form-select form-select-sm border shadow-none"
                        style={{ width: '150px', fontSize: '0.85rem' }}
                        defaultValue={question.language || 'javascript'}
                        disabled
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
                <button
                    className="btn btn-sm btn-success fw-bold px-3 d-flex align-items-center gap-2 shadow-sm"
                    onClick={onRunCode}
                    disabled={executing}
                >
                    {executing ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Running...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-play-fill text-white fs-6"></i> Run Code
                        </>
                    )}
                </button>
            </div>

            {/* Premium Editor Container */}
            <div className="coding-editor-wrapper bg-dark p-1 border border-top-0 rounded-bottom">
                <textarea
                    className="form-control font-monospace border-0 bg-transparent text-light p-3 coding-textarea"
                    rows={12}
                    value={answer || question.starterCode || ''}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    spellCheck="false"
                    style={{
                        resize: 'none',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        minHeight: '300px',
                        outline: 'none',
                        boxShadow: 'none'
                    }}
                    placeholder="// Write your solution here..."
                ></textarea>
            </div>

            {/* Test Cases Area */}
            <div className="test-cases-card mt-4 shadow-sm">
                <div className="test-cases-header bg-light border-bottom px-3 py-2 d-flex align-items-center gap-2">
                    <i className="bi bi-check2-square text-primary"></i>
                    <span className="text-uppercase small fw-bold">Test Cases (Reference)</span>
                </div>
                <div className="test-cases-body p-0">
                    {testCases.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm mb-0">
                                <thead className="bg-white">
                                    <tr className="small text-muted border-bottom">
                                        <th className="ps-3 py-2">Input</th>
                                        <th className="py-2">Expected Output</th>
                                        <th className="py-2">Visibility</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testCases.map((tc, idx) => (
                                        <tr key={idx} className="border-bottom-0">
                                            <td className="ps-3 py-2 text-muted font-monospace">{tc.input || "-"}</td>
                                            <td className="py-2 text-muted font-monospace">{tc.output || "-"}</td>
                                            <td className="py-2">
                                                {tc.hidden ?
                                                    <span className="badge bg-secondary opacity-75 fw-normal">Hidden</span> :
                                                    <span className="badge bg-info text-dark fw-normal">Public</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-muted small fst-italic">
                            No test cases defined for this question.
                        </div>
                    )}
                </div>
            </div>

            {/* Execution Results Overlay/Panel */}
            {executionResults && (
                <div className="execution-results-card mt-4 border rounded overflow-hidden shadow-sm animate-fade-in">
                    <div className={`px-3 py-2 small fw-bold text-white d-flex justify-content-between align-items-center ${executionResults.allPassed ? 'bg-success' : 'bg-danger'}`}>
                        <span>
                            <i className={`bi ${executionResults.allPassed ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                            {executionResults.allPassed ? 'All Test Cases Passed' : 'Execution Failed'}
                        </span>
                    </div>
                    <div className="bg-white p-3">
                        <div className="vstack gap-2">
                            {executionResults.results.map((res, i) => (
                                <div key={i} className="p-2 border rounded-3 bg-light bg-opacity-50 small">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="fw-bold">Case {i + 1}</span>
                                        {res.passed ? (
                                            <span className="text-success small fw-bold"><i className="bi bi-check-circle me-1"></i>Passed</span>
                                        ) : (
                                            <span className="text-danger small fw-bold"><i className="bi bi-x-circle me-1"></i>Failed</span>
                                        )}
                                    </div>
                                    <div className="row g-2 font-monospace x-small opacity-75">
                                        <div className="col-4">
                                            <div className="text-muted text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Input</div>
                                            <div className="px-2 py-1 bg-white border rounded text-truncate">{res.input}</div>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-muted text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Expected</div>
                                            <div className="px-2 py-1 bg-white border rounded text-truncate">{res.expected}</div>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-muted text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Actual</div>
                                            <div className={`px-2 py-1 rounded border text-truncate ${res.passed ? 'bg-white text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                                {res.actual}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodingQuestion;
