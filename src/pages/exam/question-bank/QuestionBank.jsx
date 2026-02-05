import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, Database, Search } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExamService } from "../services/examService";

const QuestionBank = () => {
  const [type, setType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await ExamService.getExams();
      setQuestions(data || []);
    } catch (error) {
      toast.error("Failed to load question bank data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this exam from bank? This does not delete actual questions if they are reused elsewhere.")) return;

    try {
      await ExamService.deleteExam(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast.success("Exam link removed from bank");
    } catch {
      toast.error("Process failed");
    }
  };

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchesType = type === "all" || q.type === type;
      const title = q.title || "";
      const course = q.course || "";
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [questions, type, searchTerm]);

  return (
    <div className="min-vh-100 bg-gray-5 text-dark p-4 scrollbar-hide">
      <ToastContainer theme="light" position="bottom-right" />

      <div className="container-fluid max-w-1200 mx-auto">
        {/* Header */}
        <header className="mb-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4"
          >
            <div>
              <h1 className="fw-bold h2 mb-2 d-flex align-items-center gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-3">
                  <Database className="text-primary" size={32} />
                </div>
                Question Bank
              </h1>
              <p className="text-muted mb-0">Central repository for all created exam papers and assessment logic.</p>
            </div>

            <div className="d-flex gap-3 align-items-center">
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                <input
                  type="text"
                  className="form-control bg-white border-light shadow-sm text-dark rounded-pill ps-5 py-2"
                  style={{ width: '280px' }}
                  placeholder="Find exams or courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="/exams/create" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold premium-btn shadow-lg">
                New Assessment
              </Link>
            </div>
          </motion.div>
        </header>

        {/* Filters */}
        <div className="mb-4 d-flex overflow-auto pb-2 gap-2 scrollbar-hide">
          {["all", "mixed", "coding", "quiz"].map(t => (
            <button
              key={t}
              className={`btn rounded-pill px-4 py-2 transition-all fw-medium border shadow-sm ${type === t ? "btn-primary text-white" : "bg-white text-muted hover-bg-light"
                }`}
              onClick={() => setType(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* List View */}
        <div className="glass-panel rounded-4 border border-light overflow-hidden shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light text-muted small text-uppercase fw-bold ls-1">
                <tr>
                  <th className="ps-4 py-4">Exam Identity</th>
                  <th className="py-4">Associated Course</th>
                  <th className="py-4 text-center">Difficulty / Type</th>
                  <th className="py-4">Question Count</th>
                  <th className="pe-4 py-4 text-end">Management</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-5 opacity-50">Generating bank list...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <Database size={48} className="text-muted mb-3 opacity-20" />
                        <div className="text-muted">No records match your criteria</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((exam, idx) => (
                      <motion.tr
                        key={exam.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group"
                      >
                        <td className="ps-4 py-3">
                          <div className="py-1">
                            <div className="fw-bold h6 mb-1 group-hover:text-primary transition-colors text-dark">{exam.title}</div>
                            <div className="small text-muted flex align-items-center gap-1">
                              <span className="opacity-50">ID:</span> {exam.id}
                            </div>
                          </div>
                        </td>
                        <td className="text-muted fw-medium">{exam.course}</td>
                        <td className="text-center text-capitalize">
                          <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2">
                            {exam.type}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="progress flex-grow-1 bg-light rounded-pill shadow-inner" style={{ height: 8, maxWidth: 80 }}>
                              <div className="progress-bar bg-primary rounded-pill" style={{ width: '70%' }}></div>
                            </div>
                            <span className="small text-dark fw-bold">{exam.questions?.length || 0}</span>
                          </div>
                        </td>
                        <td className="pe-4 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Link to={`/exams/view-paper/${exam.id}`} className="btn btn-icon btn-light-hover">
                              <Eye size={18} />
                            </Link>
                            <button onClick={() => handleDelete(exam.id)} className="btn btn-icon btn-danger-hover">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .bg-gray-5 { background: #f8fafc; }
        .glass-panel { background: #ffffff; backdrop-filter: blur(12px); transition: all 0.3s ease; }
        .max-w-1200 { max-width: 1200px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .btn-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: #f1f5f9; border: 1px solid #e2e8f0; color: #64748b; }
        .btn-light-hover:hover { background: #e2e8f0; color: #0f172a; transform: translateY(-2px); }
        .btn-danger-hover:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; transform: translateY(-2px); }
        .premium-btn { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: none; transition: all 0.3s; }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
        .ls-1 { letter-spacing: 0.05em; }
        .progress.shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .hover-bg-light:hover { background: #f1f5f9 !important; }
      `}</style>
    </div>
  );
};

export default QuestionBank;
