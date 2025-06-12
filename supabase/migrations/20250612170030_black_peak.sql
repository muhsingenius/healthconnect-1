/*
  # Add affiliate health facility column to profiles table

  1. Changes
    - Add `affiliate_health_facility` column to `profiles` table
    - Column is nullable text type to store the name of the health facility

  2. Notes
    - This field will be used specifically for doctor profiles
    - Allows doctors to specify their affiliated health facility during registration
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'affiliate_health_facility'
  ) THEN
    ALTER TABLE profiles ADD COLUMN affiliate_health_facility text;
  END IF;
END $$;