import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, loading, isAuthenticated } = useAuth();
  
  const isLogin = location.pathname === '/login';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/feed');
    }
  }, [isAuthenticated, loading, navigate]);

  // Reset form state when switching between login/signup
  useEffect(() => {
    setError('');
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    });
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password);
        if (!result.success) {
          setError(result.error || 'Invalid email or password');
        }
      } else {
        // Validate signup form
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }
        if (!formData.name.trim()) {
          setError('Full name is required');
          return;
        }
        if (!formData.phone.trim()) {
          setError('Phone number is required');
          return;
        }
        
        const result = await signUp(formData.email, formData.password, formData.name.trim(), formData.phone.trim());
        if (!result.success) {
          setError(result.error || 'Failed to create account');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = loading || isSubmitting;

  // Show loading if we're checking authentication status
  if (loading && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-medical-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-medical-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Join HealthConnect'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Sign in to your patient account' : 'Create your patient account to get started'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                  disabled={isFormDisabled}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="Enter your phone number"
                  disabled={isFormDisabled}
                />
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
              disabled={isFormDisabled}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter your password"
              disabled={isFormDisabled}
            />

            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Confirm your password"
                disabled={isFormDisabled}
              />
            )}

            {!isLogin && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Patient Account</h4>
                    <p className="text-sm text-blue-700">
                      You're creating a patient account. This will allow you to ask health questions, 
                      book consultations with verified doctors, and access our health community.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isFormDisabled}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Patient Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => navigate(isLogin ? '/signup' : '/login')}
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                disabled={isFormDisabled}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {!isLogin && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy. 
                All health information shared on this platform is confidential and secure.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}