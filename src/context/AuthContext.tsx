import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  specialization: string | null;
  bio: string | null;
  is_verified: boolean;
  role: string;
  affiliate_health_facility: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  verified?: boolean;
  specialization?: string;
  bio?: string;
  affiliateHealthFacility?: string;
}

interface DoctorMetadata {
  role: 'doctor';
  specialization: string;
  bio: string;
  licenseNumber: string;
  yearsOfExperience: number;
  isVerified: boolean;
  affiliateHealthFacility: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string, doctorMetadata?: DoctorMetadata) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Separate function to handle profile loading without blocking auth state changes
  const loadUserProfileAsync = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Loading profile for user:', supabaseUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        // If it's not a "no rows" error, treat it as a real error
        if (error.code !== 'PGRST116') {
          setUser(null);
          setLoading(false);
          return;
        }
      }

      let userProfile = profile;

      // If no profile exists, create one
      if (!profile) {
        console.log('Creating new profile for user:', supabaseUser.id);
        
        // Get metadata from user signup
        const metadata = supabaseUser.user_metadata || {};
        
        const newProfileData = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          full_name: metadata.full_name || null,
          phone: metadata.phone || null,
          avatar_url: null,
          specialization: metadata.specialization || null,
          bio: metadata.bio || null,
          is_verified: metadata.isVerified || false,
          role: metadata.role || 'patient',
          affiliate_health_facility: metadata.affiliateHealthFacility || null,
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          
          // If it's a duplicate key error, try to fetch the existing profile
          if (insertError.code === '23505') {
            console.log('Profile already exists, fetching...');
            const { data: existingProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
            
            if (!fetchError && existingProfile) {
              userProfile = existingProfile;
            } else {
              console.error('Failed to fetch existing profile:', fetchError);
              setUser(null);
              setLoading(false);
              return;
            }
          } else {
            setUser(null);
            setLoading(false);
            return;
          }
        } else {
          userProfile = newProfile;
        }
      }

      if (userProfile) {
        console.log('Setting user profile:', userProfile);
        setUser({
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.full_name || 'User',
          phone: userProfile.phone || undefined,
          avatar: userProfile.avatar_url || undefined,
          role: (userProfile.role as UserRole) || 'patient',
          verified: userProfile.is_verified || false,
          specialization: userProfile.specialization || undefined,
          bio: userProfile.bio || undefined,
          affiliateHealthFacility: userProfile.affiliate_health_facility || undefined
        });
      } else {
        console.log('No profile data available');
        setUser(null);
      }
    } catch (error) {
      console.error('Error in loadUserProfileAsync:', error);
      setUser(null);
    } finally {
      // Always set loading to false when profile loading is complete
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          
          // Check if the error is related to invalid refresh token
          if (error.message.includes('Refresh Token Not Found') || 
              error.message.includes('Invalid Refresh Token')) {
            console.log('Invalid refresh token detected, clearing session...');
            // Clear the corrupted session data
            await supabase.auth.signOut();
          }
          
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Found existing session for user:', session.user.id);
          await loadUserProfileAsync(session.user);
        } else {
          console.log('No existing session found');
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes - KEEP THIS SYNCHRONOUS
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        console.log('User signed out or no session');
        setUser(null);
        setLoading(false);
      } else if (session?.user) {
        console.log('User signed in:', session.user.id);
        setLoading(true);
        // Fire and forget - don't await this
        loadUserProfileAsync(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    phone: string, 
    doctorMetadata?: DoctorMetadata
  ) => {
    try {
      console.log('Starting signup process...');
      setLoading(true);
      
      // Prepare user metadata
      const userMetadata: any = { 
        full_name: fullName, 
        phone 
      };

      // Add doctor-specific metadata if provided
      if (doctorMetadata) {
        userMetadata.role = doctorMetadata.role;
        userMetadata.specialization = doctorMetadata.specialization;
        userMetadata.bio = doctorMetadata.bio;
        userMetadata.licenseNumber = doctorMetadata.licenseNumber;
        userMetadata.yearsOfExperience = doctorMetadata.yearsOfExperience;
        userMetadata.isVerified = doctorMetadata.isVerified;
        userMetadata.affiliateHealthFacility = doctorMetadata.affiliateHealthFacility;
      }

      const { data: { user, session }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (user && session) {
        console.log('Signup successful, user created:', user.id);
        // The auth state change listener will handle loading the profile
        return { success: true };
      }

      // This likely won't happen if confirmation is disabled,
      // but if confirmation were enabled, you'd need to handle that here.
      setLoading(false);
      return {
        success: false,
        error: 'Please check your email to confirm your account.'
      };
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setLoading(false);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin process...');
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        setLoading(false);
        return { success: false, error: error.message };
      }

      console.log('Signin successful');
      // The auth state change listener will handle loading the profile
      return { success: true };
    } catch (error: any) {
      console.error('Signin error:', error);
      setLoading(false);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
      }
      // The auth state change listener will handle clearing the user state
    } catch (error) {
      console.error('Signout error:', error);
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}