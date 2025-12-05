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
                    className="bg-background border-2 border-black dark:border-white p-3 relative group hover:-translate-y-1 transition-transform duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                >
                    <div className="absolute top-0 right-0 p-1">
                        <div className="w-1.5 h-1.5 bg-primary/50" />
                    </div>
                    <div className="text-3xl font-black font-mono tracking-tighter text-primary">
                        {stat.value}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
