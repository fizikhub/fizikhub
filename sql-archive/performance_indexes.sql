-- Performance Optimization: Database Indexes
-- This migration adds strategic indexes to improve query performance

-- ==========================================
-- PROFILES TABLE
-- ==========================================

-- Index for username lookups (profile pages, @mentions)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Index for email lookups (authentication)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Index for verified users
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified) WHERE is_verified = true;

-- ==========================================
-- ARTICLES TABLE
-- ==========================================

-- Index for slug lookups (article detail pages)
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Composite index for published articles ordered by date
CREATE INDEX IF NOT EXISTS idx_articles_status_created ON articles(status, created_at DESC) WHERE status = 'published';

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category) WHERE status = 'published';

-- Index for author's articles
CREATE INDEX IF NOT EXISTS idx_articles_author_created ON articles(author_id, created_at DESC);

-- ==========================================
-- QUESTIONS TABLE
-- ==========================================

-- Index for author's questions
CREATE INDEX IF NOT EXISTS idx_questions_author_created ON questions(author_id, created_at DESC);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);

-- Index for recent questions (forum page)
CREATE INDEX IF NOT EXISTS idx_questions_created ON questions(created_at DESC);

-- Index for vote count ordering
CREATE INDEX IF NOT EXISTS idx_questions_votes ON questions(vote_count DESC);

-- ==========================================
-- ANSWERS TABLE
-- ==========================================

-- Composite index for answers on a question
CREATE INDEX IF NOT EXISTS idx_answers_question_created ON answers(question_id, created_at DESC);

-- Index for accepted answers
CREATE INDEX IF NOT EXISTS idx_answers_accepted ON answers(is_accepted) WHERE is_accepted = true;

-- Index for author's answers
CREATE INDEX IF NOT EXISTS idx_answers_author_created ON answers(author_id, created_at DESC);

-- ==========================================
-- ANSWER_COMMENTS TABLE
-- ==========================================

-- Composite index for comments on an answer
CREATE INDEX IF NOT EXISTS idx_answer_comments_answer_created ON answer_comments(answer_id, created_at DESC);

-- Index for author's comments
CREATE INDEX IF NOT EXISTS idx_answer_comments_author ON answer_comments(author_id);

-- ==========================================
-- ANSWER_LIKES TABLE
-- ==========================================

-- Composite index for user's like on answer
CREATE UNIQUE INDEX IF NOT EXISTS idx_answer_likes_unique ON answer_likes(answer_id, user_id);

-- Index for counting likes per answer
CREATE INDEX IF NOT EXISTS idx_answer_likes_answer ON answer_likes(answer_id);

-- ==========================================
-- NOTIFICATIONS TABLE
-- ==========================================

-- Composite index for user's unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON notifications(recipient_id, is_read, created_at DESC);

-- ==========================================
-- MESSAGES TABLE (if exists)
-- ==========================================

-- Composite index for conversation messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);

-- ==========================================
-- ANALYZE TABLES
-- ==========================================

-- Update table statistics for query planner
ANALYZE profiles;
ANALYZE articles;
ANALYZE questions;
ANALYZE answers;
ANALYZE answer_comments;
ANALYZE answer_likes;
ANALYZE notifications;
ANALYZE messages;
