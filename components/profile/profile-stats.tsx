"use client";

interface ProfileStatsProps {
    followersCount: number;
    followingCount: number;
    questionsCount: number;
    answersCount: number;
}

export function ProfileStats({ followersCount, followingCount, questionsCount, answersCount }: ProfileStatsProps) {
    const stats = [
        { label: "TAKİPÇİ", value: followersCount },
        { label: "TAKİP", value: followingCount },
        { label: "SORU", value: questionsCount },
        { label: "CEVAP", value: answersCount },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="relative bg-black/40 border border-cyan-500/30 p-4 transition-all duration-300 hover:bg-cyan-950/20 hover:border-cyan-400/60 group overflow-hidden"
                >
                    {/* HUD Corner Markers */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

                    {/* Scanlight Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />

                    <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-cyan-500/30 rounded-full" />
                    </div>

                    <div className="text-3xl md:text-4xl font-black font-mono tracking-tighter text-white group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                        {stat.value}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mt-1 font-mono">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
