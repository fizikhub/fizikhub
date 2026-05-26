-- =====================================================
-- FizikHub SEO/GEO Sağlık ve Arama Görünürlüğü RPC Katmanı
-- Tarih: 2026-05-26
-- Güvenlik: PostgREST şema sınırını (PGRST106) aşmak için public RPC wrapper'ları oluşturur.
-- =====================================================

BEGIN;

-- 1. Zayıf İçerik (Kısa Sayfalar) Sorgulamak için RPC
CREATE OR REPLACE FUNCTION public.get_seo_low_value_content()
RETURNS TABLE (
    source_type text,
    source_id text,
    title text,
    canonical_path text,
    visible_text_length integer,
    updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, private
STABLE
AS $$
    SELECT 
        source_type::text,
        source_id::text,
        title::text,
        canonical_path::text,
        visible_text_length::integer,
        updated_at::timestamptz
    FROM private.low_value_indexable_content
    ORDER BY visible_text_length ASC;
$$;

-- 2. Senkron Olmayan Vektör Arama Dokümanlarını Sorgulamak için RPC
CREATE OR REPLACE FUNCTION public.get_seo_sync_status()
RETURNS TABLE (
    source_type text,
    source_id text,
    title text,
    expected_path text,
    updated_at timestamptz,
    document_id bigint,
    is_synced boolean,
    indexed_canonical_path text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, private
STABLE
AS $$
    SELECT 
        source_type::text,
        source_id::text,
        title::text,
        expected_path::text,
        updated_at::timestamptz,
        document_id::bigint,
        is_synced::boolean,
        indexed_canonical_path::text
    FROM private.search_document_sync_status
    WHERE is_synced = false;
$$;

-- 3. Yetkileri Sıfırla (PUBLIC, anon, authenticated erişimi engelle)
REVOKE EXECUTE ON FUNCTION public.get_seo_low_value_content() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_seo_sync_status() FROM PUBLIC, anon, authenticated;

-- 4. Yalnızca service_role (Next.js server-side) için yetki ver
GRANT EXECUTE ON FUNCTION public.get_seo_low_value_content() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_seo_sync_status() TO service_role;

-- 5. Dokümantasyon Açıklamaları
COMMENT ON FUNCTION public.get_seo_low_value_content() IS 'Zayıf (kısa) içeriklerin admin paneli tarafından güvenli şekilde listelenmesini sağlayan service_role RPCsi.';
COMMENT ON FUNCTION public.get_seo_sync_status() IS 'Semantik arama indeksiyle senkronize olmayan içeriklerin listelenmesini sağlayan service_role RPCsi.';

COMMIT;
