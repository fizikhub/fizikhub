-- Fix RLS policies for articles to ensure correct access control

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
DROP POLICY IF EXISTS "Writers can view own articles" ON articles;
DROP POLICY IF EXISTS "Writers can insert articles" ON articles;
DROP POLICY IF EXISTS "Writers can update own articles" ON articles;
DROP POLICY IF EXISTS "Admins can do everything" ON articles;

-- 1. Public Access: Everyone can view published articles
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
USING (status = 'published');

-- 2. Writer Access: Writers can view their own articles (even pending/draft)
CREATE POLICY "Writers can view own articles"
ON articles FOR SELECT
USING (auth.uid() = author_id);

-- 3. Writer Insert: Writers can insert articles (default status will be pending)
CREATE POLICY "Writers can insert articles"
ON articles FOR INSERT
WITH CHECK (
    auth.uid() = author_id AND
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_writer = true))
);

-- 4. Writer Update: Writers can update their own articles
-- This fixes the issue where writers couldn't edit their articles
CREATE POLICY "Writers can update own articles"
ON articles FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- 5. Admin Access: Admins can do everything
-- We assume is_admin() function exists from previous migrations
CREATE POLICY "Admins can do everything"
ON articles FOR ALL
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' OR
    auth.email() IN ('barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com')
);
