"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ScrollProgress = dynamic(() => import("@/components/ui/scroll-progress").then((mod) => mod.ScrollProgress), {
    ssr: false,
});

const BackToTop = dynamic(() => import("@/components/ui/back-to-top").then((mod) => mod.BackToTop), {
    ssr: false,
});

export function DesktopScrollEffects() {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px)");
        const sync = () => setEnabled(media.matches);

        sync();
        media.addEventListener("change", sync);
        return () => media.removeEventListener("change", sync);
    }, []);

    if (!enabled) return null;

    return (
        <>
            <ScrollProgress />
            <BackToTop />
        </>
    );
}
