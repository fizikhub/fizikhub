"use client";

interface ProfileStatsProps {
    followersCount: number;
    followingCount: number;
    questionsCount: number;
    answersCount: number;
}

export function ProfileStats({ followersCount, followingCount, questionsCount, answersCount }: ProfileStatsProps) {
    return (
        <div className="flex items-center justify-center gap-4 md:gap-6 py-3 flex-wrap">
            <div className="text-center">
                <div className="text-xl font-bold">{followersCount}</div>
                <div className="text-xs text-muted-foreground">Takipçi</div>
            </div>
            <div className="text-center">
                <div className="text-xl font-bold">{followingCount}</div>
                <div className="text-xs text-muted-foreground">Takip</div>
            </div>
            <div className="text-center">
                <div className="text-xl font-bold">{questionsCount}</div>
                <div className="text-xs text-muted-foreground">Soru</div>
            </div>
            <div className="text-center">
                <div className="text-xl font-bold">{answersCount}</div>
                <div className="text-xs text-muted-foreground">Cevap</div>
            </div>
        </div>
    );
}
