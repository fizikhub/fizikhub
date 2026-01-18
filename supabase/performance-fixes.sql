-- ==========================================
-- Supabase Performance Fix Script (v2 - Safer)
-- ==========================================
-- This script fixes "Auth RLS Init Plan" and "Multiple Permissive Policies" warnings.
--
-- SAFETY: Each table section is wrapped in BEGIN...EXCEPTION...END blocks.
-- If one table fails, it will log the error and continue with others.
--
-- Run this in Supabase SQL Editor
-- ==========================================

-- Helper: Drop all policies for a table
CREATE OR REPLACE FUNCTION drop_all_policies_for_table(p_table_name text)
RETURNS void AS $$
DECLARE
    p_rec record;
BEGIN
    FOR p_rec IN SELECT policyname FROM pg_policies WHERE tablename = p_table_name AND schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', p_rec.policyname, p_table_name);
        RAISE NOTICE 'Dropped policy: % on %', p_rec.policyname, p_table_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =======================
-- ARTICLES
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('articles');
    
    EXECUTE 'CREATE POLICY "articles_select" ON articles FOR SELECT USING (
        status = ''published'' 
        OR author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    EXECUTE 'CREATE POLICY "articles_insert" ON articles FOR INSERT WITH CHECK (
        auth.role() = ''authenticated''
    )';
    
    EXECUTE 'CREATE POLICY "articles_update" ON articles FOR UPDATE USING (
        author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    EXECUTE 'CREATE POLICY "articles_delete" ON articles FOR DELETE USING (
        author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ articles - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ articles - FAILED: %', SQLERRM;
END $$;

-- =======================
-- QUESTIONS
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('questions');
    
    EXECUTE 'CREATE POLICY "questions_select" ON questions FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "questions_insert" ON questions FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
    EXECUTE 'CREATE POLICY "questions_update" ON questions FOR UPDATE USING (
        author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "questions_delete" ON questions FOR DELETE USING (
        author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ questions - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ questions - FAILED: %', SQLERRM;
END $$;

-- =======================
-- ANSWERS
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('answers');
    
    EXECUTE 'CREATE POLICY "answers_select" ON answers FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "answers_insert" ON answers FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
    EXECUTE 'CREATE POLICY "answers_update" ON answers FOR UPDATE USING (
        author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "answers_delete" ON answers FOR DELETE USING (
        author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ answers - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ answers - FAILED: %', SQLERRM;
END $$;

-- =======================
-- ARTICLE_COMMENTS (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('article_comments');
    
    EXECUTE 'CREATE POLICY "article_comments_select" ON article_comments FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "article_comments_insert" ON article_comments FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
    EXECUTE 'CREATE POLICY "article_comments_delete" ON article_comments FOR DELETE USING (
        user_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ article_comments - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ article_comments - FAILED: %', SQLERRM;
END $$;

-- =======================
-- ANSWER_COMMENTS (uses author_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('answer_comments');
    
    EXECUTE 'CREATE POLICY "answer_comments_select" ON answer_comments FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "answer_comments_insert" ON answer_comments FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
    EXECUTE 'CREATE POLICY "answer_comments_delete" ON answer_comments FOR DELETE USING (
        author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ answer_comments - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ answer_comments - FAILED: %', SQLERRM;
END $$;

-- =======================
-- PROFILES
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('profiles');
    
    EXECUTE 'CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (
        id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ profiles - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ profiles - FAILED: %', SQLERRM;
END $$;

-- =======================
-- ARTICLE_LIKES (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('article_likes');
    
    EXECUTE 'CREATE POLICY "article_likes_select" ON article_likes FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "article_likes_insert" ON article_likes FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "article_likes_delete" ON article_likes FOR DELETE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ article_likes - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ article_likes - FAILED: %', SQLERRM;
END $$;

-- =======================
-- ANSWER_LIKES (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('answer_likes');
    
    EXECUTE 'CREATE POLICY "answer_likes_select" ON answer_likes FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "answer_likes_insert" ON answer_likes FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "answer_likes_delete" ON answer_likes FOR DELETE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ answer_likes - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ answer_likes - FAILED: %', SQLERRM;
END $$;

-- =======================
-- QUESTION_VOTES (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('question_votes');
    
    EXECUTE 'CREATE POLICY "question_votes_select" ON question_votes FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "question_votes_insert" ON question_votes FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "question_votes_update" ON question_votes FOR UPDATE USING (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "question_votes_delete" ON question_votes FOR DELETE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ question_votes - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ question_votes - FAILED: %', SQLERRM;
END $$;

-- =======================
-- ARTICLE_BOOKMARKS (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('article_bookmarks');
    
    EXECUTE 'CREATE POLICY "article_bookmarks_select" ON article_bookmarks FOR SELECT USING (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "article_bookmarks_insert" ON article_bookmarks FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "article_bookmarks_delete" ON article_bookmarks FOR DELETE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ article_bookmarks - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ article_bookmarks - FAILED: %', SQLERRM;
END $$;

-- =======================
-- QUESTION_BOOKMARKS (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('question_bookmarks');
    
    EXECUTE 'CREATE POLICY "question_bookmarks_select" ON question_bookmarks FOR SELECT USING (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "question_bookmarks_insert" ON question_bookmarks FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "question_bookmarks_delete" ON question_bookmarks FOR DELETE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ question_bookmarks - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ question_bookmarks - FAILED: %', SQLERRM;
END $$;

-- =======================
-- FOLLOWS (uses follower_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('follows');
    
    EXECUTE 'CREATE POLICY "follows_select" ON follows FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "follows_insert" ON follows FOR INSERT WITH CHECK (follower_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "follows_delete" ON follows FOR DELETE USING (follower_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ follows - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ follows - FAILED: %', SQLERRM;
END $$;

-- =======================
-- NOTIFICATIONS (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('notifications');
    
    EXECUTE 'CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ notifications - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ notifications - FAILED: %', SQLERRM;
END $$;

-- =======================
-- REPORTS (uses reporter_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('reports');
    
    EXECUTE 'CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
    EXECUTE 'CREATE POLICY "reports_select" ON reports FOR SELECT USING (
        reporter_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "reports_update" ON reports FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ reports - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ reports - FAILED: %', SQLERRM;
END $$;

-- =======================
-- BLOCKED_USERS (uses blocker_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('blocked_users');
    
    EXECUTE 'CREATE POLICY "blocked_users_select" ON blocked_users FOR SELECT USING (blocker_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "blocked_users_insert" ON blocked_users FOR INSERT WITH CHECK (blocker_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "blocked_users_delete" ON blocked_users FOR DELETE USING (blocker_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ blocked_users - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ blocked_users - FAILED: %', SQLERRM;
END $$;

-- =======================
-- USER_ACTIVITY_LOGS (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('user_activity_logs');
    
    EXECUTE 'CREATE POLICY "logs_select" ON user_activity_logs FOR SELECT USING (
        user_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "logs_insert" ON user_activity_logs FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ user_activity_logs - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ user_activity_logs - FAILED: %', SQLERRM;
END $$;

-- =======================
-- USER_QUIZ_ATTEMPTS (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('user_quiz_attempts');
    
    EXECUTE 'CREATE POLICY "quiz_attempts_select" ON user_quiz_attempts FOR SELECT USING (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "quiz_attempts_insert" ON user_quiz_attempts FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ user_quiz_attempts - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ user_quiz_attempts - FAILED: %', SQLERRM;
END $$;

-- =======================
-- REPUTATION_HISTORY (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('reputation_history');
    
    EXECUTE 'CREATE POLICY "reputation_select" ON reputation_history FOR SELECT USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ reputation_history - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ reputation_history - FAILED: %', SQLERRM;
END $$;

-- =======================
-- USER_BADGES (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('user_badges');
    
    EXECUTE 'CREATE POLICY "user_badges_select" ON user_badges FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "user_badges_insert" ON user_badges FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ user_badges - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ user_badges - FAILED: %', SQLERRM;
END $$;

-- =======================
-- ANSWER_COMMENT_LIKES (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('answer_comment_likes');
    
    EXECUTE 'CREATE POLICY "answer_comment_likes_select" ON answer_comment_likes FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "answer_comment_likes_insert" ON answer_comment_likes FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "answer_comment_likes_delete" ON answer_comment_likes FOR DELETE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ answer_comment_likes - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ answer_comment_likes - FAILED: %', SQLERRM;
END $$;

-- =======================
-- DICTIONARY_TERMS (admin only for write)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('dictionary_terms');
    
    EXECUTE 'CREATE POLICY "dictionary_select" ON dictionary_terms FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "dictionary_insert" ON dictionary_terms FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ dictionary_terms - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ dictionary_terms - FAILED: %', SQLERRM;
END $$;

-- =======================
-- QUIZZES (admin only for write)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('quizzes');
    
    EXECUTE 'CREATE POLICY "quizzes_select" ON quizzes FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "quizzes_insert" ON quizzes FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "quizzes_update" ON quizzes FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "quizzes_delete" ON quizzes FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ quizzes - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ quizzes - FAILED: %', SQLERRM;
END $$;

-- =======================
-- QUIZ_QUESTIONS (admin only for write)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('quiz_questions');
    
    EXECUTE 'CREATE POLICY "quiz_questions_select" ON quiz_questions FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "quiz_questions_insert" ON quiz_questions FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "quiz_questions_update" ON quiz_questions FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "quiz_questions_delete" ON quiz_questions FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ quiz_questions - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ quiz_questions - FAILED: %', SQLERRM;
END $$;

-- =======================
-- WRITER_APPLICATIONS (uses user_id)
-- =======================
DO $$
BEGIN
    PERFORM drop_all_policies_for_table('writer_applications');
    
    EXECUTE 'CREATE POLICY "writer_app_insert" ON writer_applications FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "writer_app_select" ON writer_applications FOR SELECT USING (
        user_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    EXECUTE 'CREATE POLICY "writer_app_update" ON writer_applications FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin'')
    )';
    
    RAISE NOTICE '✅ writer_applications - DONE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ writer_applications - FAILED: %', SQLERRM;
END $$;

-- =======================
-- MESSAGING TABLES (Skipping complex ones)
-- =======================
-- conversations, messages, message_likes have complex participant-based logic.
-- NOT dropping/recreating to avoid breaking the messaging system.
-- These warnings can be addressed manually if needed.

-- =======================
-- CLEANUP
-- =======================
DROP FUNCTION IF EXISTS drop_all_policies_for_table(text);

SELECT '🎉 Performance fix script completed! Check NOTICE messages above for results.' as message;
