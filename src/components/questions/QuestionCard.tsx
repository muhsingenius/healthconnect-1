import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Eye, Clock, Send, Loader2, ChevronDown, ChevronUp, Image } from 'lucide-react';
import { Question } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AnswerCard } from './AnswerCard';
import { QuestionService } from '../../services/questionService';
import { useAuth } from '../../context/AuthContext';

interface QuestionCardProps {
  question: Question;
  onUpvote: (questionId: string) => void;
  onQuestionUpdate?: () => void;
  thumbnailUrl?: string;
}

export function QuestionCard({ question, onUpvote, onQuestionUpdate, thumbnailUrl }: QuestionCardProps) {
  const { user } = useAuth();
  const [showAnswers, setShowAnswers] = useState(false);
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim() || !user) return;

    setSubmittingAnswer(true);
    try {
      const result = await QuestionService.createAnswer({
        content: answerContent.trim(),
        questionId: question.id
      });

      if (result.success) {
        setAnswerContent('');
        setShowAnswerInput(false);
        if (onQuestionUpdate) {
          onQuestionUpdate();
        }
      } else {
        console.error('Failed to create answer:', result.error);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link to={`/questions/${question.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer transition-colors">
              {question.title}
            </h3>
          </Link>
          <p className="text-gray-600 mb-3 line-clamp-3">{question.content}</p>
          
          {/* Display thumbnail image if available */}
          {thumbnailUrl && (
            <div className="mb-3">
              <img
                src={thumbnailUrl}
                alt="Question attachment"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              {question.imageUrls && question.imageUrls.length > 1 && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Image className="h-4 w-4 mr-1" />
                  +{question.imageUrls.length - 1} more image{question.imageUrls.length - 1 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="primary">{question.category}</Badge>
        {question.tags.map(tag => (
          <Badge key={tag} variant="neutral">#{tag}</Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(question.createdAt)}
          </span>
          <span>by {question.isAnonymous ? 'Anonymous' : question.authorName}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {question.views}
            </span>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {question.answers.length}
              {showAnswers ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpvote(question.id)}
              className={`flex items-center ${question.hasUserUpvoted ? 'text-primary-600' : ''}`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {question.upvotes}
            </Button>
            
            {user?.role === 'doctor' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswerInput(!showAnswerInput)}
              >
                Answer
              </Button>
            )}

            <Link to={`/questions/${question.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Answer Input Field for Doctors */}
      {showAnswerInput && user?.role === 'doctor' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <textarea
              placeholder="Provide your professional medical advice here..."
              rows={4}
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              disabled={submittingAnswer}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Your response will be marked as verified medical advice
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAnswerInput(false)}
                  disabled={submittingAnswer}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
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
        </div>
      )}

      {/* Answers Section */}
      {showAnswers && question.answers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
          </h4>
          <div className="space-y-4">
            {question.answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Answers Message */}
      {showAnswers && question.answers.length === 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-center py-6">
            <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No answers yet</p>
            <p className="text-gray-400 text-xs">Be the first to help answer this question</p>
          </div>
        </div>
      )}
    </div>
  );
}