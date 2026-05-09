-- Fix Supabase Performance Advisor warnings reported on 2026-05-04.
-- Apply after 20260504120000_security_advisor_warnings.sql.

BEGIN;

-- Shared helpers keep RLS policies short and avoid direct auth.* calls in policy predicates.
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = auth
AS $$
    SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION private.is_article_reviewer()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = private.current_user_id()
          AND (
            p.username = 'baranbozkurt'
            OR p.role IN ('admin', 'editor', 'author')
            OR COALESCE(p.is_writer, false)
          )
    );
$$;

GRANT EXECUTE ON FUNCTION private.current_user_id() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_article_reviewer() TO anon, authenticated, service_role;

-- 1. public.articles: merge public/owner/admin policies into one policy per action.
DROP POLICY IF EXISTS "Admins can read any article" ON public.articles;
DROP POLICY IF EXISTS "articles_select_public" ON public.articles;
DROP POLICY IF EXISTS "articles_select" ON public.articles;
DROP POLICY IF EXISTS "articles_select_access" ON public.articles;
CREATE POLICY "articles_select_access"
ON public.articles
FOR SELECT
TO anon, authenticated
USING (
    status = 'published'
    OR COALESCE(published, false)
    OR author_id = (SELECT private.current_user_id())
    OR (SELECT private.is_article_reviewer())
);

DROP POLICY IF EXISTS "Admins can update any article" ON public.articles;
DROP POLICY IF EXISTS "articles_update_owner" ON public.articles;
DROP POLICY IF EXISTS "articles_update" ON public.articles;
DROP POLICY IF EXISTS "articles_update_access" ON public.articles;
CREATE POLICY "articles_update_access"
ON public.articles
FOR UPDATE
TO authenticated
USING (
    author_id = (SELECT private.current_user_id())
    OR (SELECT private.is_article_reviewer())
)
WITH CHECK (
    author_id = (SELECT private.current_user_id())
    OR (SELECT private.is_article_reviewer())
);

-- 2. public.article_approvals: optimize auth lookup and merge DELETE policies.
DROP POLICY IF EXISTS "Only valid users can insert approvals" ON public.article_approvals;
DROP POLICY IF EXISTS "article_approvals_insert_valid_user" ON public.article_approvals;
CREATE POLICY "article_approvals_insert_valid_user"
ON public.article_approvals
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = (SELECT private.current_user_id())
    AND (SELECT private.is_article_reviewer())
);

DROP POLICY IF EXISTS "Admins can delete any approval" ON public.article_approvals;
DROP POLICY IF EXISTS "Only valid users can delete approvals" ON public.article_approvals;
DROP POLICY IF EXISTS "article_approvals_delete_valid_user_or_reviewer" ON public.article_approvals;
CREATE POLICY "article_approvals_delete_valid_user_or_reviewer"
ON public.article_approvals
FOR DELETE
TO authenticated
USING (
    user_id = (SELECT private.current_user_id())
    OR (SELECT private.is_article_reviewer())
);

-- 3. public.article_references: replace overlapping admin/author policies with one per action.
DROP POLICY IF EXISTS "Admins can manage references" ON public.article_references;
DROP POLICY IF EXISTS "Anyone can read references" ON public.article_references;
DROP POLICY IF EXISTS "Authors can manage references" ON public.article_references;
DROP POLICY IF EXISTS "Authors can update references" ON public.article_references;
DROP POLICY IF EXISTS "Authors can delete references" ON public.article_references;
DROP POLICY IF EXISTS "article_references_select" ON public.article_references;
DROP POLICY IF EXISTS "article_references_insert_owner_or_reviewer" ON public.article_references;
DROP POLICY IF EXISTS "article_references_update_owner_or_reviewer" ON public.article_references;
DROP POLICY IF EXISTS "article_references_delete_owner_or_reviewer" ON public.article_references;

CREATE POLICY "article_references_select"
ON public.article_references
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "article_references_insert_owner_or_reviewer"
ON public.article_references
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_references.article_id
          AND (
            a.author_id = (SELECT private.current_user_id())
            OR (SELECT private.is_article_reviewer())
          )
    )
);

CREATE POLICY "article_references_update_owner_or_reviewer"
ON public.article_references
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_references.article_id
          AND (
            a.author_id = (SELECT private.current_user_id())
            OR (SELECT private.is_article_reviewer())
          )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_references.article_id
          AND (
            a.author_id = (SELECT private.current_user_id())
            OR (SELECT private.is_article_reviewer())
          )
    )
);

CREATE POLICY "article_references_delete_owner_or_reviewer"
ON public.article_references
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_references.article_id
          AND (
            a.author_id = (SELECT private.current_user_id())
            OR (SELECT private.is_article_reviewer())
          )
    )
);

-- 4. public.article_notes: wrap user lookup and keep one policy per action.
DROP POLICY IF EXISTS "Authenticated users can add notes" ON public.article_notes;
DROP POLICY IF EXISTS "Note authors can update their notes" ON public.article_notes;
DROP POLICY IF EXISTS "Note authors can delete their notes" ON public.article_notes;
DROP POLICY IF EXISTS "article_notes_insert_author" ON public.article_notes;
DROP POLICY IF EXISTS "article_notes_update_author" ON public.article_notes;
DROP POLICY IF EXISTS "article_notes_delete_author" ON public.article_notes;

CREATE POLICY "article_notes_insert_author"
ON public.article_notes
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT private.current_user_id()));

CREATE POLICY "article_notes_update_author"
ON public.article_notes
FOR UPDATE
TO authenticated
USING (user_id = (SELECT private.current_user_id()))
WITH CHECK (user_id = (SELECT private.current_user_id()));

CREATE POLICY "article_notes_delete_author"
ON public.article_notes
FOR DELETE
TO authenticated
USING (user_id = (SELECT private.current_user_id()));

-- 5. public.article_ai_reviews: remove the old broad ALL policy if it still exists.
DROP POLICY IF EXISTS "Service can manage AI reviews" ON public.article_ai_reviews;
DROP POLICY IF EXISTS "Anyone can read AI reviews" ON public.article_ai_reviews;
DROP POLICY IF EXISTS "Authors and reviewers can insert AI reviews" ON public.article_ai_reviews;
DROP POLICY IF EXISTS "Authors and reviewers can update AI reviews" ON public.article_ai_reviews;
DROP POLICY IF EXISTS "Authors and reviewers can delete AI reviews" ON public.article_ai_reviews;
DROP POLICY IF EXISTS "article_ai_reviews_select" ON public.article_ai_reviews;
DROP POLICY IF EXISTS "article_ai_reviews_insert_owner_or_reviewer" ON public.article_ai_reviews;
DROP POLICY IF EXISTS "article_ai_reviews_update_owner_or_reviewer" ON public.article_ai_reviews;
DROP POLICY IF EXISTS "article_ai_reviews_delete_owner_or_reviewer" ON public.article_ai_reviews;

CREATE POLICY "article_ai_reviews_select"
ON public.article_ai_reviews
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "article_ai_reviews_insert_owner_or_reviewer"
ON public.article_ai_reviews
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_ai_reviews.article_id
          AND (
            a.author_id = (SELECT private.current_user_id())
            OR (SELECT private.is_article_reviewer())
          )
    )
);

CREATE POLICY "article_ai_reviews_update_owner_or_reviewer"
ON public.article_ai_reviews
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_ai_reviews.article_id
          AND (
            a.author_id = (SELECT private.current_user_id())
            OR (SELECT private.is_article_reviewer())
          )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_ai_reviews.article_id
          AND (
            a.author_id = (SELECT private.current_user_id())
            OR (SELECT private.is_article_reviewer())
          )
    )
);

CREATE POLICY "article_ai_reviews_delete_owner_or_reviewer"
ON public.article_ai_reviews
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.articles a
        WHERE a.id = article_ai_reviews.article_id
          AND (
            a.author_id = (SELECT private.current_user_id())
            OR (SELECT private.is_article_reviewer())
          )
    )
);

-- 6. Drop duplicate indexes, keeping the more recent/query-specific variants.
DROP INDEX IF EXISTS public.idx_answer_likes_composite;
DROP INDEX IF EXISTS public.idx_answers_author;
DROP INDEX IF EXISTS public.idx_answers_author_created;
DROP INDEX IF EXISTS public.idx_article_bookmarks_article_user;
DROP INDEX IF EXISTS public.idx_article_likes_article_id_user_id;
DROP INDEX IF EXISTS public.idx_article_references_article_id;
DROP INDEX IF EXISTS public.idx_articles_slug;
DROP INDEX IF EXISTS public.idx_messages_conversation;
DROP INDEX IF EXISTS public.idx_question_bookmarks_question_user;
DROP INDEX IF EXISTS public.idx_question_votes_composite;
DROP INDEX IF EXISTS public.idx_question_votes_question_user;
DROP INDEX IF EXISTS public.idx_questions_author;
DROP INDEX IF EXISTS public.idx_questions_author_created;
DROP INDEX IF EXISTS public.idx_questions_created;
DROP INDEX IF EXISTS public.idx_questions_created_desc;
DROP INDEX IF EXISTS public.trgm_idx_questions_title;

ANALYZE public.articles;
ANALYZE public.article_approvals;
ANALYZE public.article_references;
ANALYZE public.article_notes;
ANALYZE public.article_ai_reviews;
ANALYZE public.answer_likes;
ANALYZE public.answers;
ANALYZE public.article_bookmarks;
ANALYZE public.article_likes;
ANALYZE public.messages;
ANALYZE public.question_bookmarks;
ANALYZE public.question_votes;
ANALYZE public.questions;

COMMIT;
