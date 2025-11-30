-- Insert new badges
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value) VALUES
('Einstein', '50 soru ile bilim merakını yayanlara verilir.', 'atom', 'special', 'question_count', 50),
('Newton', '10 soru sorarak topluluğu canlandıranlara verilir.', 'apple', 'special', 'question_count', 10),
('Tesla', '50 cevap ile bilgiyi yaymaya adananlara verilir.', 'zap', 'special', 'answer_count', 50),
('Curie', '10 cevap vererek bilgiyi paylaşanlara verilir.', 'flask', 'special', 'answer_count', 10),
('Galileo', 'Cevaplarıyla 20+ beğeni kazanan gözlemcilere verilir.', 'telescope', 'special', 'answer_likes', 20),
('Hawking', '100+ beğeniyle evrenin sırlarını açanlara verilir.', 'stars', 'special', 'answer_likes', 100),
('Da Vinci', '30+ beğeniyle yaratıcı sorular soranlara verilir.', 'pen-tool', 'special', 'question_votes', 30)
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
