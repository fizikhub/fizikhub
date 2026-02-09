import { cn } from "@/lib/utils";
import { Users, Zap, FileText } from "lucide-react";

interface DMStatsProps {
    stats: any;
}

export function DMStats({ stats }: DMStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            <StatBox
                value={stats.reputation}
                label="Reputation"
                icon={<Zap className="w-4 h-4 text-yellow-400" />}
                glowColor="rgba(250, 204, 21, 0.2)"
            />
            <StatBox
                value={stats.followersCount}
                label="Followers"
                icon={<Users className="w-4 h-4 text-cyan-400" />}
                glowColor="rgba(34, 211, 238, 0.2)"
            />
            <StatBox
                value={stats.articlesCount + stats.questionsCount}
                label="Contributions"
                icon={<FileText className="w-4 h-4 text-pink-400" />}
                glowColor="rgba(232, 121, 249, 0.2)"
            />
        </div>
    );
}

function StatBox({ value, label, icon, glowColor }: { value: number, label: string, icon: any, glowColor: string }) {
    return (
        <div
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm transition-transform hover:-translate-y-1 group"
            style={{ boxShadow: `0 0 0 1px inset ${glowColor}` }}
        >
            <div className="mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {icon}
            </div>
            <span className="text-lg font-bold text-white mb-0.5 lining-nums tabular-nums tracking-tight">
                {value}
            </span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                {label}
            </span>
        </div>
    );
}
