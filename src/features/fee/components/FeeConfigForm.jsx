import React, { useState, useEffect } from 'react';
import { useFeeCalculation } from '../hooks/useFeeCalculation';
import InstallmentTable from './InstallmentTable';
import PenaltySettings from './PenaltySettings';
import { feeApi } from '../api/feeApi';
import { courseService } from '../../../pages/Courses/services/courseService';
import { batchService } from '../../../pages/Batches/services/batchService';
import { FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function FeeConfigForm() {
    // --- Form State ---
    const [name, setName] = useState('');
    const [courseId, setCourseId] = useState('');
    const [batchId, setBatchId] = useState('');
    const [feeTypeId, setFeeTypeId] = useState('');
    const [currency, setCurrency] = useState('INR');

    // --- Dropdown Data ---
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [feeTypes, setFeeTypes] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Default penalty config
    const [penaltyConfig, setPenaltyConfig] = useState({
        penaltyType: 'NONE',
        fixedPenaltyAmount: 0,
        penaltyPercentage: 0,
        maxPenaltyCap: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // --- Hooks ---
    const {
        totalFee,
        setTotalFee,
        installments,
        actions,
        remainingToAllocate,
        isFullyAllocated
    } = useFeeCalculation(0);

    // --- Load Initial Data ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [coursesData, feeTypesData] = await Promise.all([
                    courseService.getCourses().catch(() => []),
                    feeApi.getActiveFeeTypes().catch(() => [])
                ]);
                setCourses(coursesData || []);
                setFeeTypes(feeTypesData || []);
            } catch (error) {
                console.error("Failed to load initial data", error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchInitialData();
    }, []);

    // --- Load Batches when Course Changes ---
    useEffect(() => {
        const fetchBatches = async () => {
            if (!courseId) {
                setBatches([]);
                setBatchId('');
                return;
            }
            try {
                const data = await batchService.getBatchesByCourseId(courseId);
                setBatches(data || []);
                // Only reset batchId if the current batchId is not in the new list
                if (data && !data.some(b => b.id === Number(batchId))) {
                    setBatchId('');
                }
            } catch (error) {
                console.error("Failed to load batches", error);
                setBatches([]);
            }
        };
        fetchBatches();
    }, [courseId]);


    // --- Submit Handler ---
    const handleSave = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validations
        if (!name || !courseId || !feeTypeId) {
            setMessage({ type: 'error', text: 'Please fill in the Structure Name, select a Course, and choose a Fee Type.' });
            return;
        }

        if (totalFee <= 0) {
            setMessage({ type: 'error', text: 'Total base fee must be greater than zero.' });
            return;
        }

        if (!isFullyAllocated) {
            setMessage({ type: 'error', text: `Please allocate exact installments. Remaining: ₹${remainingToAllocate}` });
            return;
        }

        if (installments.some(inst => !inst.dueDate || !inst.amount)) {
            setMessage({ type: 'error', text: 'All installments must have a Due Date and Amount.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name,
                courseId: Number(courseId),
                batchId: batchId ? Number(batchId) : null,
                feeTypeId: Number(feeTypeId),
                totalAmount: Number(totalFee),
                penaltyType: penaltyConfig.penaltyType,
                fixedPenaltyAmount: Number(penaltyConfig.fixedPenaltyAmount),
                penaltyPercentage: Number(penaltyConfig.penaltyPercentage),
                maxPenaltyCap: Number(penaltyConfig.maxPenaltyCap),
                active: true,
                components: installments.map((inst, index) => ({
                    name: `Installment ${index + 1}`,
                    amount: inst.amount,
                    mandatory: true,
                }))
            };

            await feeApi.createFeeStructure(payload);

            setMessage({ type: 'success', text: 'Fee Structure saved successfully!' });

            // Re-initialize form
            setName('');
            setCourseId('');
            setBatchId('');
            setFeeTypeId('');
            setTotalFee(0);
            actions.autoSplit(0); // clear installments
            setPenaltyConfig({ penaltyType: 'NONE' });

        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save Fee Structure.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="container-fluid py-2 max-w-5xl mx-auto">

            {/* Status Messages */}
            {message.text && (
                <div className={`alert d-flex align-items-center mb-4 ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {message.type === 'success' ? <FiCheckCircle className="me-2" /> : <FiAlertCircle className="me-2" />}
                    <div className="fw-medium">{message.text}</div>
                </div>
            )}

            {/* Section A: Base Fee Setup */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                    <h5 className="card-title fw-bold text-dark border-bottom pb-3 mb-4">A. Base Fee Setup</h5>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-secondary small">Course <span className="text-danger">*</span></label>
                            <select
                                value={courseId}
                                onChange={e => setCourseId(e.target.value)}
                                className="form-select"
                                required
                                disabled={isLoadingData}
                            >
                                <option value="">{isLoadingData ? 'Loading...' : 'Select a Course'}</option>
                                {courses.map(course => (
                                    <option key={course.courseId || course.id} value={course.courseId || course.id}>
                                        {course.courseName || course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-secondary small">Batch (Optional)</label>
                            <select
                                value={batchId}
                                onChange={e => setBatchId(e.target.value)}
                                className="form-select"
                                disabled={!courseId || batches.length === 0}
                            >
                                <option value="">{courseId ? (batches.length === 0 ? 'No batches available' : 'Select a Batch (Optional)') : 'Select a Course first'}</option>
                                {batches.map(batch => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.name || `Batch #${batch.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold text-secondary small">Fee Type <span className="text-danger">*</span></label>
                            <select
                                value={feeTypeId}
                                onChange={e => setFeeTypeId(e.target.value)}
                                className="form-select"
                                required
                                disabled={isLoadingData}
                            >
                                <option value="">{isLoadingData ? 'Loading...' : 'Select a Fee Type'}</option>
                                {feeTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold text-secondary small">Structure Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. B.Tech Semester 1"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold text-secondary small">Currency</label>
                            <select
                                value={currency}
                                onChange={e => setCurrency(e.target.value)}
                                className="form-select bg-light"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-bold text-dark mb-1">Total Course Fee <span className="text-danger">*</span></label>
                            <div className="input-group mb-1" style={{ maxWidth: '300px' }}>
                                <span className="input-group-text bg-white text-muted">{currency === 'INR' ? '₹' : '$'}</span>
                                <input
                                    type="number"
                                    min="0" step="0.01"
                                    value={totalFee || ''}
                                    onChange={e => setTotalFee(Number(e.target.value))}
                                    className="form-control form-control-lg fw-bold text-primary"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <small className="text-muted">Must exactly match the sum of all installments.</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section B: Installment Setup */}
            <InstallmentTable
                installments={installments}
                actions={actions}
                isEditMode={true}
                remainingToAllocate={remainingToAllocate}
                totalFee={totalFee}
            />

            {/* Section C: Penalty Configuration */}
            <PenaltySettings
                penaltyConfig={penaltyConfig}
                onChange={setPenaltyConfig}
            />

            {/* Save Button */}
            <div className="d-flex justify-content-end pt-3 pb-5">
                <button
                    type="submit"
                    disabled={isSubmitting || !isFullyAllocated}
                    className="btn btn-primary btn-lg d-flex align-items-center gap-2 px-4 shadow-sm"
                >
                    <FiSave className="mb-1" />
                    {isSubmitting ? 'Saving Configuration...' : 'Save Fee Configuration'}
                </button>
            </div>

        </form>
    );
}
