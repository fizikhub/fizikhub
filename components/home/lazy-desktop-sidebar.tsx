"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SidebarSkeleton } from "@/components/home/performance-skeletons";

const FeedSidebar = dynamic(
    () => import("@/components/home/feed-sidebar").then((mod) => mod.FeedSidebar),
    { ssr: false, loading: () => <SidebarSkeleton /> }
);

export function LazyDesktopSidebar({ suggestedUsers = [] }: { suggestedUsers?: any[] }) {
    const [shouldMount, setShouldMount] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1280px)");
        const update = () => setShouldMount(mediaQuery.matches);

        update();
        mediaQuery.addEventListener("change", update);
        return () => mediaQuery.removeEventListener("change", update);
    }, []);

    if (!shouldMount) return null;

    return <FeedSidebar suggestedUsers={suggestedUsers} />;
}

