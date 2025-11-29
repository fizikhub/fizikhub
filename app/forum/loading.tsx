import { Skeleton } from "@/components/ui/skeleton";
import { LoadingMessage } from "@/components/ui/loading-message";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container py-4 sm:py-6 md:py-8 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 sm:gap-8">
                    <div className="space-y-6">
                        {/* Header Skeleton */}
                        <div className="space-y-4">
                            <Skeleton className="h-10 sm:h-12 w-full max-w-md rounded-xl" />
                            <div className="flex gap-2 overflow-hidden">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
                                ))}
                            </div>
                        </div>

                        {/* Question List Skeleton */}
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 sm:p-6 border rounded-xl space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2 w-full">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                                    </div>
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="hidden lg:block space-y-6">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </div>
                </div>
            </div>
            <LoadingMessage />
        </div>
    );
}
