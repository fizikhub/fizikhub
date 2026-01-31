-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
    ON profiles
    FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (SELECT email FROM auth.users WHERE id = auth.uid()) = 'barannnbozkurttb.b@gmail.com'
    );

-- Allow admins to update all profiles (for writer status, etc.)
CREATE POLICY "Admins can update all profiles"
    ON profiles
    FOR UPDATE
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (SELECT email FROM auth.users WHERE id = auth.uid()) = 'barannnbozkurttb.b@gmail.com'
    );
