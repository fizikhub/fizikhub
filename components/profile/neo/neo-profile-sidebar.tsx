"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Link as LinkIcon, Award, Zap, Users, BookOpen, MessageCircle, Info } from "lucide-react";
import Link from "next/link";

interface NeoProfileSidebarProps {
    profile: any;
    user: any;
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
    userBadges?: any[];
}

export function NeoProfileSidebar({ profile, user, stats, userBadges = [] }: NeoProfileSidebarProps) {

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('tr-TR', { notation: "compact", maximumFractionDigits: 1 }).format(num);
    };

    return (
        <div className="space-y-6 lg:sticky lg:top-32 transition-all duration-300 font-[family-name:var(--font-outfit)]">

            {/* === 1. STATS CARD === */}
            <div className="bg-white dark:bg-black border-[3px] border-black dark:border-white rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">

                <div className="p-4 border-b-[3px] border-black dark:border-white flex items-center justify-between bg-[#FACC15] text-black">
                    <h3 className="font-black flex items-center gap-2 text-xs tracking-widest uppercase">
                        <Zap className="w-4 h-4 text-black fill-black" />
                        İSTATİSTİKLER
                    </h3>
                </div>

                <div className="grid grid-cols-2 divide-x-[3px] divide-black dark:divide-white border-b-[3px] border-black dark:border-white">
                    {/* HUB PUAN Highlight */}
                    <Link
                        href="/yardim/puanlar"
                        className="col-span-2 p-6 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 override-p hover:bg-black/5 dark:hover:bg-white/5 transition-all relative group/sidebar-rep"
                    >
                        <span className="text-[10px] text-zinc-500 font-black tracking-widest mb-1 group-hover/sidebar-rep:text-[#4169E1] transition-colors uppercase">TOPLAM HUB PUAN</span>
                        <div className="relative">
                            <span className="text-5xl font-black text-black dark:text-white tracking-tighter italic z-10 relative">
                                {formatNumber(stats.reputation)}
                            </span>
                            <div className="absolute -bottom-1 left-0 w-full h-3 bg-[#4169E1]/20 -skew-x-12 z-0"></div>
                        </div>
                    </Link>

                    {[
                        { label: "Takipçi", value: stats.followersCount, icon: Users },
                        { label: "Takip", value: stats.followingCount, icon: Users },
                        { label: "Makale", value: stats.articlesCount, icon: BookOpen },
                        { label: "Cevap", value: stats.answersCount, icon: MessageCircle },
                    ].map((stat, i) => (
                        <div key={i} className={cn(
                            "p-4 flex flex-col items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-default",
                            i < 2 ? "border-b-[3px] border-black dark:border-white" : ""
                        )}>
                            <stat.icon className="w-5 h-5 text-black dark:text-white mb-2 group-hover:text-[#4169E1] transition-colors stroke-[2.5px]" />
                            <span className="text-xl font-black text-black dark:text-white tabular-nums">
                                {formatNumber(stat.value)}
                            </span>
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5 text-center">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* === 2. ABOUT CARD === */}
            <div className="bg-white dark:bg-black border-[3px] border-black dark:border-white rounded-xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                <h3 className="font-black text-black dark:text-white mb-4 flex items-center gap-2 text-xs tracking-widest uppercase border-b-2 border-black/10 dark:border-white/10 pb-2">
                    <div className="w-1.5 h-3.5 bg-[#4169E1] skew-x-[-12deg]" />
                    KÜNYE
                </h3>

                <div className="space-y-3">
                    <div className="flex flex-col gap-2.5 text-xs font-bold text-zinc-500">
                        <div className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white transition-all">
                            <Calendar className="w-4 h-4 text-black dark:text-white" />
                            <span>Katılım: <span className="text-black dark:text-white ml-1">{format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span></span>
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800 transition-all group shadow-none hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                                <LinkIcon className="w-4 h-4 text-black dark:text-white group-hover:text-[#4169E1] transition-colors" />
                                <span className="truncate text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* === 3. BADGES CARD === */}
            {userBadges && userBadges.length > 0 && (
                <div className="bg-white dark:bg-black border-[3px] border-black dark:border-white rounded-xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <h3 className="font-black text-black dark:text-white mb-4 flex items-center justify-between text-xs tracking-widest uppercase border-b-2 border-black/10 dark:border-white/10 pb-2">
                        <span className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#4169E1]" />
                            ROZETLER
                        </span>
                        <span className="text-[10px] bg-[#4169E1] text-white px-2 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {userBadges.length}
                        </span>
                    </h3>

                    <div className="grid grid-cols-4 gap-3">
                        {userBadges.map((badgeItem: any, i: number) => {
                            const badge = badgeItem.badges;
                            return (
                                <div key={i} className="group relative aspect-square">
                                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-lg flex items-center justify-center text-xl hover:border-[#4169E1] hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-help hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                                        {badge.icon || "🏆"}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[180px] bg-black text-white p-3 rounded-lg border-2 border-[#4169E1] shadow-[4px_4px_0px_0px_rgba(65,105,225,1)] opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50">
                                        <div className="font-black mb-1 text-[#4169E1] uppercase tracking-wider text-[10px] pb-1 border-b border-white/20">{badge.name}</div>
                                        <div className="text-zinc-300 text-[10px] leading-relaxed pt-1">{badge.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
