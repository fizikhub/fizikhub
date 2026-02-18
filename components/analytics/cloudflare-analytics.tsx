"use client";

import Script from "next/script";

export function CloudflareAnalytics() {
    // We'll use a hardcoded token if provided directly, otherwise env var
    // For now, I'll set it up to accept an env var or we can paste it here later
    const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

    // Render nothing if no token (or we can render the script tag if the user provides the token string directly)
    if (!token) return null;

    return (
        <Script
            defer
            src='https://static.cloudflareinsights.com/beacon.min.js'
            data-cf-beacon={`{"token": "${token}"}`}
        />
    );
}
