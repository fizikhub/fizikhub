-- ROBUST FIX: Improve is_admin function and simplify policies

-- 1. Create a more robust is_admin function
-- This function checks BOTH the role in profiles AND the email in auth.users
-- It runs as SECURITY DEFINER to bypass RLS and permissions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_email TEXT;
BEGIN
  -- Check if user has admin role in profiles
  IF EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;

  -- Check if user has specific admin email (querying auth.users securely)
  SELECT email INTO current_email FROM auth.users WHERE id = auth.uid();
  
  IF current_email ILIKE 'barannnbozkurttb.b@gmail.com' THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing policies to be safe
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 3. Re-create policies using the simplified check
CREATE POLICY "Admins can view all profiles"
    ON profiles
    FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can update all profiles"
    ON profiles
    FOR UPDATE
    USING (is_admin());

-- 4. Force update the admin role for your user (just in case)
UPDATE profiles
SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email ILIKE 'barannnbozkurttb.b@gmail.com');
