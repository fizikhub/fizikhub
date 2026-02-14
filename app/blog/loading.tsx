import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container md:px-16 px-4 py-4 md:py-8 max-w-[1600px] mx-auto min-h-screen">
            {/* Category tabs skeleton */}
            <div className="flex gap-2 mb-6 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-9 w-28 rounded-full flex-shrink-0" />
                ))}
            </div>
            {/* Search skeleton */}
            <Skeleton className="h-12 w-full max-w-md mb-8 rounded-xl" />
            {/* Article grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border rounded-xl overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex items-center gap-2 pt-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
