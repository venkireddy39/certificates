/* src/components/layout/StudentSidebar.jsx */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    BookOpen,
    PlayCircle,
    ClipboardList,
    Edit3,
    BarChart3,
    BarChart2,
    Calendar,
    MessageCircle,
    User,
    Award,
    Bus,
    Home,
    LifeBuoy,
    Video
} from 'lucide-react';
import { useToast } from '../../pages/Library/context/ToastContext';
import './StudentSidebar.css';

const StudentSidebar = ({ isCollapsed }) => {
    const navigate = useNavigate();
    const toast = useToast();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard', icon: LayoutGrid, isMock: false },
        { id: 'courses', label: 'My Courses', path: '/student/courses', icon: BookOpen, isMock: false },
        { id: 'content', label: 'Learning Content', path: '/student/content', icon: PlayCircle, isMock: false },
        { id: 'assignments', label: 'Assignments', path: '/student/assignments', icon: ClipboardList, isMock: false },
        { id: 'exams', label: 'Exams', path: '/student/exams', icon: Edit3, isMock: false },
        { id: 'grades', label: 'Grades', path: '/student/grades', icon: BarChart3, isMock: false },
        { id: 'reports', label: 'Reports', path: '/student/reports', icon: BarChart2, isMock: false },
        { id: 'calendar', label: 'Calendar', path: '/student/calendar', icon: Calendar, isMock: false },
        { id: 'webinars', label: 'Webinars', path: '/student/webinars', icon: Video, isMock: false },
        { id: 'transport', label: 'Transport', path: '/student/transport', icon: Bus, isMock: false },
        { id: 'hostel', label: 'My Hostel', path: '/student/hostel', icon: Home, isMock: false },
        { id: 'communication', label: 'Communication', path: '/student/communication', icon: MessageCircle, isMock: false },
        { id: 'profile', label: 'Profile', path: '/student/profile', icon: User, isMock: false },
        { id: 'attendance', label: 'Attendance', path: '/student/attendance', icon: Calendar, isMock: false },
        { id: 'library', label: 'Campus Library', path: '/student/library', icon: BookOpen, isMock: false },
        { id: 'certificates', label: 'Certificates', path: '/student/certificates', icon: Award, isMock: false },
        { id: 'support', label: 'Help Desk', path: '/student/support', icon: LifeBuoy, isMock: false },
    ];

    const handleItemClick = (e, item) => {
        if (item.isMock) {
            e.preventDefault();
            toast.info(`${item.label} feature is coming soon!`);
        }
    };

    return (
        <aside className={`student-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>
            <div className="student-sidebar-brand d-flex align-items-center px-4 py-4">
                <div className="brand-logo bg-primary rounded-3 p-1 d-flex align-items-center justify-content-center me-3 shadow-lg">
                    <PlayCircle size={28} className="text-white" />
                </div>
                {!isCollapsed && <h3 className="m-0 fw-bold text-primary">LMS Student</h3>}
            </div>

            <nav className="student-sidebar-nav px-3 flex-grow-1 overflow-auto">
                <div className="nav flex-column gap-1">
                    {menuItems.map(item => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={(e) => handleItemClick(e, item)}
                            className={({ isActive }) => `nav-link student-nav-item d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all ${isActive ? 'active shadow-sm' : ''}`}
                            title={isCollapsed ? item.label : ''}
                        >
                            <item.icon size={20} className="nav-icon flex-shrink-0" />
                            {!isCollapsed && <span className="nav-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {!isCollapsed && (
                <div className="student-sidebar-footer p-3 mt-auto">
                    <div className="p-3 text-center text-muted small rounded-4 border transition-all" style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                        <span className="opacity-75 tracking-wider fw-bold">Academic Year 2024-25</span>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default StudentSidebar;
