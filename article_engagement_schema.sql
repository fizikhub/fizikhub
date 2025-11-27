-- Article Engagement System: Likes and Comments
-- Run this in Supabase SQL Editor

-- Create article_likes table
CREATE TABLE IF NOT EXISTS article_likes (
    id BIGSERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, user_id)
);

-- Create article_comments table (with nested replies support)
CREATE TABLE IF NOT EXISTS article_comments (
    id BIGSERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_comment_id BIGINT REFERENCES article_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_likes_article ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user ON article_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_article ON article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_parent ON article_comments(parent_comment_id);

-- Enable RLS
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_likes
-- Anyone can view likes
CREATE POLICY "Anyone can view likes"
    ON article_likes FOR SELECT
    USING (true);

-- Authenticated users can insert likes
CREATE POLICY "Users can like articles"
    ON article_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can unlike articles"
    ON article_likes FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for article_comments
-- Anyone can view comments
CREATE POLICY "Anyone can view comments"
    ON article_comments FOR SELECT
    USING (true);

-- Authenticated users can create comments
CREATE POLICY "Users can create comments"
    ON article_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
    ON article_comments FOR DELETE
    USING (auth.uid() = user_id);

-- Admins can delete any comment
CREATE POLICY "Admins can delete any comment"
    ON article_comments FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'barannnbozkurttb.b@gmail.com'
        )
    );

-- Success message
SELECT 'Article engagement tables created successfully!' as message;
