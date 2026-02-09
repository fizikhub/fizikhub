import { cn } from "@/lib/utils";

interface FunkyStatsProps {
    stats: any;
}

export function FunkyStats({ stats }: FunkyStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-4 px-4 w-full max-w-md mx-auto mb-8">
            <StatCard label="Posts" value={stats.articlesCount + stats.questionsCount} />
            <StatCard label="Followers" value={stats.followersCount} highlighted />
            <StatCard label="Following" value={stats.followingCount} />
        </div>
    );
}

function StatCard({ label, value, highlighted = false }: { label: string, value: number, highlighted?: boolean }) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-4 px-2 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0_black] transition-transform hover:-translate-y-1",
            highlighted && "border-3" // Middle card could carry slight emphasis if needed
        )}>
            <span className="text-xl font-black font-heading leading-none text-black mb-1">{value}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{label}</span>
        </div>
    );
}
