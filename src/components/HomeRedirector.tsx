import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LandingPage } from '../pages/LandingPage';

export function HomeRedirector() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're not loading and user is authenticated
    if (!loading && isAuthenticated && user) {
      // Role-based redirection
      if (user.role === 'doctor') {
        navigate('/doctor-dashboard', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        // Default to feed for patients and other roles
        navigate('/feed', { replace: true });
      }
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the landing page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // This should rarely be reached due to the useEffect redirect,
  // but provides a fallback loading state during navigation
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}