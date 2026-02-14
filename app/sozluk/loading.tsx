import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-12 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 items-end mb-12 pb-8">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-6 w-full max-w-lg" />
                </div>
            </div>
            {/* Search bar skeleton */}
            <Skeleton className="h-12 w-full max-w-md mb-8 rounded-xl" />
            {/* Term list skeleton */}
            <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="p-4 border rounded-xl flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
