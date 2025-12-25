-- Add cover_offset_y column to profiles table
ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "cover_offset_y" double precision DEFAULT 50;

-- Grant permissions if necessary (though usually public profile update policy covers it)
-- Ensure RLS allows update of this column
-- Existing policies usually allow update of OWN profile for all columns or specific ones. 
-- Since we use dynamic update in actions.ts, and RLS usually checks 'USING (auth.uid() = id)', it should be fine as long as the column exists.
