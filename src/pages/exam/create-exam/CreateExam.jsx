import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

import SetupMode from "./components/SetupMode";
import EditorMode from "./components/EditorMode";
import PreviewMode from "./components/PreviewMode";
import { ExamService } from "../services/examService";
import { ExamSettingsService } from "../services/examSettingsService";
import { QuestionService } from "../services/questionService";
import { Loader2 } from "lucide-react";

const CreateExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [step, setStep] = useState(isEditMode ? "editor" : "setup");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const [examData, setExamData] = useState({
    title: "",
    course: "", // Display name
    courseId: null, // Required for backend
    batchId: null, // Required for backend
    type: "mixed", // mixed | coding | quiz
    totalMarks: 100,
    duration: 60,
    questions: [],
    sections: [],
    customAssets: {
      bgImage: null,
      watermark: null,
      watermarkOpacity: 0.1,
      orientation: "portrait"
    },
    settings: {
      maxAttempts: 1,
      gradingStrategy: "highest",
      negativeMarking: false,
      autoSubmit: true,
      shuffleQuestions: false,
      shuffleOptions: false,
      allowResume: true,
      autoEvaluation: true,
      partialMarking: false,
      showResults: true,
      showRank: false,
      showPercentile: false
    },
    proctoring: {
      enabled: false,
      cameraRequired: false,
      forceFullScreen: false,
      maxViolations: 5
    },
    status: "DRAFT"
  });

  useEffect(() => {
    if (isEditMode) {
      fetchExamToEdit();
    }
  }, [id, isEditMode]);

  const fetchExamToEdit = async () => {
    setLoading(true);
    try {
      const examToEdit = await ExamService.getExamById(id);
      if (examToEdit) {
        // Fetch related settings too
        const [settings, design, proctoring, grading] = await Promise.all([
          ExamService.getExamSettings(id),
          ExamService.getExamDesign(id),
          ExamService.getExamProctoring(id),
          ExamService.getExamGrading(id)
        ]);

        setExamData({
          ...examToEdit,
          settings: { ...examToEdit.settings, ...settings, ...grading },
          proctoring: { ...examToEdit.proctoring, ...proctoring },
          customAssets: { ...examToEdit.customAssets, ...design }
        });
        setStep("editor");
      } else {
        toast.error("Exam record not found!");
        navigate("/exams/dashboard");
      }
    } catch (error) {
      toast.error("Failed to load exam data");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = (config) => {
    setExamData(prev => ({ ...prev, ...config }));
    setStep("editor");
    toast.info("Configuration saved. Opening question editor...");
  };

  const handleSave = async () => {
    if (!examData.title || !examData.courseId) {
      toast.error("Title and Course selection are required.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Core Exam Data
      const corePayload = {
        title: examData.title,
        courseId: examData.courseId,
        batchId: examData.batchId,
        examType: examData.type.toUpperCase(),
        totalMarks: examData.totalMarks,
        durationMinutes: examData.duration,
        passPercentage: 40 // Default
      };

      let savedExam;
      if (isEditMode) {
        // Assuming updateExam is implemented or we use a specific update flow
        savedExam = await ExamService.updateExam(id, corePayload);
      } else {
        savedExam = await ExamService.saveExam(corePayload);
      }

      const examId = savedExam.exam_id || savedExam.examId || savedExam.id || id;

      // 2. Parallel save of all configuration entities aligned with Tables 2, 3, 4, 5, 6
      await Promise.all([
        // Table 3: exam_settings
        ExamSettingsService.saveSettings(examId, {
          attemptsAllowed: examData.settings.maxAttempts,
          negativeMarking: examData.settings.negativeMarking,
          negativeMarkValue: examData.settings.negativeMarkingPenalty || 0,
          shuffleQuestions: examData.settings.shuffleQuestions,
          shuffleOptions: examData.settings.shuffleOptions,
          allowLateEntry: examData.settings.allowLateEntry || false,
          networkMode: (examData.settings.networkStrictness || "LENIENT").toUpperCase()
        }),

        // Table 2: exam_design
        ExamSettingsService.saveDesign(examId, {
          orientation: (examData.customAssets?.orientation || "PORTRAIT").toUpperCase(),
          instituteLogo: examData.customAssets?.logo,
          backgroundImage: examData.customAssets?.bgImage,
          watermark_type: (typeof examData.customAssets?.watermark === 'string' && !examData.customAssets?.watermark.startsWith('data:')) ? 'TEXT' : 'IMAGE',
          watermark_value: examData.customAssets?.watermark,
          watermark_opacity: examData.customAssets?.watermarkOpacity || 0.1
        }),

        // Table 4: exam_proctoring
        ExamSettingsService.saveProctoring(examId, {
          enabled: examData.proctoring.enabled,
          cameraRequired: examData.proctoring.cameraRequired,
          systemCheckRequired: true,
          violationLimit: examData.proctoring.maxViolations || 5
        }),

        // Table 5: exam_grading
        ExamSettingsService.saveGrading(examId, {
          autoEvaluation: examData.settings.autoEvaluation ?? true,
          partialMarking: examData.settings.partialMarking,
          showResult: examData.settings.showResults,
          showRank: examData.settings.showRank,
          showPercentile: examData.settings.showPercentile
        }),

        // Table 6: exam_notification
        ExamSettingsService.saveNotification(examId, {
          scheduledNotification: examData.settings.scheduledNotification || false,
          reminderBefore: examData.settings.examReminder || "NONE",
          feedback_after_exam: examData.settings.collectFeedback || false
        })
      ]);

      // 3. Table 7: exam_question (Saving & Mapping Questions)
      if (examData.questions && examData.questions.length > 0) {

        // A. Persist new questions to Question Bank first
        const questionsWithIds = await Promise.all(examData.questions.map(async (q) => {
          // If it already has an ID, it's from the bank.
          if (q.id || q.questionId) return q;

          // Otherwise, CREATE it in the backend
          try {
            // Enrich with course context
            const savedQ = await QuestionService.createQuestion({
              ...q,
              courseId: examData.courseId
            });
            // Return original q merged with new ID
            return { ...q, id: savedQ.id || savedQ.questionId || savedQ.question_id };
          } catch (err) {
            console.error("Failed to auto-save new question:", q);
            throw new Error("Failed to save one or more new questions. Please try again.");
          }
        }));

        // B. Link questions to the Exam
        await ExamService.addExamQuestions(examId, questionsWithIds.map((q, i) => ({
          questionId: q.id || q.questionId,
          marks: q.marks || 1,
          questionOrder: i + 1
        })));
      }

      // 4. Publish if it's a final action
      await ExamService.publishExam(examId);

      toast.success(isEditMode ? "Exam updated!" : "New exam published!");
      setTimeout(() => navigate("/exams/dashboard"), 1500);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save exam. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-white text-dark">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mb-3" size={48} />
          <h5 className="fw-light">Loading exam content...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-white text-dark d-flex flex-column" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ToastContainer position="bottom-right" theme="dark" />

      <AnimatePresence mode="wait">
        {step === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-grow-1"
          >
            <SetupMode
              initialData={isEditMode ? examData : null}
              onComplete={handleSetupComplete}
            />
          </motion.div>
        )}

        {step === "editor" && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow-1"
          >
            <EditorMode
              examData={examData}
              setExamData={setExamData}
              onSave={handleSave}
              submitting={submitting}
              onPreview={() => setShowPreview(true)}
              onBack={() => {
                if (window.confirm("Return to configuration? Unsaved editor changes will be lost if you leave this session.")) {
                  setStep("setup");
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showPreview && (
        <PreviewMode
          examData={examData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default CreateExam;
