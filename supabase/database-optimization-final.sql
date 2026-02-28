-- ==========================================
-- FizikHub Supabase Database Optimization v1
-- ==========================================
-- This script addresses all WARN level linter issues:
-- 1. [PERFORMANCE] Auth RLS Initialization Plan (Subquery Optimization)
-- 2. [PERFORMANCE] Multiple Permissive Policies (Policy Cleanup)
-- 3. [PERFORMANCE] Duplicate Index Cleanup (Indexing Optimization)
-- ==========================================

BEGIN;

-- ==========================================
-- 1. AUTH RLS INITIALIZATION PLAN FIXES
-- ==========================================
-- Recommendation: Wrap auth.<function>() in (SELECT auth.<function>())
-- to prevent re-evaluation for each row.

-- public.messages
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;
CREATE POLICY "Users can delete their own messages"
    ON public.messages FOR DELETE
    USING (sender_id = (SELECT auth.uid()));

-- public.stories
DROP POLICY IF EXISTS "Users can delete their own stories" ON public.stories;
CREATE POLICY "Users can delete their own stories"
    ON public.stories FOR DELETE
    USING (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own stories" ON public.stories;
CREATE POLICY "Users can insert their own stories"
    ON public.stories FOR INSERT
    WITH CHECK (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own stories" ON public.stories;
CREATE POLICY "Users can update their own stories"
    ON public.stories FOR UPDATE
    USING (author_id = (SELECT auth.uid()));

-- public.story_groups
DROP POLICY IF EXISTS "Users can delete their own story groups" ON public.story_groups;
CREATE POLICY "Users can delete their own story groups"
    ON public.story_groups FOR DELETE
    USING (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own story groups" ON public.story_groups;
CREATE POLICY "Users can insert their own story groups"
    ON public.story_groups FOR INSERT
    WITH CHECK (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own story groups" ON public.story_groups;
CREATE POLICY "Users can update their own story groups"
    ON public.story_groups FOR UPDATE
    USING (author_id = (SELECT auth.uid()));

-- public.message_reactions
DROP POLICY IF EXISTS "Users can add reactions" ON public.message_reactions;
CREATE POLICY "Users can add reactions"
    ON public.message_reactions FOR INSERT
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can remove their reactions" ON public.message_reactions;
CREATE POLICY "Users can remove their reactions"
    ON public.message_reactions FOR DELETE
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view reactions in their conversations" ON public.message_reactions;
CREATE POLICY "Users can view reactions in their conversations"
    ON public.message_reactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_participants.conversation_id = (
                SELECT conversation_id FROM messages WHERE id = message_reactions.message_id
            )
            AND conversation_participants.user_id = (SELECT auth.uid())
        )
    );

-- ==========================================
-- 2. MULTIPLE PERMISSIVE POLICIES CLEANUP
-- ==========================================
-- Detected and merging redundant 'DELETE' policies on public.messages for all roles.
-- Standardizing on the single optimized policy "Users can delete their own messages".

DROP POLICY IF EXISTS "messages_delete" ON public.messages;

-- ==========================================
-- 3. DUPLICATE INDEX CLEANUP
-- ==========================================
-- Dropping duplicate indexes to improve write performance and reclaim storage.

-- public.articles
-- idx_articles_feed_composite is identical to idx_articles_status_created_at
DROP INDEX IF EXISTS public.idx_articles_status_created_at;

-- public.conversation_participants
-- idx_conversation_participants_user is identical to idx_conversation_participants_user_id
DROP INDEX IF EXISTS public.idx_conversation_participants_user;

-- public.profiles
-- profiles_username_key (Unique Constraint) is identical to profiles_username_unique (Index/Constraint)
-- If it's a constraint, we must drop it using ALTER TABLE
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_unique;
DROP INDEX IF EXISTS public.profiles_username_unique;

-- public.questions
-- idx_questions_created_at is identical to idx_questions_created_at_desc
DROP INDEX IF EXISTS public.idx_questions_created_at_desc;

COMMIT;

-- Final Verification Message
SELECT '🎉 Supabase optimizations applied successfully!' as message;
