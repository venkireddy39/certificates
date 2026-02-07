import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';


const LibraryLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Toggle for mobile (can be passed to a trigger if we had a local header)
    // For now, we assume desktop mostly or user clicks standard nav toggles.
    // If the main AdminLayout TopNavbar has a toggle, it toggles the MAIN sidebar if it existed.
    // Here we have a submodule sidebar.

    return (
        <div className="d-flex position-relative w-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
            {/* Library Sidebar */}
            <div className="library-sidebar-container">
                <Sidebar
                    mobileOpen={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    className="sidebar-admin-offset" // Defined in Sidebar.css
                />
            </div>

            {/* Main Content Area */}
            <div
                className="flex-grow-1"
                style={{
                    marginLeft: '260px', /* Desktop default */
                    width: 'calc(100% - 260px)',
                    padding: '1.5rem',
                    transition: 'margin-left 0.3s ease, width 0.3s ease'
                }}
            >
                {/* Mobile styles should be handled via media query or JS window width check for robustness */}
                {/* For now we rely on the CSS media query in Sidebar.css to HIDE the sidebar, 
                    but the margin-left here is inline. We need a media query here too? 
                    Actually, let's keep it simple. If we use inline styles, we lose media query power.
                    Let's use a class 'library-main-content' and inject a style tag or rely on Sidebar.css?
                    
                    Better: Use the Sidebar.css for the main content too!
                    I can add .library-main-offset to Sidebar.css
                */}
                <Outlet />
            </div>

            <style>{`
                @media (max-width: 991.98px) {
                    .flex-grow-1[style] {
                        margin-left: 0 !important;
                        width: 100% !important;
                        padding: 1rem !important;
                    }
                }
            `}</style>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                    style={{ zIndex: 1040 }}
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </div>
    );
};

export default LibraryLayout;
