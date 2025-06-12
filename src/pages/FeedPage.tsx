import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, TrendingUp, Upload, X, Loader2 } from 'lucide-react';
import { QuestionCard } from '../components/questions/QuestionCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Question } from '../types';
import { QuestionService } from '../services/questionService';
import { useAuth } from '../context/AuthContext';

export function FeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const categories = ['All', 'General Medicine', 'Diabetes', 'Nutrition', 'Preventive Care', 'Mental Health'];

  // Load questions on component mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const result = await QuestionService.getQuestions();
    if (result.success && result.questions) {
      setQuestions(result.questions);
    } else {
      console.error('Failed to load questions:', result.error);
    }
    setLoading(false);
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpvote = async (questionId: string) => {
    if (!user) return;

    // Optimistic update
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            upvotes: q.hasUserUpvoted ? q.upvotes - 1 : q.upvotes + 1, 
            hasUserUpvoted: !q.hasUserUpvoted 
          }
        : q
    ));

    const result = await QuestionService.toggleQuestionUpvote(questionId);
    if (!result.success) {
      // Revert optimistic update on error
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              upvotes: q.hasUserUpvoted ? q.upvotes + 1 : q.upvotes - 1, 
              hasUserUpvoted: !q.hasUserUpvoted 
            }
          : q
      ));
      console.error('Failed to toggle upvote:', result.error);
    }
  };

  const handleAnswerClick = (questionId: string) => {
    navigate(`/questions/${questionId}`);
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
        await loadQuestions();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Q&A Community</h1>
            <p className="text-gray-600">Ask questions, share knowledge, and learn from medical experts</p>
          </div>
          <Button onClick={() => setShowAskModal(true)} className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['#diabetes', '#hypertension', '#mental-health', '#nutrition', '#covid19', '#pregnancy'].map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm cursor-pointer hover:bg-primary-100 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Questions Feed */}
        <div className="space-y-6">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                onUpvote={handleUpvote}
                onQuestionUpdate={loadQuestions}
                thumbnailUrl={question.imageUrls && question.imageUrls.length > 0 ? question.imageUrls[0] : undefined}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No questions found matching your criteria.</p>
              <Button onClick={() => setShowAskModal(true)} className="mt-4">
                Be the first to ask!
              </Button>
            </div>
          )}
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
                    {categories.filter(cat => cat !== 'All').map(category => (
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