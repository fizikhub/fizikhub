-- FizikHub Forum & Quiz Sorgu Performans Güçlendirmesi
-- Tarih: 2026-05-24
-- Amaç: Forum cevapları, yorumları, yorum beğenileri ve quiz ilişkisel sorgularını hızlandırmak için ek ilişkisel (Foreign Key) indeksleri ekler.

BEGIN;

-- 1. Forum Cevap Yorumları İndeksi
CREATE INDEX IF NOT EXISTS idx_answer_comments_answer_id_created 
ON public.answer_comments (answer_id, created_at ASC);

-- 2. Forum Yorum Beğenileri İndeksi
CREATE INDEX IF NOT EXISTS idx_answer_comment_likes_comment_id 
ON public.answer_comment_likes (comment_id);

-- 3. Quiz Soruları İlişki İndeksi
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id 
ON public.quiz_questions (quiz_id);

COMMIT;
