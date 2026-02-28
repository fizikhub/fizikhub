-- =============================================
-- FizikHub Query Performance Optimizasyonu
-- =============================================
-- Bu script, Supabase Query Performance verilerine göre
-- en pahalı sorguları optimize eder.
--
-- EN BÜYÜK SORUN: realtime.list_changes sorguları toplam 
-- sorgu zamanının %92'sini alıyor! Nedeni: 
-- "FOR ALL TABLES" publication ayarı.
-- =============================================

BEGIN;

-- =========================================================
-- 1. REALTIME PUBLICATION OPTİMİZASYONU (EN BÜYÜK KAZANÇ!)
-- =========================================================
-- Mevcut durum: "FOR ALL TABLES" → HER tablo değişikliği 
-- realtime motorunu tetikliyor (%92 sorgu zamanı!)
-- Çözüm: Sadece gerçekten realtime ihtiyacı olan tabloları ekle.
--
-- Realtime kullanan kanallar (uygulamadan tespit edildi):
--   - notifications-bell → notifications tablosu
--   - global-admin-notification → notifications tablosu
--   - inbox:updates → conversations, messages
--   - chat:{id} → messages
--   - reactions:{id} → message_reactions
--   - questions_realtime → questions
--   - answers_{id} → answers
--   - comments_{id} → answer_comments
-- =========================================================

-- Eski publication'ı kaldır
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Sadece gerçekten ihtiyaç duyan tabloları ekle
CREATE PUBLICATION supabase_realtime FOR TABLE
    public.notifications,
    public.messages,
    public.conversations,
    public.conversation_participants,
    public.message_reactions,
    public.questions,
    public.answers,
    public.answer_comments;


-- =========================================================
-- 2. increment_question_views FONKSİYONUNU OPTİMİZE ET
-- =========================================================
-- Mevcut: 16.6ms ortalama (en yavaş uygulama sorgusu)
-- Çözüm: SECURITY DEFINER + sabit search_path ile optimize et

CREATE OR REPLACE FUNCTION public.increment_question_views(question_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.questions
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = question_id;
END;
$$;


-- =========================================================
-- 3. COMPOSITE INDEX'LER (Sık kullanılan sorgu pattern'leri)
-- =========================================================

-- Articles: status filtresi + created_at sıralaması (15K+ çağrı, 11ms ort.)
CREATE INDEX IF NOT EXISTS idx_articles_status_created_desc
    ON public.articles(status, created_at DESC);

-- Articles: author ilişkisi hızlandırma
CREATE INDEX IF NOT EXISTS idx_articles_author_status 
    ON public.articles(author_id, status);

-- Questions: created_at sıralaması (12K+ çağrı)
CREATE INDEX IF NOT EXISTS idx_questions_created_desc 
    ON public.questions(created_at DESC);

-- Questions: author ilişkisi
CREATE INDEX IF NOT EXISTS idx_questions_author 
    ON public.questions(author_id);

-- Answers: question_id ile sorgulama (lateral join'de kullanılıyor)
CREATE INDEX IF NOT EXISTS idx_answers_question_id 
    ON public.answers(question_id);

-- Conversation participants: user_id ile sorgulama (her mesajda)
CREATE INDEX IF NOT EXISTS idx_conv_participants_user 
    ON public.conversation_participants(user_id);

-- Profiles: is_writer partial index (articles JOIN profiles WHERE is_writer)
CREATE INDEX IF NOT EXISTS idx_profiles_writer 
    ON public.profiles(is_writer) WHERE is_writer = true;


-- =========================================================
-- 4. user_activity_logs TABLOSU OPTİMİZASYONU
-- =========================================================
-- 22K+ INSERT çağrısı. Okuma sorgularını hızlandırmak için
-- sadece gerekli index'leri ekle, yazma performansını koruyarak.

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created 
    ON public.user_activity_logs(user_id, created_at DESC);

-- Eski, artık kullanılmayan tek kolonlu index'leri kaldır
-- (composite index bunların yerini alır)
DROP INDEX IF EXISTS idx_user_activity_logs_user_id;
DROP INDEX IF EXISTS idx_user_activity_logs_created_at;


COMMIT;

-- Doğrulama
SELECT '🚀 Query Performance optimizasyonu başarıyla uygulandı!' as message;
