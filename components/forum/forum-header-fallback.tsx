"use client";

import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

interface ForumHeaderFallbackProps {
    currentCategory?: string;
    currentSort?: string;
}

export function ForumHeaderFallback({ currentCategory = "Tümü", currentSort = "newest" }: ForumHeaderFallbackProps) {
    const categories = [
        "Tümü",
        "Fizik",
        "Kuantum",
        "Astrofizik",
        "Mekanik",
        "Termodinamik",
        "Biyoloji",
        "Kimya",
        "Matematik",
        "Edebiyat",
        "Felsefe",
    ];

    return (
        <div className="flex flex-col gap-4 sm:gap-8 mb-6 sm:mb-8" aria-hidden="true">
            {/* CHALKBOARD HERO CARD */}
            <div className={cn(
                "relative rounded-xl overflow-hidden w-full",
                "bg-[#15201b] border-[4px] border-[#d4b483] shadow-[4px_4px_0_0_#1a1a1a]",
                "min-h-[140px] flex flex-col items-center justify-center p-6 sm:p-8 gap-6"
            )}>
                <div className="absolute inset-0 bg-[#2A3335] pointer-events-none" />

                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-between gap-6">
                    {/* Title Skeleton */}
                    <div className="h-12 sm:h-16 w-3/4 max-w-md bg-white/10 rounded-lg animate-pulse" />

                    {/* Input Trigger Skeleton */}
                    <div className="w-full md:max-w-xl">
                        <div className={cn(
                            "w-full h-14 sm:h-16 rounded-lg",
                            "bg-white/5 border-[2px] border-white/30",
                            "flex items-center px-4"
                        )}>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mr-4">
                                <Sparkles className="w-5 h-5 opacity-40 text-white" />
                            </div>
                            <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
                            <div className="ml-auto opacity-50">
                                <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTERS BAR SKELETON */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between py-3 sm:py-4">
                <div className="w-full md:w-auto overflow-hidden py-1">
                    <div className="flex gap-2 sm:gap-2.5 px-1 animate-pulse">
                        {categories.slice(0, 6).map((category) => (
                            <div
                                key={category}
                                className={cn(
                                    "px-4 py-2 w-20 sm:w-24 h-8 sm:h-9 border-[2.5px] rounded-full",
                                    currentCategory === category
                                        ? "bg-[#FFBD2E]/50 border-black/50"
                                        : "bg-card border-black/20 dark:border-zinc-600/50"
                                )}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-card p-1 rounded-xl border-[2.5px] border-black/20 dark:border-zinc-600/50 w-full md:w-auto h-[44px] animate-pulse">
                    <div className={cn("flex-1 md:w-24 h-full rounded-lg", currentSort === 'newest' ? "bg-[#FFBD2E]/50" : "bg-muted")} />
                    <div className={cn("flex-1 md:w-24 h-full rounded-lg", currentSort === 'popular' ? "bg-[#FFBD2E]/50" : "bg-muted")} />
                </div>
            </div>
        </div>
    );
}
