import React, { useState } from 'react';
import { Save, Info } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const AddEditResourceModal = ({
    resource,
    viewMode,
    existingResources = [],
    onClose,
    onSave
}) => {
    const toast = useToast();

    const isEdit = Boolean(resource?.id);
    const isPhysical = (resource?.type || viewMode) === 'PHYSICAL';

    /* ===================== STATE ===================== */

    const [formData, setFormData] = useState({
        id: resource?.id,
        title: resource?.title || '',
        author: resource?.author || '',
        publisher: resource?.publisher || '',
        edition: resource?.edition || '',
        publicationYear: resource?.publicationYear || '',
        language: resource?.language || '',
        category: resource?.category || '',
        type: resource?.type || viewMode,

        // Physical only
        isbn: resource?.isbn || '',
        shelfLocation: resource?.shelfLocation || '',
        totalCopies: resource?.totalCopies || 1,

        // Digital only
        accessUrl: resource?.accessUrl || '',
        format: resource?.format || 'PDF'
    });

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    /* ===================== SUBMIT ===================== */

    const handleSubmit = () => {
        // Required: title & author
        if (!formData.title.trim() || !formData.author.trim()) {
            toast.error('Title and Author are required.');
            return;
        }

        if (isPhysical) {
            // Required: ISBN
            if (!formData.isbn.trim()) {
                toast.error('ISBN is required.');
                return;
            }

            // ISBN format (13 digits)
            const cleanIsbn = formData.isbn.replace(/-/g, '');
            if (!/^\d{13}$/.test(cleanIsbn)) {
                toast.error('ISBN must be a valid 13-digit number.');
                return;
            }

            // Unique ISBN
            const duplicate = existingResources.some(
                r => r.isbn === cleanIsbn && r.id !== formData.id
            );
            if (duplicate) {
                toast.error('ISBN already exists.');
                return;
            }

            // Required: Shelf
            if (!formData.shelfLocation.trim()) {
                toast.error('Shelf location is required.');
                return;
            }

            // Total copies only on create
            if (!isEdit && Number(formData.totalCopies) < 1) {
                toast.error('Total copies must be at least 1.');
                return;
            }

            onSave({
                ...formData,
                isbn: cleanIsbn,
                totalCopies: !isEdit ? Number(formData.totalCopies) : undefined
            });

            return;
        }

        // Digital resource
        onSave(formData);
    };

    /* ===================== UI ===================== */

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isEdit ? 'Edit' : 'Add'} {isPhysical ? 'Book' : 'Digital Resource'}
                        </h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">

                        {/* BASIC INFO */}
                        <h6 className="text-muted mb-3 border-bottom pb-2">
                            Basic Information
                        </h6>

                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label">
                                    Title <span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Enter book title"
                                    value={formData.title}
                                    onChange={e => handleChange('title', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Author <span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Enter author name"
                                    value={formData.author}
                                    onChange={e => handleChange('author', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Publisher</label>
                                <input
                                    className="form-control"
                                    value={formData.publisher}
                                    onChange={e => handleChange('publisher', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Category</label>
                                <input
                                    className="form-control"
                                    placeholder="Software Engineering"
                                    value={formData.category}
                                    onChange={e => handleChange('category', e.target.value)}
                                />
                            </div>

                            {/* RESTORED FIELDS */}
                            <div className="col-md-4">
                                <label className="form-label">Edition</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. 2nd"
                                    value={formData.edition}
                                    onChange={e => handleChange('edition', e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Year</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="YYYY"
                                    value={formData.publicationYear}
                                    onChange={e => handleChange('publicationYear', e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Language</label>
                                <input
                                    className="form-control"
                                    placeholder="English"
                                    value={formData.language}
                                    onChange={e => handleChange('language', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* PHYSICAL */}
                        {isPhysical && (
                            <>
                                <h6 className="text-muted mb-3 border-bottom pb-2">
                                    Inventory Details
                                </h6>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            ISBN <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            className="form-control"
                                            placeholder="ISBN-13"
                                            value={formData.isbn}
                                            onChange={e => handleChange('isbn', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Shelf Location <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            className="form-control"
                                            placeholder="A1-B2"
                                            value={formData.shelfLocation}
                                            onChange={e => handleChange('shelfLocation', e.target.value)}
                                        />
                                    </div>

                                    {!isEdit && (
                                        <div className="col-12">
                                            <div className="card bg-light border-0">
                                                <div className="card-body">
                                                    <label className="form-label fw-bold">
                                                        Total Copies
                                                    </label>

                                                    <div className="d-flex align-items-center gap-3">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            className="form-control"
                                                            style={{ width: '120px' }}
                                                            value={formData.totalCopies}
                                                            onChange={e =>
                                                                handleChange('totalCopies', e.target.value)
                                                            }
                                                        />
                                                        <span className="text-muted small">
                                                            <Info size={14} className="me-1" />
                                                            Barcodes will be generated automatically
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* DIGITAL */}
                        {!isPhysical && (
                            <>
                                <h6 className="text-muted mb-3 border-bottom pb-2">
                                    Digital Access
                                </h6>

                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <label className="form-label">Access URL</label>
                                        <input
                                            className="form-control"
                                            placeholder="https://..."
                                            value={formData.accessUrl}
                                            onChange={e => handleChange('accessUrl', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Format</label>
                                        <select
                                            className="form-select"
                                            value={formData.format}
                                            onChange={e => handleChange('format', e.target.value)}
                                        >
                                            <option value="PDF">PDF</option>
                                            <option value="EPUB">EPUB</option>
                                            <option value="VIDEO">Video</option>
                                            <option value="ONLINE">Online</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-light" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            <Save size={16} className="me-2" />
                            {isEdit ? 'Save Changes' : 'Create Resource'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddEditResourceModal;
