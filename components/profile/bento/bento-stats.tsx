import { cn } from "@/lib/utils";
import { Users, UserPlus, Star, BarChart2 } from "lucide-react";

interface BentoStatsProps {
    stats: any;
}

export function BentoStats({ stats }: BentoStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            <StatCard
                icon={<Users className="w-5 h-5 text-blue-500" />}
                value={stats.followersCount}
                label="Takipçi"
                color="bg-blue-50"
            />
            <StatCard
                icon={<UserPlus className="w-5 h-5 text-purple-500" />}
                value={stats.followingCount}
                label="Takip"
                color="bg-purple-50"
            />
            <StatCard
                icon={<Star className="w-5 h-5 text-yellow-500" />}
                value={stats.reputation}
                label="Puan"
                color="bg-yellow-50"
            />
            <StatCard
                icon={<BarChart2 className="w-5 h-5 text-green-500" />}
                value={stats.articlesCount + stats.questionsCount}
                label="İçerik"
                color="bg-green-50"
            />
        </div>
    );
}

function StatCard({ icon, value, label, color }: { icon: any, value: number, label: string, color: string }) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-4 rounded-3xl border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,0.05)] hover:shadow-[5px_5px_0_rgba(0,0,0,0.1)] transition-all duration-300 bg-white group cursor-default hover:-translate-y-1"
        )}>
            <div className={cn("p-2 rounded-xl mb-2 transition-colors", color)}>
                {icon}
            </div>
            <span className="text-xl font-black text-gray-900 leading-none mb-1">{value}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
        </div>
    );
}
