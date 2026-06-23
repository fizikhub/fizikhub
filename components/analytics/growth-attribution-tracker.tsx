"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
    GROWTH_ATTRIBUTION_STORAGE_KEY,
    GROWTH_ATTRIBUTION_COOKIE,
    GROWTH_LAST_TOUCH_STORAGE_KEY,
    extractGrowthAttribution,
    getLandingContentType,
    parseGrowthTrackingCookie,
} from "@/lib/growth-attribution";
import { trackGrowthEvent } from "@/lib/growth-client";

export function GrowthAttributionTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const previousPath = useRef<string | null>(null);

    useEffect(() => {
        const query = new URLSearchParams(searchParams.toString());
        const redirectedTrackingParams = parseGrowthTrackingCookie(document.cookie);
        redirectedTrackingParams.forEach((value, key) => {
            if (!query.has(key)) query.set(key, value);
        });
        if (redirectedTrackingParams.size > 0) {
            document.cookie = `${GROWTH_ATTRIBUTION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
        }
        const attribution = extractGrowthAttribution(query, document.referrer, pathname);
        const contentType = getLandingContentType(pathname);
        const sessionKey = `fizikhub:growth:${pathname}?${query.toString()}`;

        try {
            if (!window.localStorage.getItem(GROWTH_ATTRIBUTION_STORAGE_KEY)) {
                window.localStorage.setItem(GROWTH_ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
            }
            window.localStorage.setItem(GROWTH_LAST_TOUCH_STORAGE_KEY, JSON.stringify(attribution));

            if (!window.sessionStorage.getItem(sessionKey)) {
                window.sessionStorage.setItem(sessionKey, "1");
                trackGrowthEvent("acquisition_landing", {
                    source: attribution.source,
                    medium: attribution.medium,
                    campaign: attribution.campaign,
                    content_type: contentType,
                    landing_path: pathname,
                });
            }
        } catch {
            // Storage may be disabled; event tracking can still continue.
        }

        if (previousPath.current && previousPath.current !== pathname) {
            trackGrowthEvent("page_view", {
                page_path: pathname,
                content_type: contentType,
            });
        }
        previousPath.current = pathname;
    }, [pathname, searchParams]);

    return null;
}
