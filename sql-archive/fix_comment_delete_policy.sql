-- Admin delete politikasını JWT üzerinden güncelle (Daha güvenilir)

DROP POLICY IF EXISTS "Admins can delete any comment" ON article_comments;

CREATE POLICY "Admins can delete any comment"
    ON article_comments FOR DELETE
    USING (
        -- Email kontrolü (JWT içinden - daha hızlı ve güvenilir)
        (auth.jwt() ->> 'email' ILIKE 'barannnbozkurttb.b@gmail.com') OR
        (auth.jwt() ->> 'email' ILIKE 'barannnnbozkurttb.b@gmail.com') OR
        -- Admin rolü kontrolü (Profiles tablosundan)
        (
            SELECT role FROM profiles 
            WHERE id = auth.uid()
        ) = 'admin'
    );

-- Emin olmak için insert politikasını da kontrol edelim
DROP POLICY IF EXISTS "Users can create comments" ON article_comments;
CREATE POLICY "Users can create comments"
    ON article_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Select politikası
DROP POLICY IF EXISTS "Anyone can view comments" ON article_comments;
CREATE POLICY "Anyone can view comments"
    ON article_comments FOR SELECT
    USING (true);
