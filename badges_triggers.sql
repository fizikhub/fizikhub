-- Trigger for "Meraklı Kedi" (First Question)
CREATE OR REPLACE FUNCTION check_first_question_badge()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM questions WHERE author_id = NEW.author_id) = 1 THEN
        PERFORM award_badge(NEW.author_id, 'Meraklı Kedi');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_question_created
    AFTER INSERT ON questions
    FOR EACH ROW
    EXECUTE FUNCTION check_first_question_badge();

-- Trigger for "Profesör" (10 Answers)
CREATE OR REPLACE FUNCTION check_professor_badge()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM answers WHERE author_id = NEW.author_id) >= 10 THEN
        PERFORM award_badge(NEW.author_id, 'Profesör');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_answer_created
    AFTER INSERT ON answers
    FOR EACH ROW
    EXECUTE FUNCTION check_professor_badge();

-- Trigger for "Popüler" (Question with 10+ votes)
CREATE OR REPLACE FUNCTION check_popular_question_badge()
RETURNS TRIGGER AS $$
DECLARE
    v_question_id INTEGER;
    v_author_id UUID;
    v_vote_count INTEGER;
BEGIN
    -- Determine question_id based on operation
    IF (TG_OP = 'DELETE') THEN
        v_question_id := OLD.question_id;
    ELSE
        v_question_id := NEW.question_id;
    END IF;

    -- Get vote count (sum of vote_type)
    SELECT COALESCE(SUM(vote_type), 0) INTO v_vote_count
    FROM question_votes
    WHERE question_id = v_question_id;

    -- Check if threshold reached
    IF v_vote_count >= 10 THEN
        -- Get author of the question
        SELECT author_id INTO v_author_id FROM questions WHERE id = v_question_id;
        
        IF v_author_id IS NOT NULL THEN
            PERFORM award_badge(v_author_id, 'Popüler');
        END IF;
    END IF;
    
    RETURN NULL; -- Result is ignored for AFTER triggers
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vote_change
    AFTER INSERT OR UPDATE OR DELETE ON question_votes
    FOR EACH ROW
    EXECUTE FUNCTION check_popular_question_badge();
