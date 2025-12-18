-- Create article-images bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Owner update" ON storage.objects;
DROP POLICY IF EXISTS "Owner delete" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects;

-- Create policies

-- 1. Public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

-- 2. Authenticated upload
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'article-images'
);

-- 3. Owner update (users can update their own images)
CREATE POLICY "Owner update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'article-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Owner delete (users can delete their own images)
CREATE POLICY "Owner delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'article-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
