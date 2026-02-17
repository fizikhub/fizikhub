import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-background relative pb-20 pt-8">
            <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">

                {/* 1. HERO SKELETON */}
                <div className="w-full h-60 rounded-xl border border-border/40 bg-card/50 mb-8 overflow-hidden relative">
                    <Skeleton className="w-full h-full" />
                    <div className="absolute bottom-6 left-6 flex items-end gap-4">
                        <Skeleton className="w-24 h-24 rounded-xl border-4 border-background" />
                        <div className="space-y-2 mb-2">
                            <Skeleton className="h-8 w-48 rounded-md" />
                            <Skeleton className="h-4 w-32 rounded-md" />
                        </div>
                    </div>
                </div>

                {/* 2. GRID CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: FEED SKELETON (7 Columns) */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                        {/* Tabs */}
                        <div className="flex gap-3 pb-2 border-b border-border/40">
                            <Skeleton className="h-10 w-28 rounded-lg" />
                            <Skeleton className="h-10 w-28 rounded-lg" />
                            <Skeleton className="h-10 w-28 rounded-lg" />
                        </div>

                        {/* Feed Items */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                    <Skeleton className="h-4 w-32 rounded-md" />
                                </div>
                                <Skeleton className="h-6 w-3/4 rounded-md" />
                                <Skeleton className="h-16 w-full rounded-md" />
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: SIDEBAR SKELETON (5 Columns) */}
                    <div className="hidden xl:block xl:col-span-5 space-y-6">
                        {/* About Card */}
                        <div className="h-64 rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
                            <Skeleton className="h-6 w-1/3 rounded-md border-b border-border/40 pb-2" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                            <Skeleton className="h-12 w-full rounded-lg mt-4" />
                        </div>

                        {/* Badges Card */}
                        <div className="h-48 rounded-xl border border-border/40 bg-card/50 p-6">
                            <Skeleton className="h-6 w-1/3 rounded-md mb-4" />
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                                    <Skeleton key={j} className="aspect-square rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
