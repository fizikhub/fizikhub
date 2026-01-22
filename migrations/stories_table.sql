-- Create stories table for Rapid Science (Hızlı Bilim) feature
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  image_url TEXT NOT NULL,
  color TEXT DEFAULT 'from-amber-600 to-orange-600',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours') -- Optional: if we want them to disappear like real stories
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read
CREATE POLICY "Stories are viewable by everyone" 
  ON stories FOR SELECT 
  USING (true);

-- Only writers can insert
CREATE POLICY "Writers can create stories" 
  ON stories FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_writer = true
    )
  );

-- Writers can delete their own stories
CREATE POLICY "Users can delete own stories" 
  ON stories FOR DELETE 
  USING (auth.uid() = author_id);
