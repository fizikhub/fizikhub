-- Tune the Query Performance issues observed on 2026-05-04.
--
-- The top slow-query rows are Supabase Realtime internals:
-- realtime.list_changes(...) and realtime.subscription maintenance. The most
-- effective database-side fix is to publish only tables that the app actually
-- subscribes to, instead of letting every public table change enter Realtime.

DO $$
DECLARE
    realtime_tables text[] := ARRAY[
        'public.notifications',
        'public.conversations',
        'public.conversation_participants',
        'public.messages',
        'public.message_reactions',
        'public.questions',
        'public.answers',
        'public.answer_comments'
    ];
    publication_table_sql text;
BEGIN
    SELECT string_agg(
        format('%I.%I', n.nspname, c.relname),
        ', ' ORDER BY array_position(realtime_tables, format('%I.%I', n.nspname, c.relname))
    )
    INTO publication_table_sql
    FROM unnest(realtime_tables) AS requested(table_name)
    JOIN pg_class c ON c.oid = to_regclass(requested.table_name)
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind IN ('r', 'p');

    IF publication_table_sql IS NULL THEN
        RAISE EXCEPTION 'None of the expected Realtime tables exist.';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime SET TABLE ' || publication_table_sql;
    ELSE
        EXECUTE 'CREATE PUBLICATION supabase_realtime FOR TABLE ' || publication_table_sql;
    END IF;
END $$;

-- Exact query patterns from the Query Performance export.
CREATE INDEX IF NOT EXISTS idx_articles_status_created_at
    ON public.articles (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_articles_category_created_at
    ON public.articles (category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_questions_created_at_desc
    ON public.questions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_questions_category_created_at
    ON public.questions (category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_questions_votes_desc
    ON public.questions (votes DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_answers_question_created_at
    ON public.answers (question_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_answer_comments_answer_created_at
    ON public.answer_comments (answer_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_article_comments_article_created_at
    ON public.article_comments (article_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_article_references_article_created_at
    ON public.article_references (article_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created_at
    ON public.messages (conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at
    ON public.conversations (last_message_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_created_at
    ON public.user_activity_logs (user_id, created_at DESC);

ANALYZE public.articles;
ANALYZE public.questions;
ANALYZE public.answers;
ANALYZE public.answer_comments;
ANALYZE public.article_comments;
ANALYZE public.article_references;
ANALYZE public.messages;
ANALYZE public.conversations;
ANALYZE public.user_activity_logs;
