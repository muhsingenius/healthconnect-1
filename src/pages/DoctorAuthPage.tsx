import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Stethoscope, Loader2, Shield, Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function DoctorAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, loading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    bio: '',
    licenseNumber: '',
    yearsOfExperience: '',
    affiliateHealthFacility: '',
    documents: [] as File[]
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Obstetrics & Gynecology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Surgery',
    'Urology',
    'Nutrition & Dietetics',
    'Other'
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/doctor-dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...validFiles].slice(0, 5) // Max 5 documents
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form
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
      if (!formData.specialization) {
        setError('Specialization is required');
        return;
      }
      if (!formData.licenseNumber.trim()) {
        setError('Medical license number is required');
        return;
      }
      if (!formData.yearsOfExperience.trim()) {
        setError('Years of experience is required');
        return;
      }
      if (!formData.affiliateHealthFacility.trim()) {
        setError('Affiliate health facility is required');
        return;
      }
      if (formData.documents.length === 0) {
        setError('Please upload at least one verification document');
        return;
      }

      // Create the account with doctor role metadata
      const result = await signUp(
        formData.email, 
        formData.password, 
        formData.name.trim(), 
        formData.phone.trim(),
        {
          role: 'doctor',
          specialization: formData.specialization,
          bio: formData.bio.trim(),
          licenseNumber: formData.licenseNumber.trim(),
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          isVerified: false, // Will be verified by admin
          affiliateHealthFacility: formData.affiliateHealthFacility.trim()
        }
      );

      if (!result.success) {
        setError(result.error || 'Failed to create doctor account');
      } else {
        // TODO: Upload documents to Supabase Storage
        // For now, we'll just show a success message
        navigate('/doctor-verification-pending');
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
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-medical-600 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Join as a Doctor
          </h2>
          <p className="mt-2 text-gray-600">
            Register your medical practice and start helping patients in your community
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Dr. John Smith"
                  disabled={isFormDisabled}
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="doctor@example.com"
                  disabled={isFormDisabled}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+233-XX-XXX-XXXX"
                  disabled={isFormDisabled}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                    disabled={isFormDisabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select your specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Medical License Number"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    required
                    placeholder="MD-2024-001"
                    disabled={isFormDisabled}
                  />

                  <Input
                    label="Years of Experience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    required
                    placeholder="5"
                    min="0"
                    max="50"
                    disabled={isFormDisabled}
                  />
                </div>

                <Input
                  label="Affiliate Health Facility"
                  type="text"
                  value={formData.affiliateHealthFacility}
                  onChange={(e) => setFormData({ ...formData, affiliateHealthFacility: e.target.value })}
                  required
                  placeholder="e.g., City General Hospital, Private Practice"
                  disabled={isFormDisabled}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell patients about your experience, expertise, and approach to healthcare..."
                    disabled={isFormDisabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Documents</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Documents (Required) *
                  </label>
                  <div className="space-y-3">
                    {/* Upload Button */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> verification documents
                          </p>
                          <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB (Max 5 files)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleDocumentUpload}
                          disabled={formData.documents.length >= 5 || isFormDisabled}
                        />
                      </label>
                    </div>

                    {/* Document Preview */}
                    {formData.documents.length > 0 && (
                      <div className="space-y-2">
                        {formData.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {file.type === 'application/pdf' ? (
                                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                    <span className="text-red-600 text-xs font-bold">PDF</span>
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                    <span className="text-blue-600 text-xs font-bold">IMG</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              disabled={isFormDisabled}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Required documents: Medical license, diploma, government ID, and any relevant certifications
                  </p>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                  disabled={isFormDisabled}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  placeholder="Confirm your password"
                  disabled={isFormDisabled}
                />
              </div>
            </div>

            {/* Verification Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Verification Process</h4>
                  <p className="text-sm text-blue-700">
                    Your account will be reviewed by our medical verification team. This process typically 
                    takes 2-3 business days. You'll receive an email notification once your account is verified 
                    and you can start practicing on our platform.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isFormDisabled}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Doctor Account...
                </>
              ) : (
                'Create Doctor Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have a doctor account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                disabled={isFormDisabled}
              >
                Sign in here
              </button>
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              By creating a doctor account, you agree to our Terms of Service, Privacy Policy, 
              and Medical Professional Code of Conduct. All information provided will be verified 
              before account activation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}