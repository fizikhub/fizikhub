-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'new_answer', 'badge_earned', 'new_vote'
    content TEXT NOT NULL,
    link TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for New Answer Notification
CREATE OR REPLACE FUNCTION notify_new_answer()
RETURNS TRIGGER AS $$
DECLARE
    v_question_title TEXT;
    v_question_author_id UUID;
BEGIN
    -- Get question details
    SELECT title, author_id INTO v_question_title, v_question_author_id
    FROM questions WHERE id = NEW.question_id;

    -- Don't notify if answering own question
    IF v_question_author_id != NEW.author_id THEN
        INSERT INTO notifications (user_id, type, content, link)
        VALUES (
            v_question_author_id,
            'new_answer',
            'Sorunuza yeni bir cevap geldi: ' || LEFT(v_question_title, 30) || '...',
            '/forum/' || NEW.question_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_answer_notification
    AFTER INSERT ON answers
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_answer();

-- Trigger for Badge Earned Notification
CREATE OR REPLACE FUNCTION notify_badge_earned()
RETURNS TRIGGER AS $$
DECLARE
    v_badge_name TEXT;
    v_badge_icon TEXT;
BEGIN
    -- Get badge details
    SELECT name, icon INTO v_badge_name, v_badge_icon
    FROM badges WHERE id = NEW.badge_id;

    INSERT INTO notifications (user_id, type, content, link)
    VALUES (
        NEW.user_id,
        'badge_earned',
        'Yeni Rozet Kazandın: ' || v_badge_icon || ' ' || v_badge_name,
        '/profil'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_badge_earned_notification
    AFTER INSERT ON user_badges
    FOR EACH ROW
    EXECUTE FUNCTION notify_badge_earned();

-- Trigger for Comment Reply Notification
CREATE OR REPLACE FUNCTION notify_comment_reply()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_author_id UUID;
    v_article_slug TEXT;
    v_article_title TEXT;
BEGIN
    -- Only notify if it's a reply (has parent_comment_id)
    IF NEW.parent_comment_id IS NOT NULL THEN
        -- Get parent comment author
        SELECT user_id INTO v_parent_author_id
        FROM article_comments WHERE id = NEW.parent_comment_id;

        -- Get article details
        SELECT slug, title INTO v_article_slug, v_article_title
        FROM articles WHERE id = NEW.article_id;

        -- Don't notify if replying to self
        IF v_parent_author_id != NEW.user_id THEN
            INSERT INTO notifications (user_id, type, content, link)
            VALUES (
                v_parent_author_id,
                'new_comment_reply',
                'Yorumunuza cevap geldi: ' || LEFT(NEW.content, 30) || '...',
                '/blog/' || v_article_slug
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_reply_notification
    AFTER INSERT ON article_comments
    FOR EACH ROW
    EXECUTE FUNCTION notify_comment_reply();
