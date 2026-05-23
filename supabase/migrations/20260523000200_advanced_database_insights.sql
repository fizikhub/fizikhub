-- =====================================================
-- FizikHub Gelişmiş Veritabanı Analizleri ve Görünümleri
-- Tarih: 2026-05-23
-- Amacı: Veritabanı sağlığını izlemek için Google/Microsoft standartlarında
-- analiz görünümleri oluşturur ve makale görüntülenmelerini güvenli artıran RPC yazar.
-- =====================================================

BEGIN;

-- 1. database_health_status Görünümü
-- Bu görünüm, veritabanındaki tabloların boyutlarını, index hit oranlarını
-- ve hangi tabloların full-table scan (seq_scan) sebebiyle yavaş çalışabileceğini raporlar.
CREATE OR REPLACE VIEW public.database_health_status AS
SELECT
    schemaname AS schema_name,
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size,
    seq_scan AS sequential_scans,
    idx_scan AS index_scans,
    CASE 
        WHEN (seq_scan + idx_scan) = 0 THEN '0%'
        ELSE round(100.0 * idx_scan / (seq_scan + idx_scan), 2)::text || '%'
    END AS index_usage_rate,
    n_tup_ins AS rows_inserted,
    n_tup_upd AS rows_updated,
    n_tup_del AS rows_deleted
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

COMMENT ON VIEW public.database_health_status IS 'FizikHub veritabanındaki tabloların sağlık, boyut ve indeks kullanım oranlarını izleme görünümü.';

-- 2. Görüntülenme Sayılarını Güvenli ve Performanslı Arttıran RPC
-- Klasik UPDATE sorguları yüksek eşzamanlılıkta kilitlenmelere (locking) sebep olabilir.
-- Bu fonksiyon atomik olarak views sayısını 1 arttırır ve güncellenen makalenin son durumunu döner.
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER -- Güvenlik açığı vermemek için yetkili rolde çalıştırılır
SET search_path = public
AS $$
DECLARE
    new_views integer;
BEGIN
    UPDATE public.articles
    SET views = COALESCE(views, 0) + 1
    WHERE id = article_id
    RETURNING views INTO new_views;
    
    RETURN new_views;
END;
$$;

-- RLS korumalı veritabanlarında RPC'lerin anonim veya yetkili kullanıcılar tarafından çağrılabilmesi gerekir.
GRANT EXECUTE ON FUNCTION public.increment_article_views(integer) TO anon, authenticated, service_role;

-- 3. Eksik Olabilecek İlişkisel İndekslerin Eklenmesi
-- public.article_notes ve public.article_references tablolarında performansı garantiye almak için ek indeksler.
CREATE INDEX IF NOT EXISTS idx_article_notes_article_id_resolved 
ON public.article_notes(article_id, resolved);

CREATE INDEX IF NOT EXISTS idx_articles_status_views
ON public.articles(status, views DESC)
WHERE status = 'published';

ANALYZE public.articles;
ANALYZE public.article_notes;

COMMIT;
