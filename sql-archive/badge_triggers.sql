-- Add new badges for triggers
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value) VALUES
('Kaşif', 'İlk sorusunu soran meraklı zihinlere verilir.', 'compass', 'milestone', 'question_count', 1),
('Yardımsever', 'İlk cevabını veren yardımsever üyelere verilir.', 'heart', 'milestone', 'answer_count', 1)
ON CONFLICT (name) DO NOTHING;

-- Function to handle question badges
CREATE OR REPLACE FUNCTION handle_question_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_question_count INT;
    v_badge_id INT;
BEGIN
    -- Count user's questions
    SELECT COUNT(*) INTO v_question_count FROM questions WHERE author_id = NEW.author_id;

    -- 1st Question -> Kaşif
    IF v_question_count = 1 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Kaşif';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- 10th Question -> Newton
    IF v_question_count = 10 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Newton';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- 50th Question -> Einstein
    IF v_question_count = 50 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Einstein';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle answer badges
CREATE OR REPLACE FUNCTION handle_answer_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_answer_count INT;
    v_badge_id INT;
BEGIN
    -- Count user's answers
    SELECT COUNT(*) INTO v_answer_count FROM answers WHERE author_id = NEW.author_id;

    -- 1st Answer -> Yardımsever
    IF v_answer_count = 1 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Yardımsever';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- 10th Answer -> Curie
    IF v_answer_count = 10 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Curie';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- 50th Answer -> Tesla
    IF v_answer_count = 50 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Tesla';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Triggers
DROP TRIGGER IF EXISTS on_question_created_badge ON questions;
CREATE TRIGGER on_question_created_badge
    AFTER INSERT ON questions
    FOR EACH ROW
    EXECUTE FUNCTION handle_question_badges();

DROP TRIGGER IF EXISTS on_answer_created_badge ON answers;
CREATE TRIGGER on_answer_created_badge
    AFTER INSERT ON answers
    FOR EACH ROW
    EXECUTE FUNCTION handle_answer_badges();
