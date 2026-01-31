-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'defne@gmail.com'; -- Typo 'commm' düzeltildi
  v_password text := 'Defne123.321';
  v_username text := 'defneyorgun';
BEGIN
  -- 1. Create User in auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    v_email,
    crypt(v_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('username', v_username, 'full_name', 'Defne Yorgun'),
    now(),
    now(),
    '',
    ''
  );

  -- 2. Create Profile (User trigger might handle this, but explicit insert is safe)
  INSERT INTO public.profiles (id, username, full_name, email)
  VALUES (
    v_user_id,
    v_username,
    'Defne Yorgun',
    v_email
  )
  ON CONFLICT (id) DO NOTHING;

END $$;
