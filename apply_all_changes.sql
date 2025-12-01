-- 1. Otomatik profil oluşturmayı kapat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. ÖNCE eksik kolonları ekle
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 3. SONRA sadece ilişkili verisi OLMAYAN boş profilleri temizle
-- Eğer bir kullanıcı soru sormuşsa veya cevap vermişse silinmeyecek
DELETE FROM public.profiles 
WHERE onboarding_completed = FALSE 
  AND (username IS NULL OR username = '' OR username NOT LIKE '%@%')
  AND id NOT IN (SELECT author_id FROM public.questions)
  AND id NOT IN (SELECT author_id FROM public.answers);

-- 4. Şemayı yenile
NOTIFY pgrst, 'reload schema';
