-- FINAL FIX FOR MESSAGING SYSTEM
-- 1. Fixes "Unknown User" (Bilinmeyen Kullanıcı) by resolving Recursive RLS
-- 2. Fixes Console WebSocket Errors by enabling Realtime correctly

BEGIN;

-- A. HELPER FUNCTION TO AVOID RLS RECURSION
-- This function checks if the current user is a participant of a conversation
-- It runs as SECURITY DEFINER to bypass RLS during the check itself
CREATE OR REPLACE FUNCTION public.is_conv_participant(conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = $1 
    AND user_id = auth.uid()
  );
$$;

-- B. UPDATE RLS POLICIES

-- 1. Conversation Participants
-- Drop old policies to be safe
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;

-- New Policy: Use the security definer function to break recursion
CREATE POLICY "Users can view conversation participants"
    ON conversation_participants FOR SELECT
    USING (
        -- Can see if I am a participant in that conversation
        is_conv_participant(conversation_id)
    );

-- 2. Messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;

CREATE POLICY "View messages"
    ON messages FOR SELECT
    USING (
        is_conv_participant(conversation_id)
    );

CREATE POLICY "Send messages"
    ON messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() 
        AND 
        is_conv_participant(conversation_id)
    );

-- C. ENABLE REALTIME (WebSocket Fix)
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

COMMIT;

-- D. GRANT PERMISSIONS (Just in case)
GRANT EXECUTE ON FUNCTION public.is_conv_participant(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_conv_participant(UUID) TO service_role;
