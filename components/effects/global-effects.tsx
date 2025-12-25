"use client";

import dynamic from "next/dynamic";

const SnowfallEffect = dynamic(() => import("@/components/effects/snowfall-effect").then(mod => mod.SnowfallEffect), {
    ssr: false,
});
const MarsEffect = dynamic(() => import("@/components/effects/mars-effect").then(mod => mod.MarsEffect), {
    ssr: false,
});

export function GlobalEffects() {
    return (
        <>
            <SnowfallEffect />
            <MarsEffect />
        </>
    );
}
