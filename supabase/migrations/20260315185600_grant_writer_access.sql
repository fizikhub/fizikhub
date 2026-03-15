-- Grant writer access to specified users
-- These users will be able to access /yazar-paneli and create articles

UPDATE profiles SET is_writer = true WHERE username IN (
    'oregon',
    'Defne_Yorğun',
    'noctis',
    'dr.ursa',
    'hed'
);

-- Also set their role to 'author' if not already admin/editor
UPDATE profiles 
SET role = 'author' 
WHERE username IN ('oregon', 'Defne_Yorğun', 'noctis', 'dr.ursa', 'hed')
AND role NOT IN ('admin', 'editor');
