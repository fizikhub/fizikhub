"use client";

import { Trophy, Users, FileText, MessageCircle, HelpCircle, Activity } from "lucide-react";
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
            desc: "İtibar Seviyesi",
            icon: Trophy,
            color: "text-[#FFC800]",
            border: "border-[#FFC800]",
            bg: "bg-[#FFC800]/20"
        },
        {
            label: "Takipçi",
            value: stats.followersCount,
            desc: "Takip Edenler",
            icon: Users,
            color: "text-blue-400",
            border: "border-blue-400",
            bg: "bg-blue-400/20"
        },
        {
            label: "Makaleler",
            value: stats.articlesCount,
            desc: "Yayınlanan",
            icon: FileText,
            color: "text-green-400",
            border: "border-green-400",
            bg: "bg-green-400/20"
        },
        {
            label: "Sorular",
            value: stats.questionsCount,
            desc: "Meraklar",
            icon: HelpCircle,
            color: "text-purple-400",
            border: "border-purple-400",
            bg: "bg-purple-400/20"
        }
    ];

    return (
        <div className="w-full bg-[#050505] border-[3px] border-white rounded-[1.5rem] shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] p-8 mb-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center text-black">
                    <Activity className="w-5 h-5 stroke-[3px]" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                    İSTATİSTİK
                </h2>
            </div>

            <div className="relative space-y-6 pl-2">
                {/* Connector Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-white/20" />

                {items.map((item, index) => (
                    <div key={index} className="relative flex items-center gap-5 group">
                        {/* Icon Circle */}
                        <div className={cn(
                            "w-14 h-14 rounded-full border-[3px] flex items-center justify-center shrink-0 z-10 bg-black transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                            item.border,
                            item.color
                        )}>
                            <item.icon className="w-6 h-6 stroke-[2.5px]" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 pr-4 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-baseline">
                                <div className="text-3xl font-black tabular-nums tracking-tighter text-white">
                                    {item.value}
                                </div>
                                <div className={cn("text-xs font-black uppercase tracking-wider opacity-80", item.color)}>
                                    {item.label}
                                </div>
                            </div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                {item.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
