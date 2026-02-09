"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "../follow-button";
import { formatNumber } from "@/lib/utils";

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
            {/* HEADER BANNER - Dark with colorful gradient overlay */}
            <div className="relative h-44 md:h-56 overflow-hidden rounded-t-3xl border-[3px] border-zinc-800">
                {/* Dark gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />

                {/* Colorful accent glow */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
                <div className="absolute top-10 right-20 w-32 h-32 bg-yellow-500/15 rounded-full blur-2xl" />

                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden opacity-60">
                    <span className="absolute top-6 left-8 text-yellow-400 text-2xl">✦</span>
                    <span className="absolute top-12 right-16 text-purple-400 text-xl">✦</span>
                    <span className="absolute bottom-8 left-20 text-cyan-400 text-lg">✧</span>
                    <span className="absolute top-8 left-1/3 text-pink-400 text-sm">✧</span>
                    <span className="absolute bottom-12 right-1/3 text-yellow-300 text-xl">★</span>
                    <div className="absolute top-6 right-10 w-6 h-6 border-2 border-yellow-400/50 rotate-12" />
                    <div className="absolute bottom-10 right-24 w-4 h-4 bg-pink-500/50 rounded-full" />
                    <div className="absolute top-16 left-12 w-3 h-3 bg-cyan-500/50 rotate-45" />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* CONTENT CARD - Dark with borders */}
            <div className="relative bg-zinc-900 border-[3px] border-t-0 border-zinc-800 rounded-b-3xl pt-16 pb-6 px-5 md:px-8">

                {/* FLOATING AVATAR */}
                <div className="absolute -top-14 left-6 md:left-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-28 h-28 md:w-32 md:h-32 bg-zinc-800 rounded-2xl border-[3px] border-zinc-700 shadow-[4px_4px_0_rgba(250,204,21,0.5)] overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-4xl font-black bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Verified badge */}
                        <div className="absolute -bottom-2 -right-2 bg-cyan-500 text-black p-1.5 rounded-lg border-2 border-zinc-800">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </motion.div>
                </div>

                {/* NAME & HANDLE */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                    <div className="md:ml-36 lg:ml-40">
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            {profile?.full_name || "New User"}
                        </h1>
                        <span className="inline-block mt-1 text-sm font-bold bg-yellow-400 text-black px-2 py-0.5 border-2 border-black transform -skew-x-6">
                            @{profile?.username || "username"}
                        </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3">
                        {isOwnProfile ? (
                            <Link href="/profil/duzenle">
                                <button className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-black px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-black shadow-[3px_3px_0_#FACC15] hover:shadow-[1px_1px_0_#FACC15] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                    <Edit3 className="w-4 h-4" />
                                    Düzenle
                                </button>
                            </Link>
                        ) : (
                            <FollowButton
                                targetUserId={profile.id}
                                initialIsFollowing={isFollowing}
                                className="px-6 py-2.5 text-sm font-bold rounded-xl border-2 border-black shadow-[3px_3px_0_#4169E1]"
                            />
                        )}
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border-2 border-zinc-600 shadow-[3px_3px_0_rgba(255,255,255,0.1)] transition-all"
                        >
                            {isSharing ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* BIO */}
                {profile?.bio && (
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl border-l-4 border-purple-500 pl-4 py-1">
                        {profile.bio}
                    </p>
                )}

                {/* META INFO */}
                <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-500 mb-8">
                    {profile?.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-pink-400" />
                            {profile.location}
                        </div>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                            <LinkIcon className="w-4 h-4 text-cyan-400" />
                            {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        Katılım: {new Date(profile?.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                    </div>
                </div>

                {/* STATS GRID - Colorful cards on dark */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* HUB POINTS */}
                    <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-xl border-2 border-purple-500 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Hub Puan</p>
                        <h3 className="text-3xl font-black text-white">{formatNumber(stats.reputation)}</h3>
                    </div>

                    {/* FOLLOWERS */}
                    <div className="bg-zinc-800 p-4 rounded-xl border-2 border-zinc-700 shadow-[4px_4px_0_rgba(250,204,21,0.2)] hover:border-yellow-500/50 transition-colors">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Takipçi</p>
                        <h3 className="text-2xl font-black text-white">{formatNumber(stats.followersCount)}</h3>
                    </div>

                    {/* FOLLOWING */}
                    <div className="bg-zinc-800 p-4 rounded-xl border-2 border-zinc-700 shadow-[4px_4px_0_rgba(236,72,153,0.2)] hover:border-pink-500/50 transition-colors">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Takip</p>
                        <h3 className="text-2xl font-black text-white">{formatNumber(stats.followingCount)}</h3>
                    </div>

                    {/* CONTRIBUTIONS */}
                    <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 p-4 rounded-xl border-2 border-cyan-500 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-200 mb-1">Katkı</p>
                        <h3 className="text-2xl font-black text-white">{stats.articlesCount + stats.questionsCount + stats.answersCount}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
