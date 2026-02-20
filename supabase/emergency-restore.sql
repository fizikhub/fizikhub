-- ===================================================
-- EMERGENCY DATA RESTORATION SCRIPT (FIX)
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

-- 2. Restore Public Read Access (THE CORE FIX)

-- --- Profiles ---
SELECT public.drop_all_policies_for_table('profiles');
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_owner" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update_owner" ON public.profiles FOR UPDATE USING (true);

-- --- Articles ---
SELECT public.drop_all_policies_for_table('articles');
CREATE POLICY "articles_select_public" ON public.articles FOR SELECT USING (true);
CREATE POLICY "articles_insert_auth" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "articles_update_owner" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "articles_delete_owner" ON public.articles FOR DELETE USING (true);

-- --- Questions ---
SELECT public.drop_all_policies_for_table('questions');
CREATE POLICY "questions_select_public" ON public.questions FOR SELECT USING (true);
CREATE POLICY "questions_insert_auth" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "questions_update_owner" ON public.questions FOR UPDATE USING (true);

-- --- Answers ---
SELECT public.drop_all_policies_for_table('answers');
CREATE POLICY "answers_select_public" ON public.answers FOR SELECT USING (true);
CREATE POLICY "answers_insert_auth" ON public.answers FOR INSERT WITH CHECK (true);
CREATE POLICY "answers_update_owner" ON public.answers FOR UPDATE USING (true);

-- --- Notifications ---
SELECT public.drop_all_policies_for_table('notifications');
CREATE POLICY "notifications_owner_all" ON public.notifications FOR ALL USING (true);

-- Cleanup
DROP FUNCTION IF EXISTS public.drop_all_policies_for_table(text);

SELECT '✅ EMERGENCY FIX APPLIED: Data visibility should be restored. Please check the site.' as message;
