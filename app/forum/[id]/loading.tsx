import { Skeleton } from "@/components/ui/skeleton";
import { BackgroundWrapper } from "@/components/home/background-wrapper";

export default function Loading() {
    return (
        <div className="min-h-[150vh] bg-background pb-20 relative overflow-x-hidden">
            <BackgroundWrapper />
            <div className="container py-4 sm:py-6 md:py-10 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
                {/* Back Button Skeleton */}
                <div className="mb-4 sm:mb-6">
                    <Skeleton className="h-9 w-24 bg-muted/20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Question Card Skeleton */}
                        <div className="bg-card border-2 border-border overflow-hidden">
                            <div className="p-6 sm:p-8">
                                {/* Author Header */}
                                <Skeleton className="h-12 w-12 rounded-full bg-muted/60" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32 bg-muted/60" />
                                    <Skeleton className="h-3 w-24 bg-muted/60" />
                                </div>
                                <Skeleton className="h-6 w-16 bg-muted/60" />
                            </div>

                            {/* Title */}
                            <Skeleton className="h-8 w-3/4 mb-5 bg-muted/60" />

                            {/* Content */}
                            <div className="space-y-3 mb-6">
                                <Skeleton className="h-4 w-full bg-muted/60" />
                                <Skeleton className="h-4 w-full bg-muted/60" />
                                <Skeleton className="h-4 w-5/6 bg-muted/60" />
                                <Skeleton className="h-4 w-4/6 bg-muted/60" />
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2 mb-6">
                                <Skeleton className="h-6 w-16 bg-muted/60" />
                                <Skeleton className="h-6 w-20 bg-muted/60" />
                            </div>

                            {/* Actions Bar */}
                            <div className="flex items-center justify-between gap-4 pt-5 border-t border-border/50">
                                <div className="flex gap-3">
                                    <Skeleton className="h-8 w-24 bg-muted/60" />
                                    <Skeleton className="h-8 w-8 bg-muted/60" />
                                    <Skeleton className="h-8 w-8 bg-muted/60" />
                                </div>
                                <Skeleton className="h-4 w-24 bg-muted/60" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Sidebar (Desktop) */}
                <aside className="hidden lg:block space-y-4">
                    <div className="border-2 border-border bg-card">
                        <div className="p-4 border-b-2 border-border">
                            <Skeleton className="h-4 w-24 bg-muted/20" />
                        </div>
                        <div className="p-4 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-lg bg-muted/20" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-5 w-12 bg-muted/20" />
                                        <Skeleton className="h-3 w-16 bg-muted/20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
        </div >
    );
}
