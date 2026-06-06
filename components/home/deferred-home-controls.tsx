"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ScrollProgress = dynamic(() => import("@/components/ui/scroll-progress").then((mod) => mod.ScrollProgress), {
    ssr: false,
});

const BackToTop = dynamic(() => import("@/components/ui/back-to-top").then((mod) => mod.BackToTop), {
    ssr: false,
});

export function DeferredHomeControls() {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const enable = () => setEnabled(true);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable, { timeout: 2200 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(enable, 900);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    if (!enabled) return null;

    return (
        <>
            <ScrollProgress />
            <BackToTop />
        </>
    );
}
