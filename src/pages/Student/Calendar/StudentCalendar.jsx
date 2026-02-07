import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Video, Plus, X, Tag } from 'lucide-react';
import { useToast } from '../../Library/context/ToastContext';
import '../StudentDashboard.css';
import './StudentCalendar.css';

const StudentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showTaskModal, setShowTaskModal] = useState(false);
    const toast = useToast();
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        type: 'event',
        time: '10:00'
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await studentService.getCalendarEvents();
                setEvents(data || []);
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };
        fetchEvents();
    }, []);

    // Calendar Logic
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const getEventsForDate = (date) => {
        return events.filter(event => isSameDay(new Date(event.date), date));
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        const taskToAdd = {
            id: Date.now().toString(),
            ...newTask,
            date: selectedDate.toISOString(),
        };
        setEvents([...events, taskToAdd]);
        setShowTaskModal(false);
        setNewTask({ title: '', description: '', type: 'event', time: '10:00' });
        toast.success("New calendar entry created!");
    };

    const renderCalendarGrid = () => {
        const grid = [];
        for (let i = 0; i < firstDay; i++) {
            grid.push(<div key={`empty-${i}`} className="calendar-day-empty"></div>);
        }

        for (let day = 1; day <= days; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isToday = isSameDay(date, new Date());
            const isSelected = isSameDay(date, selectedDate);

            grid.push(
                <div
                    key={day}
                    className={`calendar-day-box ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className="day-val">{day}</span>
                    <div className="day-markers">
                        {dayEvents.map((ev, idx) => (
                            <span key={idx} className={`marker-dot dot-${ev.type}`}></span>
                        ))}
                    </div>
                </div>
            );
        }
        return grid;
    };

    const selectedEvents = getEventsForDate(selectedDate);

    return (
        <div className="student-calendar-container animate-fade-in text-body">
            <div className="row g-4">
                {/* Main Calendar Section */}
                <div className="col-12 col-xl-8">
                    <div className="card border-0 shadow-sm p-4 h-100" style={{ background: 'var(--surface)', borderRadius: '28px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0 text-body">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h4>
                            <div className="d-flex gap-2">
                                <button className="btn btn-icon-glass border p-2 d-flex align-items-center justify-content-center" onClick={() => changeMonth(-1)}>
                                    <ChevronLeft size={18} />
                                </button>
                                <button className="btn btn-secondary rounded-pill px-3 py-1 small fw-bold text-white shadow-sm" onClick={() => setSelectedDate(new Date())}>
                                    Today
                                </button>
                                <button className="btn btn-icon-glass border p-2 d-flex align-items-center justify-content-center" onClick={() => changeMonth(1)}>
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="calendar-weekday-header mb-2 py-3 border-bottom border-opacity-10" style={{ borderColor: 'var(--border)' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="weekday-label opacity-50 small fw-bold text-secondary">{day}</div>
                            ))}
                        </div>

                        <div className="calendar-grid-layout mt-3">
                            {renderCalendarGrid()}
                        </div>
                    </div>
                </div>

                {/* Agenda Side Panel */}
                <div className="col-12 col-xl-4">
                    <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ background: 'var(--surface)', borderRadius: '24px' }}>
                        <div className="card-header border-0 bg-transparent p-4 pb-0">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 className="fw-bold text-body mb-1">Daily Agenda</h5>
                                    <p className="text-muted small fw-medium mb-0">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <button className="btn btn-secondary rounded-circle p-2 shadow-sm text-white transition-all hover-scale" onClick={() => setShowTaskModal(true)}>
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="card-body p-4 d-flex flex-column h-100">
                            <div className="events-scroll-area flex-grow-1">
                                {selectedEvents.length > 0 ? (
                                    selectedEvents.map(event => (
                                        <div key={event.id} className={`card border-0 border-start border-4 border-${event.type === 'deadline' ? 'danger' : 'secondary'} p-3 mb-3 shadow-sm`} style={{ background: 'var(--hover-bg)', borderRadius: '12px' }}>
                                            <div className="d-flex justify-content-between align-items-start mb-2 overflow-hidden">
                                                <h6 className="fw-bold text-body m-0 small text-truncate pe-2" title={event.title}>{event.title}</h6>
                                                <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>{event.type}</span>
                                            </div>
                                            <p className="smaller text-muted mb-3 fw-medium text-wrap" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                                            <div className="d-flex flex-wrap gap-3 text-muted smaller fw-bold">
                                                <span className="d-flex align-items-center gap-1"><Clock size={12} className="text-secondary" /> {event.time || '10:00 AM'}</span>
                                                <span className="d-flex align-items-center gap-1">
                                                    {event.type === 'webinar' ? <Video size={12} className="text-secondary" /> : <MapPin size={12} className="text-secondary" />}
                                                    {event.type === 'webinar' ? 'Online' : 'On-Site'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-agenda text-center py-5">
                                        <div className="p-4 bg-secondary bg-opacity-5 rounded-circle d-inline-block mb-3">
                                            <CalendarIcon size={48} className="text-secondary opacity-25" />
                                        </div>
                                        <p className="text-muted small fw-medium">No events scheduled today.</p>
                                        <button className="btn btn-link text-secondary smaller text-decoration-none fw-bold p-0" onClick={() => setShowTaskModal(true)}>
                                            <Plus size={16} /> Create New Task
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="legend-pills pt-4 border-top" style={{ borderColor: 'var(--border)' }}>
                                <p className="smaller fw-bold text-muted text-uppercase mb-3 opacity-50" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>Calendar Keys</p>
                                <div className="row g-2">
                                    <div className="col-6"><div className="d-flex align-items-center gap-2 smaller text-muted fw-bold"><span className="p-1 rounded-circle bg-secondary"></span> Class</div></div>
                                    <div className="col-6"><div className="d-flex align-items-center gap-2 smaller text-muted fw-bold"><span className="p-1 rounded-circle bg-danger"></span> Deadline</div></div>
                                    <div className="col-6"><div className="d-flex align-items-center gap-2 smaller text-muted fw-bold"><span className="p-1 rounded-circle bg-warning"></span> Event</div></div>
                                    <div className="col-6"><div className="d-flex align-items-center gap-2 smaller text-muted fw-bold"><span className="p-1 rounded-circle bg-success"></span> Exam</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Task Modal */}
            {showTaskModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg animate-fade-in" style={{ background: 'var(--surface)', borderRadius: '24px' }}>
                            <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-secondary bg-opacity-10 rounded-3 text-secondary shadow-sm"><Tag size={20} /></div>
                                    <h5 className="modal-title fw-bold text-body">New Calendar Entry</h5>
                                </div>
                                <button type="button" className="btn-close shadow-none" onClick={() => setShowTaskModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form onSubmit={handleCreateTask}>
                                    <div className="mb-3">
                                        <label className="form-label smaller text-muted uppercase fw-bold mb-2">Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="form-control bg-transparent border text-body py-2 rounded-3 shadow-none fw-medium"
                                            style={{ borderColor: 'var(--border)' }}
                                            placeholder="Enter task or event title..."
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label smaller text-muted uppercase fw-bold mb-2">Description</label>
                                        <textarea
                                            className="form-control bg-transparent border text-body py-2 rounded-3 shadow-none fw-medium"
                                            style={{ borderColor: 'var(--border)', minHeight: '80px' }}
                                            placeholder="Add some details..."
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="row g-3 mb-4">
                                        <div className="col-6">
                                            <label className="form-label smaller text-muted uppercase fw-bold mb-2">Type</label>
                                            <select
                                                className="form-select bg-transparent border text-body py-2 rounded-3 shadow-none fw-medium"
                                                style={{ borderColor: 'var(--border)' }}
                                                value={newTask.type}
                                                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                                            >
                                                <option value="event">General Event</option>
                                                <option value="class">Class Session</option>
                                                <option value="deadline">Task Deadline</option>
                                                <option value="exam">Examination</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label smaller text-muted uppercase fw-bold mb-2">Time</label>
                                            <input
                                                type="time"
                                                className="form-control bg-transparent border text-body py-2 rounded-3 shadow-none fw-medium"
                                                style={{ borderColor: 'var(--border)' }}
                                                value={newTask.time}
                                                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="button" className="btn btn-light border py-2 rounded-3 flex-grow-1 fw-bold text-muted small shadow-none" onClick={() => setShowTaskModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-secondary py-2 rounded-3 flex-grow-1 fw-bold text-white shadow-sm transition-all hover-scale small">Create Entry</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCalendar;
