import { supabase } from '../lib/supabase';
import { Question, Answer } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface CreateQuestionData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  isAnonymous?: boolean;
  isPublic?: boolean;
  images?: File[];
}

export interface CreateAnswerData {
  content: string;
  questionId: string;
}

export interface UpdateQuestionData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isAnonymous: boolean;
  isPublic: boolean;
  newImages?: File[];
  imagesToDelete?: string[];
}

export class QuestionService {
  static async uploadQuestionImages(files: File[], userId: string): Promise<{ success: boolean; imageUrls?: string[]; error?: string }> {
    try {
      const imageUrls: string[] = [];

      for (const file of files) {
        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${userId}/${uuidv4()}.${fileExtension}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('question_images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Error uploading image:', error);
          return { success: false, error: `Failed to upload image: ${error.message}` };
        }

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('question_images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      return { success: true, imageUrls };
    } catch (error: any) {
      console.error('Error in uploadQuestionImages:', error);
      return { success: false, error: error.message || 'An unexpected error occurred during image upload' };
    }
  }

  static async deleteQuestionImages(imageUrls: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      for (const url of imageUrls) {
        // Extract the file path from the URL
        const urlParts = url.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'question_images');
        if (bucketIndex === -1) continue;
        
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        
        const { error } = await supabase.storage
          .from('question_images')
          .remove([filePath]);

        if (error) {
          console.error('Error deleting image:', error);
          // Continue with other deletions even if one fails
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in deleteQuestionImages:', error);
      return { success: false, error: error.message || 'An unexpected error occurred during image deletion' };
    }
  }

  static async updateQuestion(questionId: string, data: UpdateQuestionData): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // First, verify the user owns this question
      const { data: existingQuestion, error: fetchError } = await supabase
        .from('questions')
        .select('author_id, image_urls')
        .eq('id', questionId)
        .single();

      if (fetchError) {
        return { success: false, error: 'Question not found' };
      }

      if (existingQuestion.author_id !== user.id) {
        return { success: false, error: 'You can only edit your own questions' };
      }

      // Handle image deletions
      if (data.imagesToDelete && data.imagesToDelete.length > 0) {
        await this.deleteQuestionImages(data.imagesToDelete);
      }

      // Handle new image uploads
      let newImageUrls: string[] = [];
      if (data.newImages && data.newImages.length > 0) {
        const uploadResult = await this.uploadQuestionImages(data.newImages, user.id);
        if (!uploadResult.success) {
          return { success: false, error: uploadResult.error };
        }
        newImageUrls = uploadResult.imageUrls || [];
      }

      // Calculate final image URLs
      const currentImageUrls = existingQuestion.image_urls || [];
      const remainingImageUrls = currentImageUrls.filter((url: string) => 
        !data.imagesToDelete?.includes(url)
      );
      const finalImageUrls = [...remainingImageUrls, ...newImageUrls];

      // Update the question
      const { error: updateError } = await supabase
        .from('questions')
        .update({
          title: data.title,
          content: data.content,
          category: data.category,
          tags: data.tags,
          is_anonymous: data.isAnonymous,
          is_public: data.isPublic,
          image_urls: finalImageUrls,
          updated_at: new Date().toISOString()
        })
        .eq('id', questionId);

      if (updateError) {
        console.error('Error updating question:', updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating question:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async createQuestion(data: CreateQuestionData): Promise<{ success: boolean; error?: string; questionId?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Get user profile for author name
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return { success: false, error: 'Failed to get user profile' };
      }

      const authorName = data.isAnonymous ? 'Anonymous' : (profile.full_name || 'User');

      // Upload images if provided
      let imageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        const uploadResult = await this.uploadQuestionImages(data.images, user.id);
        if (!uploadResult.success) {
          return { success: false, error: uploadResult.error };
        }
        imageUrls = uploadResult.imageUrls || [];
      }

      const { data: question, error } = await supabase
        .from('questions')
        .insert({
          title: data.title,
          content: data.content,
          author_id: user.id,
          author_name: authorName,
          is_anonymous: data.isAnonymous || false,
          is_public: data.isPublic !== false,
          category: data.category,
          tags: data.tags || [],
          image_urls: imageUrls
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating question:', error);
        return { success: false, error: error.message };
      }

      return { success: true, questionId: question.id };
    } catch (error: any) {
      console.error('Error creating question:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async getQuestions(): Promise<{ success: boolean; questions?: Question[]; error?: string }> {
    try {
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select(`
          *,
          answers:answers(
            id,
            content,
            author_id,
            author_name,
            author_role,
            is_verified,
            upvotes,
            created_at
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        return { success: false, error: error.message };
      }

      // Get current user to check upvote status
      const { data: { user } } = await supabase.auth.getUser();
      let userQuestionUpvotes: string[] = [];
      let userAnswerUpvotes: string[] = [];

      if (user) {
        // Get question upvotes
        const { data: questionUpvotesData } = await supabase
          .from('question_upvotes')
          .select('question_id')
          .eq('user_id', user.id);
        
        userQuestionUpvotes = questionUpvotesData?.map(u => u.question_id) || [];

        // Get answer upvotes
        const { data: answerUpvotesData } = await supabase
          .from('answer_upvotes')
          .select('answer_id')
          .eq('user_id', user.id);
        
        userAnswerUpvotes = answerUpvotesData?.map(u => u.answer_id) || [];
      }

      const questions: Question[] = questionsData.map(q => ({
        id: q.id,
        title: q.title,
        content: q.content,
        authorId: q.author_id,
        authorName: q.author_name,
        isAnonymous: q.is_anonymous,
        isPublic: q.is_public,
        category: q.category,
        tags: q.tags,
        upvotes: q.upvotes,
        views: q.views,
        createdAt: q.created_at,
        imageUrls: q.image_urls || [],
        answers: q.answers.map((a: any) => ({
          id: a.id,
          content: a.content,
          authorId: a.author_id,
          authorName: a.author_name,
          authorRole: a.author_role,
          isVerified: a.is_verified,
          upvotes: a.upvotes,
          questionId: q.id,
          createdAt: a.created_at,
          hasUserUpvoted: userAnswerUpvotes.includes(a.id)
        })),
        hasUserUpvoted: userQuestionUpvotes.includes(q.id)
      }));

      return { success: true, questions };
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async getQuestionById(questionId: string): Promise<{ success: boolean; question?: Question; error?: string }> {
    try {
      // First increment the view count
      await supabase.rpc('increment_question_views', { question_id: questionId });

      const { data: questionData, error } = await supabase
        .from('questions')
        .select(`
          *,
          answers:answers(
            id,
            content,
            author_id,
            author_name,
            author_role,
            is_verified,
            upvotes,
            created_at
          )
        `)
        .eq('id', questionId)
        .single();

      if (error) {
        console.error('Error fetching question:', error);
        return { success: false, error: error.message };
      }

      // Get current user to check upvote status
      const { data: { user } } = await supabase.auth.getUser();
      let userQuestionUpvotes: string[] = [];
      let userAnswerUpvotes: string[] = [];

      if (user) {
        // Get question upvotes
        const { data: questionUpvotesData } = await supabase
          .from('question_upvotes')
          .select('question_id')
          .eq('user_id', user.id)
          .eq('question_id', questionId);
        
        userQuestionUpvotes = questionUpvotesData?.map(u => u.question_id) || [];

        // Get answer upvotes for this question's answers
        const answerIds = questionData.answers.map((a: any) => a.id);
        if (answerIds.length > 0) {
          const { data: answerUpvotesData } = await supabase
            .from('answer_upvotes')
            .select('answer_id')
            .eq('user_id', user.id)
            .in('answer_id', answerIds);
          
          userAnswerUpvotes = answerUpvotesData?.map(u => u.answer_id) || [];
        }
      }

      const question: Question = {
        id: questionData.id,
        title: questionData.title,
        content: questionData.content,
        authorId: questionData.author_id,
        authorName: questionData.author_name,
        isAnonymous: questionData.is_anonymous,
        isPublic: questionData.is_public,
        category: questionData.category,
        tags: questionData.tags,
        upvotes: questionData.upvotes,
        views: questionData.views,
        createdAt: questionData.created_at,
        imageUrls: questionData.image_urls || [],
        answers: questionData.answers.map((a: any) => ({
          id: a.id,
          content: a.content,
          authorId: a.author_id,
          authorName: a.author_name,
          authorRole: a.author_role,
          isVerified: a.is_verified,
          upvotes: a.upvotes,
          questionId: questionData.id,
          createdAt: a.created_at,
          hasUserUpvoted: userAnswerUpvotes.includes(a.id)
        })),
        hasUserUpvoted: userQuestionUpvotes.includes(questionData.id)
      };

      return { success: true, question };
    } catch (error: any) {
      console.error('Error fetching question by ID:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async getUnansweredQuestions(): Promise<{ success: boolean; questions?: Question[]; error?: string }> {
    try {
      // First get all questions
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select(`
          *,
          answers:answers(count)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        return { success: false, error: error.message };
      }

      // Filter questions with no answers
      const unansweredQuestionIds = questionsData
        .filter(q => q.answers[0]?.count === 0)
        .map(q => q.id);

      if (unansweredQuestionIds.length === 0) {
        return { success: true, questions: [] };
      }

      // Get full question data for unanswered questions
      const { data: fullQuestionsData, error: fullError } = await supabase
        .from('questions')
        .select(`
          *,
          answers:answers(
            id,
            content,
            author_id,
            author_name,
            author_role,
            is_verified,
            upvotes,
            created_at
          )
        `)
        .in('id', unansweredQuestionIds)
        .order('created_at', { ascending: false });

      if (fullError) {
        console.error('Error fetching full question data:', fullError);
        return { success: false, error: fullError.message };
      }

      // Get current user to check upvote status
      const { data: { user } } = await supabase.auth.getUser();
      let userQuestionUpvotes: string[] = [];
      let userAnswerUpvotes: string[] = [];

      if (user) {
        const { data: questionUpvotesData } = await supabase
          .from('question_upvotes')
          .select('question_id')
          .eq('user_id', user.id);
        
        userQuestionUpvotes = questionUpvotesData?.map(u => u.question_id) || [];

        const { data: answerUpvotesData } = await supabase
          .from('answer_upvotes')
          .select('answer_id')
          .eq('user_id', user.id);
        
        userAnswerUpvotes = answerUpvotesData?.map(u => u.answer_id) || [];
      }

      const questions: Question[] = fullQuestionsData.map(q => ({
        id: q.id,
        title: q.title,
        content: q.content,
        authorId: q.author_id,
        authorName: q.author_name,
        isAnonymous: q.is_anonymous,
        isPublic: q.is_public,
        category: q.category,
        tags: q.tags,
        upvotes: q.upvotes,
        views: q.views,
        createdAt: q.created_at,
        imageUrls: q.image_urls || [],
        answers: q.answers.map((a: any) => ({
          id: a.id,
          content: a.content,
          authorId: a.author_id,
          authorName: a.author_name,
          authorRole: a.author_role,
          isVerified: a.is_verified,
          upvotes: a.upvotes,
          questionId: q.id,
          createdAt: a.created_at,
          hasUserUpvoted: userAnswerUpvotes.includes(a.id)
        })),
        hasUserUpvoted: userQuestionUpvotes.includes(q.id)
      }));

      return { success: true, questions };
    } catch (error: any) {
      console.error('Error fetching unanswered questions:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async getUserQuestions(userId?: string): Promise<{ success: boolean; questions?: Question[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Use provided userId or current user's ID
      const targetUserId = userId || user.id;

      const { data: questionsData, error } = await supabase
        .from('questions')
        .select(`
          *,
          answers:answers(
            id,
            content,
            author_id,
            author_name,
            author_role,
            is_verified,
            upvotes,
            created_at
          )
        `)
        .eq('author_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user questions:', error);
        return { success: false, error: error.message };
      }

      // Get user upvotes for these questions and answers
      const { data: questionUpvotesData } = await supabase
        .from('question_upvotes')
        .select('question_id')
        .eq('user_id', user.id);
      
      const userQuestionUpvotes = questionUpvotesData?.map(u => u.question_id) || [];

      const { data: answerUpvotesData } = await supabase
        .from('answer_upvotes')
        .select('answer_id')
        .eq('user_id', user.id);
      
      const userAnswerUpvotes = answerUpvotesData?.map(u => u.answer_id) || [];

      const questions: Question[] = questionsData.map(q => ({
        id: q.id,
        title: q.title,
        content: q.content,
        authorId: q.author_id,
        authorName: q.author_name,
        isAnonymous: q.is_anonymous,
        isPublic: q.is_public,
        category: q.category,
        tags: q.tags,
        upvotes: q.upvotes,
        views: q.views,
        createdAt: q.created_at,
        imageUrls: q.image_urls || [],
        answers: q.answers.map((a: any) => ({
          id: a.id,
          content: a.content,
          authorId: a.author_id,
          authorName: a.author_name,
          authorRole: a.author_role,
          isVerified: a.is_verified,
          upvotes: a.upvotes,
          questionId: q.id,
          createdAt: a.created_at,
          hasUserUpvoted: userAnswerUpvotes.includes(a.id)
        })),
        hasUserUpvoted: userQuestionUpvotes.includes(q.id)
      }));

      return { success: true, questions };
    } catch (error: any) {
      console.error('Error fetching user questions:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async toggleQuestionUpvote(questionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check if user has already upvoted
      const { data: existingUpvote } = await supabase
        .from('question_upvotes')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingUpvote) {
        // Remove upvote
        const { error } = await supabase
          .from('question_upvotes')
          .delete()
          .eq('question_id', questionId)
          .eq('user_id', user.id);

        if (error) {
          return { success: false, error: error.message };
        }
      } else {
        // Add upvote
        const { error } = await supabase
          .from('question_upvotes')
          .insert({
            question_id: questionId,
            user_id: user.id
          });

        if (error) {
          return { success: false, error: error.message };
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error toggling upvote:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async toggleAnswerUpvote(answerId: string): Promise<{ success: boolean; error?: string; newUpvoteCount?: number }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check if user has already upvoted
      const { data: existingUpvote } = await supabase
        .from('answer_upvotes')
        .select('id')
        .eq('answer_id', answerId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingUpvote) {
        // Remove upvote
        const { error } = await supabase
          .from('answer_upvotes')
          .delete()
          .eq('answer_id', answerId)
          .eq('user_id', user.id);

        if (error) {
          return { success: false, error: error.message };
        }
      } else {
        // Add upvote
        const { error } = await supabase
          .from('answer_upvotes')
          .insert({
            answer_id: answerId,
            user_id: user.id
          });

        if (error) {
          return { success: false, error: error.message };
        }
      }

      // Get the updated upvote count
      const { data: answerData, error: fetchError } = await supabase
        .from('answers')
        .select('upvotes')
        .eq('id', answerId)
        .single();

      if (fetchError) {
        console.error('Error fetching updated upvote count:', fetchError);
        return { success: true }; // Still return success since the upvote operation worked
      }

      return { success: true, newUpvoteCount: answerData.upvotes };
    } catch (error: any) {
      console.error('Error toggling answer upvote:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async createAnswer(data: CreateAnswerData): Promise<{ success: boolean; error?: string; answerId?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Get user profile for author name and role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role, is_verified')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return { success: false, error: 'Failed to get user profile' };
      }

      const { data: answer, error } = await supabase
        .from('answers')
        .insert({
          content: data.content,
          question_id: data.questionId,
          author_id: user.id,
          author_name: profile.full_name || 'User',
          author_role: profile.role || 'patient',
          is_verified: profile.role === 'doctor' && profile.is_verified
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating answer:', error);
        return { success: false, error: error.message };
      }

      return { success: true, answerId: answer.id };
    } catch (error: any) {
      console.error('Error creating answer:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async incrementQuestionViews(questionId: string): Promise<void> {
    try {
      await supabase.rpc('increment_question_views', { question_id: questionId });
    } catch (error) {
      console.error('Error incrementing question views:', error);
    }
  }
}