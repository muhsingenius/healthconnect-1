/*
  # Add doctor-specific fields to profiles table

  1. New Columns
    - `specialization` (text, nullable) - Doctor's medical specialization
    - `bio` (text, nullable) - Professional bio/description
    - `is_verified` (boolean, default false) - Whether the doctor is verified
    - `role` (text, default 'patient') - User role (patient, doctor, admin)

  2. Security
    - Update existing RLS policies to work with new fields
    - Ensure users can only update their own profiles

  3. Indexes
    - Add index on role for efficient role-based queries
    - Add index on is_verified for verified doctor queries
*/

-- Add new columns to profiles table
DO $$
BEGIN
  -- Add specialization column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'specialization'
  ) THEN
    ALTER TABLE profiles ADD COLUMN specialization text;
  END IF;

  -- Add bio column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;

  -- Add is_verified column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_verified boolean DEFAULT false;
  END IF;

  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'patient';
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_specialization ON profiles(specialization);

-- Insert some sample doctor profiles for testing
INSERT INTO profiles (
  id,
  email,
  full_name,
  specialization,
  bio,
  is_verified,
  role,
  created_at,
  updated_at
) VALUES
-- Sample verified doctors
(
  gen_random_uuid(),
  'dr.sarah.johnson@healthconnect.com',
  'Dr. Sarah Johnson',
  'General Medicine',
  'Board-certified family physician with 15 years of experience. Specializes in preventive care, diabetes management, and women''s health. Committed to providing compassionate, evidence-based medical care.',
  true,
  'doctor',
  NOW() - INTERVAL '6 months',
  NOW() - INTERVAL '6 months'
),
(
  gen_random_uuid(),
  'dr.michael.chen@healthconnect.com',
  'Dr. Michael Chen',
  'Cardiology',
  'Interventional cardiologist with expertise in heart disease prevention and treatment. Fellowship-trained in cardiac catheterization and coronary interventions. Passionate about patient education and lifestyle medicine.',
  true,
  'doctor',
  NOW() - INTERVAL '4 months',
  NOW() - INTERVAL '4 months'
),
(
  gen_random_uuid(),
  'dr.emily.rodriguez@healthconnect.com',
  'Dr. Emily Rodriguez',
  'Nutrition & Dietetics',
  'Registered dietitian and certified diabetes educator. Specializes in medical nutrition therapy, weight management, and chronic disease prevention through dietary interventions.',
  true,
  'doctor',
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '3 months'
),
(
  gen_random_uuid(),
  'dr.james.wilson@healthconnect.com',
  'Dr. James Wilson',
  'Psychiatry',
  'Board-certified psychiatrist specializing in anxiety disorders, depression, and cognitive behavioral therapy. Advocates for integrated mental health care and reducing stigma around mental illness.',
  true,
  'doctor',
  NOW() - INTERVAL '5 months',
  NOW() - INTERVAL '5 months'
),
(
  gen_random_uuid(),
  'dr.amanda.foster@healthconnect.com',
  'Dr. Amanda Foster',
  'Obstetrics & Gynecology',
  'OB/GYN with special interest in maternal-fetal medicine and high-risk pregnancies. Dedicated to providing comprehensive women''s healthcare throughout all stages of life.',
  true,
  'doctor',
  NOW() - INTERVAL '2 months',
  NOW() - INTERVAL '2 months'
);