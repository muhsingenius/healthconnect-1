/*
  # Create question images storage bucket

  1. Storage Setup
    - Create `question_images` bucket for storing question images
    - Enable public access for image viewing
    - Set up file size and type restrictions

  2. Security Policies
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Allow users to manage their own images
*/

-- Create the storage bucket for question images
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'question_images', 
    'question_images', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Bucket already exists, update its properties
    UPDATE storage.buckets 
    SET 
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    WHERE id = 'question_images';
END $$;

-- Create storage policies using Supabase's policy functions
-- Note: These policies will be created if they don't already exist

-- Policy for allowing authenticated users to upload question images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload question images'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload question images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'question_images' AND auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Policy for allowing all users to view question images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow all users to view question images'
  ) THEN
    CREATE POLICY "Allow all users to view question images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'question_images');
  END IF;
END $$;

-- Policy for allowing authenticated users to update their own question images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update their own question images'
  ) THEN
    CREATE POLICY "Allow authenticated users to update their own question images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'question_images' AND auth.uid()::text = owner)
    WITH CHECK (bucket_id = 'question_images' AND auth.uid()::text = owner);
  END IF;
END $$;

-- Policy for allowing authenticated users to delete their own question images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete their own question images'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete their own question images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'question_images' AND auth.uid()::text = owner);
  END IF;
END $$;