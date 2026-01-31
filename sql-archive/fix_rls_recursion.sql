-- Fix infinite recursion in RLS policies by using a SECURITY DEFINER function

-- 1. Create a secure function to check participation without triggering RLS
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres/admin),
-- bypassing RLS on the tables it queries.
CREATE OR REPLACE FUNCTION is_conversation_participant(c_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = c_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Users can view participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- 3. Re-create policies using the secure function

-- Conversations: Users can view conversations they are part of
CREATE POLICY "Users can view their conversations"
    ON conversations FOR SELECT
    USING (
        is_conversation_participant(id)
    );

-- Participants: Users can view participants of conversations they are in
CREATE POLICY "Users can view participants"
    ON conversation_participants FOR SELECT
    USING (
        is_conversation_participant(conversation_id)
    );

-- Messages: Users can view messages in conversations they are in
CREATE POLICY "Users can view messages"
    ON messages FOR SELECT
    USING (
        is_conversation_participant(conversation_id)
    );

-- Messages: Users can send messages to conversations they are in
CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND
        is_conversation_participant(conversation_id)
    );
