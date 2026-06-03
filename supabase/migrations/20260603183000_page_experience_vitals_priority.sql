-- Adds P75 and issue-priority fields to the page experience view.
-- Core Web Vitals should be evaluated at the 75th percentile, segmented by route/metric.

BEGIN;

CREATE OR REPLACE VIEW public.view_page_experience_metrics AS
SELECT
    pathname,
    name as metric_name,
    COUNT(*) as event_count,
    ROUND(AVG(value)::numeric, 2) as average_value,
    ROUND((percentile_cont(0.75) WITHIN GROUP (ORDER BY value))::numeric, 2) as p75_value,
    SUM(CASE WHEN rating = 'poor' THEN 1 ELSE 0 END) as poor_count,
    SUM(CASE WHEN rating = 'needs-improvement' THEN 1 ELSE 0 END) as needs_improvement_count,
    SUM(CASE WHEN rating = 'good' THEN 1 ELSE 0 END) as good_count,
    MAX(created_at) as last_seen_at,
    (
        SUM(CASE WHEN rating = 'poor' THEN 1 ELSE 0 END) * 3 +
        SUM(CASE WHEN rating = 'needs-improvement' THEN 1 ELSE 0 END)
    ) as issue_score
FROM
    public.web_vitals_events
WHERE
    pathname IS NOT NULL
GROUP BY
    pathname, name
ORDER BY
    issue_score DESC, poor_count DESC, event_count DESC;

GRANT SELECT ON public.view_page_experience_metrics TO authenticated;
GRANT SELECT ON public.view_page_experience_metrics TO service_role;

COMMIT;
