-- ==========================================
-- Supabase Storage Security (RLS)
-- ==========================================
-- Enforces strict access control for storage buckets.
-- Buckets: 'avatars', 'covers', 'article-images'
-- Rule: Public Read, Owner Write (based on folder path 'uid/*')
-- ==========================================

-- 1. Enable RLS on storage.objects (Skipped to avoid permission errors - typically enabled by default)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Helper Policy: Public Access for Reading
-- Allows anyone to view files in these specific buckets
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('avatars', 'covers', 'article-images') );

-- 3. Policy: 'avatars' - User can manage own folder
DROP POLICY IF EXISTS "Avatars: Users manage own folder" ON storage.objects;
CREATE POLICY "Avatars: Users manage own folder"
ON storage.objects FOR ALL
USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
)
WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- 4. Policy: 'covers' - User can manage own folder
DROP POLICY IF EXISTS "Covers: Users manage own folder" ON storage.objects;
CREATE POLICY "Covers: Users manage own folder"
ON storage.objects FOR ALL
USING (
    bucket_id = 'covers'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
)
WITH CHECK (
    bucket_id = 'covers'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- 5. Policy: 'article-images' - User can manage own folder
DROP POLICY IF EXISTS "Article Images: Users manage own folder" ON storage.objects;
CREATE POLICY "Article Images: Users manage own folder"
ON storage.objects FOR ALL
USING (
    bucket_id = 'article-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
)
WITH CHECK (
    bucket_id = 'article-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- =======================
-- DONE
-- =======================
SELECT '✅ Storage Security Policies Applied successfully!' as message;
