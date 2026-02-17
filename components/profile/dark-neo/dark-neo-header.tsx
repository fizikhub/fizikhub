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
            {/* COVER BANNER - Deep Lighter Dark & Neo Touches */}
            <div className="relative h-44 sm:h-52 md:h-60 overflow-visible border-b border-zinc-800 bg-[#121212]">
                {/* Cover photo or pattern */}
                {hasCoverPhoto ? (
                    <img
                        src={profile.cover_url}
                        alt="Kapak fotoğrafı"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                ) : (
                    <>
                        {/* Premium Dark Texture */}
                        <div className="absolute inset-0 bg-[#0f0f0f] pattern-grid-lg opacity-40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-95" />

                        {/* Neo Accents - Subtle Geometry */}
                        <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none">
                            <div className="w-64 h-64 border border-white/20 rounded-full" />
                            <div className="w-48 h-48 border border-white/20 rounded-full absolute top-8 right-8" />
                            <div className="absolute top-12 right-12 text-white/10 text-9xl font-black rotate-12 select-none">F</div>
                        </div>
                    </>
                )}

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#121212]" />

                {/* FOLLOWER/FOLLOWING - Floating Cards with Inner Glow */}
                <div className="absolute -bottom-6 right-4 sm:right-6 flex gap-3 z-20">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-100/90 backdrop-blur-md border border-white/50 min-w-[72px] py-2 px-3 shadow-lg rounded-xl text-center group hover:-translate-y-1 hover:shadow-xl transition-all cursor-default relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-0.5 relative z-10">Takipçi</p>
                        <h3 className="text-xl font-black text-zinc-900 leading-none relative z-10">{formatNumber(stats.followersCount)}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700 min-w-[72px] py-2 px-3 shadow-lg rounded-xl text-center group hover:-translate-y-1 hover:shadow-xl hover:border-zinc-500 transition-all cursor-default relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5 relative z-10">Takip</p>
                        <h3 className="text-xl font-black text-white leading-none relative z-10">{formatNumber(stats.followingCount)}</h3>
                    </motion.div>
                </div>
            </div>

            {/* INFO SECTION - Lighter Background #121212 */}
            <div className="relative bg-[#121212] pt-16 sm:pt-20 pb-4 px-4 sm:px-6">

                {/* FLOATING AVATAR - "Squircle" with Inner Ring */}
                <div className="absolute -top-12 left-4 sm:left-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                    >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#121212] p-1 rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
                            <Avatar className="w-full h-full rounded-xl border border-white/10">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-3xl font-bold bg-zinc-800 text-zinc-200 rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Verified badge - Neon Pop */}
                        <div className="absolute -bottom-1 -right-1 bg-[#FF6B00] text-white p-1 rounded-full border-[3px] border-[#121212] shadow-lg">
                            <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                    </motion.div>
                </div>

                {/* NAME & HANDLE */}
                <div className="mb-5">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-1 drop-shadow-sm">
                        {profile?.full_name || "New User"}
                    </h1>
                    <span className="inline-block text-[11px] font-bold bg-zinc-800/50 text-zinc-400 px-2.5 py-0.5 rounded-full border border-zinc-700/50 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer">
                        @{profile?.username || "username"}
                    </span>
                </div>

                {/* BIO - Clean Serifs */}
                {profile?.bio && (
                    <div className="mb-6 max-w-2xl">
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                            {profile.bio}
                        </p>
                    </div>
                )}

                {/* META INFO - Subtle & Clean */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-zinc-500 mb-8 border-b border-zinc-800/50 pb-6">
                    {profile?.location && (
                        <div className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-300 transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                            <span>{profile.location}</span>
                        </div>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors group">
                            <LinkIcon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 decoration-zinc-800 underline-offset-4 group-hover:underline" />
                            <span className="truncate max-w-[150px]">{profile.website.replace(/^https?:\/\//, '')}</span>
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
                                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 font-bold text-xs rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 hover:bg-zinc-50">
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Düzenle
                                    </button>
                                </Link>
                                <Link href="/mesajlar">
                                    <button className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 font-bold text-xs rounded-xl border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Mesajlar
                                    </button>
                                </Link>
                                {profile?.is_writer && (
                                    <Link href="/yazar/yeni">
                                        <button className="flex items-center gap-2 bg-amber-400 text-black px-4 py-2 font-bold text-xs rounded-xl border border-amber-300 shadow-sm hover:shadow-md hover:bg-amber-300 hover:-translate-y-0.5 transition-all active:scale-95">
                                            <PenSquare className="w-3.5 h-3.5" />
                                            Yaz
                                        </button>
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link href="/admin">
                                        <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 font-bold text-xs rounded-xl border border-rose-500 shadow-sm hover:bg-rose-500 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95">
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
                                    className="px-5 py-2 text-xs font-bold rounded-xl shadow-sm border border-transparent transition-all active:scale-95 hover:shadow-md hover:-translate-y-0.5"
                                />
                                <Link href={`/mesajlar?to=${profile.id}`}>
                                    <button className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 font-bold text-xs rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-all active:scale-95 hover:shadow-md hover:-translate-y-0.5">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Mesaj
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* HUB SCORE - Glassy Pill */}
                    <div className="flex items-center gap-2 bg-zinc-800/40 border border-zinc-700/50 rounded-full px-4 py-1.5 backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Hub Puan</span>
                        <span className="text-sm font-black text-white tracking-tight">{formatNumber(stats.reputation)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
