import React from 'react';
import { Outlet } from 'react-router-dom';
import './DashboardLayout.css';

/**
 * DashboardLayout - Pure UI wrapper
 * No auth logic, no role logic.
 * Default layout for dashboard-style views.
 */
const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-wrapper">
      <main className="dashboard-content">
        <div className="container-fluid px-4 py-4">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
