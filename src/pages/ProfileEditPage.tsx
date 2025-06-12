import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfileService, UpdateProfileData } from '../services/profileService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ProfileEditPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Debug logs for initial state
  console.log('ProfileEditPage - Initial state:', { loading, saving, user: user?.name });

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    specialization: '',
    affiliate_health_facility: ''
  });

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

  useEffect(() => {
    if (user) {
      console.log('ProfileEditPage - User found, loading profile for:', user.name);
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    console.log('ProfileEditPage - loadProfile started');
    setLoading(true);
    const result = await ProfileService.getProfile(user.id);
    
    if (result.success && result.profile) {
      console.log('ProfileEditPage - Profile loaded successfully:', result.profile);
      setFormData({
        full_name: result.profile.full_name || '',
        phone: result.profile.phone || '',
        bio: result.profile.bio || '',
        specialization: result.profile.specialization || '',
        affiliate_health_facility: result.profile.affiliate_health_facility || ''
      });
    } else {
      console.log('ProfileEditPage - Failed to load profile:', result.error);
      setError(result.error || 'Failed to load profile');
    }
    
    console.log('ProfileEditPage - loadProfile completed, loading set to false');
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProfileEditPage - handleSubmit started');
    if (!user) return;

    setError('');
    setSuccess('');
    console.log('ProfileEditPage - Setting saving to true');
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.full_name.trim()) {
        setError('Full name is required');
        return;
      }

      if (user.role === 'doctor') {
        if (!formData.specialization) {
          setError('Specialization is required for doctors');
          return;
        }
        if (!formData.affiliate_health_facility.trim()) {
          setError('Affiliate health facility is required for doctors');
          return;
        }
      }

      const updateData: UpdateProfileData = {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        bio: formData.bio.trim() || null,
      };

      // Add doctor-specific fields
      if (user.role === 'doctor') {
        updateData.specialization = formData.specialization;
        updateData.affiliate_health_facility = formData.affiliate_health_facility.trim();
      }

      console.log('ProfileEditPage - Calling ProfileService.updateProfile with:', updateData);
      const result = await ProfileService.updateProfile(user.id, updateData);
      console.log('ProfileEditPage - ProfileService.updateProfile result:', result);

      if (result.success) {
        setSuccess('Profile updated successfully!');
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          navigate('/doctor-dashboard');
        }, 1500);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      console.log('ProfileEditPage - Setting saving to false');
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    console.log('ProfileEditPage - handleInputChange called:', { field, value, currentSaving: saving });
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  if (loading) {
    console.log('ProfileEditPage - Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  console.log('ProfileEditPage - Rendering form with formData:', formData);
  console.log('ProfileEditPage - Current saving state:', saving);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/doctor-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600">Update your professional information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name *"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                  placeholder="Dr. John Smith"
                  disabled={saving}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+233-XX-XXX-XXXX"
                  disabled={saving}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Tell patients about your experience, expertise, and approach to healthcare..."
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Doctor-specific fields */}
            {user?.role === 'doctor' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      required
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select your specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Affiliate Health Facility *"
                    type="text"
                    value={formData.affiliate_health_facility}
                    onChange={(e) => handleInputChange('affiliate_health_facility', e.target.value)}
                    required
                    placeholder="e.g., City General Hospital, Private Practice"
                    disabled={saving}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/doctor-dashboard')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}