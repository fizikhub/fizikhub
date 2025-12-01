import { Skeleton } from "@/components/ui/skeleton";

export function ForumSkeleton() {
    return (
        <div className="space-y-4">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-6 mb-8">
                <Skeleton className="h-[200px] w-full rounded-[32px]" />
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                {/* Sidebar Skeleton */}
                <div className="hidden md:block space-y-6">
                    <Skeleton className="h-[300px] w-full rounded-2xl" />
                    <Skeleton className="h-[200px] w-full rounded-2xl" />
                </div>

                {/* Questions List Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-6 rounded-2xl border border-border/40 bg-card/50 space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-3/4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
