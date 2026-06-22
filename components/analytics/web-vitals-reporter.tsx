"use client";

import { useEffect } from "react";
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
let latestNativeLcpEntry: Record<string, unknown> | null = null;

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

function getSanitizedHref() {
    return `${window.location.origin}${window.location.pathname}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object" ? value as Record<string, unknown> : null;
}

function lcpElementLabel(value: unknown) {
    if (typeof value === "string") return value.slice(0, 512);
    if (!(value instanceof Element)) return undefined;

    const candidate = value.getAttribute("data-lcp-candidate");
    const id = value.id ? `#${value.id}` : "";
    const classes = Array.from(value.classList).slice(0, 3).map((name) => `.${name}`).join("");
    return `${value.tagName.toLowerCase()}${candidate ? `[data-lcp-candidate="${candidate}"]` : ""}${id}${classes}`.slice(0, 512);
}

function getActionableAttribution(metric: unknown) {
    const metricRecord = asRecord(metric);
    const attribution = asRecord(metricRecord?.attribution) || (metricRecord?.name === "LCP" ? latestNativeLcpEntry : null);
    if (!attribution) return undefined;

    const entry = asRecord(attribution.lcpEntry);
    const element = lcpElementLabel(attribution.element ?? entry?.element);
    const resourceUrl = [attribution.url, attribution.resourceUrl, entry?.url]
        .find((value): value is string => typeof value === "string")
        ?.split(/[?#]/, 1)[0]
        .slice(0, 1024);
    const result: Record<string, string | number> = {};

    if (element) result.element = element;
    if (resourceUrl) result.resourceUrl = resourceUrl;

    for (const key of [
        "timeToFirstByte",
        "resourceLoadDelay",
        "resourceLoadDuration",
        "elementRenderDelay",
        "loadTime",
        "renderTime",
        "startTime",
        "size",
    ]) {
        const value = attribution[key] ?? entry?.[key];
        if (typeof value === "number" && Number.isFinite(value)) result[key] = Math.round(value * 100) / 100;
    }

    return Object.keys(result).length > 0 ? result : undefined;
}

export function WebVitalsReporter() {
    useEffect(() => {
        if (!("PerformanceObserver" in window)) return;

        let observer: PerformanceObserver | null = null;
        try {
            observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const entry = entries[entries.length - 1] as PerformanceEntry & {
                    element?: Element;
                    url?: string;
                    loadTime?: number;
                    renderTime?: number;
                    size?: number;
                };
                if (!entry) return;

                latestNativeLcpEntry = {
                    element: entry.element,
                    url: entry.url,
                    loadTime: entry.loadTime,
                    renderTime: entry.renderTime,
                    startTime: entry.startTime,
                    size: entry.size,
                };
            });
            observer.observe({ type: "largest-contentful-paint", buffered: true });
        } catch {
            observer?.disconnect();
            return;
        }

        return () => observer?.disconnect();
    }, []);

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
            href: getSanitizedHref(),
            connection: getConnectionInfo(),
            attribution: getActionableAttribution(metric),
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
