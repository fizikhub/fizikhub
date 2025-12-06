"use client";

interface ProfileStatsProps {
    followersCount: number;
    followingCount: number;
    questionsCount: number;
    answersCount: number;
}

export function ProfileStats({ followersCount, followingCount, questionsCount, answersCount }: ProfileStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* FOLLOWERS */}
            <div className="relative group">
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent w-full animate-scan-y shadow-[0_0_10px_rgba(245,158,11,0.5)]" />

                <div className="bg-black/40 backdrop-blur-md border border-amber-500/20 p-4 relative overflow-hidden group hover:border-amber-500/50 transition-colors h-full">
                    <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
                        <span className="text-4xl font-black font-mono text-white tracking-tighter drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                            {followersCount}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-500">Takipçi</span>
                    </div>
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                </div>
            </div>

            {/* FOLLOWING */}
            <div className="relative group">
                <div className="bg-black/40 backdrop-blur-md border border-amber-500/20 p-4 relative overflow-hidden group hover:border-amber-500/50 transition-colors h-full">
                    <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
                        <span className="text-4xl font-black font-mono text-white tracking-tighter drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                            {followingCount}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-500">Takip</span>
                    </div>
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                </div>
            </div>

            {/* QUESTIONS */}
            <div className="relative group">
                <div className="bg-black/40 backdrop-blur-md border border-amber-500/20 p-4 relative overflow-hidden group hover:border-amber-500/50 transition-colors h-full">
                    <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
                        <span className="text-4xl font-black font-mono text-white tracking-tighter drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                            {questionsCount}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-500">Soru</span>
                    </div>
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                </div>
            </div>

            {/* ANSWERS */}
            <div className="relative group">
                <div className="bg-black/40 backdrop-blur-md border border-amber-500/20 p-4 relative overflow-hidden group hover:border-amber-500/50 transition-colors h-full">
                    <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
                        <span className="text-4xl font-black font-mono text-white tracking-tighter drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                            {answersCount}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-500">Cevap</span>
                    </div>
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                </div>
            </div>
        </div>
    );
}
