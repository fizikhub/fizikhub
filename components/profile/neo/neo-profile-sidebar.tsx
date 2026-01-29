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
        <div className="space-y-6 lg:sticky lg:top-24">

            {/* === 1. STATS CARD (HUD Style) === */}
            <div className="bg-black/50 backdrop-blur-md border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#FFC800]" />
                        İSTATİSTİKLER
                    </h3>
                    <div className="text-xs font-mono text-neutral-500">ID: {profile?.id?.slice(0, 6)}</div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-neutral-800">
                    {[
                        { label: "Puan", value: stats.reputation, icon: Zap, color: "text-amber-500" },
                        { label: "Takipçi", value: stats.followersCount, icon: Users, color: "text-cyan-500" },
                        { label: "Makale", value: stats.articlesCount, icon: BookOpen, color: "text-purple-500" },
                        { label: "Soru", value: stats.questionsCount, icon: HelpCircle, color: "text-red-500" },
                        { label: "Cevap", value: stats.answersCount, icon: MessageCircle, color: "text-green-500" },
                        { label: "Takip", value: stats.followingCount, icon: Users, color: "text-blue-500" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-black/80 p-4 flex flex-col items-center justify-center hover:bg-neutral-900 transition-colors group">
                            <stat.icon className={cn("w-5 h-5 mb-2 opacity-70 group-hover:opacity-100 transition-all", stat.color)} />
                            <span className="text-xl font-black text-white">{formatNumber(stat.value)}</span>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* === 2. ABOUT CARD === */}
            <div className="bg-black/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-cyan-500 rounded-full" />
                    HAKKINDA
                </h3>

                <div className="space-y-4">
                    {profile?.bio && (
                        <div className="text-sm text-neutral-300 leading-relaxed font-mono bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
                            {profile.bio}
                        </div>
                    )}

                    <div className="flex flex-col gap-2 text-xs text-neutral-500 font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Katılım: {format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span>
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[200px]">{profile.website}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* === 3. BADGES CARD === */}
            {userBadges && userBadges.length > 0 && (
                <div className="bg-black/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-500" />
                        ROZETLER
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {userBadges.map((badgeItem: any, i: number) => {
                            const badge = badgeItem.badges;
                            return (
                                <div key={i} className="group relative">
                                    <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 rounded-lg flex items-center justify-center text-xl hover:border-purple-500 hover:bg-purple-500/10 transition-all cursor-help">
                                        {badge.icon || "🏆"}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-black border border-neutral-700 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                        <div className="font-bold mb-1">{badge.name}</div>
                                        <div className="text-neutral-400 text-[10px]">{badge.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Simulating "Suggested" or other widgets if needed, keeping it clean for now */}
        </div>
    );
}
