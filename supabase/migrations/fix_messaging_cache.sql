-- Re-create the create_conversation function
-- This creates a conversation between the authenticated user and the specified other_user_id
-- If a conversation already exists, it returns the existing ID

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

-- Grant permissions explicitly
GRANT EXECUTE ON FUNCTION create_conversation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_conversation(UUID) TO service_role;

-- Ensure RLS is enabled and policies exist (idempotent checks)
ALTER TABLE IF EXISTS conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
