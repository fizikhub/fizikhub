-- ==========================================
-- Supabase Emergency Fix: Messaging Visibility
-- ==========================================
-- PROBLEM: The previous RLS policies caused "infinite recursion".
-- (To check if you can see a conversation, it checked conversation_participants, 
--  which checked if you can see the conversation...)
-- result: All rows became hidden (but NOT deleted!).
--
-- SOLUTION: Use a SECURITY DEFINER function to break the loop.
-- This function runs with admin privileges to check participation
-- without triggering RLS recursively.
-- ==========================================

-- 1. Create Helper Function (Bypasses RLS)
DROP FUNCTION IF EXISTS is_conversation_participant(uuid);

CREATE OR REPLACE FUNCTION is_conversation_participant(conversation_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversation_uuid
    AND user_id = (select auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- <!! Important: Security Definer

-- 2. Fix 'CONVERSATIONS' Policy
DROP POLICY IF EXISTS "conversations_select" ON conversations;
CREATE POLICY "conversations_select" ON conversations FOR SELECT USING (
    is_conversation_participant(id)
);

-- 3. Fix 'CONVERSATION_PARTICIPANTS' Policy
DROP POLICY IF EXISTS "participants_select" ON conversation_participants;
CREATE POLICY "participants_select" ON conversation_participants FOR SELECT USING (
    is_conversation_participant(conversation_id)
);

-- 4. Fix 'MESSAGES' Policy
DROP POLICY IF EXISTS "messages_select" ON messages;
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
    is_conversation_participant(conversation_id)
);

-- =======================
-- DONE
-- =======================
SELECT '✅ Messaging visibility fixed! Data should be visible now.' as message;
