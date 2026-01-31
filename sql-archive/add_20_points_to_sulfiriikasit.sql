DO $$
DECLARE
    target_username TEXT := 'sulfiriikasit';
    points_to_add INTEGER := 20;
    target_user_id UUID;
BEGIN
    -- 1. Find the user ID
    SELECT id INTO target_user_id
    FROM profiles
    WHERE username = target_username;

    -- 2. Check if user exists
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User % not found!', target_username;
        RETURN;
    END IF;

    -- 3. Update the reputation
    UPDATE profiles
    SET reputation = COALESCE(reputation, 0) + points_to_add
    WHERE id = target_user_id;

    -- 4. Log to reputation history (if table exists and we want to track it)
    -- Using a nested block to handle potential missing table error separately, 
    -- though usually in DO blocks we just run it. 
    -- We'll assume the schema is consistent with migrations.
    INSERT INTO reputation_history (user_id, points, reason, reference_type, reference_id)
    VALUES (target_user_id, points_to_add, 'admin_bonus', 'system', NULL);

    RAISE NOTICE 'Added % hub points to user %', points_to_add, target_username;
END $$;
