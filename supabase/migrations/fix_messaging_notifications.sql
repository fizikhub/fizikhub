-- Create a trigger to automatically send notifications for new messages

-- 1. Function to handle new message notifications
CREATE OR REPLACE FUNCTION public.handle_new_message_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    recipient_user_id UUID;
    sender_user_id UUID;
    sender_username TEXT;
BEGIN
    -- Get the sender ID from the new message
    sender_user_id := NEW.sender_id;

    -- Find the recipient (the other participant in the conversation)
    SELECT user_id INTO recipient_user_id
    FROM conversation_participants
    WHERE conversation_id = NEW.conversation_id
    AND user_id != sender_user_id
    LIMIT 1;

    -- If no recipient found (should not happen in valid conversation), exit
    IF recipient_user_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Get sender username for the notification content
    SELECT username INTO sender_username
    FROM profiles
    WHERE id = sender_user_id;

    -- Insert the notification
    INSERT INTO notifications (
        recipient_id,
        actor_id,
        type,
        resource_id,
        resource_type,
        content,
        is_read,
        created_at
    )
    VALUES (
        recipient_user_id,
        sender_user_id,
        'message',
        NEW.conversation_id, -- resource_id is the conversation ID
        'conversation',      -- resource_type is conversation
        CASE 
            WHEN sender_username IS NOT NULL THEN sender_username || ' sana bir mesaj gönderdi.'
            ELSE 'Yeni bir mesajınız var.'
        END,
        FALSE,
        NOW()
    );

    RETURN NEW;
END;
$$;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_new_message_notification ON messages;
CREATE TRIGGER on_new_message_notification
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_message_notification();
