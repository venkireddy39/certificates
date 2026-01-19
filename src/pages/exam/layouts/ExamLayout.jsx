import React from 'react';
import { Outlet } from "react-router-dom";

const ExamLayout = () => {
    return (
        <div className="exam-module-content">
            <Outlet />
        </div>
    );
};

export default ExamLayout;
