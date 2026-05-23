-- =====================================================
-- FizikHub Vektör Arama Optimizasyonu ve Hata Giderimi
-- Tarih: 2026-05-23
-- =====================================================

-- 1. HNSW Vektör İndeksi Oluşturma (Cosine Similarity için)
-- pgvector uzantısının kurulu olduğunu varsayar. Cosine distance (<=>) için
-- vector_cosine_ops operatör sınıfı kullanılır. HNSW index, IVFFlat'a göre çok daha hızlıdır.
CREATE INDEX IF NOT EXISTS idx_documents_embedding 
ON public.documents USING hnsw (embedding vector_cosine_ops);

-- 2. Tekrarlı Kayıtları Önlemek İçin Benzersiz (Unique) Kısmi İndeks Oluşturma
-- metadata JSONB yapısındaki source_type ve source_id alanları üzerinden
-- aynı kaydın birden fazla kez indekslenmesini engeller.
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_source_unique 
ON public.documents ((metadata->>'source_type'), (metadata->>'source_id'));

-- 3. match_documents RPC (Uzaktan Yordam Çağrısı) Güncellemesi
-- Eski fonksiyon metadata alanını olduğu gibi dönüyordu. Bu durum Next.js tarafında
-- flat erişim yapılmaya çalışıldığında (item.source_type vb.) tanımsız (undefined) 
-- dönmesine ve YZ arama sonuçlarının sessizce elenmesine yol açıyordu.
-- Bu güncellenmiş sürüm, JSONB içerisindeki alanları doğrudan SQL seviyesinde açarak geri döner.
CREATE OR REPLACE FUNCTION public.match_documents (
  query_embedding public.vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  content text,
  similarity float,
  source_id text,
  source_type text,
  title text,
  slug text,
  cover_image text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.content,
    (1 - (d.embedding <=> query_embedding))::float AS similarity,
    (d.metadata->>'source_id')::text AS source_id,
    (d.metadata->>'source_type')::text AS source_type,
    (d.metadata->>'title')::text AS title,
    (d.metadata->>'slug')::text AS slug,
    (d.metadata->>'cover_image')::text AS cover_image
  FROM public.documents d
  WHERE (1 - (d.embedding <=> query_embedding)) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
