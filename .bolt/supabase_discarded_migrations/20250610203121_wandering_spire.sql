/*
  # Create Question Images Storage Bucket

  1. Storage Setup
    - Create `question_images` storage bucket for question attachments
    - Enable public access for viewing images
    - Set up Row Level Security (RLS) policies

  2. Security
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Allow users to update/delete their own images
*/

-- Create the storage bucket for question images
INSERT INTO storage.buckets (id, name, public)
VALUES ('question_images', 'question_images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) for the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for allowing authenticated users to upload question images
CREATE POLICY "Allow authenticated users to upload question images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'question_images' AND auth.uid() IS NOT NULL);

-- Policy for allowing all users to view question images
CREATE POLICY "Allow all users to view question images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'question_images');

-- Policy for allowing authenticated users to update their own question images
CREATE POLICY "Allow authenticated users to update their own question images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'question_images' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'question_images' AND auth.uid() = owner);

-- Policy for allowing authenticated users to delete their own question images
CREATE POLICY "Allow authenticated users to delete their own question images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'question_images' AND auth.uid() = owner);