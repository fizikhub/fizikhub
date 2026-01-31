-- Update sulfiriikasit user to be verified (Blue Badge)
UPDATE profiles
SET is_verified = true
WHERE username = 'sulfiriikasit';

-- Remove 'Doğrulanmış Hesap' badge (Green Tick) if it exists
DO $$
DECLARE
  v_user_id uuid;
  v_badge_id integer;
BEGIN
  -- Get user ID
  SELECT id INTO v_user_id FROM profiles WHERE username = 'sulfiriikasit';
  
  -- Get badge ID for 'Doğrulanmış Hesap'
  SELECT id INTO v_badge_id FROM badges WHERE name = 'Doğrulanmış Hesap';
  
  -- Delete user badge if both exist
  IF v_user_id IS NOT NULL AND v_badge_id IS NOT NULL THEN
    DELETE FROM user_badges
    WHERE user_id = v_user_id AND badge_id = v_badge_id;
  END IF;
END $$;
