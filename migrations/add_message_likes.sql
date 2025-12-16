-- Message likes and delete functionality
-- Run this in Supabase SQL Editor

-- 1. Create message_likes table
CREATE TABLE IF NOT EXISTS message_likes (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- 2. Enable RLS
ALTER TABLE message_likes ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for message_likes

-- Users can like messages in conversations they're part of
CREATE POLICY "Users can like messages in their conversations"
ON message_likes FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM messages m
        JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
        WHERE m.id = message_id AND cp.user_id = auth.uid()
    )
);

-- Users can unlike (delete) their own likes
CREATE POLICY "Users can remove own likes"
ON message_likes FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Users can see likes on messages in their conversations
CREATE POLICY "Users can view likes in their conversations"
ON message_likes FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM messages m
        JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
        WHERE m.id = message_id AND cp.user_id = auth.uid()
    )
);

-- 4. Policy for deleting messages (only sender can delete)
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;
CREATE POLICY "Users can delete own messages"
ON messages FOR DELETE
TO authenticated
USING (sender_id = auth.uid());

-- 5. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_message_likes_message_id ON message_likes(message_id);
CREATE INDEX IF NOT EXISTS idx_message_likes_user_id ON message_likes(user_id);

-- 6. Trigger to send notification when message is liked
CREATE OR REPLACE FUNCTION notify_message_liked()
RETURNS TRIGGER AS $$
DECLARE
    v_message RECORD;
    v_liker_username TEXT;
BEGIN
    -- Get the message details
    SELECT m.*, c.id as conv_id
    INTO v_message
    FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE m.id = NEW.message_id;

    -- Get liker's username
    SELECT username INTO v_liker_username
    FROM profiles WHERE id = NEW.user_id;

    -- Don't notify if user liked their own message
    IF v_message.sender_id != NEW.user_id THEN
        INSERT INTO notifications (
            recipient_id,
            actor_id,
            type,
            content,
            resource_type,
            resource_id,
            is_read
        ) VALUES (
            v_message.sender_id,
            NEW.user_id,
            'message_like',
            v_liker_username || ' mesajını beğendi',
            'message',
            NEW.message_id::text,
            false
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_message_liked ON message_likes;
CREATE TRIGGER on_message_liked
    AFTER INSERT ON message_likes
    FOR EACH ROW
    EXECUTE FUNCTION notify_message_liked();

-- Verification
SELECT 'message_likes table created' as status;
