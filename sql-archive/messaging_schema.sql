-- Messaging System Schema

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conversation Participants Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Conversations: Users can view conversations they are part of
CREATE POLICY "Users can view their conversations"
    ON conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = conversations.id
            AND user_id = auth.uid()
        )
    );

-- Participants: Users can view participants of their conversations
CREATE POLICY "Users can view participants"
    ON conversation_participants FOR SELECT
    USING (
        user_id = auth.uid() -- Can see self
        OR
        conversation_id IN ( -- Can see others in same conversation
            SELECT conversation_id FROM conversation_participants
            WHERE user_id = auth.uid()
        )
    );

-- Messages: Users can view messages in their conversations
CREATE POLICY "Users can view messages"
    ON messages FOR SELECT
    USING (
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants
            WHERE user_id = auth.uid()
        )
    );

-- Messages: Users can insert messages into their conversations
CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants
            WHERE user_id = auth.uid()
        )
    );

-- Function to create a new conversation between two users
-- This prevents duplicate conversations between same pair
CREATE OR REPLACE FUNCTION create_conversation(other_user_id UUID)
RETURNS UUID AS $$
DECLARE
    conv_id UUID;
BEGIN
    -- Check if conversation already exists
    SELECT c.id INTO conv_id
    FROM conversations c
    JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
    JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
    WHERE cp1.user_id = auth.uid()
    AND cp2.user_id = other_user_id
    LIMIT 1;

    -- If exists, return it
    IF conv_id IS NOT NULL THEN
        RETURN conv_id;
    END IF;

    -- If not, create new one
    INSERT INTO conversations DEFAULT VALUES RETURNING id INTO conv_id;

    -- Add participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES 
        (conv_id, auth.uid()),
        (conv_id, other_user_id);

    RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
