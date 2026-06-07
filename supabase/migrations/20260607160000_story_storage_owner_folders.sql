-- Restrict stories bucket writes to authenticated users' own folder.
-- App uploads now use: <auth.uid()>/stories/... and <auth.uid()>/story-groups/...

BEGIN;

DROP POLICY IF EXISTS "Authenticated users can upload stories" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own stories" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own stories" ON storage.objects;
DROP POLICY IF EXISTS "Stories: users upload own folder" ON storage.objects;
DROP POLICY IF EXISTS "Stories: users update own folder" ON storage.objects;
DROP POLICY IF EXISTS "Stories: users delete own folder" ON storage.objects;

CREATE POLICY "Stories: users upload own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'stories'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Stories: users update own folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'stories'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
)
WITH CHECK (
    bucket_id = 'stories'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Stories: users delete own folder"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'stories'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

COMMIT;
