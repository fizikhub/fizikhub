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
        <div className="space-y-6 lg:sticky lg:top-32 transition-all duration-300">

            {/* === 1. STATS CARD (NEO BRUTALIST) === */}
            <div className="bg-[#09090b] border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_#000]">

                <div className="p-4 border-b-2 border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <h3 className="font-black text-white flex items-center gap-2 text-sm tracking-wider uppercase font-[family-name:var(--font-outfit)]">
                        <Zap className="w-5 h-5 text-black fill-[#4169E1]" />
                        İSTATİSTİKLER
                    </h3>
                </div>

                <div className="grid grid-cols-2 divide-x-2 divide-zinc-800 border-b-2 border-zinc-800">
                    {/* HUB PUAN Highlight */}
                    <Link
                        href="/yardim/puanlar"
                        className="col-span-2 p-6 flex flex-col items-center justify-center bg-black hover:bg-zinc-900/30 transition-colors relative group/sidebar-rep"
                    >
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1 group-hover/sidebar-rep:text-[#4169E1]">TOPLAM HUB PUAN</span>
                        <div className="relative">
                            <span className="text-5xl font-black text-white tracking-tighter italic z-10 relative">
                                {formatNumber(stats.reputation)}
                            </span>
                            <div className="absolute -bottom-1 left-0 w-full h-3 bg-[#4169E1]/20 -skew-x-12 z-0"></div>
                        </div>

                        {/* Tooltip for Sidebar */}
                        <div className="absolute top-0 right-4 translate-y-2 opacity-0 group-hover/sidebar-rep:opacity-100 transition-all pointer-events-none">
                            <Info className="w-4 h-4 text-[#4169E1]" />
                        </div>
                    </Link>

                    {[
                        { label: "Takipçi", value: stats.followersCount, icon: Users },
                        { label: "Takip", value: stats.followingCount, icon: Users },
                        { label: "Makale", value: stats.articlesCount, icon: BookOpen },
                        { label: "Cevap", value: stats.answersCount, icon: MessageCircle },
                    ].map((stat, i) => (
                        <div key={i} className="p-4 flex flex-col items-center justify-center hover:bg-zinc-900 transition-colors group cursor-default">
                            <stat.icon className="w-5 h-5 text-zinc-600 mb-2 group-hover:text-[#4169E1] transition-colors stroke-[2.5px]" />
                            <span className="text-xl font-black text-white tabular-nums">
                                {formatNumber(stat.value)}
                            </span>
                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wide mt-1 group-hover:text-zinc-400 text-center">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* === 2. ABOUT CARD === */}
            <div className="bg-[#09090b] border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_#000]">
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm tracking-widest uppercase font-[family-name:var(--font-outfit)]">
                    <div className="w-1.5 h-4 bg-[#4169E1] skew-x-[-12deg]" />
                    KÜNYE
                </h3>

                <div className="space-y-4">
                    <div className="flex flex-col gap-3 text-xs font-bold text-zinc-400">
                        <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border-2 border-zinc-800 hover:border-[#4169E1] transition-colors group">
                            <Calendar className="w-4 h-4 text-zinc-500 group-hover:text-[#4169E1] transition-colors" />
                            <span>Katılım: <span className="text-white ml-1">{format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span></span>
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border-2 border-zinc-800 hover:border-[#4169E1] hover:bg-black transition-all group active:translate-y-0.5">
                                <LinkIcon className="w-4 h-4 text-zinc-500 group-hover:text-[#4169E1] transition-colors" />
                                <span className="truncate max-w-[200px] text-zinc-300 group-hover:text-white group-hover:underline decoration-[#4169E1] decoration-2 underline-offset-2">{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* === 3. BADGES CARD === */}
            {userBadges && userBadges.length > 0 && (
                <div className="bg-[#09090b] border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_#000]">
                    <h3 className="font-black text-white mb-4 flex items-center justify-between text-sm tracking-wide font-[family-name:var(--font-outfit)]">
                        <span className="flex items-center gap-2 uppercase tracking-widest">
                            <Award className="w-5 h-5 text-black fill-[#4169E1]" />
                            ROZETLER
                        </span>
                        <span className="text-[10px] bg-[#4169E1] text-white font-black px-2 py-0.5 rounded border border-black shadow-[2px_2px_0px_#000]">
                            {userBadges.length}
                        </span>
                    </h3>

                    <div className="grid grid-cols-5 gap-2">
                        {userBadges.map((badgeItem: any, i: number) => {
                            const badge = badgeItem.badges;
                            return (
                                <div key={i} className="group relative aspect-square">
                                    <div className="w-full h-full bg-zinc-900 border-2 border-zinc-800 rounded-lg flex items-center justify-center text-xl text-zinc-400 hover:text-[#4169E1] hover:border-[#4169E1] hover:bg-black transition-all cursor-help shadow-sm hover:shadow-[3px_3px_0px_#4169E1] hover:-translate-y-1">
                                        {badge.icon || "🏆"}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[180px] bg-black border-2 border-[#4169E1] text-white text-xs p-3 rounded-none shadow-[4px_4px_0px_#000] opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 translate-y-2 group-hover:translate-y-0">
                                        <div className="font-black mb-1 text-[#4169E1] uppercase tracking-wide text-[11px] border-b border-zinc-800 pb-1">{badge.name}</div>
                                        <div className="text-zinc-300 text-[11px] leading-tight font-medium pt-1">{badge.description}</div>
                                        {/* Little Triangle */}
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-r-2 border-b-2 border-[#4169E1] rotate-45 transform"></div>
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
