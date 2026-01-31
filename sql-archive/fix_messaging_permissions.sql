-- Fix permissions for messaging system

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT ALL ON TABLE conversations TO authenticated;
GRANT ALL ON TABLE conversation_participants TO authenticated;
GRANT ALL ON TABLE messages TO authenticated;

-- Grant usage on sequences (Critical for serial columns like messages.id)
GRANT USAGE, SELECT ON SEQUENCE messages_id_seq TO authenticated;

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION create_conversation TO authenticated;

-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;

-- Verify RLS policies exist (re-applying just in case, safe to run)
-- (Policies are already in the previous script, assuming they are created)
