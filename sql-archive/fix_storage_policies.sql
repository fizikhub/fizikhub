-- "article-images" depolama alanını oluştur veya varsa güncelle
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- NOT: storage.objects tablosunda RLS zaten aktiftir, o satırı sildik.

-- Varolan politikaları temizle (Hata vermemesi için)
DROP POLICY IF EXISTS "Public View" ON storage.objects;
DROP POLICY IF EXISTS "User Upload" ON storage.objects;
DROP POLICY IF EXISTS "Users Update Own Images" ON storage.objects;
DROP POLICY IF EXISTS "Users Delete Own Images" ON storage.objects;

-- 1. Herkesin resimleri görmesine izin ver
CREATE POLICY "Public View" ON storage.objects FOR SELECT
USING ( bucket_id = 'article-images' );

-- 2. Giriş yapmış kullanıcıların resim yüklemesine izin ver
CREATE POLICY "User Upload" ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'article-images' );

-- 3. Opsiyonel: Kendi resimlerini güncelleyebilsinler
CREATE POLICY "Users Update Own Images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'article-images' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'article-images' AND auth.uid() = owner );

-- 4. Opsiyonel: Kendi resimlerini silebilsinler
CREATE POLICY "Users Delete Own Images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'article-images' AND auth.uid() = owner );
