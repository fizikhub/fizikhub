-- ============================================
-- FizikHub Messaging Enhancement v2
-- Mevcut verilere DOKUNMAZ, sadece yeni kolonlar ve fonksiyonlar ekler
-- ============================================

-- 1. messages tablosuna yeni kolonlar ekle
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system'));
ALTER TABLE messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_id BIGINT REFERENCES messages(id) ON DELETE SET NULL DEFAULT NULL;

-- 2. conversations tablosuna performans için preview kolonları ekle
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_preview TEXT DEFAULT NULL;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_sender_id UUID DEFAULT NULL;

-- 3. message_reactions tablosu (message_likes varsa dokunma, yeni tablo ekle)
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id BIGINT REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reaction TEXT NOT NULL CHECK (reaction IN ('❤️', '😂', '😮', '👍', '🔥', '👏')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, reaction)
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user ON message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC NULLS LAST);

-- 5. RLS for message_reactions
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view reactions in their conversations" ON message_reactions;
CREATE POLICY "Users can view reactions in their conversations"
    ON message_reactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM messages m
            JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
            WHERE m.id = message_reactions.message_id
            AND cp.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can add reactions" ON message_reactions;
CREATE POLICY "Users can add reactions"
    ON message_reactions FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM messages m
            JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
            WHERE m.id = message_reactions.message_id
            AND cp.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can remove their reactions" ON message_reactions;
CREATE POLICY "Users can remove their reactions"
    ON message_reactions FOR DELETE
    USING (user_id = auth.uid());

-- 6. Messages delete policy (sadece gönderen silebilir)
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;
CREATE POLICY "Users can delete their own messages"
    ON messages FOR DELETE
    USING (sender_id = auth.uid());

-- 7. Conversation preview güncellemesi için trigger güncelle
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE conversations
    SET 
        updated_at = NOW(),
        last_message_preview = LEFT(NEW.content, 100),
        last_message_at = NEW.created_at,
        last_message_sender_id = NEW.sender_id
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

-- Eski trigger'ı kaldır ve yenisini oluştur
DROP TRIGGER IF EXISTS update_conversation_timestamp_trigger ON messages;
CREATE TRIGGER update_conversation_on_message_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_on_message();

-- 8. Mevcut konuşmalar için preview'ları doldur (one-time migration)
UPDATE conversations c
SET 
    last_message_preview = sub.content,
    last_message_at = sub.created_at,
    last_message_sender_id = sub.sender_id
FROM (
    SELECT DISTINCT ON (conversation_id) 
        conversation_id, 
        LEFT(content, 100) as content, 
        created_at,
        sender_id
    FROM messages 
    ORDER BY conversation_id, created_at DESC
) sub
WHERE c.id = sub.conversation_id AND c.last_message_at IS NULL;

-- 9. Grants
GRANT ALL ON TABLE message_reactions TO authenticated;
GRANT ALL ON TABLE message_reactions TO service_role;

-- 10. Realtime for new table (Safer check for 'FOR ALL TABLES' publications)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime' AND puballtables = false) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;
    ELSE
        RAISE NOTICE 'Publication is FOR ALL TABLES or does not exist, skipping explicit add.';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not add table to publication: %', SQLERRM;
END $$;

-- DONE: Mevcut veriler korundu, yeni özellikler eklendi.
