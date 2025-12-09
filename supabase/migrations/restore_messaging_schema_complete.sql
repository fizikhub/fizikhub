-- Messaging System Complete Restoration
-- Run this entire script in Supabase SQL Editor

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    -- referencing auth.users is safer for foreign keys in Supabase
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Indexes
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user 
    ON conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation 
    ON conversation_participants(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation 
    ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender 
    ON messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_conversations_updated 
    ON conversations(updated_at DESC);

-- 3. Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Conversations
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

-- Participants
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

DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
CREATE POLICY "Users can join conversations"
    ON conversation_participants FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Messages
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

-- 5. Create Functions
CREATE OR REPLACE FUNCTION create_conversation(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    existing_conversation_id UUID;
    new_conversation_id UUID;
BEGIN
    -- Check if conversation already exists between these two users
    SELECT cp1.conversation_id INTO existing_conversation_id
    FROM conversation_participants cp1
    INNER JOIN conversation_participants cp2 
        ON cp1.conversation_id = cp2.conversation_id
    WHERE cp1.user_id = auth.uid()
        AND cp2.user_id = other_user_id
    LIMIT 1;

    -- If conversation exists, return it
    IF existing_conversation_id IS NOT NULL THEN
        RETURN existing_conversation_id;
    END IF;

    -- Create new conversation
    INSERT INTO conversations DEFAULT VALUES
    RETURNING id INTO new_conversation_id;

    -- Add both participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES 
        (new_conversation_id, auth.uid()),
        (new_conversation_id, other_user_id);

    RETURN new_conversation_id;
END;
$$;

-- Trigger Function for Updated At
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

-- Trigger
DROP TRIGGER IF EXISTS update_conversation_timestamp_trigger ON messages;
CREATE TRIGGER update_conversation_timestamp_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- 6. Grant Permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON TABLE conversations TO authenticated;
GRANT ALL ON TABLE conversations TO service_role;

GRANT ALL ON TABLE conversation_participants TO authenticated;
GRANT ALL ON TABLE conversation_participants TO service_role;

GRANT ALL ON TABLE messages TO authenticated;
GRANT ALL ON TABLE messages TO service_role;

GRANT ALL ON SEQUENCE messages_id_seq TO authenticated;
GRANT ALL ON SEQUENCE messages_id_seq TO service_role;

GRANT EXECUTE ON FUNCTION create_conversation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_conversation(UUID) TO service_role;
