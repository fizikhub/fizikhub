-- ===================================================
-- Supabase Performance & Security Optimization (v3)
-- ===================================================

-- 1. Helper Function: Drop all policies for a table
CREATE OR REPLACE FUNCTION public.drop_all_policies_for_table(p_table_name text)
RETURNS void AS $$
DECLARE
    p_rec record;
BEGIN
    FOR p_rec IN SELECT policyname FROM pg_policies WHERE tablename = p_table_name AND schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', p_rec.policyname, p_table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2. Performance: Auth Wrapper Functions (STABLE)
-- This avoids re-calculating auth context for every row, solving "Auth RLS Init Plan" warnings.
CREATE OR REPLACE FUNCTION public.request_uid()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.request_role()
RETURNS text LANGUAGE sql STABLE AS $$
  SELECT auth.role();
$$;

-- 3. Cleanup Duplicate Indexes on public.profiles
-- The Performance Advisor detects cases where two or more identical indexes exist.
DROP INDEX IF EXISTS public.profiles_id_idx;
DROP INDEX IF EXISTS public.idx_profiles_id;
DROP INDEX IF EXISTS public.profiles_pkey_idx;

-- 4. Unified RLS Policies (Solves "Multiple Permissive Policies")
-- Instead of having multiple policies for the same action (SELECT/INSERT/etc) which adds overhead,
-- we consolidate them into single or logically separated policies using our stable functions.

-- --- Profiles ---
SELECT drop_all_policies_for_table('profiles');
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_write" ON public.profiles FOR UPDATE USING (id = public.request_uid()) WITH CHECK (id = public.request_uid());
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = public.request_uid() AND role = 'admin')
);

-- --- Notifications ---
SELECT drop_all_policies_for_table('notifications');
CREATE POLICY "notifications_owner_all" ON public.notifications FOR ALL USING (recipient_id = public.request_uid());

-- --- Stories ---
SELECT drop_all_policies_for_table('stories');
CREATE POLICY "stories_read_all" ON public.stories FOR SELECT USING (true);
CREATE POLICY "stories_author_manage" ON public.stories FOR ALL USING (author_id = public.request_uid());

-- --- Story Groups ---
SELECT drop_all_policies_for_table('story_groups');
CREATE POLICY "story_groups_read_all" ON public.story_groups FOR SELECT USING (true);
CREATE POLICY "story_groups_admin_manage" ON public.story_groups FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = public.request_uid() AND role = 'admin')
);

-- 5. Performance Indexes (Recommended for high-traffic fields)
CREATE INDEX IF NOT EXISTS idx_articles_status_slug ON public.articles(status, slug);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON public.questions(author_id);
CREATE INDEX IF NOT EXISTS idx_answers_author_id ON public.answers(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON public.stories(author_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Cleanup
DROP FUNCTION IF EXISTS public.drop_all_policies_for_table(text);

SELECT '🚀 Optimization Script Completed Successfully! Please run this in your Supabase SQL Editor.' as message;
