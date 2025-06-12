import { supabase } from '../lib/supabase';

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  affiliate_health_facility?: string;
}

export class ProfileService {
  static async updateProfile(userId: string, data: UpdateProfileData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async getProfile(userId: string): Promise<{ success: boolean; profile?: any; error?: string }> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true, profile };
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}