import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { createFeeStructure } from '../../services/newFeeService';
import './FeeManagement.css';

const FeeCreate = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [batchId, setBatchId] = useState('');
    const [components, setComponents] = useState([
        { name: 'Tuition Fee', amount: '', mandatory: true }
    ]);
    const [loading, setLoading] = useState(false);
    const [penaltyType, setPenaltyType] = useState('FIXED');
    const [fixedPenaltyAmount, setFixedPenaltyAmount] = useState('');
    const [penaltyPercentage, setPenaltyPercentage] = useState('');
    const [maxPenaltyCap, setMaxPenaltyCap] = useState('');
    const [balanceHandling, setBalanceHandling] = useState('MOVE_TO_NEXT');

    const addComponent = () => {
        setComponents([...components, { name: '', amount: '', mandatory: true }]);
    };

    const removeComponent = (index) => {
        setComponents(components.filter((_, i) => i !== index));
    };

    const updateComponent = (index, field, value) => {
        const newComponents = [...components];
        newComponents[index][field] = value;
        setComponents(newComponents);
    };

    const totalAmount = components.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const structure = {
                name,
                batchId: parseInt(batchId),
                totalAmount,
                penaltyType,
                fixedPenaltyAmount: parseFloat(fixedPenaltyAmount) || 0,
                penaltyPercentage: parseFloat(penaltyPercentage) || 0,
                maxPenaltyCap: parseFloat(maxPenaltyCap) || 0,
                balanceHandling,
                components: components.map(c => ({ ...c, amount: parseFloat(c.amount) }))
            };
            await createFeeStructure(structure);
            alert('Fee Structure Created Successfully');
            navigate('/admin/fee');
        } catch (error) {
            console.error('Error creating structure:', error);
            alert('Failed to create fee structure: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fee-create-container p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create Fee Structure</h2>
                <button onClick={() => navigate('/admin/fee')} className="btn-secondary">
                    <X size={18} /> Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Structure Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. FY 2024-25 Standard"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
                        <input
                            type="number"
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Batch ID"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Fee Components</h3>
                        <button type="button" onClick={addComponent} className="btn-primary-sm flex items-center gap-2">
                            <Plus size={16} /> Add Component
                        </button>
                    </div>

                    <div className="space-y-4">
                        {components.map((comp, index) => (
                            <div key={index} className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Component Name</label>
                                    <input
                                        type="text"
                                        value={comp.name}
                                        onChange={(e) => updateComponent(index, 'name', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="e.g. Admission Fee"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        value={comp.amount}
                                        onChange={(e) => updateComponent(index, 'amount', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={comp.mandatory}
                                        onChange={(e) => updateComponent(index, 'mandatory', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-xs text-gray-600">Mandatory</span>
                                </div>
                                {components.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeComponent(index)}
                                        className="mb-1 p-2 text-red-500 hover:bg-red-50 rounded-md"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                    <div className="penalty-rules">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                            Penalty Rules
                        </h3>
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium mb-1">Penalty Type</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={penaltyType}
                                    onChange={(e) => setPenaltyType(e.target.value)}
                                >
                                    <option value="FIXED">Option A: Fixed Penalty</option>
                                    <option value="PERCENTAGE">Option B: Percentage-based</option>
                                </select>
                            </div>

                            {penaltyType === 'FIXED' ? (
                                <div className="form-group">
                                    <label className="block text-sm font-medium mb-1">Fixed Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={fixedPenaltyAmount}
                                        onChange={(e) => setFixedPenaltyAmount(e.target.value)}
                                        placeholder="e.g. 2500"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label className="block text-sm font-medium mb-1">Penalty Percentage (%)</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={penaltyPercentage}
                                            onChange={(e) => setPenaltyPercentage(e.target.value)}
                                            placeholder="e.g. 20"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-sm font-medium mb-1">Max Penalty Cap (Optional)</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={maxPenaltyCap}
                                            onChange={(e) => setMaxPenaltyCap(e.target.value)}
                                            placeholder="e.g. 5000"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="balance-handling">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-600">
                            Balance Reallocation
                        </h3>
                        <div className="space-y-4">
                            <p className="text-xs text-gray-500 mb-2">How should unpaid portions of a partial payment be handled?</p>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="handling"
                                        className="mt-1"
                                        checked={balanceHandling === 'MOVE_TO_NEXT'}
                                        onChange={() => setBalanceHandling('MOVE_TO_NEXT')}
                                    />
                                    <div>
                                        <span className="font-bold block">Option 1: Add to Next Installment</span>
                                        <span className="text-xs text-gray-500">Remaining amount moves fully to the immediate next installment.</span>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="handling"
                                        className="mt-1"
                                        checked={balanceHandling === 'SPLIT_REMAINING'}
                                        onChange={() => setBalanceHandling('SPLIT_REMAINING')}
                                    />
                                    <div>
                                        <span className="font-bold block">Option 2: Split Across Remaining</span>
                                        <span className="text-xs text-gray-500">Remaining amount is distributed equally across ALL pending installments.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6 flex justify-between items-center">
                    <div className="text-lg">
                        <span className="text-gray-600">Total Amount: </span>
                        <span className="font-bold text-2xl text-blue-600">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Save size={20} /> {loading ? 'Saving...' : 'Save Structure'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeeCreate;
