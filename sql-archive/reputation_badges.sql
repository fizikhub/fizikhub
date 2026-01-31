-- Insert Badges
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value) VALUES
('Yıldız Tozu', '50 HubPuan toplayarak evrene ilk adımını atanlara verilir.', 'star', 'milestone', 'reputation', 50),
('Kuyruklu Yıldız', '250 HubPuan ile hızla yükselen yıldızlara verilir.', 'zap', 'milestone', 'reputation', 250),
('Galaksi', '2000 HubPuan ile kendi sistemini kuran ustalara verilir.', 'trophy', 'milestone', 'reputation', 2000)
ON CONFLICT (name) DO NOTHING;

-- Trigger Function
CREATE OR REPLACE FUNCTION handle_reputation_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_badge_id INT;
BEGIN
    -- 50 Points -> Yıldız Tozu
    IF OLD.reputation < 50 AND NEW.reputation >= 50 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Yıldız Tozu';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- 250 Points -> Kuyruklu Yıldız
    IF OLD.reputation < 250 AND NEW.reputation >= 250 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Kuyruklu Yıldız';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- 2000 Points -> Galaksi
    IF OLD.reputation < 2000 AND NEW.reputation >= 2000 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Galaksi';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger
DROP TRIGGER IF EXISTS on_reputation_change_badge ON profiles;
CREATE TRIGGER on_reputation_change_badge
    AFTER UPDATE OF reputation ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_reputation_badges();
