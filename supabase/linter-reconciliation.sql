-- =============================================
-- FizikHub Supabase Linter Reconciliation
-- =============================================
-- Bu script, "Unused Index" ve "Unindexed Foreign Key"
-- arasındaki çelişkiyi çözer. 
--
-- KRİTİK: Yabancı anahtarların (Foreign Keys) indeksli olması, 
-- silme ve join işlemlerinde full table scan'i önlemek için 
-- standart bir "en iyi uygulama"dır (best practice). 
-- Bu indeksler şu an "unused" görünse bile tutulmalıdır.
-- =============================================

BEGIN;

-- =============================================
-- 1. EKSİK YABANCI ANAHTAR İNDEKSLEYİCİLERİ GERİ GETİR
-- =============================================
-- Son temizlikte (linter-fixes-final.sql) silinen ve 
-- tekrar "Unindexed Foreign Key" uyarısı verenler:

-- message_reactions (user_id)
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_cover 
    ON public.message_reactions(user_id);

-- user_quiz_attempts (user_id)
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_cover 
    ON public.user_quiz_attempts(user_id);


-- =============================================
-- 2. DİĞER FK İNDEKSLERİNİ KORU
-- =============================================
-- linter-fixes-final.sql ile eklenen şu indeksler 
-- "unused" uyarısı verse de, FK coverage için TUTULMALIDIR:
--   - idx_answer_likes_user_id
--   - idx_article_bookmarks_article_id
--   - idx_follows_following_id
--   - idx_messages_reply_to_id
--   - idx_question_bookmarks_question_id
--   - idx_question_votes_user_id
--   - idx_quiz_questions_quiz_id
--   - idx_stories_author_id
--   - idx_stories_group_id
--   - idx_user_badges_badge_id
--   - idx_user_quiz_attempts_quiz_id

-- Bu indeksler zaten mevcutsa dokunmuyoruz.


-- =============================================
-- 3. MÜKERRER KONTROLÜ
-- =============================================
-- Eğer linter hala mükerrer görüyorsa, eski isimli olanları temizle.

-- Questions author duplicate fix
DROP INDEX IF EXISTS public.idx_questions_author;
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON public.questions(author_id);

-- Questions created_at duplicate fix
DROP INDEX IF EXISTS public.idx_questions_created_at;
CREATE INDEX IF NOT EXISTS idx_questions_created_desc ON public.questions(created_at DESC);


COMMIT;

-- Doğrulama
SELECT '✅ Supabase linter uzlaşması ve FK indekslemesi tamamlandı!' as message;
