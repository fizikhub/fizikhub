"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Link as LinkIcon, Award, Zap, Users, BookOpen, MessageCircle, HelpCircle } from "lucide-react";

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

            {/* === 1. STATS CARD (MATTE PREMIUM) === */}
            <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">

                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm tracking-wide">
                        <Zap className="w-4 h-4 text-[#FACC15]" />
                        GENEL BAKIŞ
                    </h3>
                </div>

                <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5">
                    {/* Primary Highlight */}
                    <div className="col-span-2 p-6 flex flex-col items-center justify-center bg-white/[0.02]">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Toplam İtibar</span>
                        <span className="text-4xl font-bold text-white tracking-tight">{formatNumber(stats.reputation)}</span>
                    </div>

                    {[
                        { label: "Takipçi", value: stats.followersCount, icon: Users },
                        { label: "Takip", value: stats.followingCount, icon: Users },
                        { label: "Makale", value: stats.articlesCount, icon: BookOpen },
                        { label: "Cevap", value: stats.answersCount, icon: MessageCircle },
                    ].map((stat, i) => (
                        <div key={i} className="p-4 flex flex-col items-center justify-center hover:bg-white/[0.02] transition-colors group">
                            <stat.icon className="w-4 h-4 text-zinc-600 mb-2 group-hover:text-white transition-colors" />
                            <span className="text-xl font-bold text-zinc-200 tabular-nums">{formatNumber(stat.value)}</span>
                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wide mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* === 2. ABOUT CARD === */}
            <div className="bg-[#050505] border border-white/10 rounded-xl p-5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm tracking-wide">
                    <div className="w-1 h-4 bg-zinc-700 rounded-full" />
                    KİMLİK
                </h3>

                <div className="space-y-4">
                    <div className="flex flex-col gap-3 text-xs font-medium text-zinc-400">
                        <div className="flex items-center gap-3 p-2.5 bg-white/[0.03] rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            <span>Katılım: <span className="text-zinc-300">{format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span></span>
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 bg-white/[0.03] rounded-lg border border-white/5 hover:border-white/10 hover:text-white transition-colors group">
                                <LinkIcon className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                                <span className="truncate max-w-[200px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* === 3. BADGES CARD === */}
            {userBadges && userBadges.length > 0 && (
                <div className="bg-[#050505] border border-white/10 rounded-xl p-5">
                    <h3 className="font-bold text-white mb-4 flex items-center justify-between text-sm tracking-wide">
                        <span className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#FACC15]" />
                            ROZETLER
                        </span>
                        <span className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full border border-white/5">
                            {userBadges.length}
                        </span>
                    </h3>

                    <div className="grid grid-cols-5 gap-2">
                        {userBadges.map((badgeItem: any, i: number) => {
                            const badge = badgeItem.badges;
                            return (
                                <div key={i} className="group relative aspect-square">
                                    <div className="w-full h-full bg-white/[0.03] border border-white/5 rounded-lg flex items-center justify-center text-xl text-zinc-400 hover:text-[#FACC15] hover:border-[#FACC15]/30 hover:bg-[#FACC15]/5 transition-all cursor-help">
                                        {badge.icon || "🏆"}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[160px] bg-zinc-900 border border-white/10 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 translate-y-2 group-hover:translate-y-0">
                                        <div className="font-bold mb-1 text-[#FACC15] uppercase tracking-wide text-[10px]">{badge.name}</div>
                                        <div className="text-zinc-400 text-[11px] leading-tight">{badge.description}</div>
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
