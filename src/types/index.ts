export type UserRole = 'patient' | 'doctor' | 'testing_center' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  verified?: boolean;
  specialization?: string; // for doctors
  location?: string; // for testing centers
  bio?: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  isPublic: boolean;
  category: string;
  tags: string[];
  upvotes: number;
  views: number;
  answers: Answer[];
  createdAt: string;
  imageUrls?: string[];
  hasUserUpvoted?: boolean;
}

export interface Answer {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isVerified: boolean;
  upvotes: number;
  questionId: string;
  createdAt: string;
  hasUserUpvoted?: boolean;
}

export interface TestingCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  services: string[];
  rating: number;
  verified: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  fee: number;
  notes?: string;
}