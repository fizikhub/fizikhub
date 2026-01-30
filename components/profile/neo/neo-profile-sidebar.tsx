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

            {/* === 1. STATS CARD (HUD Style) === */}
            <div className="bg-black border-[3px] border-neutral-800 rounded-xl overflow-hidden shadow-[4px_4px_0px_#000] group hover:border-[#FFC800] transition-colors relative">
                {/* Decoration Lines */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-[3px] border-r-[3px] border-white/10 rounded-tr-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[3px] border-l-[3px] border-white/10 rounded-bl-xl pointer-events-none" />

                <div className="p-4 border-b-[3px] border-neutral-800 bg-neutral-900/50 flex items-center justify-between group-hover:border-[#FFC800] transition-colors">
                    <h3 className="font-black text-white flex items-center gap-2 tracking-wider">
                        <Zap className="w-5 h-5 text-[#FFC800]" />
                        İSTATİSTİKLER
                    </h3>
                    <div className="text-[10px] font-mono text-neutral-500 bg-black px-2 py-1 rounded border border-neutral-800">
                        UID: {profile?.id?.slice(0, 6)}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-[2px] bg-neutral-800 border-b-[2px] border-neutral-800">
                    {[
                        { label: "Puan", value: stats.reputation, icon: Zap, color: "text-[#FFC800]", bg: "hover:bg-[#FFC800]/10" },
                        { label: "Takipçi", value: stats.followersCount, icon: Users, color: "text-cyan-400", bg: "hover:bg-cyan-400/10" },
                        { label: "Makale", value: stats.articlesCount, icon: BookOpen, color: "text-purple-400", bg: "hover:bg-purple-400/10" },
                        { label: "Soru", value: stats.questionsCount, icon: HelpCircle, color: "text-red-400", bg: "hover:bg-red-400/10" },
                        { label: "Cevap", value: stats.answersCount, icon: MessageCircle, color: "text-green-400", bg: "hover:bg-green-400/10" },
                        { label: "Takip", value: stats.followingCount, icon: Users, color: "text-blue-400", bg: "hover:bg-blue-400/10" },
                    ].map((stat, i) => (
                        <div key={i} className={cn("bg-black p-4 flex flex-col items-center justify-center transition-all group/stat relative overflow-hidden", stat.bg)}>
                            <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                            <stat.icon className={cn("w-5 h-5 mb-2 opacity-50 group-hover/stat:opacity-100 group-hover/stat:scale-110 transition-all", stat.color)} />
                            <span className="text-2xl font-black text-white tabular-nums tracking-tight">{formatNumber(stat.value)}</span>
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mt-1 group-hover/stat:text-white transition-colors">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Footer Deco */}
                <div className="bg-black p-2 flex justify-between items-center text-[9px] text-neutral-600 font-mono uppercase tracking-widest px-4">
                    <span>SYS_READY</span>
                    <span className="animate-pulse text-green-500">● ONLINE</span>
                </div>
            </div>

            {/* === 2. ABOUT CARD === */}
            <div className="bg-black border-[3px] border-neutral-800 rounded-xl p-6 shadow-[4px_4px_0px_#000]">
                <h3 className="font-black text-white mb-5 flex items-center gap-3 text-lg">
                    <div className="w-1.5 h-6 bg-cyan-500 skew-x-[-12deg]" />
                    HAKKINDA
                </h3>

                <div className="space-y-5">
                    {profile?.bio && (
                        <div className="text-sm text-neutral-300 leading-relaxed font-mono bg-neutral-900 border-l-[3px] border-neutral-700 p-4 rounded-r-lg">
                            {profile.bio}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 text-xs font-bold text-neutral-400 font-mono">
                        <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors">
                            <Calendar className="w-4 h-4 text-cyan-500" />
                            <span className="tracking-wide">Katılım: <span className="text-white">{format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span></span>
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors group">
                                <LinkIcon className="w-4 h-4 text-purple-500 group-hover:rotate-45 transition-transform" />
                                <span className="truncate max-w-[200px] text-purple-400 group-hover:underline decoration-purple-500/50 underline-offset-4">{profile.website}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* === 3. BADGES CARD === */}
            {userBadges && userBadges.length > 0 && (
                <div className="bg-black border-[3px] border-neutral-800 rounded-xl p-6 shadow-[4px_4px_0px_#000]">
                    <h3 className="font-black text-white mb-5 flex items-center gap-3 text-lg">
                        <Award className="w-6 h-6 text-purple-500" />
                        ROZETLER
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded ml-auto border border-purple-500/30">
                            {userBadges.length}
                        </span>
                    </h3>

                    <div className="grid grid-cols-5 gap-2">
                        {userBadges.map((badgeItem: any, i: number) => {
                            const badge = badgeItem.badges;
                            return (
                                <div key={i} className="group relative aspect-square">
                                    <div className="w-full h-full bg-neutral-900 border border-neutral-700 rounded-lg flex items-center justify-center text-2xl hover:border-purple-500 hover:bg-purple-500/10 hover:scale-105 transition-all cursor-help hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                                        {badge.icon || "🏆"}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[180px] bg-black border-[2px] border-purple-500 text-white text-xs p-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(168,85,247,0.3)] opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 translate-y-2 group-hover:translate-y-0">
                                        <div className="font-bold mb-1 text-purple-400 uppercase tracking-widest text-[10px]">{badge.name}</div>
                                        <div className="text-white/80 text-[11px] leading-tight">{badge.description}</div>
                                        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-b-[2px] border-r-[2px] border-purple-500 rotate-45"></div>
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
