-- Supabase Database Performance & Indexing Optimization
-- Resolves linter warnings: 0001_unindexed_foreign_keys and 0005_unused_index
-- Date: 2026-05-28

BEGIN;

-- 1. Create covering index for the foreign key on public.article_approvals (user_id)
-- Resolves: 0001_unindexed_foreign_keys
CREATE INDEX IF NOT EXISTS idx_article_approvals_user_id ON public.article_approvals (user_id);

-- 2. Drop redundant/duplicate composite indexes that are covered by high-performance idx_fh_ composite indexes
-- Resolves: 0005_unused_index (reduces write overhead and frees disk space)
DROP INDEX IF EXISTS public.idx_answer_likes_user_id;
DROP INDEX IF EXISTS public.idx_article_bookmarks_article_id;
DROP INDEX IF EXISTS public.idx_question_bookmarks_question_id;
DROP INDEX IF EXISTS public.idx_question_votes_user_id;
DROP INDEX IF EXISTS public.idx_article_likes_article_user;
DROP INDEX IF EXISTS public.idx_answer_comment_likes_comment_user;
DROP INDEX IF EXISTS public.idx_question_bookmarks_question_user;
DROP INDEX IF EXISTS public.idx_question_votes_question_user;

DROP INDEX IF EXISTS public.idx_fh_article_likes_article_user;
DROP INDEX IF EXISTS public.idx_fh_article_bookmarks_article_user;
DROP INDEX IF EXISTS public.idx_fh_question_bookmarks_question_user;
DROP INDEX IF EXISTS public.idx_fh_answer_likes_answer_user;
DROP INDEX IF EXISTS public.idx_fh_answer_comment_likes_comment_user;

-- 3. Drop unused single-column indexes on low-cardinality or rarely-filtered fields
DROP INDEX IF EXISTS public.idx_follows_following_id;
DROP INDEX IF EXISTS public.idx_messages_reply_to_id;
DROP INDEX IF EXISTS public.idx_quiz_questions_quiz_id;
DROP INDEX IF EXISTS public.idx_stories_author_id;
DROP INDEX IF EXISTS public.idx_stories_group_id;
DROP INDEX IF EXISTS public.idx_user_badges_badge_id;
DROP INDEX IF EXISTS public.idx_user_quiz_attempts_quiz_id;
DROP INDEX IF EXISTS public.idx_article_notes_user;
DROP INDEX IF EXISTS public.idx_user_quiz_attempts_user_cover;
DROP INDEX IF EXISTS public.idx_profiles_writer;
DROP INDEX IF EXISTS public.idx_dictionary_terms_created;
DROP INDEX IF EXISTS public.idx_articles_published_count;
DROP INDEX IF EXISTS public.idx_questions_votes_desc;
DROP INDEX IF EXISTS public.idx_answer_comments_answer_created_at;
DROP INDEX IF EXISTS public.idx_conversations_last_message_at;

-- 4. Drop redundant or unused trigram (trgm) and text search GIN indexes
DROP INDEX IF EXISTS public.idx_articles_title_trgm;
DROP INDEX IF EXISTS public.trgm_idx_articles_title;
DROP INDEX IF EXISTS public.idx_articles_category_trgm;
DROP INDEX IF EXISTS public.idx_questions_title_trgm;
DROP INDEX IF EXISTS public.idx_questions_content_trgm;
DROP INDEX IF EXISTS public.idx_dictionary_term_trgm;
DROP INDEX IF EXISTS public.idx_dictionary_def_trgm;
DROP INDEX IF EXISTS public.idx_quizzes_description_trgm;
DROP INDEX IF EXISTS public.idx_dictionary_terms_category_trgm;
DROP INDEX IF EXISTS public.idx_articles_category_trgm_published;
DROP INDEX IF EXISTS public.idx_questions_category_trgm_published;

-- Drop generic vector search & embedding indexes if not queried directly
DROP INDEX IF EXISTS public.idx_documents_search_vector;
DROP INDEX IF EXISTS public.idx_documents_embedding;

-- Drop generic search indexes since we use tailored query-specific text-search indexes
DROP INDEX IF EXISTS public.idx_articles_search;
DROP INDEX IF EXISTS public.idx_questions_search;
DROP INDEX IF EXISTS public.idx_dictionary_search;

-- Drop old profiles helper indexes
DROP INDEX IF EXISTS public.idx_profiles_is_writer_reputation;
DROP INDEX IF EXISTS public.idx_fh_profiles_writer_reputation;

-- Drop old Web Vitals generic indexes since we aggregate metrics
DROP INDEX IF EXISTS public.web_vitals_events_name_created_at_idx;
DROP INDEX IF EXISTS public.web_vitals_events_pathname_created_at_idx;

-- 5. Refresh query planner statistics on modified tables
ANALYZE public.article_approvals;
ANALYZE public.articles;
ANALYZE public.questions;
ANALYZE public.answers;
ANALYZE public.answer_likes;
ANALYZE public.answer_comments;
ANALYZE public.answer_comment_likes;
ANALYZE public.question_votes;
ANALYZE public.question_bookmarks;
ANALYZE public.article_bookmarks;
ANALYZE public.article_likes;
ANALYZE public.profiles;
ANALYZE public.stories;
ANALYZE public.story_groups;
ANALYZE public.dictionary_terms;
ANALYZE public.quizzes;
ANALYZE public.quiz_questions;
ANALYZE public.notifications;

COMMIT;
