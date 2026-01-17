import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiBook, FiSettings, FiPlus, FiTrash2, FiSearch, FiX, FiRefreshCw } from 'react-icons/fi';
import { MOCK_USERS } from '../../data/mockUsers';
import { INITIAL_BATCHES } from './hooks/useBatches';
import AttendanceTab from './tabs/AttendanceTab';
import ClassesTab from './tabs/ClassesTab';
import './styles/BatchBuilder.css';

const BatchBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Transfer Modal State
    const [transferModal, setTransferModal] = useState({ isOpen: false, student: null });
    const [selectedTransferBatch, setSelectedTransferBatch] = useState('');

    // Mock Enrolled Students (Initially some random subset)
    const [enrolledStudents, setEnrolledStudents] = useState(
        MOCK_USERS.filter(u => u.role === 'Student').slice(0, 2)
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPotentialStudents, setSelectedPotentialStudents] = useState([]);

    // Filter available students (Students who are NOT already enrolled)
    const availableStudents = MOCK_USERS.filter(u =>
        u.role === 'Student' &&
        !enrolledStudents.find(e => e.id === u.id) &&
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Other batches for transfer (excluding current)
    const otherBatches = INITIAL_BATCHES.filter(b => String(b.id) !== String(id));

    const handleAddStudents = () => {
        const toAdd = MOCK_USERS.filter(u => selectedPotentialStudents.includes(u.id));
        setEnrolledStudents([...enrolledStudents, ...toAdd]);
        setSelectedPotentialStudents([]);
        setIsAddModalOpen(false);
    };

    const toggleSelection = (id) => {
        if (selectedPotentialStudents.includes(id)) {
            setSelectedPotentialStudents(prev => prev.filter(sid => sid !== id));
        } else {
            setSelectedPotentialStudents(prev => [...prev, id]);
        }
    };

    const removeStudent = (id) => {
        if (window.confirm('Remove this student from the batch?')) {
            setEnrolledStudents(prev => prev.filter(s => s.id !== id));
        }
    };

    const openTransferModal = (student) => {
        setTransferModal({ isOpen: true, student });
        setSelectedTransferBatch('');
    };

    const confirmTransfer = () => {
        if (!selectedTransferBatch || !transferModal.student) return;

        // In a real app, call API to update batchId for student
        const targetBatch = otherBatches.find(b => String(b.id) === selectedTransferBatch);

        // Remove from current list
        setEnrolledStudents(prev => prev.filter(s => s.id !== transferModal.student.id));

        alert(`Successfully transferred ${transferModal.student.name} to ${targetBatch.name}`);
        setTransferModal({ isOpen: false, student: null });
    };

    return (
        <div className="batch-builder-layout">
            <header className="bb-header">
                <div className="bb-header-left">
                    <button onClick={() => navigate('/batches')} className="btn-back">
                        <FiArrowLeft /> Back
                    </button>
                    <div className="bb-title">
                        <h2>Batch Management</h2>
                        <span className="badge-id">ID: {id}</span>
                    </div>
                </div>
                <div className="bb-header-right">
                    <div className="bb-tabs">
                        <button className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Classes</button>
                        <button className={`tab-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Students modifications</button>
                        <button className={`tab-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Attendance</button>
                    </div>
                </div>
            </header>

            <main className="bb-main">
                {activeTab === 'overview' ? (
                    <ClassesTab batchId={id} />
                ) : activeTab === 'students' ? (
                    <div className="students-manager">
                        <div className="sm-header">
                            <div>
                                <h3>Member Management</h3>
                                <p className="text-muted">Manage students, faculty, and staff access</p>
                            </div>
                            <button className="btn-primary-add" onClick={() => setIsAddModalOpen(true)}>
                                <FiPlus /> Add Member
                            </button>
                        </div>

                        <div className="students-list">
                            {enrolledStudents.length > 0 ? (
                                <table className="w-100 table-custom">
                                    <thead>
                                        <tr>
                                            <th>MEMBER PROFILE</th>
                                            <th>ROLE & ID</th>
                                            <th>ACADEMIC/DEPT</th>
                                            <th>STATUS</th>
                                            <th className="text-end">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrolledStudents.map(student => (
                                            <tr key={student.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="avatar-square" style={{ width: 40, height: 40, borderRadius: 8, background: student.name.charCodeAt(0) % 2 === 0 ? '#0ea5e9' : '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{student.name}</div>
                                                            <div className="small text-muted">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                                                        STUDENT
                                                    </span>
                                                    <span className="ms-2 text-muted small">ID: {student.id}</span>
                                                </td>
                                                <td>
                                                    <div className="text-dark">Computer Science</div>
                                                    <div className="small text-muted">2nd Year, Sem 3</div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2 text-dark">
                                                        <div className="rounded-circle bg-success p-1" style={{ width: 6, height: 6 }}></div>
                                                        Active
                                                    </div>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button
                                                            className="btn-icon-plain text-secondary hover-primary"
                                                            onClick={() => openTransferModal(student)}
                                                            title="Edit"
                                                        >
                                                            <FiSettings size={18} />
                                                        </button>
                                                        <button
                                                            className="btn-icon-plain text-secondary hover-danger"
                                                            onClick={() => removeStudent(student.id)}
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state-small">
                                    <FiUsers size={40} className="text-muted mb-2" />
                                    <p>No students enrolled yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'attendance' ? (
                    <AttendanceTab batchId={id} />
                ) : (
                    <div className="empty-content-state">
                        <div className="ecs-icon"><FiSettings /></div>
                        <h3>Module Not Found</h3>
                        <p>The requested module is not available.</p>
                    </div>
                )}
            </main>

            {/* Add Student Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-large">
                        <div className="modal-header">
                            <h3>Add Students to Batch</h3>
                            <button className="btn-close" onClick={() => setIsAddModalOpen(false)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="search-bar mb-3">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search students by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="list-selection">
                                {availableStudents.length > 0 ? availableStudents.map(user => (
                                    <div
                                        key={user.id}
                                        className={`list-item-select ${selectedPotentialStudents.includes(user.id) ? 'selected' : ''}`}
                                        onClick={() => toggleSelection(user.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPotentialStudents.includes(user.id)}
                                            readOnly
                                        />
                                        <div className="ms-3">
                                            <div className="fw-bold">{user.name}</div>
                                            <small className="text-muted">{user.email}</small>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center p-4 text-muted">No available students found.</div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="text-muted small me-auto">
                                {selectedPotentialStudents.length} selected
                            </div>
                            <button className="btn-secondary me-2" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                            <button
                                className="btn-primary"
                                onClick={handleAddStudents}
                                disabled={selectedPotentialStudents.length === 0}
                            >
                                Add Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            {transferModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-large" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>Transfer Student</h3>
                            <button className="btn-close" onClick={() => setTransferModal({ isOpen: false, student: null })}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <p className="mb-4 text-muted">
                                Move <strong>{transferModal.student?.name}</strong> to another batch. This will remove them from the current batch.
                            </p>

                            <div className="form-group mb-3">
                                <label className="mb-2 d-block fw-bold text-sm">Select Target Batch</label>
                                <select
                                    className="w-100 p-2 border rounded"
                                    value={selectedTransferBatch}
                                    onChange={(e) => setSelectedTransferBatch(e.target.value)}
                                >
                                    <option value="">-- Select Batch --</option>
                                    {otherBatches.map(batch => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.name} ({batch.startDate} - {batch.mode})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="mb-2 d-block fw-bold text-sm">Reason (Optional)</label>
                                <textarea className="w-100 p-2 border rounded" rows="3" placeholder="e.g. Student requested timing change..."></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setTransferModal({ isOpen: false, student: null })}>Cancel</button>
                            <button
                                className="btn-primary"
                                onClick={confirmTransfer}
                                disabled={!selectedTransferBatch}
                            >
                                Confirm Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BatchBuilder;
