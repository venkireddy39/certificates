import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderX, Search, Download, Printer, Eye, BarChart2, PieChart as PieIcon, FileText, ChevronDown, Award } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { ExamService } from "../services/examService";
import { toast, ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";

const ExamReports = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", exam: "All", startDate: "", endDate: "" });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await ExamService.getReports();
      setResults(data || []);
    } catch (error) {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const matchSearch = r.studentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.studentId?.toLowerCase().includes(filters.search.toLowerCase());
      const matchExam = filters.exam === "All" || r.examName === filters.exam;
      let matchDate = true;
      if (filters.startDate) matchDate = new Date(r.examDate) >= new Date(filters.startDate);
      if (filters.endDate) matchDate = matchDate && new Date(r.examDate) <= new Date(filters.endDate);
      return matchSearch && matchExam && matchDate;
    });
  }, [results, filters]);

  const uniqueExams = useMemo(() => [...new Set(results.map(r => r.examName))], [results]);

  const stats = useMemo(() => {
    const total = filteredResults.length;
    const passCount = filteredResults.filter(r => r.passed).length;
    const failCount = total - passCount;
    const avgScore = total > 0 ? Math.round(filteredResults.reduce((a, r) => a + r.score, 0) / total) : 0;

    const ranges = [
      { name: "0-49", count: 0 }, { name: "50-69", count: 0 },
      { name: "70-89", count: 0 }, { name: "90+", count: 0 }
    ];
    filteredResults.forEach(r => {
      if (r.score < 50) ranges[0].count++;
      else if (r.score < 70) ranges[1].count++;
      else if (r.score < 90) ranges[2].count++;
      else ranges[3].count++;
    });

    return { total, passCount, failCount, avgScore, passRate: total ? Math.round((passCount / total) * 100) : 0, ranges };
  }, [filteredResults]);

  if (loading && results.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-dark">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gray-5 text-dark p-4 scrollbar-hide">
      <ToastContainer theme="light" />
      <div className="container-fluid max-w-1400 mx-auto">

        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="fw-bold mb-1 h2 text-dark">Analytics & Performance</h1>
            <p className="text-muted mb-0 text-uppercase small tracking-widest letter-spacing-1">Comprehensive Exam Reports Portal</p>
          </motion.div>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-dark rounded-pill px-3 shadow-sm hover-lift" onClick={() => window.print()}>
              <Printer size={18} className="me-2" /> Print PDF
            </button>
            <button className="btn btn-primary rounded-pill px-4 premium-btn shadow-lg">
              <Download size={18} className="me-2" /> Export Data
            </button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="row g-4 mb-5">
          <StatCard title="Pass Rate" value={`${stats.passRate}%`} icon={<Award size={20} />} color="#10b981" />
          <StatCard title="Average Score" value={`${stats.avgScore}%`} icon={<BarChart2 size={20} />} color="#6366f1" />
          <StatCard title="Total Participated" value={stats.total} icon={<FileText size={20} />} color="#f59e0b" />
          <StatCard title="Qualified Candidates" value={stats.passCount} icon={<BarChart2 size={20} />} color="#ec4899" />
        </div>

        <div className="row g-4 mb-5">
          {/* Main Chart */}
          <div className="col-lg-8">
            <div className="glass-panel p-4 rounded-4 border border-light shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold mb-0 text-dark">Score Distribution</h6>
                <div className="text-muted small">Frequency per range</div>
              </div>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="99%">
                  <AreaChart data={stats.ranges}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#1e293b' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="col-lg-4">
            <div className="glass-panel p-4 rounded-4 border border-light shadow-sm h-100">
              <h6 className="fw-bold mb-4 text-dark">Filter Reports</h6>
              <div className="d-flex flex-column gap-4">
                <div className="text-input-group">
                  <label className="small text-muted fw-bold mb-2 d-block text-uppercase ls-1">Search Candidate</label>
                  <div className="position-relative">
                    <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                    <input
                      className="form-control bg-light border-light shadow-sm text-dark rounded-3 ps-5"
                      placeholder="Enter ID or Name..."
                      value={filters.search}
                      onChange={e => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
                <div className="text-input-group">
                  <label className="small text-muted fw-bold mb-2 d-block text-uppercase ls-1">Assessment Type</label>
                  <select
                    className="form-select bg-light border-light shadow-sm text-dark rounded-3"
                    value={filters.exam}
                    onChange={e => setFilters({ ...filters, exam: e.target.value })}
                  >
                    <option value="All">All Examinations</option>
                    {uniqueExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="small text-muted fw-bold mb-2 d-block text-uppercase ls-1">From</label>
                    <input type="date" className="form-control bg-light border-light shadow-sm text-dark rounded-3 small"
                      value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                  </div>
                  <div className="col-6">
                    <label className="small text-muted fw-bold mb-2 d-block text-uppercase ls-1">To</label>
                    <input type="date" className="form-control bg-light border-light shadow-sm text-dark rounded-3 small"
                      value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                  </div>
                </div>
                <button className="btn btn-outline-secondary rounded-pill mt-2 shadow-sm" onClick={() => setFilters({ search: "", exam: "All", startDate: "", endDate: "" })}>
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="glass-panel rounded-4 border border-light overflow-hidden mb-5 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light text-muted small text-uppercase fw-bold">
                <tr>
                  <th className="ps-4 py-3">Identity</th>
                  <th className="py-3">Examination Name</th>
                  <th className="py-3">Attempt Date</th>
                  <th className="py-3 text-center">Score</th>
                  <th className="py-3">Evaluation</th>
                  <th className="pe-4 py-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {filteredResults.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 opacity-50">Zero records found matching filters</td></tr>
                ) : (
                  filteredResults.map(r => (
                    <tr key={r.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-xs bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">{r.studentName?.charAt(0)}</div>
                          <div>
                            <div className="fw-bold text-dark">{r.studentName}</div>
                            <div className="small text-muted">{r.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-dark fw-medium">{r.examName}</td>
                      <td className="text-muted small">{new Date(r.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="text-center fw-bold text-primary">{r.score}%</td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 ${r.passed ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-20' : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-20'}`}>
                          {r.passed ? "Passed" : "Not Qualified"}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        <button className="btn btn-icon-sm btn-light-hover">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`
        .bg-gray-5 { background: #f8fafc; }
        .glass-panel { background: #ffffff; backdrop-filter: blur(12px); transition: all 0.3s ease; }
        .max-w-1400 { max-width: 1400px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .avatar-xs { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; }
        .btn-icon-sm { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: #f1f5f9; border: 1px solid #e2e8f0; color: #64748b; }
        .btn-light-hover:hover { background: #e2e8f0; color: #0f172a; transform: translateY(-1px); }
        .ls-1 { letter-spacing: 0.05em; }
        .tracking-widest { letter-spacing: 0.1em; }
        .premium-btn { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: none; transition: all 0.3s; }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(99,102,241,0.3); }
        .hover-lift { transition: transform 0.2s; }
        .hover-lift:hover { transform: translateY(-2px); }
        @media print {
            body { background: white !important; color: black !important; }
            .btn, .glass-panel:has(.filter-reports), header .d-flex:has(button) { display: none !important; }
            .glass-panel { background: white !important; border: 1px solid #eee !important; color: black !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-3">
    <div className="glass-panel p-4 rounded-4 border border-light shadow-sm d-flex align-items-center gap-4 position-relative overflow-hidden" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="p-3 rounded-circle" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div>
        <div className="small text-muted fw-bold text-uppercase ls-1 mb-1" style={{ fontSize: '0.7rem' }}>{title}</div>
        <div className="h4 fw-bold mb-0 text-dark">{value}</div>
      </div>
    </div>
  </div>
);

export default ExamReports;
