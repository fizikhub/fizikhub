-- =====================================================================================
-- Fizikhub Supabase SQL Editor Performance Pack
-- Date: 2026-05-03
--
-- Paste this file into Supabase Dashboard > SQL Editor and run it once.
-- It only adds safe indexes/extensions/statistics; it does not drop existing indexes.
-- Supabase SQL Editor may wrap queries in a transaction, so this version avoids
-- CREATE INDEX CONCURRENTLY and runs as one pasteable script.
-- =====================================================================================

-- Text search acceleration for ILIKE queries in /makale and /ara.
create extension if not exists pg_trgm;

-- -------------------------------------------------------------------------------------
-- Articles: homepage feed, /makale library, article detail, related articles, search.
-- -------------------------------------------------------------------------------------
create index if not exists idx_fh_articles_published_created_id
    on public.articles (created_at desc, id desc)
    where status = 'published';

create index if not exists idx_fh_articles_published_category_created
    on public.articles (category, created_at desc, id desc)
    where status = 'published' and category is not null;

create index if not exists idx_fh_articles_published_slug
    on public.articles (slug)
    where status = 'published';

create index if not exists idx_fh_articles_author_status_created
    on public.articles (author_id, status, created_at desc);

create index if not exists idx_fh_articles_title_trgm_published
    on public.articles using gin (title gin_trgm_ops)
    where status = 'published';

create index if not exists idx_fh_articles_excerpt_trgm_published
    on public.articles using gin (excerpt gin_trgm_ops)
    where status = 'published' and excerpt is not null;

-- Article detail side data.
create index if not exists idx_fh_article_likes_article_user
    on public.article_likes (article_id, user_id);

create index if not exists idx_fh_article_bookmarks_article_user
    on public.article_bookmarks (article_id, user_id);

create index if not exists idx_fh_article_comments_article_created_user
    on public.article_comments (article_id, created_at asc, user_id);

create index if not exists idx_fh_article_references_article_created
    on public.article_references (article_id, created_at asc);

-- -------------------------------------------------------------------------------------
-- Forum: /forum listing, detail page, vote/like/comment side queries.
-- -------------------------------------------------------------------------------------
create index if not exists idx_fh_questions_created_id
    on public.questions (created_at desc, id desc);

create index if not exists idx_fh_questions_votes_created
    on public.questions (votes desc, created_at desc, id desc);

create index if not exists idx_fh_questions_category_created
    on public.questions (category, created_at desc, id desc)
    where category is not null;

create index if not exists idx_fh_questions_author_created
    on public.questions (author_id, created_at desc);

create index if not exists idx_fh_questions_title_trgm
    on public.questions using gin (title gin_trgm_ops);

create index if not exists idx_fh_answers_question_created
    on public.answers (question_id, created_at asc, id asc);

create index if not exists idx_fh_answers_author_created
    on public.answers (author_id, created_at desc);

create index if not exists idx_fh_answer_likes_answer_user
    on public.answer_likes (answer_id, user_id);

create index if not exists idx_fh_answer_comments_answer_created_user
    on public.answer_comments (answer_id, created_at asc, author_id);

create index if not exists idx_fh_answer_comment_likes_comment_user
    on public.answer_comment_likes (comment_id, user_id);

create index if not exists idx_fh_question_votes_question_user
    on public.question_votes (question_id, user_id);

create index if not exists idx_fh_question_bookmarks_question_user
    on public.question_bookmarks (question_id, user_id);

-- -------------------------------------------------------------------------------------
-- Profiles, stories, dictionary, quizzes, notifications.
-- -------------------------------------------------------------------------------------
create index if not exists idx_fh_profiles_writer_reputation
    on public.profiles (reputation desc, id)
    where is_writer = true;

create index if not exists idx_fh_profiles_username_not_null
    on public.profiles (username)
    where username is not null;

create index if not exists idx_fh_stories_active_created
    on public.stories (expires_at, created_at desc)
    where expires_at is not null;

create index if not exists idx_fh_story_groups_created
    on public.story_groups (created_at desc, id desc);

create index if not exists idx_fh_dictionary_terms_term
    on public.dictionary_terms (term asc);

create index if not exists idx_fh_quizzes_created
    on public.quizzes (created_at desc, id desc);

create index if not exists idx_fh_quiz_questions_quiz_order
    on public.quiz_questions (quiz_id, "order" asc);

create index if not exists idx_fh_notifications_recipient_read_created
    on public.notifications (recipient_id, is_read, created_at desc);

-- Refresh planner statistics after the new indexes exist.
analyze public.articles;
analyze public.article_likes;
analyze public.article_bookmarks;
analyze public.article_comments;
analyze public.article_references;
analyze public.questions;
analyze public.answers;
analyze public.answer_likes;
analyze public.answer_comments;
analyze public.answer_comment_likes;
analyze public.question_votes;
analyze public.question_bookmarks;
analyze public.profiles;
analyze public.stories;
analyze public.story_groups;
analyze public.dictionary_terms;
analyze public.quizzes;
analyze public.quiz_questions;
analyze public.notifications;

-- Optional post-run checks:
-- 1) Supabase Dashboard > Database > Query Performance > Index Advisor
-- 2) Supabase Dashboard > Database > Performance Advisor
-- 3) If pg_stat_statements is enabled, inspect slow statements after real traffic:
-- select calls, mean_exec_time, rows, query
-- from pg_stat_statements
-- order by total_exec_time desc
-- limit 20;

select 'Fizikhub performance indexes created. Check Query Performance after new traffic lands.' as message;
