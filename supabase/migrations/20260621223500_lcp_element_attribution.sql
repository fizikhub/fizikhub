-- Exposes the concrete LCP element/resource captured by WebVitalsReporter.

BEGIN;

CREATE OR REPLACE VIEW public.view_lcp_element_metrics AS
SELECT
    pathname,
    COALESCE(NULLIF(attribution ->> 'element', ''), '(unknown)') AS lcp_element,
    NULLIF(attribution ->> 'resourceUrl', '') AS resource_url,
    COUNT(*) AS event_count,
    ROUND((percentile_cont(0.75) WITHIN GROUP (ORDER BY value))::numeric, 2) AS p75_value,
    SUM(CASE WHEN rating = 'poor' THEN 1 ELSE 0 END) AS poor_count,
    SUM(CASE WHEN rating = 'needs-improvement' THEN 1 ELSE 0 END) AS needs_improvement_count,
    MAX(created_at) AS last_seen_at
FROM public.web_vitals_events
WHERE name = 'LCP' AND pathname IS NOT NULL
GROUP BY pathname, lcp_element, resource_url
ORDER BY poor_count DESC, needs_improvement_count DESC, p75_value DESC, event_count DESC;

GRANT SELECT ON public.view_lcp_element_metrics TO authenticated;
GRANT SELECT ON public.view_lcp_element_metrics TO service_role;

COMMIT;
