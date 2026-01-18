-- ==========================================
-- Supabase Performance Fix Script (v7 - Final Index Touchup)
-- ==========================================
-- Fixes final missing foreign key indexes.
-- Note: 'Unused Index' warnings for recently created indexes can be ignored
-- as Supabase needs time to gather usage stats.
-- ==========================================

-- answer_likes.user_id
CREATE INDEX IF NOT EXISTS idx_answer_likes_user_id ON answer_likes(user_id);

-- follows.following_id
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- =======================
-- DONE
-- =======================
SELECT '🎉 V7 Completed! All optimized.' as message;
