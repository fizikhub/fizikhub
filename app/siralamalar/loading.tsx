import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container max-w-5xl py-12 px-4 mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 items-end mb-12 pb-8">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-6 w-full max-w-lg" />
                </div>
            </div>
            {/* Top 3 podium skeleton */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-3 p-6 border rounded-xl">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
            {/* Leaderboard list skeleton */}
            <div className="space-y-3">
                {[4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="p-4 border rounded-xl flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-3 w-1/6" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}
