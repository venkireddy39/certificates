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
import DesignStudio from "./editor/DesignStudio";
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
    instituteName: "",
    subTitle: "",
    defaultFooterText: "",
    logo: null,
    sealImage: null,
    directorSignature: null,
  });
  const [automationRules, setAutomationRules] = useState([]);



  // Fetch initial data
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const certs = await certificateService.getAllCertificates();
        setCertificates(certs || []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        toast.error("Failed to fetch certificates");
      }
    };
    fetchCertificates();
  }, []);

  // editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // preview
  const [previewCert, setPreviewCert] = useState(null);

  // manual issue state
  const [issueData, setIssueData] = useState({
    recipientName: "",
    courseName: "",
    date: new Date().toISOString().split("T")[0],
    selectedTemplateId: "",
  });

  // ------------------ HELPERS ------------------
  const generateCertificateId = (courseName, date) => {
    const year = new Date(date).getFullYear();
    const code = courseName
      ? courseName.slice(0, 3).toUpperCase()
      : "GEN";
    return `CERT-${year}-${code}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleIssueCertificate = async (data) => {
    if (!data.recipientName) {
      toast.error("Recipient name is required");
      return;
    }

    const template = templates.find(
      (t) => t.id === data.selectedTemplateId
    );

    if (!template) {
      toast.error("Please select a template");
      return;
    }

    try {
      const resp = await certificateService.manualGenerate({
        userId: 1, // DUMMY USER ID - MUST BE REPLACED WITH REAL SELECTION LATER
        targetType: "COURSE", // Assume COURSE for manual issue right now
        targetId: 1, // DUMMY TARGET ID
        studentName: data.recipientName,
        studentEmail: "student@example.com", // DUMMY EMAIL
        eventTitle: data.courseName || "General Event",
        score: 100
      });

      setCertificates((prev) => [resp, ...prev]);

      toast.success(`Certificate issued successfully`);
      setActiveTab("history");
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Failed to issue certificate");
    }
  };

  const handleApprove = (cert) => {
    // TODO: API INTEGRATION - POST /api/certificates/approve
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
  };

  const handleReject = (id) => {
    // TODO: API INTEGRATION - DELETE /api/certificates/pending/:id
    setPendingCertificates((prev) => prev.filter((c) => c.id !== id));
    toast.info("Certificate request rejected");
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
          <DesignStudio
            editingTemplate={editingTemplate}
            setEditingTemplate={setEditingTemplate}
            settings={adminSettings}
            setIsEditorOpen={setIsEditorOpen}
            handleTemplateSave={() => {
              // TODO: API INTEGRATION - PUT /api/templates/:id
              setTemplates((prev) =>
                prev.map((t) =>
                  t.id === editingTemplate.id ? editingTemplate : t
                )
              );
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
            handleAutoRuleSave={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newRule = {
                id: Date.now(),
                course: formData.get("course"),
                templateId: formData.get("templateId"),
                trigger: "Progress = 100%"
              };
              // TODO: API INTEGRATION - POST /api/automation/rules
              setAutomationRules([...automationRules, newRule]);
              toast.success("Automation rule created");
              e.target.reset();
            }}
          />
        );

      case "settings":
        return (
          <CertificateSettings
            settings={adminSettings}
            onUpdateSettings={(newSettings) => {
              // TODO: API INTEGRATION - PUT /api/settings
              setAdminSettings(newSettings);
            }}
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
