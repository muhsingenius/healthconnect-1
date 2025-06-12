/*
  # Add doctor-specific fields to profiles table

  1. New Columns
    - `specialization` (text) - Doctor's medical specialization
    - `bio` (text) - Professional biography
    - `is_verified` (boolean) - Verification status for doctors
    - `role` (text) - User role (patient, doctor, admin, etc.)

  2. Indexes
    - Add performance indexes for role, verification status, and specialization

  3. Notes
    - Removed sample data insertion to avoid foreign key constraint violations
    - All columns are nullable to allow gradual migration of existing users
    - Default values set appropriately for new users
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

-- Update existing profiles to have default role if null
UPDATE profiles SET role = 'patient' WHERE role IS NULL;
UPDATE profiles SET is_verified = false WHERE is_verified IS NULL;