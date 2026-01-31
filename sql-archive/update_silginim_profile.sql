
-- Kullanıcı ID'si script çıktısından alındı: c7b4285b-e964-44c8-b10d-9867f0c9b0af

UPDATE profiles
SET 
    username = 'silginim',
    full_name = 'Silginim',
    avatar_url = 'https://cdn-icons-png.flaticon.com/512/2661/2661282.png',
    updated_at = NOW()
WHERE id = 'c7b4285b-e964-44c8-b10d-9867f0c9b0af';
