"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Link as LinkIcon, Award, Zap, Users, BookOpen, MessageCircle, HelpCircle, Terminal } from "lucide-react";

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
        <div className="space-y-6 lg:sticky lg:top-32 transition-all duration-300 font-mono">

            {/* === 1. STATS CARD (SYSTEM STATUS) === */}
            <div className="bg-black border-2 border-white rounded-none p-0">
                {/* Header */}
                <div className="bg-white text-black p-3 border-b-2 border-white flex items-center justify-between">
                    <h3 className="font-bold tracking-wider flex items-center gap-2 text-sm uppercase">
                        <Terminal className="w-4 h-4" />
                        SYS_STATS
                    </h3>
                    <div className="w-2 h-2 bg-black animate-pulse" />
                </div>

                {/* Score Big Display */}
                <div className="p-6 border-b border-white/20 flex flex-col items-center justify-center bg-zinc-900/50 relative overflow-hidden group">
                    <span className="text-[10px] text-zinc-500 absolute top-2 left-2 uppercase tracking-widest">REPUTATION_SCORE</span>
                    <span className="text-5xl font-black text-white tracking-tighter group-hover:text-[#FACC15] transition-colors">{formatNumber(stats.reputation)}</span>
                    <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 bg-white gap-px border-b border-white">
                    {[
                        { label: "FOLLOWERS", value: stats.followersCount, icon: Users },
                        { label: "FOLLOWING", value: stats.followingCount, icon: Users },
                        { label: "ARTICLES", value: stats.articlesCount, icon: BookOpen },
                        { label: "QUESTIONS", value: stats.questionsCount, icon: HelpCircle },
                        { label: "ANSWERS", value: stats.answersCount, icon: MessageCircle },
                        { label: "BADGES", value: userBadges?.length || 0, icon: Award },
                    ].map((stat, i) => (
                        <div key={i} className="bg-black p-4 flex flex-col items-start justify-center group hover:bg-white hover:text-black transition-colors h-24 relative">
                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-black/60 transition-colors">{stat.label}</span>
                            <span className="text-xl font-bold tabular-nums">{formatNumber(stat.value)}</span>
                            <stat.icon className="absolute bottom-2 right-2 w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="bg-black p-2 flex justify-between items-center text-[9px] text-zinc-500 font-mono uppercase tracking-widest px-3">
                    <span>ID::{profile?.id?.slice(0, 8)}</span>
                    <span className="text-green-500">● ACTIVE</span>
                </div>
            </div>

            {/* === 2. ABOUT CARD === */}
            <div className="bg-black border-2 border-white rounded-none">
                <div className="p-3 border-b-2 border-white bg-black">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#FACC15]" />
                        BIO_DATA
                    </h3>
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex flex-col gap-2 text-xs font-bold text-zinc-400">
                        <div className="flex items-center gap-3 p-2 border border-white/10 hover:border-white hover:text-white transition-colors bg-zinc-900/30">
                            <Calendar className="w-4 h-4" />
                            <span className="tracking-wide">JOINED: <span className="text-white">{format(new Date(user?.created_at || Date.now()), 'MMM yyyy').toUpperCase()}</span></span>
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 border border-white/10 hover:border-[#FACC15] hover:text-[#FACC15] transition-colors bg-zinc-900/30">
                                <LinkIcon className="w-4 h-4" />
                                <span className="truncate max-w-[200px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* === 3. BADGES CARD === */}
            {userBadges && userBadges.length > 0 && (
                <div className="bg-black border-2 border-white rounded-none p-4 relative">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-white/20 pb-2 flex justify-between">
                        <span>ACHIEVEMENTS</span>
                        <span className="bg-white text-black px-1 text-[10px]">{userBadges.length}</span>
                    </h3>

                    <div className="grid grid-cols-5 gap-1">
                        {userBadges.map((badgeItem: any, i: number) => {
                            const badge = badgeItem.badges;
                            return (
                                <div key={i} className="group relative aspect-square">
                                    <div className="w-full h-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xl hover:bg-[#FACC15] hover:text-black hover:border-white transition-colors cursor-help">
                                        {badge.icon || "★"}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[160px] bg-white border-2 border-black text-black text-xs p-2 shadow-[4px_4px_0px_#000] opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 hidden group-hover:block">
                                        <div className="font-black mb-1 uppercase text-[10px]">{badge.name}</div>
                                        <div className="text-[10px] leading-tight opacity-80">{badge.description}</div>
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
