"use client";

import { useReportWebVitals } from "next/web-vitals";

type ConnectionInfo = {
    effectiveType?: string;
    saveData?: boolean;
    rtt?: number;
    downlink?: number;
};

type NavigatorWithConnection = Navigator & {
    connection?: ConnectionInfo;
};

const TRACKED_METRICS = new Set(["CLS", "FCP", "INP", "LCP", "TTFB"]);
const PRODUCTION_SAMPLE_RATE = 0.1;

function shouldSampleVitals(): boolean {
    if (process.env.NODE_ENV !== "production") return true;
    if (typeof window === "undefined") return false;

    const key = "fh_web_vitals_sampled";
    const existing = safeSessionStorageGet(key);
    if (existing) return existing === "1";

    const sampled = Math.random() < PRODUCTION_SAMPLE_RATE;
    safeSessionStorageSet(key, sampled ? "1" : "0");
    return sampled;
}

function safeSessionStorageGet(key: string): string | null {
    try {
        return window.sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeSessionStorageSet(key: string, value: string) {
    try {
        window.sessionStorage.setItem(key, value);
    } catch {
        // Metrics sampling must never affect the app path.
    }
}

function getConnectionInfo(): ConnectionInfo | undefined {
    if (typeof navigator === "undefined") return undefined;

    const connection = (navigator as NavigatorWithConnection).connection;
    if (!connection) return undefined;

    return {
        effectiveType: connection.effectiveType,
        saveData: connection.saveData,
        rtt: connection.rtt,
        downlink: connection.downlink,
    };
}

export function WebVitalsReporter() {
    useReportWebVitals((metric) => {
        if (!TRACKED_METRICS.has(metric.name)) return;
        if (!shouldSampleVitals()) return;

        const payload = {
            id: metric.id,
            name: metric.name,
            value: metric.value,
            delta: "delta" in metric ? metric.delta : undefined,
            rating: "rating" in metric ? metric.rating : undefined,
            navigationType: "navigationType" in metric ? metric.navigationType : undefined,
            pathname: window.location.pathname,
            href: window.location.href,
            connection: getConnectionInfo(),
            attribution: "attribution" in metric ? metric.attribution : undefined,
        };
        const body = JSON.stringify(payload);

        if (navigator.sendBeacon) {
            const blob = new Blob([body], { type: "application/json" });
            navigator.sendBeacon("/api/metrics/web-vitals", blob);
            return;
        }

        fetch("/api/metrics/web-vitals", {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
            keepalive: true,
        }).catch(() => {
            // Web Vitals should never affect the product path.
        });
    });

    return null;
}
