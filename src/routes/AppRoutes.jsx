
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayOut';
import Loading from '../components/common/Loading';

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
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/course-overview/:id" element={<CourseOverview />} />
        <Route path="/share/:shareCode" element={<CourseOverview />} />
        <Route path="/affiliate/join" element={<AffiliateRegister />} />

        {/* ================= DASHBOARD ROUTES ================= */}
        <Route element={<DashboardLayout />}>

          {/* 🔴 FIX: ROOT NEVER RENDERS UI */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

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
