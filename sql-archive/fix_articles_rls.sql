-- RLS Policies for 'articles' table
-- Run this in Supabase SQL Editor

-- 1. Enable RLS (safe to run if already enabled)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Public can view published articles
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
USING (status = 'published');

-- 3. Policy: Authors can do EVERYTHING on their own articles
-- This covers:
--   SELECT (view their own drafts/pending)
--   INSERT (create new articles)
--   UPDATE (edit their articles)
--   DELETE (delete their articles)
DROP POLICY IF EXISTS "Authors can manage own articles" ON articles;
CREATE POLICY "Authors can manage own articles"
ON articles FOR ALL
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- 4. Policy: Admins can do EVERYTHING (Optional but good practice)
-- Adjust 'admin' role check as per your profiles table structure
DROP POLICY IF EXISTS "Admins can manage all articles" ON articles;
CREATE POLICY "Admins can manage all articles"
ON articles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
