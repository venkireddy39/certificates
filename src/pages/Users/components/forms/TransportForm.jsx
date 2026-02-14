import React, { useState } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

const TransportForm = ({ onSubmit, onCancel, initialValues, type }) => {
    const [formData, setFormData] = useState({
        firstName: initialValues?.firstName || '',
        lastName: initialValues?.lastName || '',
        email: initialValues?.email || '',
        mobile: initialValues?.phone || initialValues?.mobile || '',
        password: '',
        role: type // 'Driver' or 'Conductor'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <div className="form-grid">
                <div className="form-group">
                    <label>First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Mobile Number</label>
                    <input name="mobile" value={formData.mobile} onChange={handleChange} required />
                </div>
                {!initialValues && (
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    <FiX /> Cancel
                </button>
                <button type="submit" className="btn-save">
                    <FiSave /> {initialValues ? 'Update' : `Add ${type}`}
                </button>
            </div>
        </form>
    );
};

export default TransportForm;
