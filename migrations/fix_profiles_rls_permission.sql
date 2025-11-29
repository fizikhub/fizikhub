-- Fix permission denied for table users error
-- The error occurs because RLS policies cannot directly access auth.users table
-- We need to move the email check inside a SECURITY DEFINER function

-- 1. Update is_admin function to check email internally
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_email text;
BEGIN
  -- Check if user is logged in
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check specific email (superuser)
  SELECT email INTO current_email FROM auth.users WHERE id = auth.uid();
  IF current_email = 'barannnbozkurttb.b@gmail.com' OR current_email = 'barannnnbozkurttb.b@gmail.com' THEN
    RETURN TRUE;
  END IF;

  -- Check admin role in profiles
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update policies to use ONLY is_admin()
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
    ON profiles
    FOR SELECT
    USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
    ON profiles
    FOR UPDATE
    USING (is_admin());

-- 3. Ensure other policies are correct
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
