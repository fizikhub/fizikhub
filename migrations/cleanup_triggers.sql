-- 1. Önce tüm triggerları bulup silelim
DROP TRIGGER IF EXISTS on_new_answer_notification ON answers;
DROP TRIGGER IF EXISTS on_badge_earned_notification ON user_badges;
DROP TRIGGER IF EXISTS on_comment_reply_notification ON article_comments;
DROP TRIGGER IF EXISTS on_vote_notification ON question_votes; -- Varsa bunu da silelim

-- 2. Trigger fonksiyonlarını silelim
DROP FUNCTION IF EXISTS notify_new_answer();
DROP FUNCTION IF EXISTS notify_badge_earned();
DROP FUNCTION IF EXISTS notify_comment_reply();
DROP FUNCTION IF EXISTS notify_vote();

-- 3. Emin olmak için tabloyu tekrar sıfırlayalım
DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content TEXT,
    resource_id TEXT,
    resource_type TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Users can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);
