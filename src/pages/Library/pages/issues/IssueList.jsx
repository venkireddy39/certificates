import React, { useEffect, useState, useMemo } from 'react';
import { Search, RotateCcw, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IssueService, MemberService } from '../../services/api'; // Added MemberService
import { useToast } from '../../context/ToastContext';
import { useReturnPreview } from '../../hooks/useReturnPreview';
import ReturnModal from './components/ReturnModal';
import '../books/BookList.css'; // Shared styles

const IssueList = () => {
    const toast = useToast();
    const {
        isOpen, loading: loadingModal, previewData, processing,
        openReturnModal, confirmReturn, closeModal
    } = useReturnPreview();

    const [issues, setIssues] = useState([]);
    const [allMembers, setAllMembers] = useState([]); // Store members
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        console.log("IssueList Component Mounted");
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [issuesData, membersData] = await Promise.all([
                IssueService.getAllIssues(),
                MemberService.getAllMembers().catch(() => [])
            ]);

            // Filter only 'ISSUED' transactions for the active list
            setIssues(issuesData.filter(i => i.status?.toUpperCase() === 'ISSUED'));
            setAllMembers(membersData);
        } catch (error) {
            console.error("Failed to load issues:", error);
            toast.error('Failed to load issues');
        } finally {
            setLoading(false);
        }
    };

    const handleReturnConfirm = async (waiveFine) => {
        const success = await confirmReturn(waiveFine);
        if (success) {
            loadData(); // Refresh list after successful return
        }
    };

    // Create a map for quick member lookup by ID
    const memberMap = useMemo(() => {
        const map = {};
        allMembers.forEach(m => {
            map[m.id] = m;
        });
        return map;
    }, [allMembers]);

    const filteredIssues = useMemo(() => {
        const q = searchTerm.toLowerCase();

        // Helper to safely stringify
        const safeStr = (val) => (val || '').toString().toLowerCase();

        return issues.filter(i => {
            // Resolve member object from issue or map
            const memberObj = i.member || i.user || memberMap[i.userId || i.memberId];
            const memberName = safeStr(memberObj?.name) || safeStr(i.userName);
            const memberId = safeStr(i.userId || i.memberId || memberObj?.id);
            const memberEmail = safeStr(memberObj?.email);

            const bookTitle = safeStr(i.book?.title);
            const bookIsbn = safeStr(i.book?.isbn);
            const bookAuthor = safeStr(i.book?.author);
            const barcode = safeStr(i.barcode || i.barcodeValue);

            const matches = bookTitle.includes(q) ||
                bookIsbn.includes(q) ||
                bookAuthor.includes(q) ||
                barcode.includes(q) ||
                memberId.includes(q) ||
                memberName.includes(q) ||
                memberEmail.includes(q);

            return matches;
        });
    }, [issues, allMembers, memberMap, searchTerm]);

    const isOverdue = (dateStr) => {
        return new Date(dateStr) < new Date();
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Active Issues & Returns</h3>
                <Link to="/admin/library/issues/new" className="btn btn-primary d-flex align-items-center">
                    <PlusCircle size={18} className="me-2" />
                    Issue Book
                </Link>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    {/* FILTER */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text"><Search size={16} /></span>
                                <input
                                    className="form-control"
                                    placeholder="Search by Book Title, Barcode or Member ID/Name..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Book Details</th>
                                    <th>Member ID</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                                ) : filteredIssues.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center text-muted">No active issues found</td></tr>
                                ) : (
                                    filteredIssues.map(issue => {
                                        const overdue = isOverdue(issue.dueDate);

                                        // Resolve member for display
                                        const memberObj = issue.member || issue.user || memberMap[issue.userId || issue.memberId];
                                        const memberDisplayName = memberObj?.name ? `${memberObj.name} (${memberObj.id})` : `User ${issue.userId || issue.memberId}`;

                                        return (
                                            <tr key={issue.issueId || issue.id} className={overdue ? 'table-danger-subtle' : ''}>
                                                <td>
                                                    <div className="fw-bold">{issue.book?.title || 'Unknown Title'}</div>
                                                    <div className="small text-muted">
                                                        Code: {issue.book?.isbn || 'N/A'}
                                                        {issue.barcode && <span className="ms-1">({issue.barcode})</span>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {memberDisplayName}
                                                    </span>
                                                </td>
                                                <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={overdue ? 'text-danger fw-bold' : ''}>
                                                        {new Date(issue.dueDate).toLocaleDateString()}
                                                    </span>
                                                    {overdue && <div className="small text-danger">Overdue</div>}
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary d-flex align-items-center ms-auto"
                                                        onClick={() => openReturnModal(issue.id)}
                                                    >
                                                        <RotateCcw size={14} className="me-2" />
                                                        Return
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RETURN MODAL */}
            <ReturnModal
                isOpen={isOpen}
                loading={loadingModal}
                data={previewData}
                processing={processing}
                onConfirm={handleReturnConfirm}
                onClose={closeModal}
            />
        </div>
    );
};

export default IssueList;
