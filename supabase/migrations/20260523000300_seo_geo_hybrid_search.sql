-- =====================================================
-- FizikHub SEO/GEO Hybrid Search ve Gözlem Katmanı
-- Tarih: 2026-05-23
-- Güvenlik: Veri silmez; indeks, RPC ve private gözlem view'ları ekler.
-- Rollback özeti:
--   drop function if exists public.hybrid_search_documents(public.vector(768), text, int, float);
--   drop view if exists private.search_document_sync_status;
--   drop view if exists private.low_value_indexable_content;
--   drop index if exists public.idx_documents_search_vector;
--   alter table public.documents drop column if exists search_vector;
-- =====================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS vector;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector(
        'turkish',
        trim(
            coalesce(metadata->>'title', '') || ' ' ||
            coalesce(metadata->>'slug', '') || ' ' ||
            coalesce(content, '')
        )
    )
) STORED;

CREATE INDEX IF NOT EXISTS idx_documents_search_vector
ON public.documents USING gin (search_vector);

CREATE INDEX IF NOT EXISTS idx_documents_embedding
ON public.documents USING hnsw (embedding vector_cosine_ops);

CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_source_unique
ON public.documents ((metadata->>'source_type'), (metadata->>'source_id'));

CREATE OR REPLACE FUNCTION public.hybrid_search_documents (
    query_embedding public.vector(768),
    query_text text,
    match_count int DEFAULT 8,
    match_threshold float DEFAULT 0.45
)
RETURNS TABLE (
    id bigint,
    content text,
    similarity float,
    keyword_rank float,
    hybrid_score float,
    source_id text,
    source_type text,
    title text,
    slug text,
    canonical_path text,
    cover_image text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    WITH query_terms AS (
        SELECT websearch_to_tsquery('turkish', coalesce(query_text, '')) AS tsq
    ),
    scored AS (
        SELECT
            d.id,
            d.content,
            (1 - (d.embedding <=> query_embedding))::float AS vector_similarity,
            CASE
                WHEN numnode(query_terms.tsq) > 0
                    THEN ts_rank_cd(d.search_vector, query_terms.tsq)::float
                ELSE 0::float
            END AS text_rank,
            (d.metadata->>'source_id')::text AS source_id,
            (d.metadata->>'source_type')::text AS source_type,
            (d.metadata->>'title')::text AS title,
            (d.metadata->>'slug')::text AS slug,
            (d.metadata->>'canonical_path')::text AS metadata_canonical_path,
            (d.metadata->>'cover_image')::text AS cover_image
        FROM public.documents d
        CROSS JOIN query_terms
        WHERE
            (1 - (d.embedding <=> query_embedding)) > match_threshold
            OR (
                numnode(query_terms.tsq) > 0
                AND d.search_vector @@ query_terms.tsq
            )
    )
    SELECT
        scored.id,
        scored.content,
        scored.vector_similarity AS similarity,
        scored.text_rank AS keyword_rank,
        (
            scored.vector_similarity * 0.7 +
            least(scored.text_rank, 1)::float * 0.3
        )::float AS hybrid_score,
        scored.source_id,
        scored.source_type,
        scored.title,
        scored.slug,
        coalesce(
            scored.metadata_canonical_path,
            CASE
                WHEN scored.source_type = 'question' THEN '/forum/' || scored.source_id
                WHEN scored.source_type = 'dictionary' THEN '/sozluk/' || scored.slug
                WHEN scored.source_type = 'quiz' THEN '/testler/' || scored.slug
                WHEN scored.source_type = 'article' THEN '/makale/' || coalesce(scored.slug, scored.source_id)
                ELSE NULL
            END
        ) AS canonical_path,
        scored.cover_image
    FROM scored
    ORDER BY hybrid_score DESC, similarity DESC, keyword_rank DESC
    LIMIT greatest(match_count, 1);
$$;

GRANT EXECUTE ON FUNCTION public.hybrid_search_documents(public.vector(768), text, int, float)
TO anon, authenticated, service_role;

CREATE OR REPLACE VIEW private.search_document_sync_status AS
WITH expected_sources AS (
    SELECT
        'article'::text AS source_type,
        a.id::text AS source_id,
        a.title,
        '/makale/' || coalesce(a.slug, a.id::text) AS expected_path,
        a.updated_at
    FROM public.articles a
    WHERE coalesce(a.status = 'published', a.published = true)

    UNION ALL

    SELECT
        'question',
        q.id::text,
        q.title,
        '/forum/' || q.id::text,
        q.created_at
    FROM public.questions q
    WHERE q.status = 'published'

    UNION ALL

    SELECT
        'dictionary',
        d.id::text,
        d.term,
        '/sozluk/' || lower(regexp_replace(d.term, '\s+', '-', 'g')),
        d.created_at
    FROM public.dictionary_terms d

    UNION ALL

    SELECT
        'quiz',
        qz.id::text,
        qz.title,
        '/testler/' || qz.slug,
        qz.created_at
    FROM public.quizzes qz
)
SELECT
    expected_sources.*,
    doc.id AS document_id,
    doc.id IS NOT NULL AS is_synced,
    doc.metadata->>'canonical_path' AS indexed_canonical_path
FROM expected_sources
LEFT JOIN public.documents doc
    ON doc.metadata->>'source_type' = expected_sources.source_type
    AND doc.metadata->>'source_id' = expected_sources.source_id;

CREATE OR REPLACE VIEW private.low_value_indexable_content AS
SELECT
    'article'::text AS source_type,
    a.id::text AS source_id,
    a.title,
    '/makale/' || coalesce(a.slug, a.id::text) AS canonical_path,
    length(regexp_replace(coalesce(a.excerpt, '') || ' ' || coalesce(a.content, ''), '\s+', ' ', 'g')) AS visible_text_length,
    a.updated_at
FROM public.articles a
WHERE coalesce(a.status = 'published', a.published = true)
  AND length(regexp_replace(coalesce(a.excerpt, '') || ' ' || coalesce(a.content, ''), '\s+', ' ', 'g')) < 240

UNION ALL

SELECT
    'question',
    q.id::text,
    q.title,
    '/forum/' || q.id::text,
    length(regexp_replace(coalesce(q.title, '') || ' ' || coalesce(q.content, ''), '\s+', ' ', 'g')) AS visible_text_length,
    q.created_at
FROM public.questions q
WHERE q.status = 'published'
  AND length(regexp_replace(coalesce(q.title, '') || ' ' || coalesce(q.content, ''), '\s+', ' ', 'g')) < 120;

GRANT SELECT ON private.search_document_sync_status TO service_role;
GRANT SELECT ON private.low_value_indexable_content TO service_role;

COMMENT ON FUNCTION public.hybrid_search_documents(public.vector(768), text, int, float)
IS 'FizikHub global arama için semantic vector + Turkish full-text hybrid ranking RPC.';

COMMENT ON VIEW private.search_document_sync_status
IS 'Published içeriklerin public.documents semantic index kaydıyla senkron olup olmadığını gösteren private audit view.';

COMMENT ON VIEW private.low_value_indexable_content
IS 'Indexlenebilir görünen ama metin hacmi zayıf olan article/question kayıtlarını gösteren private SEO audit view.';

COMMIT;
