-- =====================================================
-- Fizikhub OpenSearch Suggestions RPC
-- Tarih: 2026-05-25
-- Guvenlik: Veri silmez. Yalnizca public arama onerileri icin read-only RPC ekler.
-- Hedefler:
--   1. /api/search/suggestions endpoint'indeki coklu sorgulari tek Postgres round-trip'e indirmek.
--   2. Mevcut pg_trgm indekslerinden yararlanarak makale, forum, sozluk ve test onerilerini siralamak.
--   3. Anon/authenticated istemciler icin sadece published/public icerik dondurmek.
-- Rollback ozeti:
--   drop function if exists public.search_suggestions(text, integer);
-- =====================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION public.search_suggestions(
    search_text text,
    match_count integer DEFAULT 8
)
RETURNS TABLE (
    source_type text,
    title text,
    description text,
    url text,
    rank_score double precision
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    clean_query text := left(btrim(regexp_replace(coalesce(search_text, ''), '[[:space:]]+', ' ', 'g')), 80);
    escaped_query text;
    like_query text;
    safe_limit integer := least(greatest(coalesce(match_count, 8), 1), 20);
BEGIN
    IF length(clean_query) < 2 THEN
        RETURN;
    END IF;

    escaped_query := replace(
        replace(
            replace(clean_query, chr(92), chr(92) || chr(92)),
            '%',
            chr(92) || '%'
        ),
        '_',
        chr(92) || '_'
    );
    like_query := '%' || escaped_query || '%';

    RETURN QUERY
    WITH candidates AS (
        SELECT
            'article'::text AS source_type,
            a.title::text AS title,
            nullif(left(regexp_replace(coalesce(a.excerpt, a.category, ''), '[[:space:]]+', ' ', 'g'), 160), '')::text AS description,
            ('/makale/' || a.slug)::text AS url,
            (
                42
                + 48 * greatest(
                    similarity(coalesce(a.title, ''), clean_query),
                    similarity(coalesce(a.category, ''), clean_query),
                    similarity(coalesce(a.excerpt, ''), clean_query) * 0.70
                )
                + CASE WHEN lower(a.title) = lower(clean_query) THEN 45 ELSE 0 END
                + CASE WHEN a.title ILIKE escaped_query || '%' ESCAPE E'\\' THEN 16 ELSE 0 END
            )::double precision AS rank_score
        FROM public.articles a
        WHERE a.status = 'published'
          AND a.slug IS NOT NULL
          AND (
              a.title ILIKE like_query ESCAPE E'\\'
              OR a.excerpt ILIKE like_query ESCAPE E'\\'
              OR a.category ILIKE like_query ESCAPE E'\\'
          )

        UNION ALL

        SELECT
            'question'::text AS source_type,
            q.title::text AS title,
            nullif(left(regexp_replace(coalesce(q.content, q.category, ''), '[[:space:]]+', ' ', 'g'), 160), '')::text AS description,
            ('/forum/' || q.id::text)::text AS url,
            (
                36
                + 44 * greatest(
                    similarity(coalesce(q.title, ''), clean_query),
                    similarity(coalesce(q.category, ''), clean_query),
                    similarity(coalesce(q.content, ''), clean_query) * 0.62
                )
                + CASE WHEN lower(q.title) = lower(clean_query) THEN 42 ELSE 0 END
                + CASE WHEN q.title ILIKE escaped_query || '%' ESCAPE E'\\' THEN 14 ELSE 0 END
            )::double precision AS rank_score
        FROM public.questions q
        WHERE q.status = 'published'
          AND (
              q.title ILIKE like_query ESCAPE E'\\'
              OR q.content ILIKE like_query ESCAPE E'\\'
              OR q.category ILIKE like_query ESCAPE E'\\'
          )

        UNION ALL

        SELECT
            'dictionary'::text AS source_type,
            d.term::text AS title,
            nullif(left(regexp_replace(coalesce(d.definition, d.category, ''), '[[:space:]]+', ' ', 'g'), 160), '')::text AS description,
            (
                '/sozluk/' || regexp_replace(
                    regexp_replace(
                        regexp_replace(
                            lower(translate(d.term, 'ğüşıöçĞÜŞİIÖÇ', 'gusiocgusiioc')),
                            '[^a-z0-9[:space:]-]',
                            '',
                            'g'
                        ),
                        '[[:space:]]+',
                        '-',
                        'g'
                    ),
                    '(^-|-$)',
                    '',
                    'g'
                )
            )::text AS url,
            (
                40
                + 50 * greatest(
                    similarity(coalesce(d.term, ''), clean_query),
                    similarity(coalesce(d.category, ''), clean_query),
                    similarity(coalesce(d.definition, ''), clean_query) * 0.56
                )
                + CASE WHEN lower(d.term) = lower(clean_query) THEN 50 ELSE 0 END
                + CASE WHEN d.term ILIKE escaped_query || '%' ESCAPE E'\\' THEN 18 ELSE 0 END
            )::double precision AS rank_score
        FROM public.dictionary_terms d
        WHERE d.term ILIKE like_query ESCAPE E'\\'
           OR d.definition ILIKE like_query ESCAPE E'\\'
           OR d.category ILIKE like_query ESCAPE E'\\'

        UNION ALL

        SELECT
            'quiz'::text AS source_type,
            z.title::text AS title,
            nullif(left(regexp_replace(coalesce(z.description, 'Fizikhub fizik testi'), '[[:space:]]+', ' ', 'g'), 160), '')::text AS description,
            ('/testler/' || z.slug)::text AS url,
            (
                30
                + 40 * greatest(
                    similarity(coalesce(z.title, ''), clean_query),
                    similarity(coalesce(z.description, ''), clean_query) * 0.62
                )
                + CASE WHEN lower(z.title) = lower(clean_query) THEN 40 ELSE 0 END
                + CASE WHEN z.title ILIKE escaped_query || '%' ESCAPE E'\\' THEN 12 ELSE 0 END
            )::double precision AS rank_score
        FROM public.quizzes z
        WHERE z.slug IS NOT NULL
          AND (
              z.title ILIKE like_query ESCAPE E'\\'
              OR z.description ILIKE like_query ESCAPE E'\\'
          )
    ),
    deduped AS (
        SELECT DISTINCT ON (candidates.url)
            candidates.source_type,
            candidates.title,
            candidates.description,
            candidates.url,
            candidates.rank_score
        FROM candidates
        WHERE candidates.title IS NOT NULL
          AND candidates.url IS NOT NULL
        ORDER BY candidates.url, candidates.rank_score DESC
    )
    SELECT
        deduped.source_type,
        deduped.title,
        deduped.description,
        deduped.url,
        deduped.rank_score
    FROM deduped
    ORDER BY deduped.rank_score DESC, deduped.title ASC
    LIMIT safe_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.search_suggestions(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_suggestions(text, integer) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.search_suggestions(text, integer)
IS 'OpenSearch ve arama autocomplete icin public iceriklerden rankli oneriler dondurur. Uygulama migration uygulanana kadar TypeScript fallback kullanabilir.';

ANALYZE public.articles;
ANALYZE public.questions;
ANALYZE public.dictionary_terms;
ANALYZE public.quizzes;

COMMIT;
