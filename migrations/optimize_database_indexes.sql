-- Articles Indexes
CREATE INDEX IF NOT EXISTS idx_articles_status_created_at ON public.articles(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);

-- Questions Indexes
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON public.questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_votes ON public.questions(votes DESC);

-- Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Messages & Conversations Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);

-- Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id_created_at ON public.notifications(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_is_read ON public.notifications(recipient_id, is_read);

-- Blocked Users Indexes
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker_id ON public.blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked_id ON public.blocked_users(blocked_id);

-- Quizzes Indexes
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON public.quizzes(slug);
