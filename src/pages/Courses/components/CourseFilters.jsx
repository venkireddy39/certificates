import React from 'react';
import { FiSearch } from "react-icons/fi";
import { COURSE_STATUS } from '../constants/courseConstants';

const CourseFilters = ({
    search,
    setSearch,
    statusFilter,
    setStatusFilter
}) => {
    return (
        <div className="courses-actions-bar">
            {/* Search */}
            <div className="course-search-wrapper">
                <FiSearch className="search-icon-abs" />
                <input
                    type="text"
                    className="course-search-input"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Status Filter */}
            <select
                className="course-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#64748b',
                    cursor: 'pointer',
                    height: '46px', // Match search height roughly
                    backgroundColor: 'white'
                }}
            >
                <option value="All">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
                <option value="DELETED">Deleted</option>
            </select>
        </div>
    );
};

export default CourseFilters;
