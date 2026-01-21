
import { useState } from 'react';

export const useCourseFilters = (courses) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredCourses = courses.filter(c => {
        const courseName = c.name ? c.name.toLowerCase() : "";
        const mentor = c.mentorName ? c.mentorName.toLowerCase() : "";
        const query = search.toLowerCase();

        const matchesSearch = courseName.includes(query) || mentor.includes(query);

        // Filter by Status: All, Active, Disabled
        // Ensure accurate matching with backend values (ACTIVE, DISABLED)
        const matchesStatus = statusFilter === "All" || (c.status && c.status.toUpperCase() === statusFilter.toUpperCase());

        return matchesSearch && matchesStatus;
    });

    return {
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        filteredCourses
    };
};
