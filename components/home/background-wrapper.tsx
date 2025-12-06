"use client";

import dynamic from "next/dynamic";

const BlackHoleBackground = dynamic(
    () => import("@/components/home/black-hole-background").then((mod) => mod.BlackHoleBackground),
    { ssr: false }
);

export function BackgroundWrapper() {
    return <BlackHoleBackground />;
}
