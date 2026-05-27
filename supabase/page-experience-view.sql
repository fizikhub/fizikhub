-- Create an index to speed up grouping by pathname and name
CREATE INDEX IF NOT EXISTS idx_web_vitals_pathname_name 
ON public.web_vitals_events (pathname, name);

-- Create a view to aggregate page experience metrics
CREATE OR REPLACE VIEW public.view_page_experience_metrics AS
SELECT 
    pathname,
    name as metric_name,
    COUNT(*) as event_count,
    ROUND(AVG(value)::numeric, 2) as average_value,
    SUM(CASE WHEN rating = 'poor' THEN 1 ELSE 0 END) as poor_count,
    SUM(CASE WHEN rating = 'needs-improvement' THEN 1 ELSE 0 END) as needs_improvement_count,
    SUM(CASE WHEN rating = 'good' THEN 1 ELSE 0 END) as good_count
FROM 
    public.web_vitals_events
WHERE 
    pathname IS NOT NULL
GROUP BY 
    pathname, name
ORDER BY 
    poor_count DESC, event_count DESC;

-- Grant access to the view
GRANT SELECT ON public.view_page_experience_metrics TO authenticated;
GRANT SELECT ON public.view_page_experience_metrics TO service_role;
