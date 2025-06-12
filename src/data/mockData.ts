import { Question, Answer, TestingCenter } from '../types';

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'What are the early symptoms of diabetes?',
    content: 'I\'ve been experiencing increased thirst and frequent urination. Should I be concerned about diabetes? What other symptoms should I look out for?',
    authorId: '2',
    authorName: 'Anonymous',
    isAnonymous: true,
    isPublic: true,
    category: 'Diabetes',
    tags: ['diabetes', 'symptoms', 'health'],
    upvotes: 24,
    views: 156,
    createdAt: '2024-01-15T10:30:00Z',
    answers: [
      {
        id: '1',
        content: 'Early diabetes symptoms include increased thirst, frequent urination, fatigue, blurred vision, and slow-healing cuts. If you\'re experiencing these symptoms, I recommend getting a blood glucose test. Early detection and management are crucial for preventing complications.',
        authorId: '1',
        authorName: 'Dr. Sarah Johnson',
        authorRole: 'doctor',
        isVerified: true,
        upvotes: 18,
        questionId: '1',
        createdAt: '2024-01-15T14:20:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'How often should I get a general health checkup?',
    content: 'I\'m 35 years old and generally healthy. How frequently should I visit a doctor for routine checkups?',
    authorId: '2',
    authorName: 'John Doe',
    isAnonymous: false,
    isPublic: true,
    category: 'Preventive Care',
    tags: ['checkup', 'preventive', 'health'],
    upvotes: 12,
    views: 89,
    createdAt: '2024-01-14T16:45:00Z',
    answers: [
      {
        id: '2',
        content: 'For healthy adults in their 30s, I recommend annual checkups. This should include blood pressure, cholesterol, diabetes screening, and cancer screenings as appropriate for your age and risk factors. Regular checkups help catch problems early when they\'re most treatable.',
        authorId: '1',
        authorName: 'Dr. Sarah Johnson',
        authorRole: 'doctor',
        isVerified: true,
        upvotes: 8,
        questionId: '2',
        createdAt: '2024-01-14T18:30:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Best foods for managing high blood pressure?',
    content: 'Recently diagnosed with hypertension. What dietary changes can help manage my blood pressure naturally?',
    authorId: '2',
    authorName: 'Health Seeker',
    isAnonymous: true,
    isPublic: true,
    category: 'Nutrition',
    tags: ['hypertension', 'diet', 'nutrition'],
    upvotes: 31,
    views: 203,
    createdAt: '2024-01-13T09:15:00Z',
    answers: []
  }
];

export const mockTestingCenters: TestingCenter[] = [
  {
    id: '1',
    name: 'City Medical Laboratory',
    address: '123 Health Street, Downtown',
    city: 'Accra',
    phone: '+233-20-123-4567',
    services: ['Blood Tests', 'X-Ray', 'ECG', 'Ultrasound'],
    rating: 4.5,
    verified: true
  },
  {
    id: '2',
    name: 'QuickTest Diagnostics',
    address: '456 Medical Avenue, Eastside',
    city: 'Accra',
    phone: '+233-24-987-6543',
    services: ['COVID-19 Testing', 'Blood Tests', 'Pregnancy Tests'],
    rating: 4.2,
    verified: true
  },
  {
    id: '3',
    name: 'Premier Health Center',
    address: '789 Wellness Road, Westside',
    city: 'Kumasi',
    phone: '+233-50-555-0123',
    services: ['Full Body Checkup', 'Blood Tests', 'MRI', 'CT Scan'],
    rating: 4.8,
    verified: true
  }
];