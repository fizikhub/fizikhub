-- Insert new badges
INSERT INTO badges (name, description, icon, category) VALUES
('Einstein', 'Bilimsel tartışmalara yön verenlere verilir.', 'atom', 'special'),
('Newton', 'Fizik yasalarını sorgulayanlara verilir.', 'apple', 'special'),
('Tesla', 'Yenilikçi fikirler üretenlere verilir.', 'zap', 'special'),
('Curie', 'Radyoaktivite ve kimya alanında katkı sağlayanlara.', 'flask', 'special'),
('Galileo', 'Gözlem ve deneylerle bilime yön verenlere.', 'telescope', 'special'),
('Hawking', 'Evrenin sırlarını çözen teorisyenlere.', 'stars', 'special'),
('Da Vinci', 'Bilim ve sanatı birleştiren çok yönlü üyelere.', 'pen-tool', 'special')
ON CONFLICT (name) DO NOTHING;

-- Grant badges to the admin user (assuming admin is the current user or we can find them)
-- This part is tricky without knowing the user ID. 
-- I will select the user with username 'admin' or the first user.
DO $$
DECLARE
    v_user_id uuid;
    v_badge_id int;
BEGIN
    -- Try to find admin user
    SELECT id INTO v_user_id FROM profiles WHERE username = 'admin' LIMIT 1;
    
    -- If not found, get the first user
    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    END IF;

    IF v_user_id IS NOT NULL THEN
        -- Grant Einstein
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Einstein';
        INSERT INTO user_badges (user_id, badge_id) VALUES (v_user_id, v_badge_id) ON CONFLICT DO NOTHING;

        -- Grant Newton
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Newton';
        INSERT INTO user_badges (user_id, badge_id) VALUES (v_user_id, v_badge_id) ON CONFLICT DO NOTHING;
        
        -- Grant Tesla
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Tesla';
        INSERT INTO user_badges (user_id, badge_id) VALUES (v_user_id, v_badge_id) ON CONFLICT DO NOTHING;
    END IF;
END $$;
