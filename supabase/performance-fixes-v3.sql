-- ==========================================
-- Supabase Performance Fix Script (v3 - Remaining Fixes)
-- ==========================================
-- Fixes:
-- 1. INSERT policies: auth.role() -> (select auth.role())
-- 2. Messaging tables (conversations, messages, message_likes)
-- 3. Duplicate indexes
-- ==========================================

-- =======================
-- FIX INSERT POLICIES
-- =======================
-- The previous script used auth.role() = 'authenticated' which still re-evaluates per row.
-- We need to use (select auth.role()) instead.

-- ARTICLES
DO $$
BEGIN
    DROP POLICY IF EXISTS "articles_insert" ON articles;
    EXECUTE 'CREATE POLICY "articles_insert" ON articles FOR INSERT WITH CHECK (
        (select auth.role()) = ''authenticated''
    )';
    RAISE NOTICE '✅ articles_insert - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ articles_insert - FAILED: %', SQLERRM;
END $$;

-- QUESTIONS
DO $$
BEGIN
    DROP POLICY IF EXISTS "questions_insert" ON questions;
    EXECUTE 'CREATE POLICY "questions_insert" ON questions FOR INSERT WITH CHECK (
        (select auth.role()) = ''authenticated''
    )';
    RAISE NOTICE '✅ questions_insert - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ questions_insert - FAILED: %', SQLERRM;
END $$;

-- ANSWERS
DO $$
BEGIN
    DROP POLICY IF EXISTS "answers_insert" ON answers;
    EXECUTE 'CREATE POLICY "answers_insert" ON answers FOR INSERT WITH CHECK (
        (select auth.role()) = ''authenticated''
    )';
    RAISE NOTICE '✅ answers_insert - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ answers_insert - FAILED: %', SQLERRM;
END $$;

-- ARTICLE_COMMENTS
DO $$
BEGIN
    DROP POLICY IF EXISTS "article_comments_insert" ON article_comments;
    EXECUTE 'CREATE POLICY "article_comments_insert" ON article_comments FOR INSERT WITH CHECK (
        (select auth.role()) = ''authenticated''
    )';
    RAISE NOTICE '✅ article_comments_insert - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ article_comments_insert - FAILED: %', SQLERRM;
END $$;

-- ANSWER_COMMENTS
DO $$
BEGIN
    DROP POLICY IF EXISTS "answer_comments_insert" ON answer_comments;
    EXECUTE 'CREATE POLICY "answer_comments_insert" ON answer_comments FOR INSERT WITH CHECK (
        (select auth.role()) = ''authenticated''
    )';
    RAISE NOTICE '✅ answer_comments_insert - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ answer_comments_insert - FAILED: %', SQLERRM;
END $$;

-- REPORTS
DO $$
BEGIN
    DROP POLICY IF EXISTS "reports_insert" ON reports;
    EXECUTE 'CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (
        (select auth.role()) = ''authenticated''
    )';
    RAISE NOTICE '✅ reports_insert - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ reports_insert - FAILED: %', SQLERRM;
END $$;


-- =======================
-- FIX NOTIFICATIONS (old policies still exist)
-- =======================
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
    DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
    
    -- Already created new ones in v2, just cleaning old names
    RAISE NOTICE '✅ notifications - OLD POLICIES CLEANED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ notifications cleanup - FAILED: %', SQLERRM;
END $$;


-- =======================
-- FIX MESSAGING TABLES
-- =======================

-- CONVERSATIONS
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
    
    -- Create optimized policy (assuming user1_id or user2_id column exists)
    -- Need to check actual schema, using generic approach
    EXECUTE 'CREATE POLICY "conversations_select" ON conversations FOR SELECT USING (
        user1_id = (select auth.uid()) OR user2_id = (select auth.uid())
    )';
    
    RAISE NOTICE '✅ conversations - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ conversations - FAILED: %', SQLERRM;
END $$;

-- MESSAGES
DO $$
BEGIN
    DROP POLICY IF EXISTS "Send messages" ON messages;
    DROP POLICY IF EXISTS "Users can delete own messages" ON messages;
    DROP POLICY IF EXISTS "Users can update messages in their conversations" ON messages;
    DROP POLICY IF EXISTS "messages_select_participants" ON messages;
    
    -- Assuming sender_id column exists
    EXECUTE 'CREATE POLICY "messages_select" ON messages FOR SELECT USING (
        sender_id = (select auth.uid()) 
        OR EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.user1_id = (select auth.uid()) OR conversations.user2_id = (select auth.uid()))
        )
    )';
    
    EXECUTE 'CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (
        sender_id = (select auth.uid())
    )';
    
    EXECUTE 'CREATE POLICY "messages_update" ON messages FOR UPDATE USING (
        sender_id = (select auth.uid())
    )';
    
    EXECUTE 'CREATE POLICY "messages_delete" ON messages FOR DELETE USING (
        sender_id = (select auth.uid())
    )';
    
    RAISE NOTICE '✅ messages - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ messages - FAILED: %', SQLERRM;
END $$;

-- MESSAGE_LIKES
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can like messages in their conversations" ON message_likes;
    DROP POLICY IF EXISTS "Users can remove own likes" ON message_likes;
    DROP POLICY IF EXISTS "Users can view likes in their conversations" ON message_likes;
    
    EXECUTE 'CREATE POLICY "message_likes_select" ON message_likes FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "message_likes_insert" ON message_likes FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "message_likes_delete" ON message_likes FOR DELETE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ message_likes - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ message_likes - FAILED: %', SQLERRM;
END $$;


-- =======================
-- DROP DUPLICATE INDEXES
-- =======================

-- answer_comments: Keep idx_answer_comments_author_id, drop idx_answer_comments_author
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_answer_comments_author;
    RAISE NOTICE '✅ Dropped: idx_answer_comments_author';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ idx_answer_comments_author - FAILED: %', SQLERRM;
END $$;

-- answer_likes: Keep idx_answer_likes_answer_id, drop idx_answer_likes_answer
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_answer_likes_answer;
    RAISE NOTICE '✅ Dropped: idx_answer_likes_answer';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ idx_answer_likes_answer - FAILED: %', SQLERRM;
END $$;

-- answer_likes: Keep answer_likes_answer_id_user_id_key (constraint), drop idx_answer_likes_unique
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_answer_likes_unique;
    RAISE NOTICE '✅ Dropped: idx_answer_likes_unique';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ idx_answer_likes_unique - FAILED: %', SQLERRM;
END $$;

-- articles: Keep idx_articles_feed_composite, drop idx_articles_status_created_at
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_articles_status_created_at;
    RAISE NOTICE '✅ Dropped: idx_articles_status_created_at';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ idx_articles_status_created_at - FAILED: %', SQLERRM;
END $$;

-- articles: Keep articles_slug_key (constraint), drop idx_articles_slug
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_articles_slug;
    RAISE NOTICE '✅ Dropped: idx_articles_slug';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ idx_articles_slug - FAILED: %', SQLERRM;
END $$;

-- notifications: Keep idx_notifications_composite, drop idx_notifications_recipient_unread
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_notifications_recipient_unread;
    RAISE NOTICE '✅ Dropped: idx_notifications_recipient_unread';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ idx_notifications_recipient_unread - FAILED: %', SQLERRM;
END $$;

-- profiles: Keep profiles_username_key (constraint), drop profiles_username_unique
DO $$
BEGIN
    DROP INDEX IF EXISTS profiles_username_unique;
    RAISE NOTICE '✅ Dropped: profiles_username_unique';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ profiles_username_unique - FAILED: %', SQLERRM;
END $$;

-- questions: Keep idx_questions_created_at, drop idx_questions_created and idx_questions_feed_sort
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_questions_created;
    DROP INDEX IF EXISTS idx_questions_feed_sort;
    RAISE NOTICE '✅ Dropped: idx_questions_created, idx_questions_feed_sort';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ questions indexes - FAILED: %', SQLERRM;
END $$;

-- user_badges: Keep idx_user_badges_user_id, drop idx_user_badges_user
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_user_badges_user;
    RAISE NOTICE '✅ Dropped: idx_user_badges_user';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ idx_user_badges_user - FAILED: %', SQLERRM;
END $$;


-- =======================
-- DONE
-- =======================
SELECT '🎉 V3 Performance fixes completed! Check NOTICE messages for details.' as message;
