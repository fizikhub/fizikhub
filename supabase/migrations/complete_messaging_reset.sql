-- COMPLETE MESSAGING SYSTEM RESET AND SETUP
-- This script will completely reset and rebuild the messaging system
-- WARNING: This will delete all existing messages and conversations

-- 1. DROP EXISTING TABLES (if any)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- 2. DROP EXISTING FUNCTIONS
DROP FUNCTION IF EXISTS create_conversation(UUID);
DROP FUNCTION IF EXISTS update_conversation_timestamp();

-- 3. CREATE TABLES
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE INDEXES
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- 5. ENABLE RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 6. CREATE RLS POLICIES

-- Conversations: Users can view conversations they're part of
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
CREATE POLICY "Users can view their conversations"
    ON conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = conversations.id
            AND conversation_participants.user_id = auth.uid()
        )
    );

-- Conversation Participants: Users can view participants of their conversations
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
CREATE POLICY "Users can view participants of their conversations"
    ON conversation_participants FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversation_participants cp
            WHERE cp.conversation_id = conversation_participants.conversation_id
            AND cp.user_id = auth.uid()
        )
    );

-- Messages: Users can view messages in their conversations
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = messages.conversation_id
            AND conversation_participants.user_id = auth.uid()
        )
    );

-- Messages: Users can send messages to their conversations
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;
CREATE POLICY "Users can send messages to their conversations"
    ON messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = messages.conversation_id
            AND conversation_participants.user_id = auth.uid()
        )
    );

-- Messages: Users can update messages in their conversations (for read status)
DROP POLICY IF EXISTS "Users can update messages in their conversations" ON messages;
CREATE POLICY "Users can update messages in their conversations"
    ON messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = messages.conversation_id
            AND conversation_participants.user_id = auth.uid()
        )
    );

-- 7. CREATE FUNCTIONS

-- Function to create or get existing conversation between two users
CREATE OR REPLACE FUNCTION create_conversation(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    existing_conversation_id UUID;
    new_conversation_id UUID;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Check if current user is authenticated
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Check if conversation already exists between these two users
    SELECT cp1.conversation_id INTO existing_conversation_id
    FROM conversation_participants cp1
    INNER JOIN conversation_participants cp2 
        ON cp1.conversation_id = cp2.conversation_id
    WHERE cp1.user_id = current_user_id
        AND cp2.user_id = other_user_id
        AND cp1.user_id != cp2.user_id
    LIMIT 1;

    -- If conversation exists, return it
    IF existing_conversation_id IS NOT NULL THEN
        RETURN existing_conversation_id;
    END IF;

    -- Create new conversation
    INSERT INTO conversations (id, created_at, updated_at)
    VALUES (gen_random_uuid(), NOW(), NOW())
    RETURNING id INTO new_conversation_id;

    -- Add both participants (bypasses RLS because of SECURITY DEFINER)
    INSERT INTO conversation_participants (conversation_id, user_id, created_at)
    VALUES 
        (new_conversation_id, current_user_id, NOW()),
        (new_conversation_id, other_user_id, NOW());

    RETURN new_conversation_id;
END;
$$;

-- Function to update conversation timestamp when a message is sent
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

-- 8. CREATE TRIGGERS
DROP TRIGGER IF EXISTS update_conversation_timestamp_trigger ON messages;
CREATE TRIGGER update_conversation_timestamp_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- 9. GRANT PERMISSIONS

-- Grant table permissions
GRANT ALL ON TABLE conversations TO authenticated;
GRANT ALL ON TABLE conversations TO service_role;

GRANT ALL ON TABLE conversation_participants TO authenticated;
GRANT ALL ON TABLE conversation_participants TO service_role;

GRANT ALL ON TABLE messages TO authenticated;
GRANT ALL ON TABLE messages TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON SEQUENCE messages_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE messages_id_seq TO service_role;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION create_conversation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_conversation(UUID) TO service_role;

GRANT EXECUTE ON FUNCTION update_conversation_timestamp() TO authenticated;
GRANT EXECUTE ON FUNCTION update_conversation_timestamp() TO service_role;

-- 10. DONE
-- All tables, indexes, policies, functions, and permissions have been set up successfully
