"use client";

import { track } from "@vercel/analytics";
import { GROWTH_ATTRIBUTION_STORAGE_KEY, normalizeGrowthAttribution, type GrowthAttribution } from "@/lib/growth-attribution";

declare global {
    interface Window {
        gtag?: (command: "event", eventName: string, params?: Record<string, unknown>) => void;
    }
}

export function trackGrowthEvent(eventName: string, params: Record<string, string | number | boolean | undefined> = {}) {
    if (typeof window === "undefined") return;
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));

    window.gtag?.("event", eventName, cleanParams);
    try {
        track(eventName, cleanParams);
    } catch {
        // Analytics must never interrupt a product action.
    }
}

export function getStoredGrowthAttribution(): GrowthAttribution | null {
    if (typeof window === "undefined") return null;

    try {
        return normalizeGrowthAttribution(JSON.parse(window.localStorage.getItem(GROWTH_ATTRIBUTION_STORAGE_KEY) || "null"));
    } catch {
        return null;
    }
}
