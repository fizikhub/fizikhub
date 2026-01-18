-- ==========================================
-- Supabase Performance Fix Script (v5 - Final Fixes)
-- ==========================================
-- Fixes remaining issues:
-- 1. conversations policy (uses conversation_participants table)
-- 2. messages policies (uses sender_id)
-- 3. profiles duplicate index
-- ==========================================

-- =======================
-- CONVERSATIONS
-- =======================
-- The conversations table doesn't have user columns directly.
-- It uses conversation_participants table for user relationships.
DO $$
BEGIN
    -- Drop old problematic policy
    DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
    DROP POLICY IF EXISTS "conversations_select" ON conversations;
    
    -- Create optimized policy using (select auth.uid())
    EXECUTE 'CREATE POLICY "conversations_select" ON conversations FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = conversations.id
            AND user_id = (select auth.uid())
        )
    )';
    
    RAISE NOTICE '✅ conversations - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ conversations - FAILED: %', SQLERRM;
END $$;

-- =======================
-- CONVERSATION_PARTICIPANTS
-- =======================
DO $$
BEGIN
    -- Drop old policies
    DROP POLICY IF EXISTS "Users can view participants" ON conversation_participants;
    
    -- Create optimized policy
    EXECUTE 'CREATE POLICY "participants_select" ON conversation_participants FOR SELECT USING (
        user_id = (select auth.uid())
        OR
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants
            WHERE user_id = (select auth.uid())
        )
    )';
    
    RAISE NOTICE '✅ conversation_participants - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ conversation_participants - FAILED: %', SQLERRM;
END $$;

-- =======================
-- MESSAGES
-- =======================
DO $$
BEGIN
    -- Drop old problematic policies
    DROP POLICY IF EXISTS "Send messages" ON messages;
    DROP POLICY IF EXISTS "Users can send messages" ON messages;
    DROP POLICY IF EXISTS "Users can delete own messages" ON messages;
    DROP POLICY IF EXISTS "Users can update messages in their conversations" ON messages;
    DROP POLICY IF EXISTS "Users can view messages" ON messages;
    DROP POLICY IF EXISTS "messages_select" ON messages;
    DROP POLICY IF EXISTS "messages_insert" ON messages;
    DROP POLICY IF EXISTS "messages_update" ON messages;
    DROP POLICY IF EXISTS "messages_delete" ON messages;
    DROP POLICY IF EXISTS "messages_select_participants" ON messages;
    
    -- SELECT: View messages in conversations you're part of
    EXECUTE 'CREATE POLICY "messages_select" ON messages FOR SELECT USING (
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants
            WHERE user_id = (select auth.uid())
        )
    )';
    
    -- INSERT: Send messages to your conversations
    EXECUTE 'CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (
        sender_id = (select auth.uid())
        AND conversation_id IN (
            SELECT conversation_id FROM conversation_participants
            WHERE user_id = (select auth.uid())
        )
    )';
    
    -- UPDATE: Update your own messages
    EXECUTE 'CREATE POLICY "messages_update" ON messages FOR UPDATE USING (
        sender_id = (select auth.uid())
    )';
    
    -- DELETE: Delete your own messages
    EXECUTE 'CREATE POLICY "messages_delete" ON messages FOR DELETE USING (
        sender_id = (select auth.uid())
    )';
    
    RAISE NOTICE '✅ messages - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ messages - FAILED: %', SQLERRM;
END $$;

-- =======================
-- MESSAGE_LIKES (if not already fixed)
-- =======================
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can like messages in their conversations" ON message_likes;
    DROP POLICY IF EXISTS "Users can remove own likes" ON message_likes;
    DROP POLICY IF EXISTS "Users can view likes in their conversations" ON message_likes;
    
    -- Might already exist from v3, using IF NOT EXISTS logic via exception handling
    EXECUTE 'CREATE POLICY "message_likes_select" ON message_likes FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "message_likes_insert" ON message_likes FOR INSERT WITH CHECK (user_id = (select auth.uid()))';
    EXECUTE 'CREATE POLICY "message_likes_delete" ON message_likes FOR DELETE USING (user_id = (select auth.uid()))';
    
    RAISE NOTICE '✅ message_likes - FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ message_likes - Skipped or already fixed: %', SQLERRM;
END $$;

-- =======================
-- PROFILES DUPLICATE INDEX
-- =======================
DO $$
BEGIN
    -- profiles_username_key is a UNIQUE CONSTRAINT, keep it
    -- profiles_username_unique is a regular index, drop it
    DROP INDEX IF EXISTS profiles_username_unique;
    RAISE NOTICE '✅ Dropped: profiles_username_unique';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ profiles_username_unique - FAILED: %', SQLERRM;
END $$;


-- =======================
-- DONE
-- =======================
SELECT '🎉 V5 Final fixes completed!' as message;
