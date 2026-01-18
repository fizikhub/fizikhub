-- ==========================================
-- Supabase Notification Triggers
-- ==========================================
-- Automates notification creation for key events.
-- 1. Article Likes -> Notify Author
-- 2. New Follower -> Notify User
-- 3. Article Comments -> Notify Author
-- ==========================================

-- Helper function to safely insert notification
CREATE OR REPLACE FUNCTION public.handle_new_notification()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
    resource_id_val TEXT;
    resource_type_val TEXT;
    notif_type TEXT;
    content_val TEXT;
BEGIN
    -- 1. HANDLE ARTICLE LIKES
    IF (TG_TABLE_NAME = 'article_likes') THEN
        -- Get article author
        SELECT author_id INTO target_user_id FROM public.articles WHERE id = NEW.article_id;
        
        -- Don't notify if liking own article
        IF target_user_id = NEW.user_id THEN RETURN NEW; END IF;

        resource_id_val := NEW.article_id::TEXT;
        resource_type_val := 'article';
        notif_type := 'like';
        content_val := 'Makalenizi beğendi.'; -- Or keep null and handle in frontend

    -- 2. HANDLE FOLLOWS
    ELSIF (TG_TABLE_NAME = 'follows') THEN
        target_user_id := NEW.following_id;
        resource_id_val := NEW.follower_id::TEXT; -- Resource is the follower profile
        resource_type_val := 'profile';
        notif_type := 'follow';
        content_val := 'Sizi takip etmeye başladı.';

    -- 3. HANDLE ARTICLE COMMENTS
    ELSIF (TG_TABLE_NAME = 'article_comments') THEN
        -- Get article author
        SELECT author_id INTO target_user_id FROM public.articles WHERE id = NEW.article_id;

        -- Don't notify if commenting on own article
        IF target_user_id = NEW.user_id THEN RETURN NEW; END IF;

        resource_id_val := NEW.article_id::TEXT;
        resource_type_val := 'article';
        notif_type := 'comment';
        content_val := left(NEW.content, 50); -- Store preview of comment
    
    END IF;

    -- INSERT NOTIFICATION (if target found)
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            recipient_id,
            actor_id,
            type,
            resource_id,
            resource_type,
            content
        ) VALUES (
            target_user_id,
            (CASE WHEN TG_TABLE_NAME = 'follows' THEN NEW.follower_id ELSE NEW.user_id END),
            notif_type,
            resource_id_val,
            resource_type_val,
            content_val
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Attach Triggers
-- ==========================================

-- 1. Trigger for Article Likes
DROP TRIGGER IF EXISTS on_article_like ON public.article_likes;
CREATE TRIGGER on_article_like
    AFTER INSERT ON public.article_likes
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_notification();

-- 2. Trigger for Follows
DROP TRIGGER IF EXISTS on_follow ON public.follows;
CREATE TRIGGER on_follow
    AFTER INSERT ON public.follows
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_notification();

-- 3. Trigger for Article Comments
DROP TRIGGER IF EXISTS on_article_comment ON public.article_comments;
CREATE TRIGGER on_article_comment
    AFTER INSERT ON public.article_comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_notification();

-- =======================
-- DONE
-- =======================
SELECT '✅ Notification Triggers created successfully!' as message;
