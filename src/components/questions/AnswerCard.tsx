import React, { useState } from 'react';
import { ThumbsUp, Shield } from 'lucide-react';
import { Answer } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QuestionService } from '../../services/questionService';
import { useAuth } from '../../context/AuthContext';

interface AnswerCardProps {
  answer: Answer;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  const { user } = useAuth();
  const [currentUpvotes, setCurrentUpvotes] = useState(answer.upvotes);
  const [hasUserUpvoted, setHasUserUpvoted] = useState(answer.hasUserUpvoted || false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleUpvote = async () => {
    if (!user || isUpvoting) return;

    setIsUpvoting(true);

    // Optimistic update
    const newHasUpvoted = !hasUserUpvoted;
    const newUpvoteCount = newHasUpvoted ? currentUpvotes + 1 : currentUpvotes - 1;
    
    setHasUserUpvoted(newHasUpvoted);
    setCurrentUpvotes(newUpvoteCount);

    try {
      const result = await QuestionService.toggleAnswerUpvote(answer.id);
      
      if (result.success) {
        // If we got the actual count from the server, use it
        if (result.newUpvoteCount !== undefined) {
          setCurrentUpvotes(result.newUpvoteCount);
        }
      } else {
        // Revert optimistic update on error
        setHasUserUpvoted(!newHasUpvoted);
        setCurrentUpvotes(currentUpvotes);
        console.error('Failed to toggle answer upvote:', result.error);
      }
    } catch (error) {
      // Revert optimistic update on error
      setHasUserUpvoted(!newHasUpvoted);
      setCurrentUpvotes(currentUpvotes);
      console.error('Error toggling answer upvote:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {answer.authorName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">{answer.authorName}</h4>
              {answer.isVerified && (
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-medical-600" />
                  <Badge variant="success" size="sm">Verified Doctor</Badge>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(answer.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{answer.content}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          This answer was helpful to many users
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUpvote}
          disabled={!user || isUpvoting}
          className={`flex items-center ${hasUserUpvoted ? 'text-primary-600' : ''}`}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          {currentUpvotes}
        </Button>
      </div>
    </div>
  );
}