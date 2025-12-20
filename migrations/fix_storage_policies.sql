-- Create the storage bucket 'article-images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'article-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated Users Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'article-images' );

-- Allow users to update their own images (optional, but good)
CREATE POLICY "Users Update Own Images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'article-images' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'article-images' AND auth.uid() = owner );

-- Allow users to delete their own images
CREATE POLICY "Users Delete Own Images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'article-images' AND auth.uid() = owner );
