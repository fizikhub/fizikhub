-- Create Materialized View for homepage feed (articles)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.feed_articles_mv AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.cover_url,
    a.content,
    a.status,
    a.author_id,
    a.category,
    a.created_at,
    p.full_name AS author_full_name,
    p.username AS author_username,
    p.avatar_url AS author_avatar_url,
    p.is_writer AS author_is_writer
FROM public.articles a
JOIN public.profiles p ON a.author_id = p.id
WHERE a.status = 'published';

-- Unique index is required for REFRESH MATERIALIZED VIEW CONCURRENTLY
CREATE UNIQUE INDEX IF NOT EXISTS feed_articles_mv_id_idx ON public.feed_articles_mv (id);
CREATE INDEX IF NOT EXISTS feed_articles_mv_created_at_idx ON public.feed_articles_mv (created_at DESC);
CREATE INDEX IF NOT EXISTS feed_articles_mv_category_idx ON public.feed_articles_mv (category);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION public.refresh_feed_articles_mv()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.feed_articles_mv;
    RETURN NULL;
END;
$$;

-- Trigger to refresh when articles change
DROP TRIGGER IF EXISTS refresh_feed_articles_mv_trigger ON public.articles;
CREATE TRIGGER refresh_feed_articles_mv_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.articles
FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_feed_articles_mv();

-- Trigger to refresh when profiles change
DROP TRIGGER IF EXISTS refresh_feed_articles_mv_profile_trigger ON public.profiles;
CREATE TRIGGER refresh_feed_articles_mv_profile_trigger
AFTER UPDATE ON public.profiles
FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_feed_articles_mv();

-- Secure the Materialized view (RLS doesn't apply directly to views, but we can grant select)
GRANT SELECT ON public.feed_articles_mv TO anon, authenticated;
