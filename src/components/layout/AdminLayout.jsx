
import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth } from '../../pages/Library/context/AuthContext';

/**
 * AdminLayout - Auth-guarded layout for all /admin routes
 * Includes AdminSidebar and either TopNav or AdminHeader
 */
const AdminLayout = () => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Role check - allow Admin and Instructor roles for now as per existing AppRoutes logic
    const role = user?.role?.toUpperCase();
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'LIBRARIAN', 'MARKETING_MANAGER', 'INSTRUCTOR'];

    if (!user || !allowedRoles.includes(role)) {
        console.warn("Restricted Access: Unauthorized attempt to access admin UI.");
        return <Navigate to="/login" replace />;
    }

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="d-flex" style={{ height: '100vh', backgroundColor: '#f8fafc' }}>
            {/* ADMIN SIDEBAR */}
            <AdminSidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />

            <div
                className="flex-grow-1 d-flex flex-column overflow-hidden transition-all duration-300"
                style={{
                    marginLeft: isMobile ? 0 : (sidebarOpen ? '260px' : '60px'),
                    width: '100%'
                }}
            >
                {/* ADMIN HEADER */}
                <AdminHeader
                    toggleSidebar={toggleSidebar}
                    pathname={location.pathname}
                />

                {/* MAIN CONTENT */}
                <main className="flex-grow-1 overflow-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
