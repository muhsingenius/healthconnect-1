import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomeRedirector } from './components/HomeRedirector';
import { AuthPage } from './pages/AuthPage';
import { DoctorAuthPage } from './pages/DoctorAuthPage';
import { DoctorVerificationPending } from './pages/DoctorVerificationPending';
import { FeedPage } from './pages/FeedPage';
import { QuestionDetailPage } from './pages/QuestionDetailPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { ProfileEditPage } from './pages/ProfileEditPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomeRedirector />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/doctor-signup" element={<DoctorAuthPage />} />
              <Route path="/doctor-verification-pending" element={<DoctorVerificationPending />} />
              
              <Route path="/feed" element={
                <ProtectedRoute>
                  <FeedPage />
                </ProtectedRoute>
              } />

              <Route path="/questions/:id" element={
                <ProtectedRoute>
                  <QuestionDetailPage />
                </ProtectedRoute>
              } />
              
              <Route path="/patient-dashboard" element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              } />

              <Route path="/doctor-dashboard" element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />

              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <ProfileEditPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;