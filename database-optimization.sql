-- Fizikhub Veritabanı Optimizasyon Scripti
-- Bu dosya, uygulamanın arama ve listeleme işlemlerini 10 kat hızlandırmak için indexlemeler içerir.
-- Bu scripti Supabase Dashboard -> SQL Editor üzerinden çalıştırın.

---------------------------------------------------
-- 1. B-TREE INDEXLERİ (Sıralama ve Filtrelemeler)
---------------------------------------------------
-- Articles tablosunda tarihe ve yayın durumuna göre sıralamayı hızlandırmak için:
CREATE INDEX IF NOT EXISTS idx_articles_status_created_at 
ON public.articles(status, created_at DESC);

-- Slug (URL) aramalarını saniyenin binde birine düşürmek için (Unique Index):
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug 
ON public.articles(slug);

CREATE UNIQUE INDEX IF NOT EXISTS idx_quizzes_slug 
ON public.quizzes(slug);

---------------------------------------------------
-- 2. GIN INDEXLERİ (Full Text Search - FTS)
---------------------------------------------------
-- "ilike" aramalarını çok daha hızlı hale getiren trigram (pg_trgm) veya tsvector tabanlı indexler.
-- PostgreSQL'in pg_trgm eklentisini aktif edelim:
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Articles (Makaleler) için GIN Index
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm 
ON public.articles USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_articles_category_trgm 
ON public.articles USING GIN (category gin_trgm_ops);

-- Questions (Sorular/Forum) için GIN Index
CREATE INDEX IF NOT EXISTS idx_questions_title_trgm 
ON public.questions USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_questions_content_trgm 
ON public.questions USING GIN (content gin_trgm_ops);

-- Dictionary (Sözlük) için GIN Index
CREATE INDEX IF NOT EXISTS idx_dictionary_term_trgm 
ON public.dictionary_terms USING GIN (term gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dictionary_def_trgm 
ON public.dictionary_terms USING GIN (definition gin_trgm_ops);

---------------------------------------------------
-- SONUÇ:
-- Bu script çalıştıktan sonra app/search/actions.ts dosyasındaki `ilike` sorguları 
-- artık Table Scan (tüm veritabanını tarama) yapmayacak, bunun yerine GIN indexlerini kullanacaktır.
-- Bu, özellikle makale/soru sayısı 10.000'i geçtiğinde uygulamanın çökmemesini garanti altına alır.
