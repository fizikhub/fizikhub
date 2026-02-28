-- ==========================================
-- FizikHub Supabase Security Hardening v4
-- ==========================================
-- This script addresses WARN level security linter issues:
-- 1. [SECURITY] Function Search Path Mutable (Fixed search_path)
-- 2. [SECURITY] Materialized View in API (Restricting public access)
-- 3. [SECURITY] RLS Policy Always True (Hardening owner-based checks)
-- ==========================================

BEGIN;

-- ==========================================
-- 1. FIXING FUNCTION SEARCH PATHS
-- ==========================================
-- Preventing search_path hijacking by setting a fixed value.

ALTER FUNCTION public.request_role() SET search_path = public, auth;
ALTER FUNCTION public.request_uid() SET search_path = public, auth;
ALTER FUNCTION public.refresh_feed_articles_mv() SET search_path = public;


-- ==========================================
-- 2. SECURING MATERIALIZED VIEWS
-- ==========================================
-- Restricting direct API access to the materialized view.
-- Only authenticated users or service_role should access it directly if needed,
-- or it should be kept for server-side usage.

REVOKE SELECT ON public.feed_articles_mv FROM anon;
-- If you want authenticated users to still see the feed (recommended for performance):
GRANT SELECT ON public.feed_articles_mv TO authenticated;


-- ==========================================
-- 3. HARDENING RLS POLICIES (ALWAYS TRUE FIXES)
-- ==========================================
-- Replacing permissive "true" checks with actual owner/auth checks.

-- public.answers
DROP POLICY IF EXISTS "answers_insert_auth" ON public.answers;
CREATE POLICY "answers_insert_auth"
    ON public.answers FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL); -- Ensure it's an authenticated user

DROP POLICY IF EXISTS "answers_update_owner" ON public.answers;
CREATE POLICY "answers_update_owner"
    ON public.answers FOR UPDATE
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

-- public.articles
DROP POLICY IF EXISTS "articles_delete_owner" ON public.articles;
CREATE POLICY "articles_delete_owner"
    ON public.articles FOR DELETE
    USING (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "articles_insert_auth" ON public.articles;
CREATE POLICY "articles_insert_auth"
    ON public.articles FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "articles_update_owner" ON public.articles;
CREATE POLICY "articles_update_owner"
    ON public.articles FOR UPDATE
    USING (author_id = (SELECT auth.uid()))
    WITH CHECK (author_id = (SELECT auth.uid()));

-- public.notifications
DROP POLICY IF EXISTS "notifications_owner_all" ON public.notifications;
CREATE POLICY "notifications_owner_all"
    ON public.notifications FOR ALL
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

-- public.profiles
DROP POLICY IF EXISTS "profiles_insert_owner" ON public.profiles;
CREATE POLICY "profiles_insert_owner"
    ON public.profiles FOR INSERT
    WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "profiles_update_owner" ON public.profiles;
CREATE POLICY "profiles_update_owner"
    ON public.profiles FOR UPDATE
    USING (id = (SELECT auth.uid()))
    WITH CHECK (id = (SELECT auth.uid()));

-- public.questions
DROP POLICY IF EXISTS "questions_insert_auth" ON public.questions;
CREATE POLICY "questions_insert_auth"
    ON public.questions FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "questions_update_owner" ON public.questions;
CREATE POLICY "questions_update_owner"
    ON public.questions FOR UPDATE
    USING (author_id = (SELECT auth.uid()))
    WITH CHECK (author_id = (SELECT auth.uid()));

COMMIT;

-- Final Verification Message
SELECT '🛡️ Supabase security hardening (V4) applied successfully!' as message;
