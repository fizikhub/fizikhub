-- Add is_writer column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_writer BOOLEAN DEFAULT FALSE;

-- Add status column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'pending', 'published', 'rejected'));

-- Update existing articles to be published
UPDATE articles SET status = 'published' WHERE status IS NULL;

-- Create policy for writers to view their own pending/draft articles
CREATE POLICY "Writers can view own articles"
    ON articles FOR SELECT
    USING (auth.uid() = author_id);

-- Create policy for writers to insert articles
CREATE POLICY "Writers can insert articles"
    ON articles FOR INSERT
    WITH CHECK (
        auth.uid() = author_id AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_writer = true)
    );

-- Create policy for writers to update their own articles
CREATE POLICY "Writers can update own articles"
    ON articles FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Create storage bucket for article images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to article images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'article-images' );

-- Allow writers to upload article images
CREATE POLICY "Writers Upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'article-images' AND
    auth.role() = 'authenticated'
);
