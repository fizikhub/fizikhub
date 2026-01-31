-- FIX: Ensure article status defaults to 'pending' and fix image uploads

-- 1. Fix Article Status
-- First, drop the default if it exists
ALTER TABLE articles ALTER COLUMN status DROP DEFAULT;

-- Set the default to 'pending'
ALTER TABLE articles ALTER COLUMN status SET DEFAULT 'pending';

-- Ensure the check constraint exists (drop and recreate to be safe)
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_status_check;
ALTER TABLE articles ADD CONSTRAINT articles_status_check CHECK (status IN ('draft', 'pending', 'published', 'rejected'));

-- Optional: Update any articles created in the last hour to 'pending' if they are 'published'
-- (Commented out to avoid accidental data loss, user can manually reject/approve)
-- UPDATE articles SET status = 'pending' WHERE status = 'published' AND created_at > NOW() - INTERVAL '1 hour';


-- 2. Fix Image Uploads (Storage)
-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to avoid conflicts/duplicates
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Writers Upload" ON storage.objects;
DROP POLICY IF EXISTS "Writers Update" ON storage.objects;
DROP POLICY IF EXISTS "Writers Delete" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects; -- potential old policy name

-- Re-create policies
-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'article-images' );

-- Allow authenticated users (writers) to upload images
CREATE POLICY "Writers Upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'article-images' AND
    auth.role() = 'authenticated'
);

-- Allow users to update/delete their own images
CREATE POLICY "Writers Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'article-images' AND auth.uid() = owner );

CREATE POLICY "Writers Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'article-images' AND auth.uid() = owner );
