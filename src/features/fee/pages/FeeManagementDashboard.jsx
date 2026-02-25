import React, { useState, useEffect } from 'react';
import FeeConfigForm from '../components/FeeConfigForm';
import StudentFeeSummary from '../components/StudentFeeSummary';
import InstallmentTable from '../components/InstallmentTable';
import PaymentForm from '../components/PaymentForm';
import { feeApi } from '../api/feeApi';
import { FiSettings, FiUsers, FiSearch, FiRefreshCw } from 'react-icons/fi';

export default function FeeManagementDashboard() {
    const [activeTab, setActiveTab] = useState('config'); // 'config' | 'ledger'

    // Ledger State
    const [allocationIdInput, setAllocationIdInput] = useState('');
    const [allocationData, setAllocationData] = useState(null);
    const [installmentsData, setInstallmentsData] = useState([]);
    const [isFetchingLedger, setIsFetchingLedger] = useState(false);

    // Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Fetch Student Ledger
    const loadLedger = async (id) => {
        if (!id) return;
        setIsFetchingLedger(true);
        try {
            const alloc = await feeApi.getStudentAllocation(id);
            const insts = await feeApi.getStudentInstallments(id);
            setAllocationData(alloc);
            setInstallmentsData(insts);
        } catch (error) {
            console.error("Failed to fetch ledger", error);
            alert("Ledger not found or API error.");
            setAllocationData(null);
            setInstallmentsData([]);
        } finally {
            setIsFetchingLedger(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadLedger(allocationIdInput);
    };

    const refreshLedger = () => {
        if (allocationData?.id) loadLedger(allocationData.id);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Dashboard Header */}
                <div className="mb-8 md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Fee Management Console
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Configure base structures and manage individual student ledgers cleanly and securely.
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`${activeTab === 'config'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition`}
                        >
                            <FiSettings className="mr-2 h-5 w-5" />
                            Fee Configuration (Admin)
                        </button>

                        <button
                            onClick={() => setActiveTab('ledger')}
                            className={`${activeTab === 'ledger'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition`}
                        >
                            <FiUsers className="mr-2 h-5 w-5" />
                            Student Ledgers
                        </button>
                    </nav>
                </div>

                {/* Tab Rendering */}
                <div className="mt-6">
                    {activeTab === 'config' && (
                        <div className="animate-fade-in-up">
                            <FeeConfigForm />
                        </div>
                    )}

                    {activeTab === 'ledger' && (
                        <div className="max-w-5xl mx-auto animate-fade-in-up">

                            {/* Search Bar */}
                            <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-3">
                                <div className="relative flex-grow max-w-md shadow-sm rounded-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={allocationIdInput}
                                        onChange={(e) => setAllocationIdInput(e.target.value)}
                                        className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        placeholder="Enter Allocation ID (e.g., 1)"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isFetchingLedger}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:bg-indigo-400"
                                >
                                    {isFetchingLedger ? 'Loading...' : 'Find Ledger'}
                                </button>
                            </form>

                            {/* Active Ledger Display */}
                            {allocationData ? (
                                <div className="space-y-6">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={refreshLedger}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1.5 transition"
                                        >
                                            <FiRefreshCw /> Refresh Ledger
                                        </button>
                                    </div>

                                    {/* The Dynamic Summary */}
                                    <StudentFeeSummary
                                        allocation={allocationData}
                                        onPaymentClick={() => setShowPaymentModal(true)}
                                    />

                                    {/* The Installments Data Table */}
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 bg-gray-50 flex justify-between items-center">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Installment Schedule
                                            </h3>
                                        </div>
                                        <InstallmentTable
                                            isEditMode={false}
                                            installments={installmentsData}
                                            actions={{}}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <FiUsers className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Ledger Selected</h3>
                                    <p className="mt-1 text-sm text-gray-500">Enter a Student Allocation ID to view and manage their fees.</p>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* Modals */}
                {showPaymentModal && allocationData && (
                    <PaymentForm
                        allocationId={allocationData.id}
                        // Dynamic read-only RMI execution matching StudentFeeSummary
                        rmi={Math.max(0, (allocationData.originalTotalAmount - allocationData.totalDiscount + allocationData.totalPenaltyApplied) - allocationData.paidAmount)}
                        onClose={() => setShowPaymentModal(false)}
                        onSuccess={() => {
                            refreshLedger(); // Refetch Ledger aggressively after payment
                        }}
                    />
                )}

            </div>
        </div>
    );
}
