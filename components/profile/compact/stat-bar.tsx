import { cn } from "@/lib/utils";
import { Zap, Users, TrendingUp, Award } from "lucide-react";

interface StatBarProps {
    stats: any;
}

export function StatBar({ stats }: StatBarProps) {
    return (
        <div className="w-full overflow-x-auto hide-scrollbar border-b-2 border-black bg-white">
            <div className="flex divide-x-2 divide-black min-w-max">
                <StatItem label="İTİBAR" value={stats.reputation} icon={Zap} color="bg-neo-vibrant-yellow" />
                <StatItem label="TAKİPÇİ" value={stats.followersCount} icon={Users} color="bg-neo-vibrant-pink" />
                <StatItem label="TAKİP" value={stats.followingCount} icon={TrendingUp} color="bg-neo-vibrant-cyan" />
                <StatItem label="ROZETLER" value={0} icon={Award} color="bg-neo-vibrant-lime" />
            </div>
        </div>
    );
}

function StatItem({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-3 w-24 flex-shrink-0 relative group cursor-default transition-colors hover:bg-gray-50")}>
            <div className={cn("absolute top-0 right-0 w-3 h-3 border-l-2 border-b-2 border-black", color)} />
            <span className="text-[10px] font-black text-gray-500 mb-0.5 tracking-wider">{label}</span>
            <span className="text-xl font-black font-heading leading-none">{value}</span>
        </div>
    );
}
