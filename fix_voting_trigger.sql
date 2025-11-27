-- Create a function to update question votes count
CREATE OR REPLACE FUNCTION update_question_votes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE questions
        SET votes = votes + NEW.vote_type
        WHERE id = NEW.question_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE questions
        SET votes = votes - OLD.vote_type
        WHERE id = OLD.question_id;
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE questions
        SET votes = votes - OLD.vote_type + NEW.vote_type
        WHERE id = NEW.question_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_vote_change ON question_votes;

CREATE TRIGGER on_vote_change
AFTER INSERT OR UPDATE OR DELETE ON question_votes
FOR EACH ROW
EXECUTE FUNCTION update_question_votes_count();

-- Grant permissions just in case
GRANT ALL ON question_votes TO authenticated;
GRANT ALL ON question_votes TO service_role;
