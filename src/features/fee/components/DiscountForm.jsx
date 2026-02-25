import React, { useState } from 'react';
import { feeApi } from '../api/feeApi';
import { FiX, FiCheckCircle, FiAlertCircle, FiPercent } from 'react-icons/fi';

export default function DiscountForm({ allocationId, onClose, onSuccess }) {
    const [type, setType] = useState('FLAT');
    const [value, setValue] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const numericValue = Number(value);
        if (numericValue <= 0) {
            setError('Discount value must be greater than zero.');
            return;
        }

        if (type === 'PERCENTAGE' && numericValue > 100) {
            setError('Percentage cannot exceed 100%.');
            return;
        }

        setIsSubmitting(true);

        try {
            await feeApi.applyDiscount(allocationId, {
                type,
                value: numericValue,
                reason
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to apply discount.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content border-0 shadow">

                    <div className="modal-header bg-primary text-white border-0">
                        <h5 className="modal-title fw-bold">
                            <FiPercent className="me-2" /> Apply Discount
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">

                            {error && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <FiAlertCircle className="me-2 flex-shrink-0" />
                                    <div>{error}</div>
                                </div>
                            )}

                            <div className="alert alert-warning border border-warning mb-4 small">
                                <strong>Warning:</strong> Discounts directly reduce the Remaining Amount (RMI) for this student's allocation permanently.
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-secondary">Discount Type <span className="text-danger">*</span></label>
                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="FLAT">Flat Amount (₹)</option>
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-secondary">
                                    {type === 'FLAT' ? 'Discount Amount (₹)' : 'Discount Percentage (%)'} <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    max={type === 'PERCENTAGE' ? '100' : undefined}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="form-control form-control-lg fw-bold text-primary"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label fw-bold small text-secondary">Reason / Remarks <span className="text-danger">*</span></label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    required
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Enter authorization reason..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !value || !reason}
                                className="btn btn-primary px-4"
                            >
                                {isSubmitting ? 'Applying...' : 'Confirm Discount'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
