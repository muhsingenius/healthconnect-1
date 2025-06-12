import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Save } from 'lucide-react';
import { Question } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { QuestionService } from '../../services/questionService';

interface EditQuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditQuestionModal({ question, isOpen, onClose, onSave }: EditQuestionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    isAnonymous: false,
    isPublic: true,
    newImages: [] as File[],
    imagesToDelete: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'General Medicine',
    'Diabetes',
    'Nutrition',
    'Preventive Care',
    'Mental Health',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Women\'s Health',
    'Other'
  ];

  // Initialize form data when question changes
  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title,
        content: question.content,
        category: question.category,
        tags: [...question.tags],
        isAnonymous: question.isAnonymous,
        isPublic: question.isPublic,
        newImages: [],
        imagesToDelete: []
      });
      setTagInput('');
      setError('');
    }
  }, [question]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...validFiles].slice(0, 3) // Max 3 new images
    }));
  };

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
  };

  const markImageForDeletion = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imagesToDelete: [...prev.imagesToDelete, imageUrl]
    }));
  };

  const unmarkImageForDeletion = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imagesToDelete: prev.imagesToDelete.filter(url => url !== imageUrl)
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        setError('Title is required');
        return;
      }
      if (!formData.content.trim()) {
        setError('Content is required');
        return;
      }

      const result = await QuestionService.updateQuestion(question.id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags,
        isAnonymous: formData.isAnonymous,
        isPublic: formData.isPublic,
        newImages: formData.newImages,
        imagesToDelete: formData.imagesToDelete
      });

      if (result.success) {
        onSave();
        onClose();
      } else {
        setError(result.error || 'Failed to update question');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const existingImages = question.imageUrls?.filter(url => !formData.imagesToDelete.includes(url)) || [];
  const totalImages = existingImages.length + formData.newImages.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Edit Question</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Question Title"
            placeholder="What would you like to know?"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            disabled={isSubmitting}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
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
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  disabled={isSubmitting || formData.tags.length >= 5}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 5 || isSubmitting}
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        disabled={isSubmitting}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            
            {/* Existing Images */}
            {question.imageUrls && question.imageUrls.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Current Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {question.imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Current ${index + 1}`}
                        className={`w-full h-24 object-cover rounded-lg border ${
                          formData.imagesToDelete.includes(url) 
                            ? 'border-red-300 opacity-50' 
                            : 'border-gray-200'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        {formData.imagesToDelete.includes(url) ? (
                          <button
                            type="button"
                            onClick={() => unmarkImageForDeletion(url)}
                            disabled={isSubmitting}
                            className="bg-green-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="text-xs px-2">Restore</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => markImageForDeletion(url)}
                            disabled={isSubmitting}
                            className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      {formData.imagesToDelete.includes(url) && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded">
                          Will be deleted
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            {totalImages < 3 && (
              <div className="mb-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to add images</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={totalImages >= 3 || isSubmitting}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {formData.newImages.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">New Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.newImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        disabled={isSubmitting}
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
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                disabled={isSubmitting}
              />
              <span className="text-sm">Post anonymously</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                disabled={isSubmitting}
              />
              <span className="text-sm">Make public</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
  );
}