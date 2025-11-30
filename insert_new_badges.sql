-- Insert new badges
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value) VALUES
('Einstein', 'Bilimsel tartışmalara yön verenlere verilir.', 'atom', 'special', 'manual', 0),
('Newton', 'Fizik yasalarını sorgulayanlara verilir.', 'apple', 'special', 'question_count', 10),
('Tesla', 'Yenilikçi fikirler üretenlere verilir.', 'zap', 'special', 'manual', 0),
('Curie', 'Radyoaktivite ve kimya alanında katkı sağlayanlara.', 'flask', 'special', 'answer_count', 10),
('Galileo', 'Gözlem ve deneylerle bilime yön verenlere.', 'telescope', 'special', 'manual', 0),
('Hawking', 'Evrenin sırlarını çözen teorisyenlere.', 'stars', 'special', 'manual', 0),
('Da Vinci', 'Bilim ve sanatı birleştiren çok yönlü üyelere.', 'pen-tool', 'special', 'manual', 0)
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
