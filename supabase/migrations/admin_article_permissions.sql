-- =====================================================
-- Admin Makale Düzenleme & Yayınlama RLS Politikaları
-- Supabase SQL Editor'de çalıştırın
-- =====================================================

-- 1) Admin tüm makaleleri okuyabilsin (düzenleme sayfasını açabilmesi için)
CREATE POLICY "Admins can read any article"
ON articles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.username = 'baranbozkurt')
  )
);

-- 2) Admin tüm makaleleri güncelleyebilsin
CREATE POLICY "Admins can update any article"
ON articles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.username = 'baranbozkurt')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.username = 'baranbozkurt')
  )
);

-- 3) Admin onayları silebilsin (düzenleme sonrası sıfırlama için)
CREATE POLICY "Admins can delete any approval"
ON article_approvals
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.username = 'baranbozkurt')
  )
);

-- 4) Admin kaynakları yönetebilsin (referanslar)
CREATE POLICY "Admins can manage references"
ON article_references
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.username = 'baranbozkurt')
  )
);
