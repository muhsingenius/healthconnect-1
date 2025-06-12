/*
  # Create questions and answers schema

  1. New Tables
    - `questions`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `author_id` (uuid, references profiles.id)
      - `author_name` (text, not null)
      - `is_anonymous` (boolean, default false)
      - `is_public` (boolean, default true)
      - `category` (text, not null)
      - `tags` (text array, default empty array)
      - `upvotes` (integer, default 0)
      - `views` (integer, default 0)
      - `image_urls` (text array, default empty array)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

    - `answers`
      - `id` (uuid, primary key)
      - `content` (text, not null)
      - `question_id` (uuid, references questions.id)
      - `author_id` (uuid, references profiles.id)
      - `author_name` (text, not null)
      - `author_role` (text, default 'patient')
      - `is_verified` (boolean, default false)
      - `upvotes` (integer, default 0)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

    - `question_upvotes`
      - `id` (uuid, primary key)
      - `question_id` (uuid, references questions.id)
      - `user_id` (uuid, references profiles.id)
      - `created_at` (timestamp with time zone, default now())

    - `answer_upvotes`
      - `id` (uuid, primary key)
      - `answer_id` (uuid, references answers.id)
      - `user_id` (uuid, references profiles.id)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
    - Ensure users can only modify their own content

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  is_anonymous boolean DEFAULT false,
  is_public boolean DEFAULT true,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  upvotes integer DEFAULT 0,
  views integer DEFAULT 0,
  image_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_role text DEFAULT 'patient',
  is_verified boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create question_upvotes table
CREATE TABLE IF NOT EXISTS question_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(question_id, user_id)
);

-- Create answer_upvotes table
CREATE TABLE IF NOT EXISTS answer_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id uuid REFERENCES answers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(answer_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_upvotes ENABLE ROW LEVEL SECURITY;

-- Questions policies
CREATE POLICY "Anyone can view public questions"
  ON questions
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Answers policies
CREATE POLICY "Anyone can view answers to public questions"
  ON answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM questions 
      WHERE questions.id = answers.question_id 
      AND questions.is_public = true
    )
  );

CREATE POLICY "Users can view answers to their own questions"
  ON answers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM questions 
      WHERE questions.id = answers.question_id 
      AND questions.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own answers"
  ON answers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create answers"
  ON answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own answers"
  ON answers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own answers"
  ON answers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Question upvotes policies
CREATE POLICY "Anyone can view question upvotes"
  ON question_upvotes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their question upvotes"
  ON question_upvotes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Answer upvotes policies
CREATE POLICY "Anyone can view answer upvotes"
  ON answer_upvotes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their answer upvotes"
  ON answer_upvotes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_is_public ON questions(is_public);

CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_author_id ON answers(author_id);
CREATE INDEX IF NOT EXISTS idx_answers_created_at ON answers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_question_upvotes_question_id ON question_upvotes(question_id);
CREATE INDEX IF NOT EXISTS idx_question_upvotes_user_id ON question_upvotes(user_id);

CREATE INDEX IF NOT EXISTS idx_answer_upvotes_answer_id ON answer_upvotes(answer_id);
CREATE INDEX IF NOT EXISTS idx_answer_upvotes_user_id ON answer_upvotes(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at
  BEFORE UPDATE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment question views
CREATE OR REPLACE FUNCTION increment_question_views(question_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE questions 
  SET views = views + 1 
  WHERE id = question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update question upvote count
CREATE OR REPLACE FUNCTION update_question_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE questions 
    SET upvotes = upvotes + 1 
    WHERE id = NEW.question_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE questions 
    SET upvotes = upvotes - 1 
    WHERE id = OLD.question_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update answer upvote count
CREATE OR REPLACE FUNCTION update_answer_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE answers 
    SET upvotes = upvotes + 1 
    WHERE id = NEW.answer_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE answers 
    SET upvotes = upvotes - 1 
    WHERE id = OLD.answer_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for upvote count updates
CREATE TRIGGER trigger_update_question_upvote_count
  AFTER INSERT OR DELETE ON question_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION update_question_upvote_count();

CREATE TRIGGER trigger_update_answer_upvote_count
  AFTER INSERT OR DELETE ON answer_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION update_answer_upvote_count();