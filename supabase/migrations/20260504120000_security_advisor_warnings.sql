-- Fix Supabase Security Advisor warnings reported on 2026-05-04.
-- Apply with Supabase CLI or paste into SQL Editor.

BEGIN;

-- 1. Materialized views should not be directly exposed through Data APIs.
REVOKE ALL ON TABLE public.feed_articles_mv FROM anon, authenticated, PUBLIC;
GRANT SELECT ON TABLE public.feed_articles_mv TO service_role;

-- 2. Replace the permissive article_ai_reviews ALL policy.
ALTER TABLE public.article_ai_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage AI reviews" ON public.article_ai_reviews;

DROP POLICY IF EXISTS "Authors and reviewers can insert AI reviews" ON public.article_ai_reviews;
CREATE POLICY "Authors and reviewers can insert AI reviews"
ON public.article_ai_reviews
FOR INSERT
WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_ai_reviews.article_id
          AND (
            a.author_id = (SELECT auth.uid())
            OR EXISTS (
                SELECT 1
                FROM public.profiles p
                WHERE p.id = (SELECT auth.uid())
                  AND (
                    p.username = 'baranbozkurt'
                    OR p.role IN ('admin', 'editor', 'author')
                    OR COALESCE(p.is_writer, false)
                  )
            )
          )
    )
);

DROP POLICY IF EXISTS "Authors and reviewers can update AI reviews" ON public.article_ai_reviews;
CREATE POLICY "Authors and reviewers can update AI reviews"
ON public.article_ai_reviews
FOR UPDATE
USING (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_ai_reviews.article_id
          AND (
            a.author_id = (SELECT auth.uid())
            OR EXISTS (
                SELECT 1
                FROM public.profiles p
                WHERE p.id = (SELECT auth.uid())
                  AND (
                    p.username = 'baranbozkurt'
                    OR p.role IN ('admin', 'editor', 'author')
                    OR COALESCE(p.is_writer, false)
                  )
            )
          )
    )
)
WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_ai_reviews.article_id
          AND (
            a.author_id = (SELECT auth.uid())
            OR EXISTS (
                SELECT 1
                FROM public.profiles p
                WHERE p.id = (SELECT auth.uid())
                  AND (
                    p.username = 'baranbozkurt'
                    OR p.role IN ('admin', 'editor', 'author')
                    OR COALESCE(p.is_writer, false)
                  )
            )
          )
    )
);

DROP POLICY IF EXISTS "Authors and reviewers can delete AI reviews" ON public.article_ai_reviews;
CREATE POLICY "Authors and reviewers can delete AI reviews"
ON public.article_ai_reviews
FOR DELETE
USING (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_ai_reviews.article_id
          AND (
            a.author_id = (SELECT auth.uid())
            OR EXISTS (
                SELECT 1
                FROM public.profiles p
                WHERE p.id = (SELECT auth.uid())
                  AND (
                    p.username = 'baranbozkurt'
                    OR p.role IN ('admin', 'editor', 'author')
                    OR COALESCE(p.is_writer, false)
                  )
            )
          )
    )
);

-- 3. Public buckets do not need broad SELECT policies for public object URLs.
DROP POLICY IF EXISTS "Article images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public View" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Covers are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Stories images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 4. Move messaging RLS helpers out of the exposed public API schema.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.is_conv_participant(conversation_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.conversation_participants cp
        WHERE cp.conversation_id = $1
          AND cp.user_id = (SELECT auth.uid())
    );
$$;

CREATE OR REPLACE FUNCTION private.is_conversation_participant(conversation_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT private.is_conv_participant($1);
$$;

GRANT EXECUTE ON FUNCTION private.is_conv_participant(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_conversation_participant(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select"
ON public.conversations
FOR SELECT
USING (private.is_conv_participant(id));

DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view conversation participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "participants_select" ON public.conversation_participants;
CREATE POLICY "participants_select"
ON public.conversation_participants
FOR SELECT
USING (private.is_conv_participant(conversation_id));

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "View messages" ON public.messages;
DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select"
ON public.messages
FOR SELECT
USING (private.is_conv_participant(conversation_id));

DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
DROP POLICY IF EXISTS "Send messages" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert"
ON public.messages
FOR INSERT
WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND private.is_conv_participant(conversation_id)
);

DROP POLICY IF EXISTS "Users can update messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "messages_update" ON public.messages;
CREATE POLICY "messages_update"
ON public.messages
FOR UPDATE
USING (private.is_conv_participant(conversation_id))
WITH CHECK (private.is_conv_participant(conversation_id));

-- 5. SECURITY DEFINER functions must not be executable from exposed API roles.
DO $$
DECLARE
    fn regprocedure;
    fns regprocedure[] := ARRAY[
        to_regprocedure('public.add_reputation(uuid, integer, text, text, bigint)'),
        to_regprocedure('public.award_badge(uuid, text)'),
        to_regprocedure('public.check_email_exists(text)'),
        to_regprocedure('public.check_first_question_badge()'),
        to_regprocedure('public.check_popular_question_badge()'),
        to_regprocedure('public.check_professor_badge()'),
        to_regprocedure('public.create_conversation(uuid)'),
        to_regprocedure('public.get_auth_uid()'),
        to_regprocedure('public.get_follower_count(uuid)'),
        to_regprocedure('public.handle_answer_badges()'),
        to_regprocedure('public.handle_answer_like_badges()'),
        to_regprocedure('public.handle_new_message_notification()'),
        to_regprocedure('public.handle_new_notification()'),
        to_regprocedure('public.handle_new_user()'),
        to_regprocedure('public.handle_question_badges()'),
        to_regprocedure('public.handle_question_vote_badges()'),
        to_regprocedure('public.handle_reputation_badges()'),
        to_regprocedure('public.increment_question_views(bigint)'),
        to_regprocedure('public.is_admin()'),
        to_regprocedure('public.is_conv_participant(uuid)'),
        to_regprocedure('public.is_conversation_participant(uuid)'),
        to_regprocedure('public.notify_message_liked()'),
        to_regprocedure('public.refresh_feed_articles_mv()'),
        to_regprocedure('public.update_article_comments_count()'),
        to_regprocedure('public.update_article_likes_count()'),
        to_regprocedure('public.update_conversation_on_message()'),
        to_regprocedure('public.update_conversation_timestamp()'),
        to_regprocedure('public.update_question_answers_count()'),
        to_regprocedure('public.update_question_votes_count()')
    ];
BEGIN
    FOREACH fn IN ARRAY fns LOOP
        IF fn IS NOT NULL THEN
            EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon, authenticated, PUBLIC', fn);
            EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn);
        END IF;
    END LOOP;
END $$;

COMMIT;
