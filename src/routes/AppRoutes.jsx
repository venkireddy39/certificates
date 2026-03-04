import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

const Certificates = lazy(() => import('../pages/Certificates/CertificateModule'));
const PublicVerificationPage = lazy(() => import('../pages/Certificates/PublicVerificationPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>}>
      <Routes>
        <Route path="/verify/:id" element={<PublicVerificationPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/certificates" replace />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="*" element={<Navigate to="/admin/certificates" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/certificates" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
