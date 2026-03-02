"use client";

import dynamic from "next/dynamic";

export const SpaceBomberGameLazy = dynamic(
    () => import("@/components/nevbara/space-bomber-game").then((mod) => mod.SpaceBomberGame),
    { ssr: false, loading: () => <div className="min-h-[600px] w-full mt-4 flex items-center justify-center border rounded-lg bg-black/50 text-muted-foreground animate-pulse">Sistem yükleniyor...</div> }
);
