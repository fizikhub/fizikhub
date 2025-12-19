"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logActivity } from "@/app/actions/logging";

function TrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Construct full URL path including query params
        const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

        // Log the page view
        // We use a small timeout to ensure the navigation handles are settled
        const timer = setTimeout(() => {
            logActivity("PAGE_VIEW", url);
        }, 1000); // 1 second delay to debounce rapid clicks

        return () => clearTimeout(timer);
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
