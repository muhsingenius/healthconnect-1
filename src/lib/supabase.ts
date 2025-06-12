import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          specialization: string | null
          bio: string | null
          is_verified: boolean
          role: string
          affiliate_health_facility: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          specialization?: string | null
          bio?: string | null
          is_verified?: boolean
          role?: string
          affiliate_health_facility?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          specialization?: string | null
          bio?: string | null
          is_verified?: boolean
          role?: string
          affiliate_health_facility?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          author_name: string
          is_anonymous: boolean
          is_public: boolean
          category: string
          tags: string[]
          upvotes: number
          views: number
          image_urls: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          author_name: string
          is_anonymous?: boolean
          is_public?: boolean
          category: string
          tags?: string[]
          upvotes?: number
          views?: number
          image_urls?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          author_name?: string
          is_anonymous?: boolean
          is_public?: boolean
          category?: string
          tags?: string[]
          upvotes?: number
          views?: number
          image_urls?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          content: string
          question_id: string
          author_id: string
          author_name: string
          author_role: string
          is_verified: boolean
          upvotes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          question_id: string
          author_id: string
          author_name: string
          author_role?: string
          is_verified?: boolean
          upvotes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          question_id?: string
          author_id?: string
          author_name?: string
          author_role?: string
          is_verified?: boolean
          upvotes?: number
          created_at?: string
          updated_at?: string
        }
      }
      question_upvotes: {
        Row: {
          id: string
          question_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string
          created_at?: string
        }
      }
      answer_upvotes: {
        Row: {
          id: string
          answer_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          answer_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          answer_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}