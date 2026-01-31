-- Username'leri benzersiz yap ve RLS policy ekle
-- Sadece admin kendi kullanıcı adını değiştirebilir

-- Username'i unique yap
ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Kullanıcılar sadece kendi profillerini okuyabilir
DROP POLICY IF EXISTS "Kullanıcılar profilleri görüntüleyebilir" ON profiles;
CREATE POLICY "Kullanıcılar profilleri görüntüleyebilir"
    ON profiles FOR SELECT
    USING (true);

-- Sadece kendi profilini güncelleyebilir
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON profiles;
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Username güncellemesi SADECE admin yapabilir
DROP POLICY IF EXISTS "Sadece admin username değiştirebilir" ON profiles;
CREATE POLICY "Sadece admin username değiştirebilir"
    ON profiles FOR UPDATE
    USING (
        auth.uid() = id AND (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'barannnbozkurttb.b@gmail.com'
            )
        )
    )
    WITH CHECK (
        auth.uid() = id AND (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'barannnbozkurttb.b@gmail.com'
            )
        )
    );
