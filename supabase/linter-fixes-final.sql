-- =============================================
-- FizikHub Supabase Linter Fixes & Final Optimization
-- =============================================
-- Bu script, Supabase Linter tarafından bildirilen
-- son WARN ve INFO sorunlarını giderir.
-- =============================================

BEGIN;

-- =============================================
-- 1. RLS PERFORMANCE FIXES (auth_rls_initplan)
-- =============================================
-- auth.uid() çağrılarını (SELECT auth.uid()) ile sarmalayarak
-- her satır için tekrar hesaplanmasını engeller (performans artışı).

-- public.answers
DROP POLICY IF EXISTS "answers_insert_auth" ON public.answers;
CREATE POLICY "answers_insert_auth" 
    ON public.answers FOR INSERT 
    WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- public.articles
DROP POLICY IF EXISTS "articles_insert_auth" ON public.articles;
CREATE POLICY "articles_insert_auth" 
    ON public.articles FOR INSERT 
    WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- public.questions
DROP POLICY IF EXISTS "questions_insert_auth" ON public.questions;
CREATE POLICY "questions_insert_auth" 
    ON public.questions FOR INSERT 
    WITH CHECK ((SELECT auth.uid()) IS NOT NULL);


-- =============================================
-- 2. DUPLICATE INDEX CLEANUP
-- =============================================
-- Mükerrer (aynı işi yapan) indeksleri temizler.

-- Articles: idx_articles_status_created_desc (benim) vs idx_articles_feed_composite (mevcut)
DROP INDEX IF EXISTS public.idx_articles_status_created_desc;

-- Conversation Participants: idx_conv_participants_user vs idx_conversation_participants_user_id
DROP INDEX IF EXISTS public.idx_conv_participants_user;

-- Questions: idx_questions_author vs idx_questions_author_id
DROP INDEX IF EXISTS public.idx_questions_author;

-- Questions: idx_questions_created_at vs idx_questions_created_desc
DROP INDEX IF EXISTS public.idx_questions_created_desc;


-- =============================================
-- 3. UNINDEXED FOREIGN KEYS (Performans Artışı)
-- =============================================
-- Linter tarafından tespit edilen eksik yabancı anahtar indeksleri.

CREATE INDEX IF NOT EXISTS idx_answer_likes_user_id ON public.answer_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_article_bookmarks_article_id ON public.article_bookmarks(article_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to_id ON public.messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_question_bookmarks_question_id ON public.question_bookmarks(question_id);
CREATE INDEX IF NOT EXISTS idx_question_votes_user_id ON public.question_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON public.stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_group_id ON public.stories(group_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON public.user_quiz_attempts(quiz_id);


-- =============================================
-- 4. UNUSED INDEX CLEANUP (Bilinen gereksizler)
-- =============================================

DROP INDEX IF EXISTS public.idx_message_reactions_user_id;
DROP INDEX IF EXISTS public.idx_user_quiz_attempts_user_id_fixed;
DROP INDEX IF EXISTS public.idx_profiles_writer;


-- =============================================
-- 5. MATERIALIZED VIEW SECURITY
-- =============================================
-- Linter, materialized view'un API'den erişilebilir olmasını WARN olarak döner.
-- v4 script'inde 'anon' yetkisini almıştık. 'authenticated' yetkisini de 
-- kısıtlayıp sadece RPC üzerinden erişilebilir yapabiliriz ancak bu uygulama kodunda
-- değişikliğe yol açar. Bu yüzden şimdilik sadece anon kısıtlamasının 
-- tam uygulandığından emin oluyoruz.

REVOKE ALL ON public.feed_articles_mv FROM anon;


COMMIT;

-- Doğrulama Mesajı
SELECT '🚀 Supabase linter düzeltmeleri ve indeks temizliği başarıyla uygulandı!' as message;
