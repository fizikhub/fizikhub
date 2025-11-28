import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen py-6 sm:py-8 md:py-12 px-4 md:px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
                    <div className="space-y-4 w-full max-w-2xl">
                        <Skeleton className="h-10 sm:h-12 md:h-14 w-3/4" />
                        <Skeleton className="h-4 sm:h-5 md:h-6 w-full" />
                        <Skeleton className="h-4 sm:h-5 md:h-6 w-2/3" />
                    </div>
                </div>

                {/* Blog List Skeleton */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
