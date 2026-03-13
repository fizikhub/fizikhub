import { Skeleton } from "@/components/ui/skeleton";
import { LoadingMessage } from "@/components/ui/loading-message";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container py-4 md:py-8 px-4 md:px-8 max-w-[1600px] mx-auto">
                {/* Header Skeleton - Chalkboard Hero */}
                <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
                    <div className="rounded-xl border-[3px] border-black dark:border-zinc-700 overflow-hidden shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
                        <Skeleton className="h-[140px] sm:h-[180px] w-full rounded-none" />
                    </div>

                    {/* Category Pills Skeleton */}
                    <div className="flex gap-2 overflow-hidden py-1">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-9 w-20 sm:w-24 rounded-full flex-shrink-0 border-[2px] border-black/10 dark:border-zinc-700" />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-10">
                    {/* Question List Skeleton */}
                    <div className="space-y-4 order-2 lg:order-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-[10px] border-[3px] border-black dark:border-zinc-700 overflow-hidden shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] bg-card">
                                {/* Yellow Header Bar */}
                                <div className="h-10 bg-[#FFBD2E]/30 dark:bg-[#FFBD2E]/10 border-b-[3px] border-black dark:border-zinc-700 flex items-center justify-between px-4">
                                    <Skeleton className="h-3 w-16 rounded bg-black/10" />
                                    <Skeleton className="h-3 w-20 rounded bg-black/10" />
                                </div>

                                {/* Body */}
                                <div className="p-4 sm:p-5 space-y-3">
                                    <Skeleton className="h-6 sm:h-7 w-4/5 rounded" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3.5 w-full rounded" />
                                        <Skeleton className="h-3.5 w-full rounded" />
                                        <Skeleton className="h-3.5 w-3/5 rounded" />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="h-12 bg-neutral-50 dark:bg-[#161618] border-t-[3px] border-black dark:border-zinc-700 flex items-center justify-between px-4 sm:px-5">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-7 w-7 rounded-full" />
                                        <Skeleton className="h-3 w-16 rounded" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-7 w-20 rounded-lg" />
                                        <Skeleton className="h-4 w-8 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="hidden lg:block space-y-8 order-2">
                        <div className="rounded-xl border-[2.5px] border-black dark:border-zinc-700 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] bg-card space-y-4">
                            <Skeleton className="h-3 w-20 rounded" />
                            <div className="space-y-2">
                                <Skeleton className="h-11 w-full rounded-lg" />
                                <Skeleton className="h-11 w-full rounded-lg" />
                            </div>
                            <div className="h-px bg-border/50 my-2" />
                            <Skeleton className="h-3 w-16 rounded" />
                            <div className="space-y-2">
                                <Skeleton className="h-11 w-full rounded-lg" />
                                <Skeleton className="h-11 w-full rounded-lg" />
                            </div>
                        </div>
                        <Skeleton className="h-[280px] w-full rounded-2xl border-[3px] border-black/10 dark:border-zinc-700" />
                    </div>
                </div>
            </div>
            <LoadingMessage />
        </div>
    );
}
