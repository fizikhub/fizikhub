import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            {/* Cover Image Skeleton */}
            <div className="h-48 md:h-64 w-full relative">
                <Skeleton className="w-full h-full" />
            </div>

            <div className="container px-4 md:px-6 max-w-6xl mx-auto -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    {/* Profile Card Skeleton */}
                    <div className="w-full md:w-[320px] flex-shrink-0 space-y-6">
                        <div className="p-6 rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-xl space-y-6">
                            <div className="flex flex-col items-center -mt-16">
                                <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
                                <Skeleton className="h-8 w-48 mt-4" />
                                <Skeleton className="h-4 w-32 mt-2" />
                            </div>

                            <div className="flex justify-center gap-8 py-4 border-y border-border/50">
                                <div className="text-center space-y-2">
                                    <Skeleton className="h-6 w-8 mx-auto" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <div className="text-center space-y-2">
                                    <Skeleton className="h-6 w-8 mx-auto" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <div className="text-center space-y-2">
                                    <Skeleton className="h-6 w-8 mx-auto" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Content Tabs Skeleton */}
                    <div className="flex-1 w-full space-y-6 mt-4 md:mt-20">
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32 rounded-full" />
                            <Skeleton className="h-10 w-32 rounded-full" />
                            <Skeleton className="h-10 w-32 rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-[160px] w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
