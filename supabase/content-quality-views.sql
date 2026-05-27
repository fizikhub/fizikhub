-- Düşük değerli indekslenebilir içerikler
CREATE OR REPLACE VIEW public.view_low_value_indexable_content AS
SELECT 
  'article' as content_type,
  id::text as id,
  title,
  slug,
  'Kısa içerik (<500 karakter)' as issue_reason
FROM public.articles
WHERE published = true AND length(coalesce(content, '')) < 500

UNION ALL

SELECT 
  'question' as content_type,
  q.id::text as id,
  q.title,
  q.id::text as slug,
  'Cevapsız indekslenebilir forum sorusu' as issue_reason
FROM public.questions q
LEFT JOIN public.answers a ON q.id = a.question_id
WHERE q.status = 'published'
GROUP BY q.id, q.title
HAVING COUNT(a.id) = 0;

-- Arama görünürlüğü ihlalleri
CREATE OR REPLACE VIEW public.view_search_visibility_violations AS
SELECT 
  'article' as content_type,
  id::text as id,
  title,
  slug,
  'Kısa/eksik meta açıklama (<50 karakter)' as violation_type
FROM public.articles
WHERE published = true AND (excerpt IS NULL OR length(excerpt) < 50)

UNION ALL

SELECT 
  'article' as content_type,
  id::text as id,
  title,
  slug,
  'Kategori atanmamış' as violation_type
FROM public.articles
WHERE published = true AND (category IS NULL OR category = '');

-- İzinler
GRANT SELECT ON public.view_low_value_indexable_content TO authenticated;
GRANT SELECT ON public.view_low_value_indexable_content TO service_role;

GRANT SELECT ON public.view_search_visibility_violations TO authenticated;
GRANT SELECT ON public.view_search_visibility_violations TO service_role;
