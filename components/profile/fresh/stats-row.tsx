import { cn } from "@/lib/utils";
import { Zap, Users, TrendingUp, Award, Star } from "lucide-react";

interface StatsRowProps {
    stats: any;
}

export function StatsRow({ stats }: StatsRowProps) {
    return (
        <div className="grid grid-cols-4 gap-2 mb-6">
            <StatItem
                value={stats.reputation}
                label="İtibar"
                icon={Zap}
                color="text-neo-vibrant-yellow"
                bg="bg-yellow-50"
                borderColor="border-yellow-200"
            />
            <StatItem
                value={stats.followersCount}
                label="Takipçi"
                icon={Users}
                color="text-neo-vibrant-pink"
                bg="bg-pink-50"
                borderColor="border-pink-200"
            />
            <StatItem
                value={stats.followingCount}
                label="Takip"
                icon={TrendingUp}
                color="text-neo-vibrant-cyan"
                bg="bg-cyan-50"
                borderColor="border-cyan-200"
            />
            <StatItem
                value={0}
                label="Rozet"
                icon={Award}
                color="text-neo-vibrant-lime"
                bg="bg-lime-50"
                borderColor="border-lime-200"
            />
        </div>
    );
}

function StatItem({ value, label, icon: Icon, color, bg, borderColor }: any) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl border border-b-4 transition-all hover:-translate-y-1",
            bg, borderColor
        )}>
            <Icon className={cn("w-5 h-5 mb-1", color)} />
            <span className="text-lg font-black font-heading leading-none text-gray-800">{value}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{label}</span>
        </div>
    );
}
