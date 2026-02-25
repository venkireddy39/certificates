import React from 'react';
import { FiDollarSign, FiClock, FiActivity } from 'react-icons/fi';

export default function StudentFeeSummary({ allocation, onPaymentClick }) {
    if (!allocation) return null;

    const { student, feeStructure, originalTotalAmount, totalDiscount, totalPenaltyApplied, paidAmount } = allocation;

    // Core Formula execution on Frontend purely for display synchronization (Backend handles truth)
    const activeTotal = (originalTotalAmount - totalDiscount + totalPenaltyApplied);
    const rmi = Math.max(0, activeTotal - paidAmount);

    return (
        <div className="card shadow-sm border-0 mb-4 overflow-hidden">

            {/* Header info */}
            <div className="card-header bg-primary bg-gradient bg-opacity-10 text-primary border-bottom border-primary border-opacity-25 p-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-1 fw-bold text-dark">
                        {student ? `${student.firstName} ${student.lastName}` : `Student ID: ${allocation.studentId}`}
                    </h4>
                    <p className="mb-0 small fw-medium">
                        Structure: {feeStructure?.name || 'Assigned Fee Structure'} | Allocation ID: #{allocation.id}
                    </p>
                </div>
                <div>
                    <span className="badge bg-white text-primary border border-primary shadow-sm px-3 py-2 rounded-pill d-flex align-items-center">
                        <FiActivity className="me-2" /> Active Ledger
                    </span>
                </div>
            </div>

            {/* Core Metrics Request by User: Massive, bold RMI */}
            <div className="card-body p-4 p-md-5">
                <div className="row g-4">

                    {/* RMI Card - Dominant Visual */}
                    <div className="col-lg-6">
                        <div className="bg-primary bg-gradient rounded-4 p-4 p-md-5 text-white shadow h-100 d-flex flex-column justify-content-center">
                            <span className="badge bg-white bg-opacity-25 text-white align-self-start mb-3 px-3 py-2 text-uppercase tracking-wide">
                                RMI (Remaining Amount)
                            </span>
                            <h1 className="display-4 fw-black mb-0 tracking-tight">
                                ₹{rmi.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h1>
                            <p className="small text-white text-opacity-75 mt-3 mb-0 fw-medium d-flex align-items-center">
                                <FiClock className="me-2" /> Strictly read-only evaluation based on backend logs
                            </p>
                        </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="col-lg-6">
                        <div className="row g-3 h-100">
                            <div className="col-6">
                                <MetricCard label="Original Base Fee" value={originalTotalAmount} colorClass="text-dark" />
                            </div>
                            <div className="col-6">
                                <MetricCard label="Total Paid" value={paidAmount} colorClass="text-success" highlight />
                            </div>
                            <div className="col-6">
                                <MetricCard label="Applied Discounts" value={totalDiscount} colorClass="text-primary" />
                            </div>
                            <div className="col-6">
                                <MetricCard label="Late Penalties (Slabs)" value={totalPenaltyApplied} colorClass="text-danger" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="card-footer bg-light p-3 border-top d-flex justify-content-end gap-2">
                <button
                    onClick={() => alert("Apply Discount functionality. (Calling API POST /discount)")}
                    className="btn btn-outline-secondary fw-medium shadow-sm"
                >
                    Apply Discount
                </button>
                <button
                    onClick={() => alert("Apply Manual Penalty functionality. (Calling API POST /penalty)")}
                    className="btn btn-outline-danger fw-medium shadow-sm"
                >
                    Add Penalty
                </button>
                <button
                    onClick={onPaymentClick}
                    disabled={rmi <= 0}
                    className="btn btn-success fw-medium shadow-sm d-flex align-items-center px-4"
                >
                    <FiDollarSign className="me-1" /> Record Payment
                </button>
            </div>
        </div>
    );
}

function MetricCard({ label, value, colorClass, highlight }) {
    return (
        <div className={`p-4 rounded-3 h-100 border ${highlight ? 'border-success bg-success bg-opacity-10' : 'border-light bg-white shadow-sm'}`}>
            <p className="small text-muted text-uppercase fw-bold tracking-wide mb-1">{label}</p>
            <h4 className={`mb-0 fw-bold ${colorClass}`}>
                ₹{(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h4>
        </div>
    );
}
