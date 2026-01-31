-- Add cover_url column to articles table for article cover images
-- Run this in your Supabase SQL Editor

-- 1. Add cover_url column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- 2. Create article-images bucket in storage (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies for article-images bucket

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Users can upload article images" ON storage.objects;
CREATE POLICY "Users can upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Allow public read access to article images
DROP POLICY IF EXISTS "Article images are publicly accessible" ON storage.objects;
CREATE POLICY "Article images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

-- Allow users to update their own images (based on folder structure userid/filename)
DROP POLICY IF EXISTS "Users can update own article images" ON storage.objects;
CREATE POLICY "Users can update own article images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'article-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
DROP POLICY IF EXISTS "Users can delete own article images" ON storage.objects;
CREATE POLICY "Users can delete own article images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'article-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Add index for faster queries on cover_url
CREATE INDEX IF NOT EXISTS idx_articles_cover_url ON articles(cover_url) WHERE cover_url IS NOT NULL;

-- Verification
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'articles' AND column_name = 'cover_url';
