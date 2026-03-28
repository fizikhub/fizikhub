export default function Loading() {
    return (
        <div className="min-h-screen bg-background pb-20 animate-pulse flex flex-col items-center pt-24">
            {/* Hero Image Skeleton */}
            <div className="w-full max-w-4xl h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-12 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_rgba(0,0,0,0.5)] border-4 border-black dark:border-zinc-700" />
            
            {/* Title Skeleton */}
            <div className="w-full max-w-4xl px-4 space-y-4">
                <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4" />
                <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-2/4" />
                
                {/* Author Info Skeleton */}
                <div className="flex items-center gap-4 mt-8">
                    <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full border-2 border-black" />
                    <div className="space-y-2">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
                    </div>
                </div>

                {/* Content Lines Skeleton */}
                <div className="mt-16 space-y-6">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-11/12" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
                </div>
            </div>
        </div>
    );
}
