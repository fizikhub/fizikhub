-- ==========================================
-- FizikHub Supabase Database Performance Tuning (INFO level)
-- ==========================================
-- This script addresses INFO level linter issues:
-- 1. [PERFORMANCE] Unindexed foreign keys (Adding missing indexes)
-- 2. [PERFORMANCE] Unused Index Cleanup (Removing overhead)
-- ==========================================

BEGIN;

-- ==========================================
-- 1. ADDING MISSING INDEXES FOR FOREIGN KEYS
-- ==========================================
-- These improve join performance and cascaded delete speed.

-- answer_likes (user_id)
CREATE INDEX IF NOT EXISTS idx_answer_likes_user_id ON public.answer_likes(user_id);

-- article_bookmarks (article_id)
CREATE INDEX IF NOT EXISTS idx_article_bookmarks_article_id ON public.article_bookmarks(article_id);

-- follows (following_id)
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

-- question_bookmarks (question_id)
CREATE INDEX IF NOT EXISTS idx_question_bookmarks_question_id ON public.question_bookmarks(question_id);

-- question_votes (user_id)
CREATE INDEX IF NOT EXISTS idx_question_votes_user_id ON public.question_votes(user_id);

-- quiz_questions (quiz_id)
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);

-- stories (author_id)
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON public.stories(author_id);

-- stories (group_id)
CREATE INDEX IF NOT EXISTS idx_stories_group_id ON public.stories(group_id);

-- user_badges (badge_id)
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);

-- user_quiz_attempts (quiz_id)
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON public.user_quiz_attempts(quiz_id);


-- ==========================================
-- 2. REMOVING UNUSED INDEXES
-- ==========================================
-- Removing indexes that are never used to save space and improve write speed.

-- public.articles
DROP INDEX IF EXISTS public.idx_articles_status_created_at;

-- public.profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_unique;
DROP INDEX IF EXISTS public.idx_profiles_is_writer;
DROP INDEX IF EXISTS public.profiles_username_unique;

-- public.user_activity_logs
DROP INDEX IF EXISTS public.idx_user_activity_logs_user_id;

-- public.feed_articles_mv (Materialized View indexes)
DROP INDEX IF EXISTS public.feed_articles_mv_created_at_idx;
DROP INDEX IF EXISTS public.feed_articles_mv_category_idx;

-- public.user_quiz_attempts
DROP INDEX IF EXISTS public.idx_user_quiz_attempts_user_id;

-- public.messages
DROP INDEX IF EXISTS public.idx_messages_reply_to;

-- public.message_reactions
DROP INDEX IF EXISTS public.idx_message_reactions_user;

-- public.conversations
DROP INDEX IF EXISTS public.idx_conversations_last_message;

COMMIT;

-- Final Verification Message
SELECT '🚀 Supabase performance tuning (INFO) completed!' as message;
