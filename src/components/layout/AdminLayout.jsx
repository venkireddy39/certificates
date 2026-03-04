import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';

const AdminLayout = () => {
    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc' }}>
            <TopNavbar />
            <main className="flex-grow-1 p-4">
                <div className="container-fluid">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
