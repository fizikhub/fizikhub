-- =====================================================
-- Fizikhub Author Discovery Indexleri
-- Tarih: 2026-05-25
-- Amac: author-sitemap.xml ve public profil metadata sorgularini hizlandirmak.
-- Guvenlik: Veri silmez, sadece ek indeks ekler.
-- =====================================================

BEGIN;

CREATE INDEX IF NOT EXISTS idx_profiles_public_updated
ON public.profiles (updated_at DESC NULLS LAST, created_at DESC)
WHERE username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_trusted_author_updated
ON public.profiles (updated_at DESC NULLS LAST, created_at DESC)
WHERE username IS NOT NULL AND (is_writer = true OR is_verified = true);

ANALYZE public.profiles;

COMMIT;
