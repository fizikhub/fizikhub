"use client";

import { Trophy, Users, FileText, MessageCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileStatsCardProps {
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
}

export function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
    const items = [
        {
            label: "Hub Puanı",
            value: stats.reputation,
            desc: "Topluluk İtibarı",
            icon: Trophy,
            color: "text-amber-500",
            bg: "bg-amber-100 dark:bg-amber-900/30",
            border: "border-amber-500"
        },
        {
            label: "Takipçi",
            value: stats.followersCount,
            desc: "Takip Edilen",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            border: "border-blue-500"
        },
        {
            label: "Makaleler",
            value: stats.articlesCount,
            desc: "Yayınlanan İçerik",
            icon: FileText,
            color: "text-green-500",
            bg: "bg-green-100 dark:bg-green-900/30",
            border: "border-green-500"
        },
        {
            label: "Sorular",
            value: stats.questionsCount,
            desc: "Merak Edilenler",
            icon: HelpCircle,
            color: "text-purple-500",
            bg: "bg-purple-100 dark:bg-purple-900/30",
            border: "border-purple-500"
        }
    ];

    return (
        <div className="w-full bg-[#FAF9F6] dark:bg-[#09090b] border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                İstatistikler
                <div className="h-1 flex-1 bg-black dark:bg-white rounded-full opacity-20" />
            </h2>

            <div className="relative space-y-8 pl-2">
                {/* Timeline Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gray-200 dark:bg-zinc-800" />

                {items.map((item, index) => (
                    <div key={index} className="relative flex items-center gap-4 group">
                        {/* Icon Circle */}
                        <div className={cn(
                            "w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110",
                            item.bg,
                            item.border
                        )}>
                            <item.icon className={cn("w-6 h-6", item.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="text-2xl font-black tabular-nums tracking-tight">
                                {item.value}
                            </div>
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {item.label}
                            </div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {item.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
