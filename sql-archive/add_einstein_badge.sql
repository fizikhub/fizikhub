INSERT INTO badges (name, description, icon) VALUES
('Einstein', 'Fizik dehası! 50 soru çözdün.', '🧠')
ON CONFLICT (name) DO NOTHING;
