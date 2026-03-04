import React, { useState, useEffect } from "react";
import {
  FaCertificate,
  FaCog,
  FaLayerGroup,
  FaRobot,
  FaUserEdit,
  FaPalette,
  FaHome,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// styles
import "./CertificateModule.css";



// api
import { certificateService } from "../../services/certificateService";

// tabs
import CertificateDashboard from "./tabs/CertificateDashboard";
import CertificateSettings from "./tabs/CertificateSettings";
import History from "./tabs/History";
import ManualIssue from "./tabs/ManualIssue";
import AutomationRules from "./tabs/AutomationRules";
import PendingCertificates from "./tabs/PendingCertificates";

// editor
import CanvasEditor from "./editor/CanvasEditor";
import TemplateGallery from "./editor/TemplateGallery";
import PreviewModal from "./editor/PreviewModal";

// ------------------ CONSTANTS ------------------
const TABS = [
  { id: "dashboard", icon: FaHome, label: "Dashboard" },
  { id: "pending", icon: FaLayerGroup, label: "Pending" },
  { id: "templates", icon: FaPalette, label: "Templates" },
  { id: "issue", icon: FaUserEdit, label: "Manual Issue" },
  { id: "auto", icon: FaRobot, label: "Automation" },
  { id: "history", icon: FaCertificate, label: "History" },
  { id: "settings", icon: FaCog, label: "Admin Settings" },
];

// ------------------ COMPONENT ------------------
const CertificateModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [templates, setTemplates] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [pendingCertificates, setPendingCertificates] = useState([]);
  const [adminSettings, setAdminSettings] = useState({
    // Organization Details
    instituteName: "",
    subTitle: "",
    instituteAddress: "",
    website: "",
    email: "",
    logo: null,

    // Signatures & Stamps
    directorSignature: null,
    instructorSignature: null,
    sealImage: null,

    // Certificate ID Configuration
    certIdPrefix: "LMS",
    certIdIncludeYear: true,
    certIdAutoIncrement: true,

    // Eligibility Rules
    eligibilityCompletion: true,
    eligibilityExamPassed: false,
    eligibilityMinScore: 0,
    requireFeePaid: true,

    // System Options
    enableVerification: true,
    allowPdfDownload: true,
    allowSharing: true,
    allowReissue: false
  });
  const [automationRules, setAutomationRules] = useState([]);



  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      // Each call is independent — one failure won't block others
      try {
        const certsRes = await certificateService.getAllCertificates();
        const certsArray = Array.isArray(certsRes) ? certsRes : (certsRes?.data || []);
        setCertificates(certsArray);
      } catch (error) {
        console.warn("Could not load certificates:", error.message);
        setCertificates([]);
      }
    };
    fetchInitialData();
  }, []);

  // editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // preview
  const [previewCert, setPreviewCert] = useState(null);

  // manual issue state
  const [issueData, setIssueData] = useState({
    userId: "",
    studentName: "",
    studentEmail: "",
    targetType: "EXAM",
    targetId: "",
    eventTitle: "",
    score: "",
    selectedTemplateId: "",
  });


  // ------------------ HELPERS ------------------

  const handleIssueCertificate = async () => {
    const { userId, studentName, studentEmail, targetType, targetId, eventTitle } = issueData;
    if (!userId || !studentName || !studentEmail || !targetId || !eventTitle) {
      toast.error("Please fill all required fields (Student Name, Email, User ID, Target ID, Event Title)");
      return;
    }

    try {
      const payload = {
        userId: parseInt(userId),
        studentName: studentName.trim(),
        targetType: targetType || "EXAM",
        targetId: parseInt(targetId),
        eventTitle: eventTitle.trim(),
        studentEmail: studentEmail.trim(),
        score: issueData.score !== '' ? parseFloat(issueData.score) : 0,
      };

      const resp = await certificateService.manualGenerate(payload);
      setCertificates((prev) => [resp, ...prev]);
      toast.success("Certificate issued successfully");
      setActiveTab("history");
    } catch (error) {
      toast.error(error.message || "Failed to issue certificate");
    }
  };

  const handleApprove = async (cert) => {
    try {
      // TODO: API INTEGRATION - POST /api/certificates/approve
      // await certificateService.approveCertificate(cert.id);

      setCertificates((prev) => [
        {
          ...cert,
          id: Date.now(),
          issuedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setPendingCertificates((prev) => prev.filter((c) => c.id !== cert.id));
      toast.success("Certificate approved");
    } catch (error) {
      toast.error("Error approving certificate");
    }
  };

  const handleReject = async (id) => {
    try {
      // TODO: API INTEGRATION - DELETE /api/certificates/pending/:id
      // await certificateService.rejectCertificate(id);

      setPendingCertificates((prev) => prev.filter((c) => c.id !== id));
      toast.info("Certificate request rejected");
    } catch (error) {
      toast.error("Error rejecting certificate");
    }
  };

  // ------------------ RENDER CONTENT ------------------
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <CertificateDashboard
            certificates={certificates}
            templates={templates}
            onNavigate={setActiveTab}
          />
        );

      case "pending":
        return (
          <PendingCertificates
            pendingCertificates={pendingCertificates}
            onApprove={handleApprove}
            onReject={handleReject}
            settings={adminSettings}
          />
        );

      case "templates":
        if (!isEditorOpen) {
          return (
            <TemplateGallery
              templates={templates}
              onEdit={(template) => {
                setEditingTemplate(template);
                setIsEditorOpen(true);
              }}
              onCreate={(newTemplate) => {
                setEditingTemplate(newTemplate);
                setIsEditorOpen(true);
              }}
              onDelete={(id) => {
                setTemplates(prev => prev.filter(t => t.id !== id));
                toast.info("Template deleted");
              }}
            />
          );
        }

        return (
          <CanvasEditor
            editingTemplate={editingTemplate}
            setEditingTemplate={setEditingTemplate}
            settings={adminSettings}
            setIsEditorOpen={setIsEditorOpen}
            handleTemplateSave={() => {
              // TODO: API INTEGRATION - PUT /api/templates/:id
              setTemplates((prev) => {
                const exists = prev.find((t) => t.id === editingTemplate.id);
                if (exists) {
                  return prev.map((t) =>
                    t.id === editingTemplate.id ? editingTemplate : t
                  );
                }
                return [...prev, editingTemplate];
              });
              setIsEditorOpen(false);
              toast.success("Template saved");
            }}
          />
        );

      case "issue":
        return (
          <ManualIssue
            issueData={issueData}
            setIssueData={setIssueData}
            templates={templates}
            onIssue={handleIssueCertificate}
            settings={adminSettings}
          />
        );

      case "history":
        return (
          <History
            certificates={certificates}
            onView={setPreviewCert}
            settings={adminSettings}
          />
        );

      case "auto":
        return (
          <AutomationRules
            autoRules={automationRules}
            setAutoRules={setAutomationRules}
            templates={templates}
            handleAutoRuleSave={(ruleData) => {
              const newRule = {
                id: Date.now(),
                ...ruleData,
                status: 'Active'
              };
              // TODO: API INTEGRATION - POST /api/automation/rules
              setAutomationRules([...automationRules, newRule]);
              toast.success("Automation rule created successfully");
            }}
          />
        );

      case "settings":
        return (
          <CertificateSettings
            adminSettings={adminSettings}
            setAdminSettings={setAdminSettings}
          />
        );

      default:
        return null;
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="container-fluid bg-light min-vh-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container py-4">

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0">
              <FaLayerGroup className="me-2 text-primary" />
              Certificate Management
            </h4>
            <small className="text-muted">Manage, issue, and track all certificates</small>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab("issue")}
          >
            <FaUserEdit className="me-2" /> Issue Certificate
          </button>
        </div>

        {/* Nav Tabs */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-2">
            <ul className="nav nav-pills gap-1 flex-wrap" role="tablist">
              {TABS.map((tab) => (
                <li key={tab.id} className="nav-item" role="presentation">
                  <button
                    className={`nav-link d-flex align-items-center gap-2 ${activeTab === tab.id ? "active" : "text-muted"
                      }`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        {renderContent()}
      </div>

      <PreviewModal
        previewCert={previewCert}
        onClose={() => setPreviewCert(null)}
        settings={adminSettings}
      />
    </div>
  );
};

export default CertificateModule;
