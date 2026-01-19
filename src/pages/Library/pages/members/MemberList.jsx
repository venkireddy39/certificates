import React, { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';
import { useToast } from '../../context/ToastContext';
import { normalizeMember, validateMember } from '../../utils/memberRules';
import { ROLES, CATEGORIES, STATUS } from '../../utils/constants';

import MemberFilters from './components/MemberFilters';
import MemberTable from './components/MemberTable';
import MemberModal from './components/MemberModal';
import '../books/BookList.css';
import './Member.css';

const MemberList = () => {
    const toast = useToast();
    const { members, loading, createMember, updateMember, deleteMember } =
        useMembers(toast);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    const [editingMember, setEditingMember] = useState(null);
    const [addingMember, setAddingMember] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    /* ---------- FILTER ---------- */

    const filteredMembers = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return members.filter(m => {
            const matchesSearch =
                m.name?.toLowerCase().includes(q) ||
                m.email?.toLowerCase().includes(q) ||
                m.memberId?.toLowerCase().includes(q) ||
                m.mobile?.includes(q);

            const matchesRole = filterRole === 'ALL' || m.role === filterRole;
            return matchesSearch && matchesRole;
        });
    }, [members, searchTerm, filterRole]);

    /* ---------- ACTIONS ---------- */

    const handleCreate = async (form) => {
        const error = validateMember(form);
        if (error) {
            toast.error(error);
            return;
        }

        const normalized = normalizeMember(form);
        const success = await createMember(normalized);

        if (success) {
            setAddingMember(null);
            toast.success('Member created');
        }
    };

    const handleUpdate = async (form) => {
        const error = validateMember(form);
        if (error) {
            toast.error(error);
            return;
        }

        const normalized = normalizeMember(form);
        const success = await updateMember(form.id, normalized);

        if (success) {
            setEditingMember(null);
            toast.success('Member updated');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const success = await deleteMember(deleteId);
        if (success) {
            setDeleteId(null);
            toast.success('Member deleted');
        }
    };

    /* ---------- UI ---------- */

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between mb-4">
                <div>
                    <h3>Member Management</h3>
                    <p className="text-muted">
                        Manage library members, roles, and categories
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        setAddingMember({
                            name: '',
                            email: '',
                            mobile: '',
                            memberId: '',
                            role: ROLES.MEMBER,
                            category: CATEGORIES.UG_ENGINEERING,
                            status: STATUS.ACTIVE
                        })
                    }
                >
                    <UserPlus size={16} className="me-2" />
                    Add Member
                </button>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <MemberFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterRole={filterRole}
                        setFilterRole={setFilterRole}
                    />

                    <MemberTable
                        members={filteredMembers}
                        loading={loading}
                        onEdit={setEditingMember}
                        onDelete={setDeleteId}
                    />
                </div>
            </div>

            {/* DELETE CONFIRM */}
            {deleteId && (
                <ConfirmModal
                    title="Delete Member"
                    message="This action cannot be undone."
                    onCancel={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                />
            )}

            {/* ADD / EDIT MODAL */}
            {(addingMember || editingMember) && (
                <MemberModal
                    member={addingMember || editingMember}
                    isNew={!!addingMember}
                    onClose={() => {
                        setAddingMember(null);
                        setEditingMember(null);
                    }}
                    onSave={addingMember ? handleCreate : handleUpdate}
                />
            )}
        </div>
    );
};

/* ---------- CONFIRM MODAL ---------- */

const ConfirmModal = ({ title, message, onCancel, onConfirm }) => (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5>{title}</h5>
                    <button className="btn-close" onClick={onCancel} />
                </div>
                <div className="modal-body">{message}</div>
                <div className="modal-footer">
                    <button className="btn btn-light" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default MemberList;
