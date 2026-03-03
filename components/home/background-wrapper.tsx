"use client";

import dynamic from "next/dynamic";

const LightweightBackground = dynamic(
    () => import("@/components/ui/lightweight-background").then(mod => mod.LightweightBackground),
    { ssr: false }
);

export function BackgroundWrapper() {
    return <LightweightBackground />;
}
