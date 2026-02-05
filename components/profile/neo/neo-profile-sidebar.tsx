"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Link as LinkIcon, Award, Zap, Users, BookOpen, MessageCircle, Info } from "lucide-react";
import Link from "next/link";
import { haptics } from "@/lib/haptics";

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
            <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">

                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="font-black text-zinc-500 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase">
                        <Zap className="w-3.5 h-3.5 text-[#4169E1] fill-[#4169E1]" />
                        PERFORMANS VERİLERİ
                    </h3>
                </div>

                <div className="grid grid-cols-2 divide-x divide-white/5">
                    {/* HUB PUAN PRESTIGE CARD */}
                    <Link
                        href="/yardim/puanlar"
                        onClick={() => haptics.medium()}
                        className="col-span-2 p-10 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-950 hover:from-black hover:to-zinc-900 transition-all relative group/sidebar-rep border-b border-white/5"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover/sidebar-rep:translate-x-full transition-transform duration-1000"></div>

                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] mb-4 group-hover/sidebar-rep:text-[#4169E1] transition-colors">HUB PRESTİJ PUANI</span>
                        <div className="relative">
                            <span className="text-6xl font-black text-white tracking-tighter italic z-10 relative drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                {formatNumber(stats.reputation)}
                            </span>
                            <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#4169E1]/20 -skew-x-12 blur-xl z-0"></div>
                        </div>

                        <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full scale-100 group-hover/sidebar-rep:scale-110 transition-transform">
                            <Award className="w-3.5 h-3.5 text-[#4169E1]" />
                            <span className="text-[10px] text-white font-black uppercase tracking-widest">KIDEMLİ ÜYE</span>
                        </div>
                    </Link>

                    {[
                        { label: "Takipçi", value: stats.followersCount, icon: Users },
                        { label: "Takip", value: stats.followingCount, icon: Users },
                        { label: "Makale", value: stats.articlesCount, icon: BookOpen },
                        { label: "Cevap", value: stats.answersCount, icon: MessageCircle },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 flex flex-col items-center justify-center hover:bg-white/[0.02] transition-colors group cursor-default">
                            <stat.icon className="w-4 h-4 text-zinc-600 mb-2 group-hover:text-white transition-colors stroke-[2px]" />
                            <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                                {formatNumber(stat.value)}
                            </span>
                            <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1 text-center group-hover:text-zinc-400">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* === 2. ABOUT CARD === */}
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 shadow-2xl">
                <h3 className="font-black text-white mb-5 flex items-center gap-2 text-xs tracking-widest uppercase">
                    <div className="w-1.5 h-3.5 bg-[#4169E1] skew-x-[-12deg]" />
                    KÜNYE
                </h3>

                <div className="space-y-4">
                    <div className="flex flex-col gap-3 text-xs font-bold text-zinc-400">
                        <div className="flex items-center gap-3 p-3.5 bg-zinc-900/30 rounded-xl border border-white/5 hover:border-[#4169E1]/30 transition-all">
                            <Calendar className="w-4 h-4 text-zinc-600" />
                            <span>Katılım: <span className="text-white ml-1">{format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span></span>
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 bg-zinc-900/30 rounded-xl border border-white/5 hover:border-[#4169E1]/30 hover:bg-black transition-all group">
                                <LinkIcon className="w-4 h-4 text-zinc-600 group-hover:text-[#4169E1] transition-colors" />
                                <span className="truncate text-zinc-300 group-hover:text-white transition-colors">{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* === 3. BADGES CARD === */}
            {userBadges && userBadges.length > 0 && (
                <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 shadow-2xl">
                    <h3 className="font-black text-white mb-5 flex items-center justify-between text-xs tracking-widest uppercase">
                        <span className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#4169E1] fill-[#4169E1]/20" />
                            ROZETLER
                        </span>
                        <span className="text-[10px] bg-[#4169E1] text-white px-2 py-0.5 rounded border border-white/10">
                            {userBadges.length}
                        </span>
                    </h3>

                    <div className="grid grid-cols-4 gap-3">
                        {userBadges.map((badgeItem: any, i: number) => {
                            const badge = badgeItem.badges;
                            return (
                                <div key={i} className="group relative aspect-square">
                                    <div className="w-full h-full bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-center text-xl hover:border-[#4169E1]/50 hover:bg-black transition-all cursor-help hover:scale-105">
                                        {badge.icon || "🏆"}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[200px] bg-black border border-[#4169E1]/50 text-white p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50">
                                        <div className="font-black mb-1 text-[#4169E1] uppercase tracking-wider text-[11px] pb-1.5 border-b border-white/5">{badge.name}</div>
                                        <div className="text-zinc-400 text-[10px] leading-relaxed pt-1.5">{badge.description}</div>
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-[#4169E1]/50 rotate-45"></div>
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
