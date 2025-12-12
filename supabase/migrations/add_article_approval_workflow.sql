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

COMMENT ON COLUMN articles.status IS 'Article workflow status: draft,pending,approved,rejected,published';
COMMENT ON COLUMN articles.reviewed_by IS 'Admin user ID who reviewed the article';
COMMENT ON COLUMN articles.reviewed_at IS 'Timestamp when article was reviewed';
COMMENT ON COLUMN articles.rejection_reason IS 'Reason for rejection (if rejected)';
