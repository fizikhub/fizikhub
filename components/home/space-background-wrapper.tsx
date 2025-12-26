"use client";

import dynamic from "next/dynamic";

const SpaceBackground = dynamic(() => import("@/components/home/space-background").then(mod => mod.SpaceBackground), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black -z-10" />
});

export function SpaceBackgroundWrapper() {
    return <SpaceBackground />;
}
