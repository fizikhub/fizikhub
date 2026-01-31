-- Ensure Einstein badge exists
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value)
VALUES ('Einstein', 'Fizik dehası! 50 soru çözdün.', 'atom', 'special', 'question_count', 50)
ON CONFLICT (name) DO NOTHING;

-- Award badge to user
DO $$
DECLARE
    target_user_id UUID;
    target_badge_id INT;
BEGIN
    -- Get User ID
    SELECT id INTO target_user_id FROM profiles WHERE username = 'sulfiriikasit';

    -- Get Badge ID
    SELECT id INTO target_badge_id FROM badges WHERE name = 'Einstein';

    -- Check if found
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User sulfiriikasit not found';
        RETURN;
    END IF;

    IF target_badge_id IS NULL THEN
        RAISE NOTICE 'Badge Einstein not found';
        RETURN;
    END IF;

    -- Insert
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (target_user_id, target_badge_id)
    ON CONFLICT (user_id, badge_id) DO NOTHING;

    RAISE NOTICE 'Awarded Einstein badge to sulfiriikasit';
END $$;
