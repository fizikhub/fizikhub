-- Fizikhub Eksik Profil Kolonları Migrasyonu
-- Bu script, profil sayfasındaki konum (location) ve ileride planlanan 
-- deneyim (level, xp) özelliklerinin çalışabilmesi için gerekli eksik sütunları ekler.
--
-- Talimatlar:
-- Bu kod bloğunu kopyalayın ve Supabase Dashboard -> SQL Editor üzerinde çalıştırın.

-- 1. Konum (Location) Sütununu Ekleme
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- 2. Deneyim ve Seviye (Level / XP) Sütunlarını Ekleme (İsteğe bağlı/Geleceğe hazırlık)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp_current INTEGER DEFAULT 0;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp_next INTEGER DEFAULT 100;

-- 3. Arama İndeks ve RLS Uyumluluğu
-- Sütun eklendikten sonra public erişim politikaları (Row Level Security - RLS) 
-- otomatik olarak tüm kolonları kapsayacaktır ancak sorguların hızlı çalışması için 
-- location alanına opsiyonel bir B-Tree indeksi eklenebilir:
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location);
