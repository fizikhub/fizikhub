"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logActivity } from "@/app/actions/logging";

// In-memory throttle: aynı URL'yi 30 saniye içinde tekrar kaydetme
const lastLoggedUrls = new Map<string, number>();
const THROTTLE_MS = 30_000; // 30 saniye

function TrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

        // Deny list check if needed, but throttle is primary
        const lastLogged = lastLoggedUrls.get(url) ?? 0;
        const now = Date.now();
        if (now - lastLogged < THROTTLE_MS) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        // Increased debounce (2.5s) to allow hydration to complete fully
        timerRef.current = setTimeout(() => {
            const runLog = () => {
                lastLoggedUrls.set(url, Date.now());
                logActivity("PAGE_VIEW", url);
            };

            if (typeof window !== "undefined" && 'requestIdleCallback' in window) {
                (window as any).requestIdleCallback(runLog, { timeout: 2000 });
            } else {
                runLog();
            }
        }, 2500);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [pathname, searchParams]);

    return null;
}

export function UserActivityTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerContent />
        </Suspense>
    );
}
