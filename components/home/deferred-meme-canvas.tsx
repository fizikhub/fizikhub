"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MemeCornerCanvas = dynamic(() => import("@/components/home/meme-corner-canvas"), {
    ssr: false,
});

export function DeferredMemeCanvas() {
    const [loadCanvas, setLoadCanvas] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const enable = () => setLoadCanvas(true);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable, { timeout: 3200 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(enable, 1800);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    return loadCanvas ? <MemeCornerCanvas /> : null;
}
