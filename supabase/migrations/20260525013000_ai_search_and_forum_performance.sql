-- =====================================================
-- Fizikhub AI Search, Forum ve Public Profil Performans Paketi
-- Tarih: 2026-05-25
-- Guvenlik: Veri silmez. Sadece extension, indeks ve private audit view ekler.
-- Hedefler:
--   1. Global aramadaki ILIKE "%term%" sorgularini pg_trgm GIN indeksleriyle hizlandirmak.
--   2. Forum, profil ve sitemap/feed sorgularinda status/author/category/order desenlerini iyilestirmek.
--   3. Indeks kullanimini service_role ile izlenebilir hale getirmek.
-- Rollback ozeti:
--   drop view if exists private.index_usage_watchlist;
--   drop index if exists public.idx_questions_published_votes_created;
--   drop index if exists public.idx_questions_published_category_created;
--   drop index if exists public.idx_questions_author_status_created;
--   drop index if exists public.idx_articles_author_status_created;
--   drop index if exists public.idx_articles_published_created_id;
--   drop index if exists public.idx_articles_title_trgm_published;
--   drop index if exists public.idx_articles_excerpt_trgm_published;
--   drop index if exists public.idx_questions_title_trgm_published;
--   drop index if exists public.idx_questions_content_trgm_published;
--   drop index if exists public.idx_dictionary_terms_term_trgm;
--   drop index if exists public.idx_dictionary_terms_definition_trgm;
--   drop index if exists public.idx_profiles_username_trgm;
--   drop index if exists public.idx_profiles_full_name_trgm;
--   drop index if exists public.idx_quizzes_title_trgm;
-- =====================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

-- Latest article feeds, sitemap generation, profile article tabs.
CREATE INDEX IF NOT EXISTS idx_articles_published_created_id
ON public.articles (created_at DESC, id DESC)
WHERE status = 'published' AND slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_author_status_created
ON public.articles (author_id, status, created_at DESC)
WHERE author_id IS NOT NULL;

-- Forum list, category pages, popular sort and public profile contribution tabs.
CREATE INDEX IF NOT EXISTS idx_questions_published_category_created
ON public.questions (category, created_at DESC, id DESC)
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_questions_published_votes_created
ON public.questions (votes DESC, created_at DESC, id DESC)
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_questions_author_status_created
ON public.questions (author_id, status, created_at DESC)
WHERE author_id IS NOT NULL;

-- Global search fallback uses ILIKE with leading wildcard. pg_trgm is the correct index family for that pattern.
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm_published
ON public.articles USING gin (title gin_trgm_ops)
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_articles_excerpt_trgm_published
ON public.articles USING gin (excerpt gin_trgm_ops)
WHERE status = 'published' AND excerpt IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_questions_title_trgm_published
ON public.questions USING gin (title gin_trgm_ops)
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_questions_content_trgm_published
ON public.questions USING gin (content gin_trgm_ops)
WHERE status = 'published' AND content IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dictionary_terms_term_trgm
ON public.dictionary_terms USING gin (term gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dictionary_terms_definition_trgm
ON public.dictionary_terms USING gin (definition gin_trgm_ops)
WHERE definition IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm
ON public.profiles USING gin (username gin_trgm_ops)
WHERE username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_full_name_trgm
ON public.profiles USING gin (full_name gin_trgm_ops)
WHERE full_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_quizzes_title_trgm
ON public.quizzes USING gin (title gin_trgm_ops);

-- Optional columns vary across older environments, so guard them.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'answers'
          AND column_name = 'is_accepted'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_answers_question_accepted_created
        ON public.answers (question_id, is_accepted DESC, created_at ASC);
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'profiles'
          AND column_name = 'reputation'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_profiles_reputation_public
        ON public.profiles (reputation DESC, created_at ASC)
        WHERE username IS NOT NULL;
    END IF;
END $$;

CREATE OR REPLACE VIEW private.index_usage_watchlist AS
SELECT
    schemaname AS schema_name,
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan AS index_scans,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
    CASE
        WHEN idx_scan = 0 THEN 'review_after_traffic'
        WHEN idx_scan < 25 THEN 'low_usage'
        ELSE 'active'
    END AS usage_status
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY
    CASE WHEN idx_scan = 0 THEN 0 WHEN idx_scan < 25 THEN 1 ELSE 2 END,
    pg_relation_size(indexrelid) DESC,
    indexrelname ASC;

GRANT SELECT ON private.index_usage_watchlist TO service_role;

COMMENT ON VIEW private.index_usage_watchlist
IS 'Public semadaki indekslerin kullanimini izlemek icin private audit view. Yeni indeksler trafik aldiktan sonra dusuk kullanim acisindan kontrol edilmeli.';

ANALYZE public.articles;
ANALYZE public.questions;
ANALYZE public.dictionary_terms;
ANALYZE public.profiles;
ANALYZE public.quizzes;

COMMIT;
