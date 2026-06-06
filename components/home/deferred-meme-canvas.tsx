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
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

        const enable = () => setLoadCanvas(true);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable, { timeout: 3200 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(enable, 1800);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    if (!loadCanvas) {
        return (
            <div
                aria-hidden="true"
                className="h-full w-full bg-[radial-gradient(circle_at_50%_45%,rgba(250,204,21,0.22),transparent_10%),radial-gradient(circle_at_35%_50%,rgba(96,165,250,0.32),transparent_22%),radial-gradient(circle_at_65%_46%,rgba(168,85,247,0.30),transparent_24%),linear-gradient(135deg,#020617,#111827_45%,#050505)]"
            />
        );
    }

    return <MemeCornerCanvas />;
}
