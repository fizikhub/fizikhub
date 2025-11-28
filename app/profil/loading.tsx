import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-4 sm:py-6 md:py-8 px-4 md:px-6 max-w-5xl mx-auto min-h-screen">
            {/* Header Skeleton */}
            <div className="relative mb-8">
                <Skeleton className="h-32 md:h-48 rounded-t-3xl w-full" />
                <div className="px-6 md:px-10 pb-6 -mt-12 md:-mt-16 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background" />
                        <div className="flex-1 space-y-2 pt-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-full max-w-md" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-6">
                <div className="flex gap-4 border-b pb-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>

                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
