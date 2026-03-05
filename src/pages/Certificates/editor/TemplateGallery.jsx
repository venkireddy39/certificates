import React from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import CertificateRenderer from "../renderer/CertificateRenderer";

const TemplateGallery = ({ templates, loading, onCreate, onEdit, onDelete }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0">Certificate Templates</h5>
          <small className="text-muted">Create and manage certificate designs</small>
        </div>
        <button
          className="btn btn-primary"
          onClick={() =>
            onCreate({
              id: Date.now().toString(),
              name: "New Template",
              page: { type: "A4", orientation: "landscape" },
              theme: {
                backgroundImage: "",
                fontFamily: "'Inter', sans-serif",
                textColor: "#1F2937",
              },
              elements: [
                {
                  id: Date.now().toString() + "1",
                  type: "text",
                  content: "{{studentName}}",
                  x: 350, y: 350, w: 300, h: 50,
                  style: { fontSize: "32px", textAlign: "center", fontWeight: "bold", color: "#000000" },
                },
                {
                  id: Date.now().toString() + "2",
                  type: "qr",
                  x: 750, y: 500, w: 100, h: 100,
                },
              ],
            })
          }
        >
          <FaPlus className="me-2" />
          Create New Design
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-5 text-muted">
          <FaSpinner className="fa-spin me-2" style={{ fontSize: "1.5rem" }} />
          <p className="mt-2">Loading templates...</p>
        </div>
      )}

      {/* Template cards */}
      {!loading && (
        <div className="row g-4">
          {templates.map((t) => (
            <div key={t.id} className="col-md-6 col-xl-4">
              <div className="card h-100 shadow-sm cert-template-card">
                {/* Card Header */}
                <div className="card-header bg-white border-bottom-0 pt-3 px-3 d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: "170px" }}>
                    {t.name}
                  </h6>
                  {t.isActive && (
                    <span className="badge bg-success-subtle text-success me-auto ms-2">Active</span>
                  )}
                  {onDelete && (
                    <button
                      className="btn btn-sm btn-outline-danger p-1 border-0"
                      title="Delete Template"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${t.name}"?`)) onDelete(t.id);
                      }}
                    >
                      <FaTrash size={13} />
                    </button>
                  )}
                </div>

                {/* Preview Area */}
                <div
                  className="card-body p-0 position-relative bg-light overflow-hidden d-flex align-items-center justify-content-center preview-area"
                  style={{ height: "220px", cursor: "pointer" }}
                  onClick={() => onEdit(t)}
                >
                  <div className="w-100 px-3">
                    <CertificateRenderer
                      template={t}
                      data={{
                        studentName: "Sample Student",
                        courseName: t.name || "Sample Course",
                        date: new Date().toISOString(),
                        certificateId: "PREVIEW-001",
                      }}
                      isDesigning={false}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="card-footer bg-white border-top p-3">
                  <button
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => onEdit(t)}
                  >
                    <FaEdit className="me-2" />
                    Edit Design
                  </button>
                </div>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">
              <FaPlus size={32} className="mb-3 opacity-25" />
              <p className="fw-semibold">No templates yet.</p>
              <p className="small">Click "Create New Design" to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
