-- FIX: Correct Storage RLS Policies for article-images bucket
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects; -- Added this
DROP POLICY IF EXISTS "Writers Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects; -- Added this
DROP POLICY IF EXISTS "Writers Update" ON storage.objects;
DROP POLICY IF EXISTS "Owner update" ON storage.objects; -- Added this
DROP POLICY IF EXISTS "Writers Delete" ON storage.objects;
DROP POLICY IF EXISTS "Owner delete" ON storage.objects; -- Added this
DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to article images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own article images" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects;

-- 3. Create CORRECT policies with proper field names
-- Public read access (everyone can view images)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

-- Authenticated users can upload (INSERT)
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'article-images'
);

-- Users can update their own images (UPDATE)
CREATE POLICY "Owner update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'article-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own images (DELETE)
CREATE POLICY "Owner delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'article-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
