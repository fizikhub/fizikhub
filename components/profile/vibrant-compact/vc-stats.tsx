import { cn } from "@/lib/utils";
import { Users, FileText, Star } from "lucide-react";

interface VCStatsProps {
    stats: any;
}

export function VCStats({ stats }: VCStatsProps) {
    return (
        <div className="px-4 mb-6">
            <div className="grid grid-cols-3 gap-3">
                <StatItem
                    icon={<Users className="w-4 h-4 text-blue-500" />}
                    value={stats.followersCount}
                    label="Takipçi"
                />
                <StatItem
                    icon={<FileText className="w-4 h-4 text-pink-500" />}
                    value={stats.articlesCount + stats.questionsCount}
                    label="İçerik"
                />
                <StatItem
                    icon={<Star className="w-4 h-4 text-yellow-500" />}
                    value={stats.reputation}
                    label="Puan"
                />
            </div>
        </div>
    );
}

function StatItem({ icon, value, label }: { icon: any, value: number, label: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-1.5 mb-0.5">
                {icon}
                <span className="text-lg font-bold text-gray-900 leading-none">{value}</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
        </div>
    );
}
