import React from "react";
import { FiPlus, FiLayers, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import CourseFilters from "./components/CourseFilters";
import CourseGrid from "./components/CourseGrid";
import CourseModal from "./components/CourseModal";
import CourseDetailsModal from "./components/CourseDetailsModal";
import CourseShareModal from "./components/CourseShareModal";

import { useCourses } from "./hooks/useCourses";
import { useCourseFilters } from "./hooks/useCourseFilters";
import { useEnrichedCourses } from "./hooks/useEnrichedCourses";

import "./styles/courses.css";

const CoursesPage = () => {
  const navigate = useNavigate();

  const [viewCourse, setViewCourse] = React.useState(null);
  const [shareCourse, setShareCourse] = React.useState(null);

  /* ======================
     Data & Logic
  ====================== */
  const {
    courses,
    showModal,
    setShowModal,
    openModal,
    handleDelete,
    handleSave,
    handleInputChange,
    handleImageChange,
    formData,
    toggleCourseStatus,
    toggleBookmark
  } = useCourses();

  /* ======================
     Filters
  ====================== */
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredCourses,
  } = useCourseFilters(courses);

  // Manual Enrichment for Learners Count
  const { enrichedCourses } = useEnrichedCourses(filteredCourses);

  return (
    <div className="courses-container">
      {/* Header */}
      <header className="courses-header">
        <div className="header-content">
          <h1>Course Management</h1>
          <p>Create, manage and assign courses.</p>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <CourseFilters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <button
            onClick={() => navigate('/admin/batches')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 18px', borderRadius: '11px',
              fontSize: '13.5px', fontWeight: '700',
              border: '1px solid #c7d2fe',
              background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
              color: '#4338ca', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 1px 4px rgba(99,102,241,0.10)'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(99,102,241,0.10)'; e.currentTarget.style.transform = 'none'; }}
          >
            <FiGrid size={15} /> All Batches
          </button>

          <button className="btn-primary-add" onClick={() => openModal()}>
            <FiPlus size={18} /> Add New Course
          </button>
        </div>
      </header>

      {/* Course Grid */}
      <div className="courses-grid-body">
        <CourseGrid
          courses={enrichedCourses}
          onEdit={openModal}
          onDelete={handleDelete}
          onToggleStatus={toggleCourseStatus}
          onManageContent={(id) => navigate(`/admin/courses/builder/${id}`)}
          onShowDetails={(course) => setViewCourse(course)}
          onShare={(course) => setShareCourse(course)}
          onBookmark={toggleBookmark}
          onCreateBatch={(courseId, courseName) => navigate('/admin/batches', { state: { createForCourse: courseId, courseName } })}
        />
      </div>

      {/* Create / Edit Modal */}
      <CourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleSave={handleSave}
      />

      {/* Details Modal */}
      <CourseDetailsModal
        isOpen={!!viewCourse}
        onClose={() => setViewCourse(null)}
        course={viewCourse}
      />

      {/* Share Modal */}
      <CourseShareModal
        isOpen={!!shareCourse}
        onClose={() => setShareCourse(null)}
        course={shareCourse}
      />
    </div>
  );
};

export default CoursesPage;
