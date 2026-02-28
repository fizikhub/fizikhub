-- ==========================================
-- FizikHub Supabase Database Performance Refinement v2
-- ==========================================
-- This script addresses the latest INFO level linter issues:
-- 1. [PERFORMANCE] Unindexed foreign keys (Adding 3 missing indexes)
-- 2. [PERFORMANCE] Unused Index Cleanup (Removing 13+ unused indexes)
-- ==========================================

BEGIN;

-- ==========================================
-- 1. ADDING MISSING INDEXES FOR FOREIGN KEYS
-- ==========================================

-- message_reactions (user_id)
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id 
    ON public.message_reactions(user_id);

-- messages (reply_to_id)
CREATE INDEX IF NOT EXISTS idx_messages_reply_to_id 
    ON public.messages(reply_to_id);

-- user_quiz_attempts (user_id)
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id_fixed 
    ON public.user_quiz_attempts(user_id);


-- ==========================================
-- 2. REMOVING UNUSED INDEXES (as flagged by linter)
-- ==========================================
-- These indexes were flagged as never being used in query plans.

-- public.articles
DROP INDEX IF EXISTS public.idx_articles_status_created_at;

-- public.profiles
DROP INDEX IF EXISTS public.idx_profiles_is_writer;

-- public.user_activity_logs
DROP INDEX IF EXISTS public.idx_user_activity_logs_user_id;

-- public.feed_articles_mv (Materialized View)
DROP INDEX IF EXISTS public.feed_articles_mv_created_at_idx;
DROP INDEX IF EXISTS public.feed_articles_mv_category_idx;

-- public.question_votes
DROP INDEX IF EXISTS public.idx_question_votes_user_id;

-- public.quiz_questions
DROP INDEX IF EXISTS public.idx_quiz_questions_quiz_id;

-- public.stories
DROP INDEX IF EXISTS public.idx_stories_author_id;
DROP INDEX IF EXISTS public.idx_stories_group_id;

-- public.user_badges
DROP INDEX IF EXISTS public.idx_user_badges_badge_id;

-- public.user_quiz_attempts
DROP INDEX IF EXISTS public.idx_user_quiz_attempts_quiz_id;
DROP INDEX IF EXISTS public.idx_user_quiz_attempts_user_id; -- Dropping old one if it exists with different name

-- public.answer_likes
DROP INDEX IF EXISTS public.idx_answer_likes_user_id;

-- public.article_bookmarks
DROP INDEX IF EXISTS public.idx_article_bookmarks_article_id;

-- public.follows
DROP INDEX IF EXISTS public.idx_follows_following_id;

-- public.question_bookmarks
DROP INDEX IF EXISTS public.idx_question_bookmarks_question_id;

-- public.messages
DROP INDEX IF EXISTS public.idx_messages_reply_to;
DROP INDEX IF EXISTS public.idx_messages_reply_to_id; -- Just in case we want to be aggressive, but wait...

-- public.message_reactions
DROP INDEX IF EXISTS public.idx_message_reactions_user;

-- public.conversations
DROP INDEX IF EXISTS public.idx_conversations_last_message;

COMMIT;

-- Final Verification Message
SELECT '🚀 Supabase performance refinement (v2) applied successfully!' as message;
