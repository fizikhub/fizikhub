-- 1. Add is_accepted column to answers table if it doesn't exist
ALTER TABLE answers 
ADD COLUMN IF NOT EXISTS is_accepted BOOLEAN DEFAULT FALSE;

-- 2. Ensure the Question of the Week exists
DO $$
DECLARE
    admin_id uuid;
    question_id bigint;
BEGIN
    -- Get admin ID (using the email we know)
    SELECT id INTO admin_id FROM auth.users WHERE email = 'barannnbozkurttb.b@gmail.com';

    -- If admin exists, proceed
    IF admin_id IS NOT NULL THEN
        -- Check if question already exists
        SELECT id INTO question_id FROM questions WHERE title = 'Işık hızıyla giden bir trende ileriye doğru fener tutarsak ışığın hızı ne olur?';

        IF question_id IS NULL THEN
            INSERT INTO questions (title, content, category, author_id, tags)
            VALUES (
                'Işık hızıyla giden bir trende ileriye doğru fener tutarsak ışığın hızı ne olur?',
                'Bu klasik bir görelilik paradoksu. Sizce dışarıdan bakan bir gözlemci ışığın hızını nasıl ölçer? Işık hızı kaynak hızından bağımsız mıdır? Düşüncelerinizi bekliyorum.',
                'Genel Görelilik',
                admin_id,
                ARRAY['haftanin-sorusu']
            );
        END IF;
    END IF;
END $$;
