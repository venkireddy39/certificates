import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Video } from 'lucide-react';
import './StudentCalendar.css';

const StudentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await studentService.getCalendarEvents();
                setEvents(data);
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

    const renderCalendarGrid = () => {
        const grid = [];
        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            grid.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of current month
        for (let day = 1; day <= days; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isToday = isSameDay(date, new Date());
            const isSelected = isSameDay(date, selectedDate);

            grid.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className="day-number">{day}</span>
                    <div className="day-dots">
                        {dayEvents.map((ev, idx) => (
                            <span key={idx} className={`dot dot-${ev.type}`}></span>
                        ))}
                    </div>
                </div>
            );
        }
        return grid;
    };

    const selectedEvents = getEventsForDate(selectedDate);

    return (
        <div className="student-calendar-page container-fluid px-0">
            <div className="row g-4 h-100">
                {/* Calendar View */}
                <div className="col-12 col-lg-8">
                    <div className="glass-card p-4 h-100">
                        <div className="calendar-header d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-white fw-bold mb-0">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h4>
                            <div className="d-flex gap-2">
                                <button className="btn btn-icon-glass" onClick={() => changeMonth(-1)}>
                                    <ChevronLeft size={20} />
                                </button>
                                <button className="btn btn-icon-glass" onClick={() => setSelectedDate(new Date())}>
                                    Today
                                </button>
                                <button className="btn btn-icon-glass" onClick={() => changeMonth(1)}>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="calendar-weekdays mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="weekday">{day}</div>
                            ))}
                        </div>

                        <div className="calendar-grid">
                            {renderCalendarGrid()}
                        </div>
                    </div>
                </div>

                {/* Event Details Side Panel */}
                <div className="col-12 col-lg-4">
                    <div className="glass-card p-4 h-100 d-flex flex-column">
                        <h5 className="text-white fw-bold mb-3">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h5>

                        <div className="events-list flex-grow-1">
                            {selectedEvents.length > 0 ? (
                                selectedEvents.map(event => (
                                    <div key={event.id} className={`event-card event-card-${event.type} mb-3`}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="mb-0 fw-bold text-white">{event.title}</h6>
                                            <span className={`badge badge-${event.type}`}>{event.type}</span>
                                        </div>
                                        <p className="text-secondary small mb-3">{event.description}</p>

                                        <div className="d-flex align-items-center gap-3 x-small text-secondary">
                                            <span className="d-flex align-items-center gap-1">
                                                <Clock size={14} /> 10:00 AM
                                            </span>
                                            {event.type === 'webinar' || event.type === 'workshop' ? (
                                                <span className="d-flex align-items-center gap-1 text-primary">
                                                    <Video size={14} /> Online
                                                </span>
                                            ) : (
                                                <span className="d-flex align-items-center gap-1">
                                                    <MapPin size={14} /> Campus
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5 text-secondary opacity-50">
                                    <CalendarIcon size={48} className="mb-3" />
                                    <p>No events scheduled for this day.</p>
                                    <button className="btn btn-sm btn-outline-secondary mt-2">Add Personal Task</button>
                                </div>
                            )}
                        </div>

                        <div className="upcoming-summary mt-4 pt-4 border-top border-white border-opacity-10">
                            <h6 className="text-white small fw-bold mb-3 text-uppercase opacity-75">Legend</h6>
                            <div className="d-flex flex-wrap gap-3">
                                <div className="d-flex align-items-center gap-2 small text-secondary">
                                    <span className="dot dot-workshop"></span> Workshop
                                </div>
                                <div className="d-flex align-items-center gap-2 small text-secondary">
                                    <span className="dot dot-deadline"></span> Deadline
                                </div>
                                <div className="d-flex align-items-center gap-2 small text-secondary">
                                    <span className="dot dot-webinar"></span> Webinar
                                </div>
                                <div className="d-flex align-items-center gap-2 small text-secondary">
                                    <span className="dot dot-meeting"></span> Meeting
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCalendar;
