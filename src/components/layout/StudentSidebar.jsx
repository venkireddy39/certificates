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
            <div className="student-sidebar-brand">
                <div className="brand-logo bg-primary rounded-3 p-1 d-flex align-items-center justify-content-center">
                    <PlayCircle size={28} className="text-white" />
                </div>
                {!isCollapsed && <h3>LMS Student</h3>}
            </div>

            <nav className="student-sidebar-nav">
                {menuItems.map(item => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={(e) => handleItemClick(e, item)}
                        className={({ isActive }) => `student-nav-item ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon size={20} className="nav-icon" />
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {!isCollapsed && (
                <div className="student-sidebar-footer">
                    <div className="glass-card p-3 text-center text-secondary x-small">
                        Academic Year 2024-25
                    </div>
                </div>
            )}
        </aside>
    );
};

export default StudentSidebar;
