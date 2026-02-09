"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Check, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "../follow-button";
import { formatNumber } from "@/lib/utils";

// True Royal Blue
const ROYAL_BLUE = "#1E3A5F";
const ROYAL_BLUE_LIGHT = "#2C5282";

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
            {/* COVER BANNER with overlapping stats */}
            <div className="relative h-40 sm:h-48 md:h-56 overflow-visible rounded-2xl border-2 border-white/10">
                {/* Deep royal blue gradient base */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0f1a2e] via-[#1E3A5F] to-[#0a1628]" />

                {/* Subtle accent glows */}
                <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#2C5282]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />

                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden opacity-40 rounded-2xl">
                    <span className="absolute top-6 left-8 text-yellow-400/60 text-base">✦</span>
                    <span className="absolute top-10 right-16 text-white/30 text-sm">✦</span>
                    <span className="absolute bottom-8 left-24 text-yellow-400/40 text-xs">✧</span>
                    <span className="absolute bottom-10 right-1/3 text-white/20 text-sm">★</span>
                    <div className="absolute top-8 right-12 w-4 h-4 border border-yellow-400/30 rotate-12" />
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* FOLLOWER/FOLLOWING BOXES - Overlapping bottom right */}
                <div className="absolute -bottom-6 right-4 sm:right-6 flex gap-2 z-20">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border-2 border-border/30 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm"
                    >
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Takipçi</p>
                        <h3 className="text-xl sm:text-2xl font-black text-foreground">{formatNumber(stats.followersCount)}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card border-2 border-border/30 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm"
                    >
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Takip</p>
                        <h3 className="text-xl sm:text-2xl font-black text-foreground">{formatNumber(stats.followingCount)}</h3>
                    </motion.div>
                </div>
            </div>

            {/* CONTENT CARD */}
            <div className="relative bg-background border-2 border-white/10 border-t-0 rounded-b-2xl pt-14 sm:pt-16 pb-5 px-4 sm:px-6">

                {/* FLOATING AVATAR */}
                <div className="absolute -top-12 sm:-top-14 left-4 sm:left-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-background rounded-xl border-2 border-white/20 shadow-[3px_3px_0_#1E3A5F] overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] text-white rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Verified badge */}
                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-1 rounded-md border border-black">
                            <ShieldCheck className="w-3 h-3" />
                        </div>
                    </motion.div>
                </div>

                {/* NAME & HANDLE */}
                <div className="flex flex-col gap-3 mb-4">
                    <div className="ml-28 sm:ml-32">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight">
                            {profile?.full_name || "New User"}
                        </h1>
                        <span className="inline-block mt-0.5 text-[10px] sm:text-xs font-bold bg-[#1E3A5F] text-white px-2 py-0.5 rounded">
                            @{profile?.username || "username"}
                        </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 mt-1">
                        {isOwnProfile ? (
                            <Link href="/profil/duzenle" className="flex-1 sm:flex-none">
                                <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-lg font-bold text-xs border-2 border-black shadow-[2px_2px_0_#1E3A5F] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Profili Düzenle
                                </button>
                            </Link>
                        ) : (
                            <FollowButton
                                targetUserId={profile.id}
                                initialIsFollowing={isFollowing}
                                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0_#1E3A5F]"
                            />
                        )}
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center p-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border/20 transition-all active:scale-95"
                        >
                            {isSharing ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* BIO */}
                {profile?.bio && (
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 border-l-2 border-[#1E3A5F] pl-3 py-0.5">
                        {profile.bio}
                    </p>
                )}

                {/* META INFO */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] sm:text-xs font-medium text-muted-foreground mb-4">
                    {profile?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-pink-400" />
                            <span className="truncate max-w-[100px]">{profile.location}</span>
                        </div>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#2C5282] transition-colors">
                            <LinkIcon className="w-3 h-3 text-[#2C5282]" />
                            <span className="truncate max-w-[120px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-yellow-500" />
                        {new Date(profile?.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}
                    </div>
                </div>

                {/* STATS - Hub Puan & Katkı */}
                <div className="grid grid-cols-2 gap-2">
                    {/* HUB POINTS */}
                    <div className="bg-[#1E3A5F] p-3 rounded-lg border border-white/10">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">Hub Puan</p>
                        <h3 className="text-xl sm:text-2xl font-black text-white">{formatNumber(stats.reputation)}</h3>
                    </div>

                    {/* CONTRIBUTIONS */}
                    <div className="bg-yellow-500 p-3 rounded-lg border border-black/10">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-black/60">Toplam Katkı</p>
                        <h3 className="text-xl sm:text-2xl font-black text-black">{stats.articlesCount + stats.questionsCount + stats.answersCount}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
