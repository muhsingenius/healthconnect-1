import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MessageCircle, User, Settings, Heart, Loader2, Upload, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { Question } from '../types';
import { QuestionService } from '../services/questionService';

export function PatientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    title: '',
    content: '',
    category: 'General Medicine',
    isAnonymous: false,
    isPublic: true,
    images: [] as File[]
  });

  const categories = ['General Medicine', 'Diabetes', 'Nutrition', 'Preventive Care', 'Mental Health', 'Cardiology', 'Dermatology', 'Pediatrics', 'Women\'s Health', 'Other'];

  const tabs = [
    { id: 'questions', label: 'My Questions', icon: MessageCircle },
    { id: 'bookings', label: 'Consultations', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Load user's questions on component mount
  useEffect(() => {
    loadUserQuestions();
  }, []);

  const loadUserQuestions = async () => {
    if (!user) return;
    
    setLoading(true);
    const result = await QuestionService.getUserQuestions();
    if (result.success && result.questions) {
      setMyQuestions(result.questions);
    } else {
      console.error('Failed to load user questions:', result.error);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (question: Question) => {
    if (question.answers.length === 0) {
      return <Badge variant="warning">No Answers</Badge>;
    } else if (question.answers.some(a => a.isVerified)) {
      return <Badge variant="success">Answered by Doctor</Badge>;
    } else {
      return <Badge variant="neutral">{question.answers.length} Answer{question.answers.length > 1 ? 's' : ''}</Badge>;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    setQuestionForm(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 3) // Max 3 images
    }));
  };

  const removeImage = (index: number) => {
    setQuestionForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setQuestionForm({
      title: '',
      content: '',
      category: 'General Medicine',
      isAnonymous: false,
      isPublic: true,
      images: []
    });
  };

  const handleSubmitQuestion = async () => {
    if (!user) return;

    setSubmitting(true);
    
    try {
      const result = await QuestionService.createQuestion({
        title: questionForm.title.trim(),
        content: questionForm.content.trim(),
        category: questionForm.category,
        tags: [], // TODO: Extract tags from content or add tag input
        isAnonymous: questionForm.isAnonymous,
        isPublic: questionForm.isPublic,
        images: questionForm.images // Pass the File objects directly
      });

      if (result.success) {
        // Reload questions to show the new one
        await loadUserQuestions();
        resetForm();
        setShowAskModal(false);
      } else {
        console.error('Failed to create question:', result.error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600">Manage your health questions and consultations</p>
              </div>
            </div>
            <Button onClick={() => setShowAskModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ask New Question
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{myQuestions.length}</h3>
                <p className="text-gray-600">Questions Asked</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">2</h3>
                <p className="text-gray-600">Upcoming Consultations</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {myQuestions.reduce((total, q) => total + q.answers.length, 0)}
                </h3>
                <p className="text-gray-600">Total Answers Received</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'questions' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">My Health Questions</h2>
                  <Button size="sm" onClick={() => setShowAskModal(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ask Question
                  </Button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your questions...</p>
                  </div>
                ) : myQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {myQuestions.map((question) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">{question.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.content}</p>
                          </div>
                          <div className="ml-4">
                            {getStatusBadge(question)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="primary">{question.category}</Badge>
                          {question.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="neutral">#{tag}</Badge>
                          ))}
                          {question.isAnonymous && (
                            <Badge variant="warning">Anonymous</Badge>
                          )}
                          {!question.isPublic && (
                            <Badge variant="error">Private</Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>{question.answers.length} answer{question.answers.length !== 1 ? 's' : ''}</span>
                            <span>{question.upvotes} upvote{question.upvotes !== 1 ? 's' : ''}</span>
                            <span>{question.views} view{question.views !== 1 ? 's' : ''}</span>
                          </div>
                          <span>Asked {formatDate(question.createdAt)}</span>
                        </div>

                        {/* Show all answers - Full display */}
                        {question.answers.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Answers:</h4>
                            <div className="space-y-3">
                              {question.answers.map((answer) => (
                                <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-900">{answer.authorName}</span>
                                      {answer.isVerified && (
                                        <Badge variant="success" size="sm">Verified Doctor</Badge>
                                      )}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(answer.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">{answer.content}</p>
                                  <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-gray-500">
                                      {answer.upvotes} upvote{answer.upvotes !== 1 ? 's' : ''}
                                    </span>
                                    <div className="text-xs text-gray-400">
                                      {answer.authorRole === 'doctor' ? 'Medical Professional' : 'Community Member'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">You haven't asked any questions yet.</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Start by asking your first health question to get expert advice from our community.
                    </p>
                    <Button onClick={() => setShowAskModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ask Your First Question
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Consultations</h2>
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      doctor: 'Dr. Sarah Johnson',
                      specialty: 'General Medicine',
                      date: '2024-01-20',
                      time: '10:00 AM',
                      status: 'scheduled'
                    },
                    {
                      id: '2',
                      doctor: 'Dr. Michael Chen',
                      specialty: 'Cardiology',
                      date: '2024-01-25',
                      time: '2:30 PM',
                      status: 'scheduled'
                    }
                  ].map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{booking.doctor}</h3>
                          <p className="text-sm text-gray-600">{booking.specialty}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={user?.phone || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ask Question Modal */}
        {showAskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Ask a Health Question</h3>
              <div className="space-y-4">
                <Input 
                  label="Question Title" 
                  placeholder="What would you like to know?"
                  value={questionForm.title}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, title: e.target.value }))}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={questionForm.category}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Details</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={6}
                    placeholder="Provide more details about your question..."
                    value={questionForm.content}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Images (Optional)
                  </label>
                  <div className="space-y-3">
                    {/* Upload Button */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB (Max 3 images)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={questionForm.images.length >= 3}
                        />
                      </label>
                    </div>

                    {/* Image Preview */}
                    {questionForm.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {questionForm.images.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Images help doctors better understand your condition. Only upload relevant medical images.
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={questionForm.isAnonymous}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    />
                    <span className="text-sm">Post anonymously</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={questionForm.isPublic}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                    />
                    <span className="text-sm">Make public</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setShowAskModal(false);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitQuestion}
                  disabled={!questionForm.title.trim() || !questionForm.content.trim() || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Question'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}