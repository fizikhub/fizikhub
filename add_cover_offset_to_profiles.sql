-- Add cover_offset_y column to profiles table with default 50 (center)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS cover_offset_y INTEGER DEFAULT 50 CHECK (cover_offset_y >= 0 AND cover_offset_y <= 100);
