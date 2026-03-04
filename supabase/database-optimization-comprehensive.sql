-- =====================================================
-- FizikHub Veritabanı Kapsamlı Optimizasyon
-- Tarih: 2026-03-04
-- =====================================================
-- Bu dosyayı Supabase SQL Editor'de çalıştırın.
-- Her bölümü ayrı ayrı çalıştırmanız önerilir.
-- =====================================================

-- =====================================================
-- BÖLÜM 1: TEMEL İNDEKSLER
-- Sık sorgulanan sütunlar için composite indexler
-- =====================================================

-- Articles tablosu: Ana sayfa feed, blog listesi, kategori filtresi
CREATE INDEX IF NOT EXISTS idx_articles_status_created 
    ON articles(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_articles_slug 
    ON articles(slug) WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_articles_author_status 
    ON articles(author_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_articles_category_status 
    ON articles(category, status, created_at DESC);

-- Questions tablosu: Forum listesi, kullanıcı soruları
CREATE INDEX IF NOT EXISTS idx_questions_created 
    ON questions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_questions_author
    ON questions(author_id, created_at DESC);

-- Answers tablosu: Soru detay sayfası
CREATE INDEX IF NOT EXISTS idx_answers_question 
    ON answers(question_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_answers_author
    ON answers(author_id, created_at DESC);

-- Profiles tablosu: Kullanıcı arama, yazar filtresi
CREATE INDEX IF NOT EXISTS idx_profiles_username 
    ON profiles(username) WHERE username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_writer 
    ON profiles(is_writer, created_at DESC) WHERE is_writer = true;

-- Dictionary Terms: Sözlük sayfası
CREATE INDEX IF NOT EXISTS idx_dictionary_terms_created 
    ON dictionary_terms(created_at DESC);







-- =====================================================
-- BÖLÜM 3: SORGU OPTİMİZASYONU
-- Yaygın sorguları hızlandırma
-- =====================================================

-- Yayınlanmış makale sayısı için partial index
CREATE INDEX IF NOT EXISTS idx_articles_published_count 
    ON articles(created_at DESC) 
    WHERE status = 'published';

-- Full-text search index (makale arama)
CREATE INDEX IF NOT EXISTS idx_articles_search 
    ON articles USING gin(to_tsvector('turkish', COALESCE(title, '') || ' ' || COALESCE(excerpt, '')))
    WHERE status = 'published';

-- Full-text search index (soru arama)
CREATE INDEX IF NOT EXISTS idx_questions_search 
    ON questions USING gin(to_tsvector('turkish', COALESCE(title, '') || ' ' || COALESCE(content, '')));

-- Full-text search index (sözlük terimi arama)
CREATE INDEX IF NOT EXISTS idx_dictionary_search 
    ON dictionary_terms USING gin(to_tsvector('turkish', COALESCE(term, '') || ' ' || COALESCE(definition, '')));


-- =====================================================
-- BÖLÜM 4: VACUUM VE ANALYZE
-- Tablo istatistiklerini günceller, ölü satırları temizler
-- =====================================================

-- TÜM TABLOLARI ANALİZ ET (sorgu planlayıcısı için)
ANALYZE articles;
ANALYZE questions;
ANALYZE answers;
ANALYZE profiles;
ANALYZE dictionary_terms;
ANALYZE quizzes;

-- VACUUM (ölü tuple'ları temizle, disk alanını geri kazan)
VACUUM (VERBOSE) articles;
VACUUM (VERBOSE) questions;
VACUUM (VERBOSE) answers;
VACUUM (VERBOSE) profiles;


-- =====================================================
-- BÖLÜM 5: PERFORMANS İZLEME
-- Yavaş sorguları tespit etmek için
-- =====================================================

-- pg_stat_statements uzantısını etkinleştir (Supabase'de genellikle aktif)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- En yavaş 20 sorguyu görüntüle
-- Bu sorguyu ayrıca çalıştırarak yavaş sorguları kontrol edebilirsiniz:
/*
SELECT 
    calls,
    round(total_exec_time::numeric, 2) AS total_time_ms,
    round(mean_exec_time::numeric, 2) AS avg_time_ms,
    round(max_exec_time::numeric, 2) AS max_time_ms,
    rows,
    query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
*/

-- Kullanılmayan indexleri bul
/*
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
*/


-- =====================================================
-- BÖLÜM 6: BAĞLANTI VE CACHE AYARLARI
-- =====================================================

-- Statement timeout: Çok uzun çalışan sorguları öldür (30 saniye)
-- ALTER DATABASE postgres SET statement_timeout = '30s';

-- İdle transaction timeout (boşta kalan bağlantıları temizle)  
-- ALTER DATABASE postgres SET idle_in_transaction_session_timeout = '60s';


-- =====================================================
-- TAMAMLANDI ✅
-- =====================================================
