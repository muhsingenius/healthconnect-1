/*
  # Create question images storage bucket

  1. Storage Setup
    - Create `question_images` storage bucket for question image uploads
    - Configure bucket to be publicly accessible for reading
    - Set up proper RLS policies for secure image management

  2. Security
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Allow users to manage their own uploaded images
*/

-- Create the storage bucket for question images using the storage schema
DO $$
BEGIN
  -- Create bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'question_images', 
    'question_images', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create storage policies using the storage schema functions
DO $$
BEGIN
  -- Policy for allowing authenticated users to upload question images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload question images'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload question images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'question_images');
  END IF;

  -- Policy for allowing all users to view question images
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

  -- Policy for allowing authenticated users to update their own question images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update their own question images'
  ) THEN
    CREATE POLICY "Allow authenticated users to update their own question images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'question_images' AND (auth.uid())::text = (storage.foldername(name))[1])
    WITH CHECK (bucket_id = 'question_images');
  END IF;

  -- Policy for allowing authenticated users to delete their own question images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete their own question images'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete their own question images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'question_images' AND (auth.uid())::text = (storage.foldername(name))[1]);
  END IF;
END $$;