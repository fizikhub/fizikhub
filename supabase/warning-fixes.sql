-- DATA BASE DUZELTMELERI
-- Bu scripti Supabase SQL Editor'de calistirin.

-- ==========================================
-- 1. GUVENLIK: Eklentileri 'extensions' semasina tasi
-- ==========================================
-- Eklentilerin public semasinda olmasi guvenlik uyarisi verir.
CREATE SCHEMA IF NOT EXISTS extensions;

-- pg_trgm eklentisini tasi
CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA extensions;
ALTER EXTENSION "pg_trgm" SET SCHEMA extensions;

-- vector eklentisini tasi
CREATE EXTENSION IF NOT EXISTS "vector" SCHEMA extensions;
ALTER EXTENSION "vector" SET SCHEMA extensions;

-- Not: Eger kodunuzda 'public.vector' seklinde acikca cagrilan yerler varsa
-- onlari 'extensions.vector' olarak guncellemeniz gerekebilir.
-- Genelde 'CREATE EXTENSION' yapildiginda search_path'e eklenir.

-- ==========================================
-- 2. GUVENLIK: Notifications RLS Politikasi
-- ==========================================
-- "RLS Policy Always True" uyarisi icin.
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Olası hatali politikalari temizle (Guvenlik acigi yaratanlar)
DROP POLICY IF EXISTS "Enable read for all" ON public.notifications;
DROP POLICY IF EXISTS "Public access" ON public.notifications;
DROP POLICY IF EXISTS "Select all" ON public.notifications;
DROP POLICY IF EXISTS "policy_always_true" ON public.notifications;

-- Dogru politikayi olustur: Kullanicilar sadece kendi bildirimlerini gorebilir
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications"
    ON public.notifications FOR SELECT
    USING (recipient_id = auth.uid());

-- ==========================================
-- 3. PERFORMANS: Tekrar Eden Indexler
-- ==========================================
-- Profiles tablosunda gereksiz indexleri temizle.
-- Genellikle PK (id) uzerine ekstra index olusturulmus olabilir.
DROP INDEX IF EXISTS public.profiles_id_idx;
DROP INDEX IF EXISTS public.idx_profiles_id;
DROP INDEX IF EXISTS public.profiles_id_key; -- Eger unique constraint index ile cakisiyorsa

-- ==========================================
-- 4. PERFORMANS: Auth Function Wrapper
-- ==========================================
-- "Auth RLS Initialization Plan" uyarisi icin.
-- RLS icinde auth.uid() cagrilari bazen performans sorunu yaratabilir.
-- Bu fonksiyonu STABLE olarak isaretleyerek optimizasyona yardimci oluyoruz.

CREATE OR REPLACE FUNCTION public.get_auth_uid()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid();
$$;

-- Gelecekteki RLS politikalarinizda auth.uid() yerine get_auth_uid() kullanabilirsiniz.
-- Ornek: USING (user_id = get_auth_uid())

-- ==========================================
-- BITTI
-- ==========================================
SELECT '✅ Tum duzeltmeler uygulandi!' as message;
