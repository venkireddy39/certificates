
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayOut';
import Loading from '../components/common/Loading';
import { useAuth } from '../pages/Library/context/AuthContext';
import {
  Edit3, ClipboardList, BarChart3, Calendar as CalendarIcon,
  MessageCircle, User as UserIcon, Award, LifeBuoy
} from 'lucide-react';

// Lazy Load Pages
const Home = lazy(() => import('../pages/Home/Home'));
const Batches = lazy(() => import('../pages/Batches/Batches'));
const Courses = lazy(() => import('../pages/Courses/Courses'));
const Webinar = lazy(() => import('../pages/Webinar/Webinar'));
const Exams = lazy(() => import('../pages/exam/Exams'));
const Marketing = lazy(() => import('../pages/Marketing/Marketing'));
const MyApp = lazy(() => import('../pages/MyApp/MyApp'));
const Websites = lazy(() => import('../pages/Websites/Websites'));
const Certificates = lazy(() => import('../pages/Certificates/CertificateModule'));
const Attendance = lazy(() => import('../pages/Attendance/Attendance'));
const Affiliates = lazy(() => import('../pages/Affiliates/Affiliates'));
const Users = lazy(() => import('../pages/Users/Users'));
const Settings = lazy(() => import('../pages/Settings/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));
const BatchBuilder = lazy(() => import('../pages/Batches/BatchBuilder'));
const CourseBuilder = lazy(() => import('../pages/Courses/CourseBuilder'));
const CourseOverview = lazy(() => import('../pages/Courses/CourseOverview'));
const CreateClass = lazy(() => import('../pages/Batches/CreateClass'));
const FeeManagement = lazy(() => import('../pages/FeeManagement/fee'));
const CreateFee = lazy(() => import('../pages/FeeManagement/CreateFee'));
const LibraryApp = lazy(() => import('../pages/Library/App'));
const AffiliateRegister = lazy(() => import('../pages/Affiliates/AffiliateRegister'));
const AffiliatePortal = lazy(() => import('../pages/Affiliates/AffiliatePortal'));
const StudentDashboard = lazy(() => import('../pages/Student/StudentDashboard'));
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const StudentCourses = lazy(() => import('../pages/Student/StudentCourses'));
const StudentBatches = lazy(() => import('../pages/Student/StudentBatches'));
const StudentAttendance = lazy(() => import('../pages/Student/StudentAttendance'));
const StudentLibrary = lazy(() => import('../pages/Student/StudentLibrary'));
const LearningContent = lazy(() => import('../pages/Student/LearningContent'));
const StudentLayout = lazy(() => import('../components/layout/StudentLayout'));
const StudentPagePlaceholder = lazy(() => import('../pages/Student/components/StudentPagePlaceholder'));
const StudentCommunication = lazy(() => import('../pages/Student/StudentCommunication'));
const StudentHostel = lazy(() => import('../pages/Student/StudentHostel'));
const StudentTransport = lazy(() => import('../pages/Student/StudentTransport'));

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (user?.role === 'STUDENT') {
    return <Navigate to="/student/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/course-overview/:id" element={<CourseOverview />} />
        <Route path="/share/:shareCode" element={<CourseOverview />} />
        <Route path="/affiliate/join" element={<AffiliateRegister />} />

        {/* ================= STUDENT PORTAL (VERTICAL LAYOUT) ================= */}
        <Route element={<StudentLayout />}>
          <Route path="/student">
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="batches" element={<StudentBatches />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="library" element={<StudentLibrary />} />
            <Route path="content" element={<LearningContent />} />
            <Route path="exams" element={<StudentPagePlaceholder title="Exams" description="View your upcoming and past examinations." icon={Edit3} />} />
            <Route path="assignments" element={<StudentPagePlaceholder title="Assignments" description="Track and submit your course assignments." icon={ClipboardList} />} />
            <Route path="grades" element={<StudentPagePlaceholder title="Grades" description="Monitor your academic performance." icon={BarChart3} />} />
            <Route path="calendar" element={<StudentPagePlaceholder title="Calendar" description="Your personal academic schedule." icon={CalendarIcon} />} />
            <Route path="communication" element={<StudentCommunication />} />
            <Route path="hostel" element={<StudentHostel />} />
            <Route path="transport" element={<StudentTransport />} />
            <Route path="profile" element={<StudentPagePlaceholder title="My Profile" description="Manage your personal information." icon={UserIcon} />} />
            <Route path="certificates" element={<StudentPagePlaceholder title="Certificates" description="View earned certificates and achievements." icon={Award} />} />
            <Route path="support" element={<StudentPagePlaceholder title="Support" description="Get help with your learning journey." icon={LifeBuoy} />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* ================= ADMIN/GENERAL DASHBOARD ROUTES ================= */}
        <Route element={<DashboardLayout />}>

          {/* 🔴 ROLE-AWARE ROOT REDIRECT */}
          <Route path="/" element={<RootRedirect />} />

          {/* ✅ REAL DASHBOARD ROUTE */}
          <Route path="/dashboard" element={<Home />} />

          {/* ... existing routes ... */}

          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/affiliate/portal" element={<AffiliatePortal />} />
          <Route path="/academics">
            <Route index element={<Navigate to="/courses" replace />} />
            <Route path="courses" element={<Navigate to="/courses" replace />} />
            <Route path="batches" element={<Navigate to="/batches" replace />} />
            <Route path="webinars" element={<Navigate to="/webinar" replace />} />
            <Route path="attendance" element={<Navigate to="/attendance" replace />} />
            <Route path="certificates" element={<Navigate to="/certificates" replace />} />
          </Route>

          {/* ===== ORIGINAL MODULE ROUTES ===== */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/builder/:id" element={<CourseBuilder />} />
          <Route path="/courses/*" element={<Navigate to="/courses" replace />} />

          <Route path="/batches" element={<Batches />} />
          <Route path="/batches/builder/:id" element={<BatchBuilder />} />
          <Route path="/batches/:id/create-class" element={<CreateClass />} />

          <Route path="/webinar/*" element={<Webinar />} />
          <Route path="/attendance/*" element={<Attendance />} />
          <Route path="/certificates" element={<Certificates />} />

          {/* ===== FINANCE ===== */}
          <Route path="/fee" element={<FeeManagement />} />
          <Route path="/fee/create" element={<CreateFee />} />

          {/* ===== LIBRARY ===== */}
          <Route path="/library/*" element={<LibraryApp />} />

          {/* ===== USERS ===== */}
          <Route path="/users/*" element={<Users />} />

          {/* ===== EXAMS ===== */}
          <Route path="/exams/*" element={<Exams />} />

          {/* ===== OTHER MODULES ===== */}
          <Route path="/marketing" element={<Marketing />} />

          <Route path="/myapp" element={<MyApp />} />
          <Route path="/websites" element={<Websites />} />
          <Route path="/settings" element={<Settings />} />

          {/* ===== 404 ===== */}
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
