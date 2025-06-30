import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Stethoscope, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function Header() {
  const { user, signOut, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HealthConnect</span>
          </Link>

          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/feed" className="text-gray-600 hover:text-gray-900 transition-colors">
                Q&A Feed
              </Link>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>

              <Link to={user?.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              </Link>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/">
                 <img
                src="https://github.com/kickiniteasy/bolt-hackathon-badge/blob/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.png?raw=true"
                alt="Doctor consultation"
                className=" w-16"
              />
              </Link>
              <Link to="/doctor-signup" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 mr-1" />
                  Join as a Doctor
                </div>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}