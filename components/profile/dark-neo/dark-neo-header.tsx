"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "../follow-button";
import { formatNumber } from "@/lib/utils";

// Royal Blue: #4169E1
const ROYAL_BLUE = "#4169E1";

interface DarkNeoHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
    isFollowing: boolean;
}

export function DarkNeoHeader({ profile, user, stats, isOwnProfile, isFollowing }: DarkNeoHeaderProps) {
    const [isSharing, setIsSharing] = useState(false);
    const initial = profile?.full_name?.[0]?.toUpperCase() || "U";

    const handleShare = async () => {
        setIsSharing(true);
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
        setTimeout(() => setIsSharing(false), 2000);
    };

    return (
        <div className="w-full">
            {/* COMPACT HEADER BANNER */}
            <div className="relative h-32 md:h-40 overflow-hidden rounded-2xl border-2 border-white/10">
                {/* Dark gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a15] via-[#0f0f20] to-[#050510]" />

                {/* Royal blue accent glow */}
                <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#4169E1]/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />

                {/* Decorative elements - Smaller & more subtle */}
                <div className="absolute inset-0 overflow-hidden">
                    <span className="absolute top-4 left-6 text-[#4169E1] text-lg">✦</span>
                    <span className="absolute top-8 right-12 text-cyan-400/60 text-sm">✦</span>
                    <span className="absolute bottom-6 left-16 text-yellow-400/50 text-xs">✧</span>
                    <span className="absolute bottom-8 right-1/4 text-yellow-300/60 text-sm">★</span>
                    <div className="absolute top-5 right-8 w-4 h-4 border border-yellow-400/40 rotate-12" />
                    <div className="absolute bottom-6 right-20 w-2 h-2 bg-pink-500/40 rounded-full" />
                </div>

                {/* Physics equations pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/equations-pattern.png')] bg-repeat" />
            </div>

            {/* COMPACT CONTENT CARD */}
            <div className="relative bg-[#0a0a0a] border-2 border-white/10 border-t-0 rounded-b-2xl pt-12 pb-4 px-4 md:px-6">

                {/* COMPACT FLOATING AVATAR */}
                <div className="absolute -top-10 left-4 md:left-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-20 h-20 bg-[#111] rounded-xl border-2 border-white/20 shadow-[3px_3px_0_#4169E1] overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-2xl font-black bg-gradient-to-br from-[#4169E1] to-cyan-500 text-white rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Verified badge - Smaller */}
                        <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-black p-1 rounded-md border border-black">
                            <ShieldCheck className="w-3 h-3" />
                        </div>
                    </motion.div>
                </div>

                {/* NAME & HANDLE - Compact */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div className="md:ml-24">
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                            {profile?.full_name || "New User"}
                        </h1>
                        <span className="inline-block mt-0.5 text-xs font-bold bg-[#4169E1] text-white px-2 py-0.5 rounded border border-white/20">
                            @{profile?.username || "username"}
                        </span>
                    </div>

                    {/* ACTION BUTTONS - Smaller */}
                    <div className="flex gap-2 md:ml-24 lg:ml-0">
                        {isOwnProfile ? (
                            <Link href="/profil/duzenle">
                                <button className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg font-bold text-xs border-2 border-black shadow-[2px_2px_0_#4169E1] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Düzenle
                                </button>
                            </Link>
                        ) : (
                            <FollowButton
                                targetUserId={profile.id}
                                initialIsFollowing={isFollowing}
                                className="px-4 py-2 text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0_#4169E1]"
                            />
                        )}
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/20 transition-all"
                        >
                            {isSharing ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* BIO - Compact */}
                {profile?.bio && (
                    <p className="text-zinc-400 text-xs leading-relaxed mb-3 max-w-xl border-l-2 border-[#4169E1] pl-3 py-0.5">
                        {profile.bio}
                    </p>
                )}

                {/* META INFO - Compact inline */}
                <div className="flex flex-wrap gap-3 text-xs font-medium text-zinc-500 mb-4">
                    {profile?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-pink-400" />
                            {profile.location}
                        </div>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#4169E1] transition-colors">
                            <LinkIcon className="w-3 h-3 text-[#4169E1]" />
                            {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-yellow-400" />
                        Katılım: {new Date(profile?.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}
                    </div>
                </div>

                {/* COMPACT STATS ROW - High contrast */}
                <div className="grid grid-cols-4 gap-2">
                    {/* HUB POINTS - Royal Blue */}
                    <div className="bg-[#4169E1] p-3 rounded-lg border-2 border-white/30 shadow-[3px_3px_0_#000]">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">Hub Puan</p>
                        <h3 className="text-xl font-black text-white">{formatNumber(stats.reputation)}</h3>
                    </div>

                    {/* FOLLOWERS - High contrast dark */}
                    <div className="bg-black p-3 rounded-lg border-2 border-white/20 hover:border-[#4169E1]/50 transition-colors">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Takipçi</p>
                        <h3 className="text-xl font-black text-white">{formatNumber(stats.followersCount)}</h3>
                    </div>

                    {/* FOLLOWING */}
                    <div className="bg-black p-3 rounded-lg border-2 border-white/20 hover:border-cyan-500/50 transition-colors">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Takip</p>
                        <h3 className="text-xl font-black text-white">{formatNumber(stats.followingCount)}</h3>
                    </div>

                    {/* CONTRIBUTIONS - Cyan accent */}
                    <div className="bg-cyan-600 p-3 rounded-lg border-2 border-white/30 shadow-[3px_3px_0_#000]">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">Katkı</p>
                        <h3 className="text-xl font-black text-white">{stats.articlesCount + stats.questionsCount + stats.answersCount}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
