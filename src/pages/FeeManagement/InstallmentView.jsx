import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Percent, AlertCircle, History, CreditCard, ArrowLeft } from 'lucide-react';
import { getAllocationDetails, getInstallments, getRMI, applyDiscount, applyPenalty } from '../../services/newFeeService';
import PaymentForm from './PaymentForm';
import './FeeManagement.css';

const InstallmentView = () => {
    const { id: allocationId } = useParams();
    const navigate = useNavigate();
    const [allocation, setAllocation] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [rmi, setRmi] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(null);

    const [showDiscountForm, setShowDiscountForm] = useState(false);
    const [discountType, setDiscountType] = useState('FLAT');
    const [discountValue, setDiscountValue] = useState('');
    const [discountReason, setDiscountReason] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [details, insts, currentRmi] = await Promise.all([
                getAllocationDetails(allocationId),
                getInstallments(allocationId),
                getRMI(allocationId)
            ]);
            setAllocation(details);
            setInstallments(insts);
            setRmi(currentRmi);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [allocationId]);

    const handleApplyDiscount = async () => {
        try {
            await applyDiscount(allocationId, discountType, discountValue, discountReason);
            alert('Discount applied');
            setShowDiscountForm(false);
            fetchData();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Fee Details...</div>;
    if (!allocation) return <div className="p-8 text-center">Allocation not found</div>;

    return (
        <div className="installment-view p-6 max-w-6xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-blue-600">
                <ArrowLeft size={20} /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Student Info Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Student</h3>
                    <p className="text-xl font-bold">{allocation.student?.firstName} {allocation.student?.lastName}</p>
                    <p className="text-gray-600 text-sm">{allocation.student?.email}</p>
                    <div className="mt-4 pt-4 border-t">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${allocation.status === 'PAID' ? 'bg-green-100 text-green-700' :
                            allocation.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {allocation.status}
                        </span>
                    </div>
                </div>

                {/* Fee Structure Summary */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Structure</h3>
                    <p className="text-xl font-bold">{allocation.structure?.name}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="text-xs text-gray-500">Total Fee</p>
                            <p className="font-semibold text-gray-800">₹{allocation.totalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Discount</p>
                            <p className="font-semibold text-green-600">-₹{allocation.discountAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Real-time RMI Card */}
                <div className="bg-blue-600 p-6 rounded-xl shadow-md text-white">
                    <h3 className="text-sm font-semibold text-blue-100 uppercase mb-2">Remaining Amount (RMI)</h3>
                    <p className="text-4xl font-black">₹{rmi.toLocaleString()}</p>
                    <div className="mt-4 flex gap-2">
                        <button
                            disabled={rmi <= 0}
                            onClick={() => {
                                setSelectedInstallment(null);
                                setShowPaymentModal(true);
                            }}
                            className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Installments List */}
                <div className="lg:col-span-3 space-y-4">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <History size={24} /> Installment Timeline
                    </h3>
                    {installments.map((inst, index) => (
                        <div key={inst.id} className={`bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md ${inst.status === 'PAID' ? 'bg-gray-50' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${inst.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">₹{inst.amount.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar size={12} /> Due: {inst.dueDate}
                                    </p>
                                    {inst.remarks && (
                                        <p className="text-xs text-blue-500 mt-1 italic flex items-center gap-1">
                                            <AlertCircle size={10} /> {inst.remarks}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className={`px-4 py-1 rounded-full text-xs font-bold ${inst.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {inst.status}
                                </span>
                                {inst.status !== 'PAID' && (
                                    <button
                                        onClick={() => {
                                            setSelectedInstallment(inst);
                                            setShowPaymentModal(true);
                                        }}
                                        className="btn-primary-sm"
                                    >
                                        Pay
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions Sidebar */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase">Quick Actions</h3>

                    {/* Discount Button/Form */}
                    {!showDiscountForm ? (
                        <button
                            onClick={() => setShowDiscountForm(true)}
                            className="w-full flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium transition-colors"
                        >
                            <Percent size={18} /> Apply Discount
                        </button>
                    ) : (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-green-800">Apply Discount</span>
                                <X size={16} className="cursor-pointer" onClick={() => setShowDiscountForm(false)} />
                            </div>
                            <div className="space-y-3">
                                <select
                                    value={discountType}
                                    onChange={(e) => setDiscountType(e.target.value)}
                                    className="w-full text-sm p-2 rounded border"
                                >
                                    <option value="FLAT">Flat Amount (₹)</option>
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Value"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    className="w-full text-sm p-2 rounded border"
                                />
                                <input
                                    type="text"
                                    placeholder="Reason"
                                    value={discountReason}
                                    onChange={(e) => setDiscountReason(e.target.value)}
                                    className="w-full text-sm p-2 rounded border"
                                />
                                <button onClick={handleApplyDiscount} className="w-full bg-green-600 text-white py-2 rounded text-sm font-bold">
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}

                    <button className="w-full flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium transition-colors">
                        <AlertCircle size={18} /> Add Penalty
                    </button>

                    <button className="w-full flex items-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
                        <CreditCard size={18} /> View Payments
                    </button>
                </div>
            </div>

            {showPaymentModal && (
                <PaymentForm
                    allocationId={allocationId}
                    installment={selectedInstallment}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
};

export default InstallmentView;
