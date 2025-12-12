# Database Migrations - Article Approval Workflow

Bu SQL script'i Supabase Dashboard'da çalıştırmalısın:

## SQL Editor'da Çalıştır

1. Supabase Dashboard'a git
2. SQL Editor'ı aç
3. Aşağıdaki SQL'i çalıştır:

```sql
-- Add new columns to profiles table for article tracking
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_written_article BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_seen_article_guide BOOLEAN DEFAULT FALSE;

-- Add new columns to articles table for admin approval workflow
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'published')),
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author_status ON articles(author_id, status);

-- Update existing articles to have 'published' status
UPDATE articles SET status = 'published' WHERE status IS NULL;
```

## Supabase Storage Bucket Oluştur

1. Supabase Dashboard → Storage
2. "Create bucket" tıkla
3. **Bucket name**: `article-images`
4. **Public bucket**: ✅ (checkbox işaretle)
5. **File size limit**: 3MB (3145728 bytes)
6. **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`
7. Create tıkla

## Storage Policies (RLS)

Bucket oluşturduktan sonra policies ekle:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Public read access
CREATE POLICY "Public read access to article images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

-- Users can delete their own images
CREATE POLICY "Users can delete their own article images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

Tamamdır! 🎉
