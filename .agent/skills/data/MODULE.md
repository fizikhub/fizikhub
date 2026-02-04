---
module: data
title: "Analytics & Data Queries"
triggers: ["analytics", "metrics", "query", "data", "dashboard", "report", "KPI", "funnel", "cohort"]
version: 1.0.0
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# Data Module

> Analytics, metrics, data queries, and reporting

**Activates on:** analytics, metrics, query, data, dashboard, report, KPI, funnel

**Collaborates with:** `api` for data endpoints, `ui` for dashboards

---

## Key Metrics Framework

### User Metrics
```sql
-- Daily Active Users (DAU)
SELECT COUNT(DISTINCT user_id) as dau
FROM events
WHERE event_date = CURRENT_DATE;

-- Weekly Active Users (WAU)
SELECT COUNT(DISTINCT user_id) as wau
FROM events
WHERE event_date >= CURRENT_DATE - INTERVAL '7 days';

-- Monthly Active Users (MAU)
SELECT COUNT(DISTINCT user_id) as mau
FROM events
WHERE event_date >= CURRENT_DATE - INTERVAL '30 days';

-- DAU/MAU Ratio (Stickiness)
WITH dau AS (
  SELECT COUNT(DISTINCT user_id) as count
  FROM events WHERE event_date = CURRENT_DATE
),
mau AS (
  SELECT COUNT(DISTINCT user_id) as count
  FROM events WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT ROUND(dau.count::numeric / mau.count * 100, 2) as stickiness
FROM dau, mau;
```

### Growth Metrics
```sql
-- New User Signups by Day
SELECT
  DATE(created_at) as signup_date,
  COUNT(*) as new_users
FROM users
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY signup_date;

-- Week-over-Week Growth
WITH weekly_users AS (
  SELECT
    DATE_TRUNC('week', created_at) as week,
    COUNT(*) as users
  FROM users
  GROUP BY DATE_TRUNC('week', created_at)
)
SELECT
  week,
  users,
  LAG(users) OVER (ORDER BY week) as prev_week,
  ROUND((users - LAG(users) OVER (ORDER BY week))::numeric /
        NULLIF(LAG(users) OVER (ORDER BY week), 0) * 100, 2) as growth_pct
FROM weekly_users
ORDER BY week DESC;
```

### Retention Metrics
```sql
-- Cohort Retention Analysis
WITH cohorts AS (
  SELECT
    user_id,
    DATE_TRUNC('week', MIN(event_date)) as cohort_week
  FROM events
  GROUP BY user_id
),
activity AS (
  SELECT
    e.user_id,
    c.cohort_week,
    DATE_TRUNC('week', e.event_date) as activity_week,
    (DATE_TRUNC('week', e.event_date) - c.cohort_week) / 7 as week_number
  FROM events e
  JOIN cohorts c ON e.user_id = c.user_id
)
SELECT
  cohort_week,
  week_number,
  COUNT(DISTINCT user_id) as users,
  ROUND(COUNT(DISTINCT user_id)::numeric /
        FIRST_VALUE(COUNT(DISTINCT user_id)) OVER (
          PARTITION BY cohort_week ORDER BY week_number
        ) * 100, 2) as retention_pct
FROM activity
GROUP BY cohort_week, week_number
ORDER BY cohort_week, week_number;
```

---

## Funnel Analysis

```sql
-- Conversion Funnel
WITH funnel AS (
  SELECT
    COUNT(DISTINCT CASE WHEN event_name = 'page_view' THEN user_id END) as step1_visitors,
    COUNT(DISTINCT CASE WHEN event_name = 'signup_start' THEN user_id END) as step2_signup_start,
    COUNT(DISTINCT CASE WHEN event_name = 'signup_complete' THEN user_id END) as step3_signup_complete,
    COUNT(DISTINCT CASE WHEN event_name = 'first_action' THEN user_id END) as step4_first_action,
    COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN user_id END) as step5_purchase
  FROM events
  WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT
  step1_visitors,
  step2_signup_start,
  ROUND(step2_signup_start::numeric / step1_visitors * 100, 2) as step1_to_2_pct,
  step3_signup_complete,
  ROUND(step3_signup_complete::numeric / step2_signup_start * 100, 2) as step2_to_3_pct,
  step4_first_action,
  ROUND(step4_first_action::numeric / step3_signup_complete * 100, 2) as step3_to_4_pct,
  step5_purchase,
  ROUND(step5_purchase::numeric / step4_first_action * 100, 2) as step4_to_5_pct,
  ROUND(step5_purchase::numeric / step1_visitors * 100, 2) as overall_conversion
FROM funnel;
```

---

## Revenue Metrics

```sql
-- Monthly Recurring Revenue (MRR)
SELECT
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) as mrr
FROM subscriptions
WHERE status = 'active'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Average Revenue Per User (ARPU)
SELECT
  DATE_TRUNC('month', p.created_at) as month,
  SUM(p.amount) as revenue,
  COUNT(DISTINCT p.user_id) as paying_users,
  ROUND(SUM(p.amount)::numeric / COUNT(DISTINCT p.user_id), 2) as arpu
FROM payments p
WHERE p.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', p.created_at)
ORDER BY month;

-- Customer Lifetime Value (LTV)
WITH user_revenue AS (
  SELECT
    user_id,
    SUM(amount) as total_revenue,
    MIN(created_at) as first_purchase,
    MAX(created_at) as last_purchase
  FROM payments
  GROUP BY user_id
)
SELECT
  ROUND(AVG(total_revenue), 2) as avg_ltv,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_revenue) as median_ltv,
  ROUND(AVG(EXTRACT(EPOCH FROM (last_purchase - first_purchase)) / 86400), 0) as avg_lifespan_days
FROM user_revenue;
```

---

## Event Tracking Schema

```typescript
// Event structure
interface AnalyticsEvent {
  eventId: string          // Unique event ID
  eventName: string        // e.g., 'page_view', 'button_click'
  userId?: string          // Authenticated user
  anonymousId: string      // Device/session ID
  timestamp: Date
  properties: {
    page?: string
    component?: string
    action?: string
    value?: number
    [key: string]: unknown
  }
  context: {
    userAgent: string
    locale: string
    timezone: string
    referrer?: string
    campaign?: {
      source?: string
      medium?: string
      campaign?: string
    }
  }
}

// Tracking implementation
export function track(eventName: string, properties?: Record<string, unknown>) {
  const event: AnalyticsEvent = {
    eventId: crypto.randomUUID(),
    eventName,
    userId: getCurrentUserId(),
    anonymousId: getAnonymousId(),
    timestamp: new Date(),
    properties: properties ?? {},
    context: {
      userAgent: navigator.userAgent,
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
    },
  }

  // Send to analytics endpoint
  fetch('/api/analytics/track', {
    method: 'POST',
    body: JSON.stringify(event),
    keepalive: true,
  })
}
```

---

## Dashboard Components

```typescript
// Metric Card
interface MetricCardProps {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
}

export function MetricCard({ title, value, change, changeLabel }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {change !== undefined && (
        <p className={cn(
          "text-sm mt-1",
          change >= 0 ? "text-green-600" : "text-red-600"
        )}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          {changeLabel && ` ${changeLabel}`}
        </p>
      )}
    </div>
  )
}

// Time Series Chart
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface TimeSeriesProps {
  data: Array<{ date: string; value: number }>
  title: string
}

export function TimeSeriesChart({ data, title }: TimeSeriesProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

## Query Optimization

```sql
-- Use indexes for common queries
CREATE INDEX idx_events_user_date ON events(user_id, event_date);
CREATE INDEX idx_events_name_date ON events(event_name, event_date);

-- Materialized views for expensive aggregations
CREATE MATERIALIZED VIEW daily_metrics AS
SELECT
  event_date,
  COUNT(DISTINCT user_id) as dau,
  COUNT(*) as total_events,
  COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN user_id END) as purchasers
FROM events
GROUP BY event_date;

-- Refresh daily
REFRESH MATERIALIZED VIEW daily_metrics;
```

---

## Checklist

```
[ ] Event tracking implemented
[ ] Key metrics defined
[ ] Dashboards built
[ ] Queries optimized (indexes, materialized views)
[ ] Data retention policy
[ ] Privacy compliance (GDPR, etc.)
[ ] Real-time vs batch processing decided
```
