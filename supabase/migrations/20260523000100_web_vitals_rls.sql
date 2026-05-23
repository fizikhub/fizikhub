-- =====================================================
-- FizikHub Core Web Vitals RLS İzni ve Telemetri Yaması
-- Tarih: 2026-05-23
-- Amacı: Tarayıcıdan gönderilen FCP, LCP, INP, TTFB, CLS metriklerinin
-- Supabase veritabanına sorunsuz kaydedilebilmesi için INSERT izni verir.
-- =====================================================

-- 1. Tablonun RLS durumunu aktif et (eğer aktif değilse)
ALTER TABLE public.web_vitals_events ENABLE ROW LEVEL SECURITY;

-- 2. Eski çakışabilecek politikaları temizle
DROP POLICY IF EXISTS "Allow anonymous inserts for telemetry" ON public.web_vitals_events;

-- 3. Telemetri metriklerinin anonim istemciler tarafından yazılabilmesini sağlayan politika oluştur
CREATE POLICY "Allow anonymous inserts for telemetry" 
ON public.web_vitals_events 
FOR INSERT 
WITH CHECK (true);

-- Bilgilendirme: Bu politika sadece INSERT işlemlerine izin verir. 
-- Güvenlik açısından anonim veya yetkisiz kullanıcıların verileri okumasına (SELECT), 
-- güncellemesine (UPDATE) veya silmesine (DELETE) kesinlikle izin verilmez.
