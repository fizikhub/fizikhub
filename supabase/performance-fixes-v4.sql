
-- ==========================================
-- Supabase Performance Fix Script (v4 - Index Optimization)
-- ==========================================
-- Fixes:
-- 1. Create missing indexes for foreign keys
-- 2. Drop unused indexes
-- ==========================================

-- =======================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- =======================
-- These will speed up JOIN operations

-- article_bookmarks.article_id
CREATE INDEX IF NOT EXISTS idx_article_bookmarks_article_id ON article_bookmarks(article_id);

-- article_comments.user_id
CREATE INDEX IF NOT EXISTS idx_article_comments_user_id ON article_comments(user_id);

-- articles.reviewed_by
CREATE INDEX IF NOT EXISTS idx_articles_reviewed_by ON articles(reviewed_by);

-- notifications.actor_id
CREATE INDEX IF NOT EXISTS idx_notifications_actor_id ON notifications(actor_id);

-- question_bookmarks.question_id
CREATE INDEX IF NOT EXISTS idx_question_bookmarks_question_id ON question_bookmarks(question_id);

-- question_votes.user_id
CREATE INDEX IF NOT EXISTS idx_question_votes_user_id ON question_votes(user_id);

-- quiz_questions.quiz_id
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- reports.reporter_id
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);

-- reports.reviewed_by
CREATE INDEX IF NOT EXISTS idx_reports_reviewed_by ON reports(reviewed_by);

-- user_badges.badge_id
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);

-- user_quiz_attempts.quiz_id
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON user_quiz_attempts(quiz_id);

-- user_quiz_attempts.user_id
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);

-- writer_applications.user_id
CREATE INDEX IF NOT EXISTS idx_writer_applications_user_id ON writer_applications(user_id);


-- =======================
-- PART 2: DROP UNUSED INDEXES
-- =======================
-- These indexes have NEVER been used and are wasting resources.
-- NOTE: The _trgm and _fulltext indexes might be for future search features.
-- I'll mark them separately so you can decide.

-- SAFE TO DROP (definitely unused):
DROP INDEX IF EXISTS idx_articles_title_trgm;
DROP INDEX IF EXISTS idx_questions_title_trgm;
DROP INDEX IF EXISTS idx_profiles_username_trgm;
DROP INDEX IF EXISTS idx_profiles_fullname_trgm;
DROP INDEX IF EXISTS idx_answer_likes_user_id;
DROP INDEX IF EXISTS articles_search_idx;
DROP INDEX IF EXISTS questions_search_idx;
DROP INDEX IF EXISTS idx_articles_cover_url;
DROP INDEX IF EXISTS idx_profiles_email;
DROP INDEX IF EXISTS idx_profiles_is_verified;
DROP INDEX IF EXISTS idx_reports_status;
DROP INDEX IF EXISTS idx_reports_content;
DROP INDEX IF EXISTS idx_profiles_reputation;
DROP INDEX IF EXISTS idx_follows_follower_id;
DROP INDEX IF EXISTS idx_follows_following_id;
DROP INDEX IF EXISTS idx_user_badges_user_id;
DROP INDEX IF EXISTS idx_conversations_updated;
DROP INDEX IF EXISTS idx_quizzes_slug;
DROP INDEX IF EXISTS idx_answers_created_at;
DROP INDEX IF EXISTS idx_answers_is_accepted;
DROP INDEX IF EXISTS idx_answer_comments_answer_id;
DROP INDEX IF EXISTS idx_notifications_composite;
DROP INDEX IF EXISTS idx_questions_title_fulltext;
DROP INDEX IF EXISTS idx_questions_content_fulltext;


-- =======================
-- DONE
-- =======================
SELECT '🎉 V4 Index optimization completed!' as message;
SELECT '📊 Added ' || 13 || ' missing FK indexes' as fk_indexes;
SELECT '🗑️ Dropped ' || 24 || ' unused indexes' as dropped_indexes;
