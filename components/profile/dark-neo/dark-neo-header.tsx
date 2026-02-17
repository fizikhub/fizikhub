"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, ShieldCheck, MessageCircle, Settings, PenSquare } from "lucide-react";
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
    const initial = profile?.full_name?.[0]?.toUpperCase() || "U";
    const isAdmin = profile?.username === "baranbozkurt";
    const hasCoverPhoto = profile?.cover_url;

    return (
        <div className="w-full">
            {/* COVER BANNER - Elegant & Sharp */}
            <div className="relative h-44 sm:h-52 md:h-60 overflow-visible border-b border-zinc-800 bg-[#0a0a0a]">
                {/* Cover photo or pattern */}
                {hasCoverPhoto ? (
                    <img
                        src={profile.cover_url}
                        alt="Kapak fotoğrafı"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                ) : (
                    <>
                        {/* Elegant Tech Background */}
                        <div className="absolute inset-0 bg-[#050505] pattern-grid-lg opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />

                        {/* Minimalist Accents */}
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <div className="w-64 h-64 border border-white/20 rounded-full" />
                            <div className="w-48 h-48 border border-white/20 rounded-full absolute top-8 right-8" />
                        </div>
                    </>
                )}

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/90" />

                {/* FOLLOWER/FOLLOWING - Clean & Minimal */}
                <div className="absolute -bottom-6 right-4 sm:right-6 flex gap-3 z-20">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/95 backdrop-blur-sm border border-zinc-200 min-w-[72px] py-2 px-3 shadow-sm rounded-lg text-center group hover:-translate-y-0.5 transition-all cursor-default"
                    >
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-0.5">Takipçi</p>
                        <h3 className="text-lg font-bold text-zinc-900 leading-none">{formatNumber(stats.followersCount)}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 min-w-[72px] py-2 px-3 shadow-sm rounded-lg text-center group hover:-translate-y-0.5 transition-all cursor-default"
                    >
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">Takip</p>
                        <h3 className="text-lg font-bold text-white leading-none">{formatNumber(stats.followingCount)}</h3>
                    </motion.div>
                </div>
            </div>

            {/* INFO SECTION - Refined Spacing */}
            <div className="relative bg-[#0a0a0a] pt-16 sm:pt-20 pb-2 px-4 sm:px-6">

                {/* FLOATING AVATAR - Elegant Rounded Square */}
                <div className="absolute -top-12 left-4 sm:left-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                    >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#0a0a0a] border-4 border-[#0a0a0a] rounded-2xl shadow-xl overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-3xl font-bold bg-zinc-100 text-zinc-900 rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Verified badge - Clean */}
                        <div className="absolute -bottom-1 -right-1 bg-[#FF6B00] text-white p-1 rounded-full border-2 border-[#0a0a0a] shadow-md">
                            <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                    </motion.div>
                </div>

                {/* NAME & HANDLE */}
                <div className="mb-5">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-1">
                        {profile?.full_name || "New User"}
                    </h1>
                    <span className="inline-block text-xs font-semibold bg-zinc-900 text-zinc-300 px-2.5 py-0.5 rounded-md border border-zinc-800">
                        @{profile?.username || "username"}
                    </span>
                </div>

                {/* BIO - Elegant Typography */}
                {profile?.bio && (
                    <div className="mb-6 max-w-2xl">
                        <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                            {profile.bio}
                        </p>
                    </div>
                )}

                {/* META INFO - Subtle */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-zinc-500 mb-8 border-b border-zinc-900 pb-6">
                    {profile?.location && (
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                            <span>{profile.location}</span>
                        </div>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors group">
                            <LinkIcon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                            <span className="truncate max-w-[150px] decoration-zinc-700 underline-offset-4 group-hover:underline">{profile.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Katıldı: {new Date(profile?.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>

                {/* ACTION BUTTONS & HUB SCORE */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2.5 flex-wrap">
                        {isOwnProfile ? (
                            <>
                                <Link href="/profil/duzenle">
                                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 font-bold text-xs rounded-lg border border-transparent shadow-sm hover:bg-zinc-200 transition-all active:scale-95">
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Düzenle
                                    </button>
                                </Link>
                                <Link href="/mesajlar">
                                    <button className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 font-bold text-xs rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-95">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Mesajlar
                                    </button>
                                </Link>
                                {profile?.is_writer && (
                                    <Link href="/yazar/yeni">
                                        <button className="flex items-center gap-2 bg-amber-400 text-black px-4 py-2 font-bold text-xs rounded-lg border border-transparent shadow-sm hover:bg-amber-300 transition-all active:scale-95">
                                            <PenSquare className="w-3.5 h-3.5" />
                                            Yaz
                                        </button>
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link href="/admin">
                                        <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 font-bold text-xs rounded-lg border border-transparent hover:bg-rose-500 transition-all active:scale-95">
                                            <Settings className="w-3.5 h-3.5" />
                                            Admin
                                        </button>
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <FollowButton
                                    targetUserId={profile.id}
                                    initialIsFollowing={isFollowing}
                                    className="px-5 py-2 text-xs font-bold rounded-lg shadow-sm border border-transparent transition-all active:scale-95"
                                />
                                <Link href={`/mesajlar?to=${profile.id}`}>
                                    <button className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 font-bold text-xs rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors active:scale-95">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Mesaj
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* HUB SCORE - Refined Badge */}
                    <div className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-800/50 rounded-full px-3 py-1.5">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Hub Puan</span>
                        <span className="text-sm font-bold text-white">{formatNumber(stats.reputation)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
