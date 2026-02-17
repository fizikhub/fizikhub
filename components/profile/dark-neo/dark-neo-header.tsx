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
            {/* COVER BANNER - High Contrast & No Blur */}
            <div className="relative h-44 sm:h-52 md:h-60 overflow-visible border-2 border-black border-b-0 bg-[#0a0a0a]">
                {/* Cover photo or solid pattern */}
                {hasCoverPhoto ? (
                    <img
                        src={profile.cover_url}
                        alt="Kapak fotoğrafı"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <>
                        {/* Solid Tech Background */}
                        <div className="absolute inset-0 bg-[#111] pattern-grid-lg opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                        {/* Elegant Geometric Accents */}
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <div className="w-32 h-32 border-2 border-white rounded-full" />
                            <div className="w-32 h-32 border-2 border-white rounded-full absolute top-4 right-4" />
                        </div>
                    </>
                )}

                {/* Dark overlay for text readability if cover exists */}
                {hasCoverPhoto && (
                    <div className="absolute inset-0 bg-black/40" />
                )}

                {/* FOLLOWER/FOLLOWING - Sharp & Solid */}
                <div className="absolute -bottom-6 right-4 sm:right-6 flex gap-3 z-20">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border-2 border-black min-w-[80px] py-2 px-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default"
                    >
                        <p className="text-[9px] font-black uppercase tracking-widest text-black/60 mb-0.5">Takipçi</p>
                        <h3 className="text-xl font-black text-black leading-none">{formatNumber(stats.followersCount)}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-black border-2 border-black min-w-[80px] py-2 px-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] text-center group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all cursor-default"
                    >
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">Takip</p>
                        <h3 className="text-xl font-black text-white leading-none">{formatNumber(stats.followingCount)}</h3>
                    </motion.div>
                </div>
            </div>

            {/* INFO SECTION - Sharp Borders */}
            <div className="relative bg-[#0a0a0a] border-2 border-black border-t-0 p-4 sm:px-6 pt-16 sm:pt-20 pb-6">

                {/* FLOATING AVATAR - Square/Sharp */}
                <div className="absolute -top-14 left-4 sm:left-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                    >
                        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-black border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-4xl font-black bg-white text-black rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Verified badge - Neo Style */}
                        <div className="absolute -bottom-2 -right-2 bg-[#FF6B00] text-black p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </motion.div>
                </div>

                {/* NAME & HANDLE */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                        {profile?.full_name || "New User"}
                    </h1>
                    <span className="inline-block text-xs font-bold bg-[#FF6B00] text-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        @{profile?.username || "username"}
                    </span>
                </div>

                {/* BIO - Serif/Mono mix for elegance */}
                {profile?.bio && (
                    <div className="mb-6 max-w-2xl">
                        <p className="text-zinc-300 text-sm sm:text-base font-medium leading-relaxed border-l-4 border-white pl-4 italic">
                            {profile.bio}
                        </p>
                    </div>
                )}

                {/* META INFO */}
                <div className="flex flex-wrap gap-4 text-xs font-bold text-zinc-500 mb-6 uppercase tracking-wide">
                    {profile?.location && (
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <MapPin className="w-4 h-4 text-[#FF6B00]" />
                            <span>{profile.location}</span>
                        </div>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors group">
                            <LinkIcon className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                            <span className="truncate max-w-[150px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        KATILDI: {new Date(profile?.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                    </div>
                </div>

                {/* ACTION BUTTONS & HUB SCORE */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t-2 border-zinc-900">
                    <div className="flex gap-3 flex-wrap">
                        {isOwnProfile ? (
                            <>
                                <Link href="/profil/duzenle">
                                    <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 font-black uppercase text-xs border-2 border-black hover:bg-[#FF6B00] hover:text-black hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 transition-all">
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Düzenle
                                    </button>
                                </Link>
                                <Link href="/mesajlar">
                                    <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 font-black uppercase text-xs border-2 border-zinc-800 hover:border-white hover:text-white transition-all">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Mesajlar
                                    </button>
                                </Link>
                                {profile?.is_writer && (
                                    <Link href="/yazar/yeni">
                                        <button className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 font-black uppercase text-xs border-2 border-black hover:bg-yellow-300 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 transition-all">
                                            <PenSquare className="w-3.5 h-3.5" />
                                            Yaz
                                        </button>
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link href="/admin">
                                        <button className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 font-black uppercase text-xs border-2 border-black hover:bg-red-500 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 transition-all">
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
                                    className="px-6 py-2.5 text-xs font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                                />
                                <Link href={`/mesajlar?to=${profile.id}`}>
                                    <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 font-black uppercase text-xs border-2 border-black hover:bg-[#FF6B00] transition-colors">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Mesaj
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* HUB SCORE - Minimalist Box */}
                    <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-4 py-2">
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Hub Puan</span>
                        <span className="text-xl font-black text-white">{formatNumber(stats.reputation)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
