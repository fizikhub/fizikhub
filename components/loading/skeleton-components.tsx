import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonCard() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </CardContent>
        </Card>
    );
}

export function SkeletonQuestionCard() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-4 mt-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </CardContent>
        </Card>
    );
}

export function SkeletonProfile() {
    return (
        <div className="space-y-6">
            {/* Cover */}
            <Skeleton className="h-48 w-full" />

            {/* Avatar and Info */}
            <div className="flex flex-col items-center -mt-20 space-y-4">
                <Skeleton className="h-32 w-32 rounded-full ring-4 ring-background" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full max-w-md" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                        <Skeleton className="h-8 w-16 mx-auto" />
                        <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
