-- Check profiles table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check RLS policies on articles
select * from pg_policies where tablename = 'articles';
