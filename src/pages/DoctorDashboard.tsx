import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, Star, Users, Shield, CheckCircle, Loader2, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { Question } from '../types';
import { QuestionService } from '../services/questionService';

export function DoctorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [answerContent, setAnswerContent] = useState<{ [key: string]: string }>({});
  const [submittingAnswers, setSubmittingAnswers] = useState<{ [key: string]: boolean }>({});

  const tabs = [
    { id: 'questions', label: 'Unanswered Questions', icon: MessageCircle },
    { id: 'consultations', label: 'Consultations', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  // Load unanswered questions on component mount
  useEffect(() => {
    loadUnansweredQuestions();
  }, []);

  const loadUnansweredQuestions = async () => {
    setLoadingQuestions(true);
    const result = await QuestionService.getUnansweredQuestions();
    if (result.success && result.questions) {
      setQuestions(result.questions);
    } else {
      console.error('Failed to load unanswered questions:', result.error);
    }
    setLoadingQuestions(false);
  };

  const handleSubmitAnswer = async (questionId: string) => {
    const content = answerContent[questionId]?.trim();
    if (!content) return;

    setSubmittingAnswers(prev => ({ ...prev, [questionId]: true }));

    try {
      const result = await QuestionService.createAnswer({
        content,
        questionId
      });

      if (result.success) {
        // Clear the answer content for this question
        setAnswerContent(prev => ({ ...prev, [questionId]: '' }));
        
        // Reload questions to reflect the newly answered question
        await loadUnansweredQuestions();
      } else {
        console.error('Failed to create answer:', result.error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmittingAnswers(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handleAnswerContentChange = (questionId: string, content: string) => {
    setAnswerContent(prev => ({ ...prev, [questionId]: content }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'D'}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  {user?.verified && (
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-medical-600 mr-1" />
                      <Badge variant="success">Verified Doctor</Badge>
                    </div>
                  )}
                </div>
                <p className="text-gray-600">{user?.specialization}</p>
                {user?.bio && (
                  <p className="text-sm text-gray-500 mt-1 max-w-2xl">{user.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{questions.length}</h3>
                <p className="text-gray-600">Pending Questions</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">147</h3>
                <p className="text-gray-600">Questions Answered</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">8</h3>
                <p className="text-gray-600">Consultations Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">4.9</h3>
                <p className="text-gray-600">Average Rating</p>
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
                  <h2 className="text-lg font-semibold text-gray-900">Questions Awaiting Your Response</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadUnansweredQuestions}
                    disabled={loadingQuestions}
                  >
                    {loadingQuestions ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Refresh
                  </Button>
                </div>

                {loadingQuestions ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading questions...</p>
                  </div>
                ) : questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{question.title}</h3>
                            <p className="text-gray-600 mb-3 leading-relaxed">{question.content}</p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="primary">{question.category}</Badge>
                              {question.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="neutral">#{tag}</Badge>
                              ))}
                            </div>
                            <div className="text-sm text-gray-500">
                              Asked by {question.isAnonymous ? 'Anonymous' : question.authorName} • 
                              {formatDate(question.createdAt)} • 
                              {question.upvotes} upvote{question.upvotes !== 1 ? 's' : ''} • 
                              {question.views} view{question.views !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Medical Response
                          </label>
                          <textarea
                            placeholder="Provide your professional medical advice here. Be thorough and consider mentioning when the patient should seek in-person care..."
                            rows={6}
                            value={answerContent[question.id] || ''}
                            onChange={(e) => handleAnswerContentChange(question.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                            disabled={submittingAnswers[question.id]}
                          />
                          <div className="flex justify-between items-center mt-3">
                            <p className="text-xs text-gray-500">
                              Your response will be marked as verified medical advice
                            </p>
                            <div className="flex space-x-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={submittingAnswers[question.id]}
                              >
                                Save Draft
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleSubmitAnswer(question.id)}
                                disabled={!answerContent[question.id]?.trim() || submittingAnswers[question.id]}
                              >
                                {submittingAnswers[question.id] ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Submit Answer
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-500 mb-4">There are no unanswered questions at the moment.</p>
                    <p className="text-sm text-gray-400">
                      Great job helping the community. Check back later for new questions.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'consultations' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Consultations</h2>
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      patient: 'John D.',
                      time: '09:00 AM',
                      duration: '30 min',
                      status: 'completed',
                      fee: '$50'
                    },
                    {
                      id: '2',
                      patient: 'Sarah M.',
                      time: '10:30 AM',
                      duration: '45 min',
                      status: 'in-progress',
                      fee: '$75'
                    },
                    {
                      id: '3',
                      patient: 'Mike R.',
                      time: '02:00 PM',
                      duration: '30 min',
                      status: 'scheduled',
                      fee: '$50'
                    }
                  ].map((consultation) => (
                    <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{consultation.patient}</h3>
                          <p className="text-sm text-gray-600">{consultation.time} • {consultation.duration}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">{consultation.fee}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                            consultation.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {consultation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Doctor Profile</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      value={user?.specialization || ''}
                     onChange={() => {}} // Read-only field
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                     placeholder="e.g., General Medicine, Cardiology, Pediatrics"
                     readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                    <textarea
                      rows={4}
                      value={user?.bio || ''}
                     onChange={() => {}} // Read-only field
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell patients about your experience, expertise, and approach to healthcare..."
                     readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        placeholder="50"
                       onChange={() => {}} // Read-only field
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                       readOnly
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Verification Status</h4>
                        <p className="text-sm text-blue-700">
                          {user?.verified 
                            ? 'Your account is verified. Patients can see the verified badge on your responses.'
                            : 'Your account is pending verification. Submit your medical credentials to get verified.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button>Update Profile</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}