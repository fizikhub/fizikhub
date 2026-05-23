-- Fizikhub Web Vitals Performance Aggregation & Automated Maintenance Migration
-- Date: 2026-05-23
-- Description: Sets up a pre-aggregated summary table for Web Vitals to keep performance reports incredibly fast and introduces an automated cleanup routine to purge historical events older than 30 days, preventing database bloat.

BEGIN;

-- 1. Create Pre-Aggregated Summary Table
CREATE TABLE IF NOT EXISTS public.web_vitals_daily_summary (
    day date PRIMARY KEY,
    cls_avg double precision DEFAULT 0.0,
    fcp_avg double precision DEFAULT 0.0,
    inp_avg double precision DEFAULT 0.0,
    lcp_avg double precision DEFAULT 0.0,
    ttfb_avg double precision DEFAULT 0.0,
    cls_count integer DEFAULT 0,
    fcp_count integer DEFAULT 0,
    inp_count integer DEFAULT 0,
    lcp_count integer DEFAULT 0,
    ttfb_count integer DEFAULT 0,
    total_events integer DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.web_vitals_daily_summary ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users / admins, or anyone if public dashboard
CREATE POLICY "Allow public read access to web_vitals_daily_summary"
ON public.web_vitals_daily_summary
FOR SELECT
USING (true);

-- 2. Daily Aggregator Function
CREATE OR REPLACE FUNCTION public.aggregate_daily_web_vitals(target_day date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cls_avg double precision;
    v_fcp_avg double precision;
    v_inp_avg double precision;
    v_lcp_avg double precision;
    v_ttfb_avg double precision;
    
    v_cls_count integer;
    v_fcp_count integer;
    v_inp_count integer;
    v_lcp_count integer;
    v_ttfb_count integer;
    
    v_total_events integer;
BEGIN
    -- Calculate averages and counts for the target day
    SELECT 
        COALESCE(AVG(value) FILTER (WHERE name = 'CLS'), 0.0),
        COALESCE(AVG(value) FILTER (WHERE name = 'FCP'), 0.0),
        COALESCE(AVG(value) FILTER (WHERE name = 'INP'), 0.0),
        COALESCE(AVG(value) FILTER (WHERE name = 'LCP'), 0.0),
        COALESCE(AVG(value) FILTER (WHERE name = 'TTFB'), 0.0),
        
        COUNT(*) FILTER (WHERE name = 'CLS'),
        COUNT(*) FILTER (WHERE name = 'FCP'),
        COUNT(*) FILTER (WHERE name = 'INP'),
        COUNT(*) FILTER (WHERE name = 'LCP'),
        COUNT(*) FILTER (WHERE name = 'TTFB'),
        
        COUNT(*)
    INTO 
        v_cls_avg, v_fcp_avg, v_inp_avg, v_lcp_avg, v_ttfb_avg,
        v_cls_count, v_fcp_count, v_inp_count, v_lcp_count, v_ttfb_count,
        v_total_events
    FROM public.web_vitals_events
    WHERE created_at::date = target_day;

    -- Upsert daily summary
    INSERT INTO public.web_vitals_daily_summary (
        day, 
        cls_avg, fcp_avg, inp_avg, lcp_avg, ttfb_avg,
        cls_count, fcp_count, inp_count, lcp_count, ttfb_count,
        total_events, updated_at
    )
    VALUES (
        target_day, 
        v_cls_avg, v_fcp_avg, v_inp_avg, v_lcp_avg, v_ttfb_avg,
        v_cls_count, v_fcp_count, v_inp_count, v_lcp_count, v_ttfb_count,
        v_total_events, now()
    )
    ON CONFLICT (day) DO UPDATE
    SET 
        cls_avg = EXCLUDED.cls_avg,
        fcp_avg = EXCLUDED.fcp_avg,
        inp_avg = EXCLUDED.inp_avg,
        lcp_avg = EXCLUDED.lcp_avg,
        ttfb_avg = EXCLUDED.ttfb_avg,
        cls_count = EXCLUDED.cls_count,
        fcp_count = EXCLUDED.fcp_count,
        inp_count = EXCLUDED.inp_count,
        lcp_count = EXCLUDED.lcp_count,
        ttfb_count = EXCLUDED.ttfb_count,
        total_events = EXCLUDED.total_events,
        updated_at = now();
END;
$$;

-- 3. Maintenance and Partition Cleanup Function
-- This function runs aggregation for yesterday & today, then purges events older than 30 days.
CREATE OR REPLACE FUNCTION public.maintain_web_vitals()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_purged_count integer;
    v_yesterday date := (now() - interval '1 day')::date;
    v_today date := now()::date;
BEGIN
    -- 1. Refresh aggregates for today and yesterday to ensure accurate counts
    PERFORM public.aggregate_daily_web_vitals(v_yesterday);
    PERFORM public.aggregate_daily_web_vitals(v_today);
    
    -- 2. Purge historical records older than 30 days to reclaim storage
    WITH deleted AS (
        DELETE FROM public.web_vitals_events
        WHERE created_at < (now() - interval '30 days')
        RETURNING id
    )
    SELECT COUNT(*) INTO v_purged_count FROM deleted;

    RETURN json_build_object(
        'success', true,
        'aggregated_days', json_build_array(v_yesterday, v_today),
        'purged_count', v_purged_count,
        'timestamp', now()
    );
END;
$$;

-- Execute initial run of maintenance to populate history if there is any
SELECT public.aggregate_daily_web_vitals(d::date)
FROM generate_series(
    (SELECT COALESCE(MIN(created_at), now())::date FROM public.web_vitals_events),
    now()::date,
    '1 day'::interval
) d;

COMMIT;
