import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, MessageCircle, ThumbsUp, Eye, Clock, Send, ArrowLeft, Shield, Edit } from 'lucide-react';
import { Question } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AnswerCard } from '../components/questions/AnswerCard';
import { EditQuestionModal } from '../components/questions/EditQuestionModal';
import { QuestionService } from '../services/questionService';
import { useAuth } from '../context/AuthContext';

export function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(0);
  const [hasUserUpvoted, setHasUserUpvoted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuestion();
    }
  }, [id]);

  const loadQuestion = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const result = await QuestionService.getQuestionById(id);
    if (result.success && result.question) {
      setQuestion(result.question);
      setCurrentUpvotes(result.question.upvotes);
      setHasUserUpvoted(result.question.hasUserUpvoted || false);
    } else {
      setError(result.error || 'Failed to load question');
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleQuestionUpvote = async () => {
    if (!user || !question) return;

    // Optimistic update
    const newHasUpvoted = !hasUserUpvoted;
    const newUpvoteCount = newHasUpvoted ? currentUpvotes + 1 : currentUpvotes - 1;
    
    setHasUserUpvoted(newHasUpvoted);
    setCurrentUpvotes(newUpvoteCount);

    try {
      const result = await QuestionService.toggleQuestionUpvote(question.id);
      
      if (!result.success) {
        // Revert optimistic update on error
        setHasUserUpvoted(!newHasUpvoted);
        setCurrentUpvotes(currentUpvotes);
        console.error('Failed to toggle question upvote:', result.error);
      }
    } catch (error) {
      // Revert optimistic update on error
      setHasUserUpvoted(!newHasUpvoted);
      setCurrentUpvotes(currentUpvotes);
      console.error('Error toggling question upvote:', error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim() || !user || !question) return;

    setSubmittingAnswer(true);
    try {
      const result = await QuestionService.createAnswer({
        content: answerContent.trim(),
        questionId: question.id
      });

      if (result.success) {
        setAnswerContent('');
        // Reload the question to show the new answer
        await loadQuestion();
      } else {
        console.error('Failed to create answer:', result.error);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleEditSave = async () => {
    await loadQuestion();
    setShowEditModal(false);
  };

  const canEditQuestion = user && question && user.id === question.authorId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Question not found'}</p>
          <Button onClick={() => navigate('/feed')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/feed">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
        </div>

        {/* Question Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight flex-1 mr-4">
                {question.title}
              </h1>
              {canEditQuestion && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                  className="flex-shrink-0"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">{question.category}</Badge>
              {question.tags.map(tag => (
                <Badge key={tag} variant="neutral">#{tag}</Badge>
              ))}
              {question.isAnonymous && (
                <Badge variant="warning">Anonymous</Badge>
              )}
              {!question.isPublic && (
                <Badge variant="error">Private</Badge>
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Asked {formatDate(question.createdAt)}
              </span>
              <span>by {question.isAnonymous ? 'Anonymous' : question.authorName}</span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {question.views} view{question.views !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
              {question.content}
            </p>
          </div>

          {/* Display All Images */}
          {question.imageUrls && question.imageUrls.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Attached Images:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {question.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Question attachment ${index + 1}`}
                    className="rounded-lg border border-gray-200 max-h-64 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(url, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Question Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuestionUpvote}
                disabled={!user}
                className={`flex items-center ${hasUserUpvoted ? 'text-primary-600' : ''}`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {currentUpvotes} Upvote{currentUpvotes !== 1 ? 's' : ''}
              </Button>
              <span className="flex items-center text-sm text-gray-500">
                <MessageCircle className="h-4 w-4 mr-1" />
                {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Answer Input */}
        {user?.role === 'doctor' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-medical-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Provide Medical Advice</h2>
            </div>
            <div className="space-y-4">
              <textarea
                placeholder="Provide your professional medical advice here. Be thorough and consider mentioning when the patient should seek in-person care..."
                rows={6}
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                disabled={submittingAnswer}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Your response will be marked as verified medical advice
                </p>
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={!answerContent.trim() || submittingAnswer}
                >
                  {submittingAnswer ? (
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
        )}

        {/* Answers Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.answers.length === 0 ? 'No Answers Yet' : 
             `${question.answers.length} Answer${question.answers.length !== 1 ? 's' : ''}`}
          </h2>

          {question.answers.length > 0 ? (
            <div className="space-y-6">
              {question.answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No answers yet</h3>
              <p className="text-gray-500 mb-4">
                Be the first to help answer this question and provide valuable insights to the community.
              </p>
              {user?.role === 'doctor' && (
                <p className="text-sm text-gray-400">
                  Use the form above to provide your professional medical advice.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Edit Question Modal */}
        {showEditModal && question && (
          <EditQuestionModal
            question={question}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditSave}
          />
        )}
      </div>
    </div>
  );
}