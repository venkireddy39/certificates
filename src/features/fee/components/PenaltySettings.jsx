import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

export default function PenaltySettings({ penaltyConfig, onChange }) {
    const [enabled, setEnabled] = useState(penaltyConfig?.penaltyType !== 'NONE');

    const handleToggle = (e) => {
        const isEnabled = e.target.checked;
        setEnabled(isEnabled);
        if (!isEnabled) {
            onChange({ ...penaltyConfig, penaltyType: 'NONE', fixedPenaltyAmount: 0, penaltyPercentage: 0, maxPenaltyCap: 0 });
        } else {
            onChange({ ...penaltyConfig, penaltyType: 'FIXED' }); // Default fallback
        }
    };

    const handleChange = (field, value) => {
        // Ensure values don't go negative
        if (Number(value) < 0) value = 0;
        onChange({ ...penaltyConfig, [field]: value });
    };

    return (
        <div className="card shadow-sm border-0 mb-4 mt-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center p-3 border-bottom">
                <div>
                    <h6 className="mb-0 fw-bold text-dark">Penalty Configuration (Slabs)</h6>
                    <small className="text-muted">Apply late fees or slabs to overdue installments automatically.</small>
                </div>
                <div className="form-check form-switch fs-4 m-0">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={enabled}
                        onChange={handleToggle}
                    />
                </div>
            </div>

            {enabled && (
                <div className="card-body p-4">

                    {/* Penalty Type Selection */}
                    <div className="mb-4">
                        <label className="form-label fw-bold text-secondary small">Penalty Type Framework:</label>
                        <div className="d-flex gap-3">
                            <div className="form-check bg-light px-4 py-2 rounded border">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="penaltyType"
                                    id="typeFixed"
                                    value="FIXED"
                                    checked={penaltyConfig.penaltyType === 'FIXED'}
                                    onChange={(e) => handleChange('penaltyType', e.target.value)}
                                />
                                <label className="form-check-label fw-medium ms-1 text-dark" htmlFor="typeFixed">
                                    Fixed Slab Base
                                </label>
                            </div>
                            <div className="form-check bg-light px-4 py-2 rounded border">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="penaltyType"
                                    id="typePercentage"
                                    value="PERCENTAGE"
                                    checked={penaltyConfig.penaltyType === 'PERCENTAGE'}
                                    onChange={(e) => handleChange('penaltyType', e.target.value)}
                                />
                                <label className="form-check-label fw-medium ms-1 text-dark" htmlFor="typePercentage">
                                    Percentage (%) Config
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Inputs based on Type */}
                    <div className="row g-4">
                        {penaltyConfig.penaltyType === 'FIXED' ? (
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary small">Max Fixed Penalty Slab Amount (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={penaltyConfig.fixedPenaltyAmount || ''}
                                    onChange={(e) => handleChange('fixedPenaltyAmount', e.target.value)}
                                    className="form-control"
                                    placeholder="e.g. 2500"
                                    required
                                />
                                <small className="text-muted">Will be applied to the RMI.</small>
                            </div>
                        ) : (
                            <>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-secondary small">Percentage Rate (%)</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            min="0" max="100"
                                            value={penaltyConfig.penaltyPercentage || ''}
                                            onChange={(e) => handleChange('penaltyPercentage', e.target.value)}
                                            className="form-control"
                                            placeholder="e.g. 5"
                                            required
                                        />
                                        <span className="input-group-text">%</span>
                                    </div>
                                    <small className="text-muted">Calculated on pending amount.</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-secondary small">Max Cap Amount Slab (Optional)</label>
                                    <div className="input-group">
                                        <span className="input-group-text">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={penaltyConfig.maxPenaltyCap || ''}
                                            onChange={(e) => handleChange('maxPenaltyCap', e.target.value)}
                                            className="form-control"
                                            placeholder="Max ceiling limit"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Strictly Read-Only Rules Warning requested by user */}
                    <div className="alert alert-info border-info mt-4 d-flex align-items-start" role="alert">
                        <FiInfo className="me-3 fs-4 text-info flex-shrink-0" />
                        <div>
                            <h6 className="alert-heading fw-bold mb-1">Penalty / Slab Rules (Automated Engine):</h6>
                            <ul className="mb-0 small ps-3">
                                <li>Applies <strong>only after</strong> the due date has passed on the specific installment.</li>
                                <li>The Slab logic evaluates strictly on the <strong>pending amount</strong> only.</li>
                                <li>Any manual Admin overrides on these calculated limits are logged in Audit.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
