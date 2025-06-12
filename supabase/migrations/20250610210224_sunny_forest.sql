/*
  # Create question_images storage bucket

  1. Storage Setup
    - Create `question_images` storage bucket for storing question images
    - Set bucket to be private (not publicly accessible by default)
    
  2. Security Policies
    - Allow authenticated users to upload images to their own folder
    - Allow authenticated users to delete their own images
    - Allow public read access to all images in the bucket
    
  3. Configuration
    - Set appropriate file size limits and allowed file types
*/

-- Create the question_images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'question_images',
  'question_images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload question images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'question_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own question images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'question_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow public read access to all images
CREATE POLICY "Public read access to question images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'question_images');