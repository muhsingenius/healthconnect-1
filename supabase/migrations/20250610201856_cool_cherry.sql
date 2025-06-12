/*
  # Create function to increment question views

  1. New Functions
    - `increment_question_views` - Safely increments the view count for a question
  
  2. Security
    - Function is accessible to authenticated users
    - Uses atomic increment to prevent race conditions
*/

-- Create function to increment question views
CREATE OR REPLACE FUNCTION increment_question_views(question_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE questions 
  SET views = views + 1 
  WHERE id = question_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_question_views(uuid) TO authenticated;