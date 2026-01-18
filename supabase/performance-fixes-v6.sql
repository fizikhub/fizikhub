-- ==========================================
-- Supabase Performance Fix Script (v6 - Force Cleanup)
-- ==========================================
-- This script addresses persistent "Multiple Permissive Policies" warnings by
-- forcefully dropping ALL known variations of policies before recreating them.
-- ==========================================

-- =======================
-- 1. CONVERSATION_PARTICIPANTS
-- =======================
DO $$
BEGIN
    -- Drop ALL known variations of policies to be safe
    DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
    DROP POLICY IF EXISTS "participants_select" ON conversation_participants;
    DROP POLICY IF EXISTS "select_participants" ON conversation_participants;
    DROP POLICY IF EXISTS "view_participants" ON conversation_participants;
    
    -- Re-create single optimized SELECT policy
    CREATE POLICY "participants_select" ON conversation_participants FOR SELECT USING (
        user_id = (select auth.uid()) OR
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants
            WHERE user_id = (select auth.uid())
        )
    );
    
    RAISE NOTICE '✅ conversation_participants - CLEANED & FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ conversation_participants - FAILED: %', SQLERRM;
END $$;

-- =======================
-- 2. MESSAGES
-- =======================
DO $$
BEGIN
    -- Drop ALL known variations of policies
    DROP POLICY IF EXISTS "View messages" ON messages;
    DROP POLICY IF EXISTS "messages_select" ON messages;
    DROP POLICY IF EXISTS "select_messages" ON messages;
    DROP POLICY IF EXISTS "Users can view messages" ON messages;
    DROP POLICY IF EXISTS "messages_view_policy" ON messages;
    
    -- Re-create single optimized SELECT policy
    CREATE POLICY "messages_select" ON messages FOR SELECT USING (
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants
            WHERE user_id = (select auth.uid())
        )
    );
    
    RAISE NOTICE '✅ messages (SELECT) - CLEANED & FIXED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ messages (SELECT) - FAILED: %', SQLERRM;
END $$;

-- =======================
-- 3. PROFILES (Duplicate Index)
-- =======================
-- 'profiles_username_key' is the constraint (Keep)
-- 'profiles_username_unique' is the redundant index (Drop)
DO $$
BEGIN
    DROP INDEX IF EXISTS profiles_username_unique;
    RAISE NOTICE '✅ profiles_username_unique - DROPPED';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ profiles_username_unique - FAILED: %', SQLERRM;
END $$;

-- =======================
-- DONE
-- =======================
SELECT '🎉 V6 Force Cleanup Completed!' as message;
