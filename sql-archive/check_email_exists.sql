-- E-posta adresinin kayıtlı olup olmadığını kontrol eden fonksiyon
-- Bu fonksiyonu Supabase SQL Editor'da çalıştırın.

CREATE OR REPLACE FUNCTION check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Bu, fonksiyonun admin yetkileriyle çalışmasını sağlar
SET search_path = public -- Güvenlik için search_path'i ayarla
AS $$
BEGIN
  -- auth.users tablosunda bu e-posta var mı kontrol et
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = email_to_check);
END;
$$;

-- Fonksiyonu herkesin kullanabilmesi için yetki ver
GRANT EXECUTE ON FUNCTION check_email_exists(TEXT) TO anon, authenticated, service_role;
