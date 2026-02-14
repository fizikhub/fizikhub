import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container max-w-7xl py-12 px-4 mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 items-end mb-12 pb-8">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-6 w-full max-w-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-6 border rounded-xl space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex justify-between pt-4">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
