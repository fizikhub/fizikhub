-- Function to handle like-based badges  
CREATE OR REPLACE FUNCTION handle_answer_like_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_total_likes INT;
    v_author_id UUID;
    v_badge_id INT;
BEGIN
    -- Get the answer author
    SELECT author_id INTO v_author_id FROM answers WHERE id = NEW.answer_id;
    
    IF v_author_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Count total likes on all answers by this user
    SELECT COUNT(*) INTO v_total_likes 
    FROM answer_likes al
    JOIN answers a ON a.id = al.answer_id
    WHERE a.author_id = v_author_id;

    -- 20+ Answer Likes -> Galileo
    IF v_total_likes = 20 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Galileo';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (v_author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- 100+ Answer Likes -> Hawking
    IF v_total_likes = 100 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Hawking';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (v_author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle question vote badges
CREATE OR REPLACE FUNCTION handle_question_vote_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_total_upvotes INT;
    v_author_id UUID;
    v_badge_id INT;
BEGIN
    -- Get the question author
    SELECT author_id INTO v_author_id FROM questions WHERE id = NEW.question_id;
    
    IF v_author_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Count total upvotes on all questions by this user
    SELECT COUNT(*) INTO v_total_upvotes 
    FROM question_votes qv
    JOIN questions q ON q.id = qv.question_id
    WHERE q.author_id = v_author_id AND qv.vote_type = 1;

    -- 30+ Question Upvotes -> Da Vinci
    IF v_total_upvotes = 30 THEN
        SELECT id INTO v_badge_id FROM badges WHERE name = 'Da Vinci';
        IF v_badge_id IS NOT NULL THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (v_author_id, v_badge_id) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Triggers for Likes
DROP TRIGGER IF EXISTS on_answer_like_badge ON answer_likes;
CREATE TRIGGER on_answer_like_badge
    AFTER INSERT ON answer_likes
    FOR EACH ROW
    EXECUTE FUNCTION handle_answer_like_badges();

DROP TRIGGER IF EXISTS on_question_vote_badge ON question_votes;
CREATE TRIGGER on_question_vote_badge
    AFTER INSERT ON question_votes
    FOR EACH ROW
    EXECUTE FUNCTION handle_question_vote_badges();
