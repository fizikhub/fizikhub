-- Fizikhub Database RLS and Indices Optimization
-- Date: 2026-05-23

BEGIN;

-- Create an optimized stable wrapper for auth.uid()
-- Calling auth.uid() directly in RLS policies can cause performance overhead because it's volatile.
-- This stable wrapper will be evaluated once per statement.
CREATE OR REPLACE FUNCTION public.get_auth_uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- Add composite indices for frequently filtered/sorted columns

-- Articles: Usually queried by status 'published' and ordered by created_at DESC, sometimes filtered by category
CREATE INDEX IF NOT EXISTS idx_articles_status_category_created
ON public.articles (status, category, created_at DESC);

-- Questions: Often queried by status 'published' and ordered by created_at DESC
CREATE INDEX IF NOT EXISTS idx_questions_status_created
ON public.questions (status, created_at DESC);

-- Article Comments: Heavily queried by article_id and then parent_comment_id
CREATE INDEX IF NOT EXISTS idx_article_comments_article_parent
ON public.article_comments (article_id, parent_comment_id);

-- Profiles: Queries by username
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_lower
ON public.profiles (lower(username));

COMMIT;
