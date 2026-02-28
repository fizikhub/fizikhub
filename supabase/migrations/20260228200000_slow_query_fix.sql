-- =============================================
-- FizikHub Slow Query Fix - 2026-02-28
-- =============================================
-- Bu SQL'i Supabase Dashboard > SQL Editor > New Query'e yapıştırıp çalıştırın.

-- --------------------------------------------------------
-- 1. ARTICLES tablosu için eksik composite indexler
--    (15K+ çağrı, ortalama 11ms - author join ve status filter)
-- --------------------------------------------------------

-- Status + created_at composite index: en sık kullanılan sorgu pattern'i
CREATE INDEX IF NOT EXISTS idx_articles_status_created_at 
ON public.articles(status, created_at DESC);

-- Yazar filtresi + status için (is_writer join'i hızlandırır)
CREATE INDEX IF NOT EXISTS idx_articles_status_author_id 
ON public.articles(status, author_id);

-- --------------------------------------------------------
-- 2. QUESTIONS tablosu için indexler
--    (12K+ çağrı, lateral join ile author ve answers çekiliyor)
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_questions_created_at_desc 
ON public.questions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_questions_author_id 
ON public.questions(author_id);

-- --------------------------------------------------------
-- 3. CONVERSATION_PARTICIPANTS tablosu
--    (6K+ çağrı, user_id sorgulama her mesajlaşmada çalışıyor)
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id 
ON public.conversation_participants(user_id);

-- --------------------------------------------------------
-- 4. USER_ACTIVITY_LOGS tablosu
--    INSERT 22K kez çalışıyor - user_id index ekle
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id 
ON public.user_activity_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at 
ON public.user_activity_logs(created_at DESC);

-- --------------------------------------------------------
-- 5. PROFILES tablosu - is_writer sorgusu için index
--    (articles JOIN profiles WHERE is_writer = true)
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_is_writer 
ON public.profiles(is_writer) 
WHERE is_writer = true;  -- Partial index: sadece writer'ları indexle

-- --------------------------------------------------------
-- 6. increment_question_views fonksiyonunu optimize et
--    (1.2K çağrı, ortalama 16ms - questions tablosuna UPDATE yapıyor)
--    questions tablosunda views kolonu yoksa bu fonksiyon boş çalışıyordur.
-- --------------------------------------------------------

-- Mevcut fonksiyonun durumunu kontrol et:
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'increment_question_views' 
AND routine_schema = 'public';

-- --------------------------------------------------------
-- 7. Realtime aboneliklerini temizle (EL ATILMASI GEREKEN EN BÜYÜK SORUN)
--    realtime.list_changes sorgusu toplam zamanın %68'ini alıyor.
--    Bu, çok fazla Realtime kanalı/abonelik olduğu anlamına geliyor.
-- --------------------------------------------------------

-- Mevcut aktif Realtime aboneliklerini göster:
SELECT entity::text as table_name, count(*) as subscription_count
FROM realtime.subscription
GROUP BY entity 
ORDER BY subscription_count DESC;
