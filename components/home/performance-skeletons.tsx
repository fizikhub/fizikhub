"use client";

import { cn } from "@/lib/utils";

export function FeedSkeleton() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-[650px] mx-auto xl:mx-0">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="w-full h-[450px] bg-zinc-900/50 animate-pulse border-2 border-zinc-800 rounded-2xl flex flex-col p-4 space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800" />
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-zinc-800 rounded" />
                            <div className="h-2 w-16 bg-zinc-800 rounded" />
                        </div>
                    </div>
                    <div className="flex-1 w-full bg-zinc-800 rounded-xl" />
                    <div className="h-4 w-3/4 bg-zinc-800 rounded" />
                </div>
            ))}
        </div>
    );
}

export function SliderSkeleton() {
    return (
        <div className="w-full mt-2 mb-4">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="h-6 w-32 bg-zinc-900 animate-pulse rounded" />
                <div className="h-4 w-20 bg-zinc-900 animate-pulse rounded" />
            </div>
            <div className="flex gap-3 overflow-hidden px-1">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[240px] sm:w-[280px] aspect-[4/3] bg-zinc-900/50 animate-pulse border-2 border-zinc-800 rounded-2xl"
                    />
                ))}
            </div>
        </div>
    );
}

export function SidebarSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="w-full h-64 bg-zinc-900/30 animate-pulse border border-zinc-800 rounded-2xl"
                />
            ))}
        </div>
    );
}
