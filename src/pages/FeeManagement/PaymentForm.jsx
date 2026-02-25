import React, { useState } from 'react';
import { X, DollarSign, CreditCard, ShieldCheck } from 'lucide-react';
import { recordPayment } from '../../services/newFeeService';

const PaymentForm = ({ allocationId, installment, onClose, onSuccess }) => {
    const [amount, setAmount] = useState(installment ? installment.amount : '');
    const [mode, setMode] = useState('ONLINE');
    const [reference, setReference] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await recordPayment(
                allocationId,
                installment?.id,
                parseFloat(amount),
                mode,
                reference
            );
            alert('Payment recorded successfully');
            onSuccess();
        } catch (error) {
            alert('Payment failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Record Payment</h2>
                        {installment && <p className="text-blue-100 text-sm">For Installment Due on {installment.dueDate}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-blue-500 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Amount to Pay (₹)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-bold"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setMode('ONLINE')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${mode === 'ONLINE' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500'
                                }`}
                        >
                            <CreditCard size={24} />
                            <span className="text-xs font-bold">ONLINE</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('CASH')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${mode === 'CASH' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500'
                                }`}
                        >
                            <DollarSign size={24} />
                            <span className="text-xs font-bold">CASH</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Reference / Transaction ID</label>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="e.g. TXN12345678"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <ShieldCheck size={24} />
                            {loading ? 'Processing...' : `Confirm Payment: ₹${parseFloat(amount || 0).toLocaleString()}`}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Your payment is secured with 256-bit encryption
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
