DO $$
DECLARE
    user1 TEXT := 'sulfiriikasit';
    score1 INTEGER := 170;
    
    user2 TEXT := 'Klausy';
    score2 INTEGER := 90;
BEGIN
    -- Update sulfiriikasit
    UPDATE profiles
    SET reputation = score1
    WHERE username = user1;
    
    IF FOUND THEN
        RAISE NOTICE 'Updated % reputation to %', user1, score1;
    ELSE
        RAISE NOTICE 'User % not found', user1;
    END IF;

    -- Update Klausy
    UPDATE profiles
    SET reputation = score2
    WHERE username = user2;
    
    IF FOUND THEN
        RAISE NOTICE 'Updated % reputation to %', user2, score2;
    ELSE
        RAISE NOTICE 'User % not found', user2;
    END IF;
    
    -- Log to history (Optional, identifying as system correction)
    -- We assume ids can be fetched if needed, but simple update is usually enough for "admin override"
    -- If we wanted to be strict we would find IDs first then insert into history.
    -- For now, direct update is efficient for this request.
END $$;
