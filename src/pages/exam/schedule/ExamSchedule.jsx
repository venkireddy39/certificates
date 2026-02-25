import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Calendar, Clock, Mail, ChevronRight, Loader2, Info, Search } from "lucide-react";
import { examService } from "../services/examService";
import { batchService } from "../../Batches/services/batchService";
import { courseService } from "../../Courses/services/courseService";

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedExam, setSelectedExam] = useState("");
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTermExam, setSearchTermExam] = useState("");
  const [searchTermCourse, setSearchTermCourse] = useState("");
  const [searchTermBatch, setSearchTermBatch] = useState("");
  const [scheduleData, setScheduleData] = useState({
    batchIds: [],
    courseIds: [],
    startTime: "",
    endTime: "",
    emailNotify: false
  });

  useEffect(() => {
    fetchExamsAndBatches();
  }, []);

  const fetchExamsAndBatches = async () => {
    setLoading(true);
    try {
      const [examsData, batchesData, coursesData] = await Promise.all([
        examService.getAllExams(),
        batchService.getAllBatches(),
        courseService.getCourses()
      ]);
      setExams(Array.isArray(examsData) ? examsData : []);
      setBatches(Array.isArray(batchesData) ? batchesData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      toast.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();

    if (!selectedExam || ((!scheduleData.batchIds || scheduleData.batchIds.length === 0) && (!scheduleData.courseIds || scheduleData.courseIds.length === 0)) || !scheduleData.startTime) {
      toast.error("Please select an exam, at least one batch or course, and a start time");
      return;
    }

    if (scheduleData.endTime && scheduleData.endTime <= scheduleData.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    setSubmitting(true);
    try {
      const promises = [];

      // Format datetime strings to append seconds if missing (datetime-local usually outputs YYYY-MM-DDThh:mm)
      const formattedStart = scheduleData.startTime.length === 16 ? scheduleData.startTime + ":00" : scheduleData.startTime;
      const formattedEnd = scheduleData.endTime.length === 16 ? scheduleData.endTime + ":00" : scheduleData.endTime;

      // Collect all unique batches to schedule
      const batchesToSchedule = new Map();

      // 1. Add explicitly selected batches
      scheduleData.batchIds.forEach(bId => {
        const batchObj = batches.find(b => String(b.batchId || b.id) === String(bId));
        if (batchObj) {
          batchesToSchedule.set(String(bId), batchObj);
        }
      });

      // 2. Add all batches belonging to explicitly selected courses
      scheduleData.courseIds.forEach(cId => {
        const courseBatches = batches.filter(b => {
          const bcId = b.course?.courseId || b.courseId || b.course?.id;
          return String(bcId) === String(cId);
        });
        courseBatches.forEach(b => {
          batchesToSchedule.set(String(b.batchId || b.id), b);
        });
      });

      if (batchesToSchedule.size === 0) {
        toast.error("No valid batches found for the selected courses/batches. The backend requires at least one valid batch.");
        setSubmitting(false);
        return;
      }

      // 3. Dispatch API Calls for each unique batch
      batchesToSchedule.forEach((batchObj, bIdString) => {
        const cId = batchObj.course?.courseId || batchObj.courseId || batchObj.course?.id || 1;

        console.log(`[DEBUG] Scheduling Batch: Selected Exam: ${selectedExam}, CourseID: ${cId}, BatchID: ${bIdString}`);

        promises.push(examService.scheduleExam({
          examId: parseInt(selectedExam, 10),
          courseId: parseInt(cId, 10),
          batchId: parseInt(bIdString, 10),
          startTime: formattedStart,
          endTime: formattedEnd
        }));
      });

      await Promise.all(promises);

      toast.success("Exam scheduled successfully for selected targets!");
      handleReset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedExam("");
    setSearchTermExam("");
    setSearchTermCourse("");
    setSearchTermBatch("");
    setScheduleData({
      batchIds: [],
      courseIds: [],
      startTime: "",
      endTime: "",
      emailNotify: false
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-gray-5">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gray-5 text-dark py-5">
      <ToastContainer theme="light" position="top-right" />

      <style>{`
        .schedule-glass {
          background: #ffffff;
          backdrop-filter: blur(15px);
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        }
        .form-control, .form-select {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          padding: 12px 16px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .form-control:focus, .form-select:focus {
          background: #ffffff;
          border-color: #6366f1;
          color: #0f172a;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .premium-btn {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          color: white;
        }
        .premium-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
        }
        .premium-btn:disabled {
          opacity: 0.7;
          transform: none;
        }
        .ls-1 { letter-spacing: 0.05em; }
        .bg-white-5 { background: #f1f5f9; }
      `}</style>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="row justify-content-center"
        >
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-2 text-dark">Schedule Exam</h1>
              <p className="text-muted">Set the timing and accessibility parameters for your assessment</p>
            </div>

            <div className="schedule-glass p-4 p-md-5">
              <form onSubmit={handleSchedule}>
                <div className="row g-4">
                  {/* SELECT EXAM */}
                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-2 ls-1">Target Exam</label>
                    {selectedExam && (
                      <div className="mb-2 p-2 bg-primary bg-opacity-10 border border-primary rounded-3 d-flex justify-content-between align-items-center">
                        <div className="fw-medium text-primary">
                          ✓ {exams.find(e => String(e.id) === String(selectedExam))?.title || 'Selected Exam'}
                        </div>
                        <button type="button" className="btn-close btn-sm" onClick={() => setSelectedExam("")}></button>
                      </div>
                    )}
                    <div className="position-relative mb-2">
                      <Search className="position-absolute top-50 translate-middle-y text-muted" size={16} style={{ left: '12px' }} />
                      <input
                        type="text"
                        className="form-control form-control-sm ps-5"
                        placeholder="Search exams..."
                        value={searchTermExam}
                        onChange={e => setSearchTermExam(e.target.value)}
                      />
                    </div>
                    <div className="form-control" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {exams.filter(e => ((e.title || '') + ' ' + (e.course || '')).toLowerCase().includes(searchTermExam.toLowerCase())).length === 0 ? (
                        <span className="text-muted small">No exams found</span>
                      ) : (
                        exams.filter(e => ((e.title || '') + ' ' + (e.course || '')).toLowerCase().includes(searchTermExam.toLowerCase())).map(exam => (
                          <div key={`exam-${exam.id}`} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="targetExam"
                              id={`exam-${exam.id}`}
                              value={exam.id}
                              checked={String(selectedExam) === String(exam.id)}
                              onChange={e => setSelectedExam(e.target.value)}
                              style={{ cursor: 'pointer' }}
                            />
                            <label className="form-check-label ms-1" htmlFor={`exam-${exam.id}`} style={{ cursor: 'pointer' }}>
                              {exam.title} {exam.course ? `(${exam.course})` : ''}
                            </label>
                          </div>
                        )))}
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-2 ls-1">Select Courses</label>
                    {scheduleData.courseIds && scheduleData.courseIds.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {scheduleData.courseIds.map(cId => {
                          const course = courses.find(c => String(c.courseId || c.id) === String(cId));
                          return course ? (
                            <span key={`pill-course-${cId}`} className="badge bg-primary bg-opacity-10 text-primary border border-primary rounded-pill d-flex align-items-center px-3 py-2">
                              {course.courseName || course.name}
                              <button type="button" className="btn-close btn-sm ms-2" style={{ fontSize: '0.65rem' }} onClick={() => {
                                setScheduleData(prev => ({ ...prev, courseIds: prev.courseIds.filter(id => id !== cId) }));
                              }}></button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="position-relative mb-2">
                      <Search className="position-absolute top-50 translate-middle-y text-muted" size={16} style={{ left: '12px' }} />
                      <input
                        type="text"
                        className="form-control form-control-sm ps-5"
                        placeholder="Search courses..."
                        value={searchTermCourse}
                        onChange={e => setSearchTermCourse(e.target.value)}
                      />
                    </div>
                    <div className="form-control" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {courses.filter(c => (c.courseName || c.name || '').toLowerCase().includes(searchTermCourse.toLowerCase())).length === 0 ? (
                        <span className="text-muted small">No courses found</span>
                      ) : (
                        courses.filter(c => (c.courseName || c.name || '').toLowerCase().includes(searchTermCourse.toLowerCase())).map(course => {
                          const courseValue = String(course.courseId || course.id);
                          return (
                            <div key={`course-${courseValue}`} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`course-${courseValue}`}
                                value={courseValue}
                                checked={scheduleData.courseIds?.includes(courseValue)}
                                onChange={e => {
                                  const val = e.target.value;
                                  let newCourseIds = [...(scheduleData.courseIds || [])];
                                  if (e.target.checked) {
                                    newCourseIds.push(val);
                                  } else {
                                    newCourseIds = newCourseIds.filter(id => id !== val);
                                  }
                                  setScheduleData({ ...scheduleData, courseIds: newCourseIds });
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                              <label className="form-check-label ms-1" htmlFor={`course-${courseValue}`} style={{ cursor: 'pointer' }}>
                                {course.courseName || course.name}
                              </label>
                            </div>
                          )
                        }))}
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-2 ls-1">Select Batches / Groups</label>
                    {scheduleData.batchIds && scheduleData.batchIds.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {scheduleData.batchIds.map(bId => {
                          const batch = batches.find(b => String(b.batchId || b.id) === String(bId));
                          return batch ? (
                            <span key={`pill-batch-${bId}`} className="badge bg-primary bg-opacity-10 text-primary border border-primary rounded-pill d-flex align-items-center px-3 py-2">
                              {batch.batchName || batch.name} {batch.course?.courseName ? `(${batch.course.courseName})` : ''}
                              <button type="button" className="btn-close btn-sm ms-2" style={{ fontSize: '0.65rem' }} onClick={() => {
                                setScheduleData(prev => ({ ...prev, batchIds: prev.batchIds.filter(id => id !== bId) }));
                              }}></button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="position-relative mb-2">
                      <Search className="position-absolute top-50 translate-middle-y text-muted" size={16} style={{ left: '12px' }} />
                      <input
                        type="text"
                        className="form-control form-control-sm ps-5"
                        placeholder="Search batches..."
                        value={searchTermBatch}
                        onChange={e => setSearchTermBatch(e.target.value)}
                      />
                    </div>
                    <div className="form-control" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {batches.filter(b => ((b.batchName || b.name || '') + ' ' + (b.course?.courseName || '')).toLowerCase().includes(searchTermBatch.toLowerCase())).length === 0 ? (
                        <span className="text-muted small">No batches found</span>
                      ) : (
                        batches.filter(b => ((b.batchName || b.name || '') + ' ' + (b.course?.courseName || '')).toLowerCase().includes(searchTermBatch.toLowerCase())).map(batch => {
                          const batchValue = String(batch.batchId || batch.id);
                          return (
                            <div key={`batch-${batchValue}`} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`batch-${batchValue}`}
                                value={batchValue}
                                checked={scheduleData.batchIds?.includes(batchValue)}
                                onChange={e => {
                                  const val = e.target.value;
                                  let newBatchIds = [...scheduleData.batchIds];
                                  if (e.target.checked) {
                                    newBatchIds.push(val);
                                  } else {
                                    newBatchIds = newBatchIds.filter(id => id !== val);
                                  }
                                  setScheduleData({ ...scheduleData, batchIds: newBatchIds });
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                              <label className="form-check-label ms-1" htmlFor={`batch-${batchValue}`} style={{ cursor: 'pointer' }}>
                                {batch.batchName || batch.name} {batch.course?.courseName ? `(${batch.course.courseName})` : ''}
                              </label>
                            </div>
                          )
                        }))}
                    </div>
                  </div>

                  {/* DATES */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-2 ls-1">
                      <Calendar size={14} className="me-2 text-primary" /> Start Window
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control form-control-lg"
                      value={scheduleData.startTime}
                      onChange={e => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase mb-2 ls-1">
                      <Clock size={14} className="me-2 text-primary" /> End Window (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control form-control-lg"
                      value={scheduleData.endTime}
                      onChange={e => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                    />
                  </div>

                  {/* NOTIFICATIONS */}
                  <div className="col-12 mt-4">
                    <div className="p-4 bg-light rounded-4 d-flex align-items-center justify-content-between border border-light shadow-sm">
                      <div className="d-flex align-items-center">
                        <div className="p-3 bg-primary bg-opacity-10 rounded-circle me-3">
                          <Mail className="text-primary" size={24} />
                        </div>
                        <div>
                          <p className="mb-0 fw-bold text-dark">Email Notifications</p>
                          <small className="text-muted">Send automated invites to all enrolled students</small>
                        </div>
                      </div>
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={scheduleData.emailNotify}
                          onChange={e => setScheduleData({ ...scheduleData, emailNotify: e.target.checked })}
                          style={{ width: '3.5rem', height: '1.75rem', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* TIPS */}
                  <div className="col-12">
                    <div className="d-flex gap-2 text-muted small p-2 bg-light rounded-3 bg-opacity-50">
                      <Info size={16} className="mt-1 text-primary" />
                      <p className="mb-0">Students will only be able to start the exam within the specified start window. Ensure you have properly configured the exam settings first.</p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="col-12 mt-4 d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-light btn-lg flex-grow-1 border"
                      onClick={handleReset}
                      style={{ borderRadius: '12px', fontWeight: '600' }}
                    >
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      className="btn premium-btn btn-lg flex-grow-1 shadow"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <><Loader2 className="animate-spin me-2" size={18} /> Scheduling...</>
                      ) : (
                        <><ChevronRight className="me-1" size={18} /> Confirm Schedule</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExamSchedule;
