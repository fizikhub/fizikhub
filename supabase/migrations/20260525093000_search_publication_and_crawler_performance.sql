-- =====================================================
-- Fizikhub Public Search, GEO ve Forum Okuma Performansi
-- Tarih: 2026-05-25
-- Guvenlik: Veri silmez. Public arama desenleri, forum okuma sorgulari
-- ve semantic index sagligini izlemek icin indeks/view ekler.
-- Rollback ozeti:
--   drop view if exists private.search_embedding_health;
--   drop view if exists private.search_visibility_violations;
--   drop index if exists public.idx_questions_status_created_public_search;
--   drop index if exists public.idx_questions_category_trgm_published;
--   drop index if exists public.idx_articles_category_trgm_published;
--   drop index if exists public.idx_quizzes_description_trgm;
--   drop index if exists public.idx_dictionary_terms_category_trgm;
--   drop index if exists public.idx_answer_comment_likes_comment_user;
--   drop index if exists public.idx_question_votes_question_user;
--   drop index if exists public.idx_question_bookmarks_question_user;
--   drop index if exists public.idx_article_likes_article_user;
-- =====================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

-- Global arama artik yalnizca published forum sorularini dondurur.
CREATE INDEX IF NOT EXISTS idx_questions_status_created_public_search
ON public.questions (status, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_questions_category_trgm_published
ON public.questions USING gin (category gin_trgm_ops)
WHERE status = 'published' AND category IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_category_trgm_published
ON public.articles USING gin (category gin_trgm_ops)
WHERE status = 'published' AND category IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_quizzes_description_trgm
ON public.quizzes USING gin (description gin_trgm_ops)
WHERE description IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dictionary_terms_category_trgm
ON public.dictionary_terms USING gin (category gin_trgm_ops)
WHERE category IS NOT NULL;

-- Forum ve makale detay sayfalari botlar tarafindan sik okundugu icin
-- daha once duz tek kolonlu kalan kullanici etkilesim tablolarini tamamla.
CREATE INDEX IF NOT EXISTS idx_answer_comment_likes_comment_user
ON public.answer_comment_likes (comment_id, user_id);

CREATE INDEX IF NOT EXISTS idx_question_votes_question_user
ON public.question_votes (question_id, user_id);

CREATE INDEX IF NOT EXISTS idx_question_bookmarks_question_user
ON public.question_bookmarks (question_id, user_id);

CREATE INDEX IF NOT EXISTS idx_article_likes_article_user
ON public.article_likes (article_id, user_id);

CREATE OR REPLACE VIEW private.search_embedding_health AS
SELECT
    count(*)::bigint AS document_count,
    count(*) FILTER (WHERE embedding IS NULL)::bigint AS missing_embedding_count,
    count(*) FILTER (WHERE embedding IS NOT NULL AND vector_dims(embedding) <> 768)::bigint AS invalid_dimension_count,
    count(*) FILTER (WHERE coalesce(metadata->>'canonical_path', '') = '')::bigint AS missing_canonical_path_count,
    max(id) AS newest_document_id
FROM public.documents;

CREATE OR REPLACE VIEW private.search_visibility_violations AS
SELECT
    doc.id AS document_id,
    doc.metadata->>'source_type' AS source_type,
    doc.metadata->>'source_id' AS source_id,
    doc.metadata->>'title' AS title,
    doc.metadata->>'canonical_path' AS canonical_path,
    a.status AS public_status
FROM public.documents doc
JOIN public.articles a
    ON doc.metadata->>'source_type' = 'article'
    AND doc.metadata->>'source_id' = a.id::text
WHERE coalesce(a.status, '') <> 'published'

UNION ALL

SELECT
    doc.id,
    doc.metadata->>'source_type',
    doc.metadata->>'source_id',
    doc.metadata->>'title',
    doc.metadata->>'canonical_path',
    q.status
FROM public.documents doc
JOIN public.questions q
    ON doc.metadata->>'source_type' = 'question'
    AND doc.metadata->>'source_id' = q.id::text
WHERE coalesce(q.status, '') <> 'published';

GRANT SELECT ON private.search_embedding_health TO service_role;
GRANT SELECT ON private.search_visibility_violations TO service_role;

COMMENT ON VIEW private.search_embedding_health
IS 'Semantic search documents tablosunda embedding boyutu, eksik embedding ve kanonik path sagligini izler.';

COMMENT ON VIEW private.search_visibility_violations
IS 'Public arama indexinde kalmamasi gereken unpublished article/question belgelerini gosterir.';

ANALYZE public.questions;
ANALYZE public.articles;
ANALYZE public.quizzes;
ANALYZE public.dictionary_terms;
ANALYZE public.answer_comment_likes;
ANALYZE public.question_votes;
ANALYZE public.question_bookmarks;
ANALYZE public.article_likes;
ANALYZE public.documents;

COMMIT;
