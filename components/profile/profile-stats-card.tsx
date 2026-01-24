"use client";

import { Trophy, Users, FileText, HelpCircle } from "lucide-react";
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
            icon: Trophy,
            bg: "bg-amber-100",
            text: "text-amber-700"
        },
        {
            label: "Takipçi",
            value: stats.followersCount,
            icon: Users,
            bg: "bg-blue-100",
            text: "text-blue-700"
        },
        {
            label: "Makaleler",
            value: stats.articlesCount,
            icon: FileText,
            bg: "bg-green-100",
            text: "text-green-700"
        },
        {
            label: "Sorular",
            value: stats.questionsCount,
            icon: HelpCircle,
            bg: "bg-purple-100",
            text: "text-purple-700"
        }
    ];

    return (
        <div className="w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] p-6 mb-6">
            <h2 className="text-lg font-black uppercase tracking-tight mb-5 text-black">
                Özet
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col items-start p-3 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-black transition-colors group">
                        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center mb-2", item.bg, item.text)}>
                            <item.icon className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-black tabular-nums text-black leading-none mb-1">
                            {item.value}
                        </div>
                        <div className="text-xs font-bold text-zinc-500 uppercase">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
