
-- Kullanıcının e-postasını onayla (Sadece email_confirmed_at güncellenmeli)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'silginim@gmail.com';

-- Profil bilgilerini tekrar güncelle (garanti olsun)
UPDATE profiles
SET 
    username = 'silginim',
    full_name = 'Silginim',
    avatar_url = 'https://cdn-icons-png.flaticon.com/512/2661/2661282.png',
    updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'silginim@gmail.com');
