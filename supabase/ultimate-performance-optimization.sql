-- ========================================================================================
-- FIZIKHUB ULTIMATE PERFORMANCE OPTIMIZATION - INDEX & CACHE TUNING
-- ========================================================================================
-- Kullanım: Bu SQL dosyasındaki tüm kodları kopyalayıp Supabase -> SQL Editor paneline yapıştırın ve çalıştırın.
-- Amacı: Veritabanı okuma (Select) sorgularını x100'e kadar hızlandırmak için eksik indeksleri oluşturur.
-- ========================================================================================

-- 1. FOREIGN KEY VE SIK KULLANILAN FILTRE INDEKSLERİ
-- Makaleler Tablosu
CREATE INDEX IF NOT EXISTS idx_articles_status_created ON public.articles (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles (author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);

-- İlişkili Veriler (Yorumlar, Beğeniler, Kaydedilenler, Referanslar)
-- Bu tablolar her sayfa açılışında "article_id" üzerinden filtreleniyor, bu indeksler şart.
CREATE INDEX IF NOT EXISTS idx_article_comments_article_id ON public.article_comments (article_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id_user_id ON public.article_likes (article_id, user_id);
CREATE INDEX IF NOT EXISTS idx_article_bookmarks_article_user ON public.article_bookmarks (article_id, user_id);
CREATE INDEX IF NOT EXISTS idx_article_references_article_id ON public.article_references (article_id);

-- Forum ve Sorular
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON public.questions (author_id);
CREATE INDEX IF NOT EXISTS idx_question_bookmarks_question_user ON public.question_bookmarks (question_id, user_id);
CREATE INDEX IF NOT EXISTS idx_question_votes_question_user ON public.question_votes (question_id, user_id);

-- Hikayeler (Stories ve Gruplar)
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON public.stories (expires_at DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_group_id ON public.stories (group_id);

-- Kullanıcı Profilleri
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_writer_reputation ON public.profiles (is_writer, reputation DESC);

-- Mesajlaşma Sistemi
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants (user_id);


-- 2. TRGM (METİN ARAMA) İÇİN GÜÇLENDİRMELER (LIKE / ILIKE KULLANIMLARI İÇİN MÜKEMMEL HIZ)
-- Eklentiyi aktifleştir (eğer yoksa)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Makale ve Soru Başlıklarında Arama İçin
CREATE INDEX IF NOT EXISTS trgm_idx_articles_title ON public.articles USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS trgm_idx_questions_title ON public.questions USING gin (title gin_trgm_ops);


-- 3. VACUUM VE ANALYZE İLE GÜNCEL VERİ İSTATİSTİKLERİNİ TOPLAMA
-- (Opsiyonel: Eğer pgAdmin/psql kullanıyorsanız bu tablo istatistiklerini güncelleyebilirsiniz. 
-- Supabase SQL Editor üzerinde çalıştırırken VACUUM işlemleri hata verebileceğinden pasife alınmıştır.)
-- VACUUM ANALYZE public.articles;
-- VACUUM ANALYZE public.profiles;
-- VACUUM ANALYZE public.article_comments;
-- VACUUM ANALYZE public.article_likes;


-- ========================================================================================
-- BİLGİLENDİRME:
-- Bütün bu eylemler (indeksler) fiziksel okumayı azalttığı için veritabanın RAM faturasını 
-- düşürecek ve sitenin ana sayfasının Supabase'den çektiği yükleme süresini dramatik azaltacak.
-- ========================================================================================
