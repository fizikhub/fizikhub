-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL, -- Lucide icon name or emoji
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for badges (Public read)
CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);

-- Policies for user_badges (Public read)
CREATE POLICY "User badges are viewable by everyone" ON user_badges FOR SELECT USING (true);

-- Insert default badges
INSERT INTO badges (name, description, icon) VALUES
('Meraklı Kedi', 'İlk sorunu sordun!', '🐱'),
('Profesör', '10 cevap verdin!', '🎓'),
('Popüler', 'Sorun 10 oy aldı!', '🔥')
ON CONFLICT (name) DO NOTHING;

-- Function to award badge
CREATE OR REPLACE FUNCTION award_badge(p_user_id UUID, p_badge_name TEXT)
RETURNS VOID AS $$
DECLARE
    v_badge_id INTEGER;
BEGIN
    -- Get badge id
    SELECT id INTO v_badge_id FROM badges WHERE name = p_badge_name;
    
    -- Insert if not exists
    IF v_badge_id IS NOT NULL THEN
        INSERT INTO user_badges (user_id, badge_id)
        VALUES (p_user_id, v_badge_id)
        ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
