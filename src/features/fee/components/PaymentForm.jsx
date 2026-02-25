import React, { useState } from 'react';
import { feeApi } from '../api/feeApi';
import { FiX, FiCheckCircle, FiAlertCircle, FiShield } from 'react-icons/fi';

export default function PaymentForm({ allocationId, rmi = 0, specificInstallment = null, onClose, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('UPI');
    const [reference, setReference] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const maxPayable = specificInstallment ? specificInstallment.remainingAmount : rmi;
    const isGeneralPayment = !specificInstallment;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const numericAmount = Number(amount);

        if (numericAmount <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }

        // Overpayment Prevention Validation
        if (numericAmount > maxPayable) {
            setError(`Cannot overpay. Maximum allowed is ₹${maxPayable.toLocaleString('en-IN')}`);
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                installmentId: specificInstallment ? specificInstallment.id : null,
                amount: numericAmount,
                mode,
                reference
            };

            await feeApi.recordPayment(allocationId, payload);

            // Trigger refresh
            if (onSuccess) onSuccess();
            onClose();

        } catch (err) {
            setError(err.message || 'Payment processing failed. Please check backend constraints.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content border-0 shadow">

                    <div className="modal-header bg-primary text-white border-0">
                        <h5 className="modal-title fw-bold" id="modal-title">
                            {isGeneralPayment ? 'Record Student Payment' : `Pay Installment: Term ${specificInstallment.index + 1}`}
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

                            <div className="alert alert-info border border-info mb-4">
                                {isGeneralPayment ? (
                                    <>
                                        <div className="fw-bold d-flex align-items-center gap-2 mb-1"><FiShield /> Global Ledger Payment</div>
                                        <small>This payment will be automatically distributed starting from the oldest priority overdue installment.</small>
                                    </>
                                ) : (
                                    <>
                                        <div className="fw-bold d-flex align-items-center gap-2 mb-1"><FiShield /> Specific Installment Target</div>
                                        <small>This payment will strictly be allocated to the selected installment.</small>
                                    </>
                                )}
                                <div className="mt-2 font-monospace bg-white d-inline-block px-2 py-1 rounded text-primary fw-bold border border-info">
                                    Max Allowed: ₹{maxPayable.toLocaleString('en-IN')}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-secondary">
                                    Amount Paid (₹) <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    max={maxPayable}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="form-control form-control-lg fw-bold"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="row g-3 mb-2">
                                <div className="col-sm-6">
                                    <label className="form-label fw-bold small text-secondary">
                                        Payment Mode <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        value={mode}
                                        onChange={(e) => setMode(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="UPI">UPI</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-bold small text-secondary">
                                        Reference ID
                                    </label>
                                    <input
                                        type="text"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        className="form-control"
                                        placeholder="Txn ID, Cheque No..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !amount}
                                className="btn btn-success px-4"
                            >
                                {isSubmitting ? 'Processing...' : `Confirm Payment`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
