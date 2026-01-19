import React, { useEffect, useMemo, useState } from 'react';
import {
    Search,
    CalendarClock,
    MoreVertical,
    XCircle,
    CheckCircle,
    Ban
} from 'lucide-react';
import { ReservationService, BookService, MemberService } from '../../services/api';
import { format, isPast, parseISO } from 'date-fns';
import '../books/BookList.css';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [resources, setResources] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ACTIVE');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [resv, books, members] = await Promise.all([
                ReservationService.getAllReservations(),
                BookService.getAllResources(),
                MemberService.getAllMembers()
            ]);

            setReservations(resv);
            setResources(books);
            setUsers(members);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- MAPS (PERFORMANCE FIX) ---------- */

    const resourceMap = useMemo(
        () => Object.fromEntries(resources.map(r => [r.id, r])),
        [resources]
    );

    const userMap = useMemo(
        () => Object.fromEntries(users.map(u => [u.id, u])),
        [users]
    );

    /* ---------- FILTER ---------- */

    const filteredReservations = useMemo(() => {
        return reservations.filter(r => {
            const resource = resourceMap[r.resourceId];
            const user = userMap[r.userId];
            const q = searchTerm.toLowerCase();

            const matchesSearch =
                resource?.title?.toLowerCase().includes(q) ||
                user?.name?.toLowerCase().includes(q);

            const expired = r.expiryDate && isPast(parseISO(r.expiryDate));

            if (filterStatus === 'ACTIVE')
                return matchesSearch && r.status === 'PENDING' && !expired;

            if (filterStatus === 'EXPIRED')
                return matchesSearch && expired;

            if (filterStatus === 'FULFILLED')
                return matchesSearch && r.status === 'FULFILLED';

            if (filterStatus === 'REJECTED')
                return matchesSearch && r.status === 'REJECTED';

            return matchesSearch;
        });
    }, [reservations, resourceMap, userMap, searchTerm, filterStatus]);

    /* ---------- ACTIONS ---------- */

    const cancelReservation = async (id) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            await ReservationService.cancelReservation(id);
            loadData();
        }
    };

    const rejectReservation = async (id) => {
        if (window.confirm('Mark this reservation as rejected?')) {
            await ReservationService.rejectReservation(id);
            loadData();
        }
    };

    const fulfillReservation = async (id) => {
        await ReservationService.fulfillReservation(id);
        loadData();
    };

    /* ---------- STATUS ---------- */

    const getStatusBadge = (r) => {
        if (r.status === 'FULFILLED')
            return <span className="badge bg-success">FULFILLED</span>;

        if (r.status === 'REJECTED')
            return <span className="badge bg-secondary">REJECTED</span>;

        if (r.expiryDate && isPast(parseISO(r.expiryDate)))
            return <span className="badge bg-danger">EXPIRED</span>;

        return <span className="badge bg-warning text-dark">PENDING</span>;
    };

    /* ---------- UI ---------- */

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between mb-4">
                <div>
                    <h3>Reservation Queue</h3>
                    <p className="text-muted">Manage waitlists for physical books</p>
                </div>
            </div>

            {/* FILTERS */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <Search size={16} />
                        </span>
                        <input
                            className="form-control"
                            placeholder="Search book or member"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="ACTIVE">Active Queue</option>
                        <option value="FULFILLED">Fulfilled</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="ALL">All</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Book</th>
                            <th>Member</th>
                            <th>Reserved On</th>
                            <th>Expires</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                        ) : filteredReservations.length === 0 ? (
                            <tr><td colSpan="6" className="text-center text-muted">No reservations</td></tr>
                        ) : (
                            filteredReservations.map(r => {
                                const resource = resourceMap[r.resourceId];
                                const user = userMap[r.userId];
                                const expired = r.expiryDate && isPast(parseISO(r.expiryDate));

                                return (
                                    <tr key={r.id} className={expired ? 'table-danger' : ''}>
                                        <td>
                                            <div className="fw-medium">{resource?.title || 'Unknown'}</div>
                                            <div className="small text-muted">{resource?.author}</div>
                                        </td>
                                        <td>
                                            <div>{user?.name || 'Unknown'}</div>
                                            {r.priority === 'HIGH' && (
                                                <span className="badge bg-warning text-dark mt-1">
                                                    <CalendarClock size={12} className="me-1" />
                                                    Priority
                                                </span>
                                            )}
                                        </td>
                                        <td>{r.reservationDate ? format(parseISO(r.reservationDate), 'dd MMM yyyy') : '-'}</td>
                                        <td>{r.expiryDate ? format(parseISO(r.expiryDate), 'dd MMM yyyy') : '-'}</td>
                                        <td>{getStatusBadge(r)}</td>
                                        <td className="text-end">
                                            {r.status === 'PENDING' && !expired && (
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-success"
                                                        onClick={() => fulfillReservation(r.id)}
                                                    >
                                                        <CheckCircle size={14} />
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => rejectReservation(r.id)}
                                                        title="Reject"
                                                    >
                                                        <XCircle size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationList;
