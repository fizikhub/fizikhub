"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, ShieldCheck, MessageCircle, Settings, PenSquare, PlusCircle } from "lucide-react";
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
        <div className="w-full relative group">
            {/* NOISE TEXTURE - Global Quality Feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0 rounded-xl"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* MAIN CONTAINER - Article Card Style */}
            <div className="relative overflow-hidden bg-[#27272a] border-[2px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">

                {/* COVER BANNER */}
                <div className="relative h-44 sm:h-52 md:h-60 overflow-visible border-b-[2px] border-black bg-zinc-900">
                    {/* Cover photo or pattern */}
                    {hasCoverPhoto ? (
                        <img
                            src={profile.cover_url}
                            alt="Kapak fotoğrafı"
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />
                    ) : (
                        <>
                            {/* Vivid Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFC800]/20 via-purple-500/10 to-blue-500/20 opacity-100" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                            {/* Geometric Accents */}
                            <div className="absolute top-0 right-0 p-8 opacity-30 pointer-events-none">
                                <div className="w-64 h-64 border-2 border-white/10 rounded-full" />
                                <div className="w-48 h-48 border-2 border-white/10 rounded-full absolute top-8 right-8" />
                            </div>
                        </>
                    )}

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#27272a]/90" />

                    {/* FOLLOWER/FOLLOWING - Vivid Cards */}
                    <div className="absolute -bottom-6 right-4 sm:right-6 flex gap-3 z-20">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border-2 border-black min-w-[72px] py-1.5 px-3 shadow-[2px_2px_0px_0px_#000] rounded-lg text-center group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-default"
                        >
                            <p className="text-[9px] font-black uppercase tracking-wider text-black/60 mb-0.5">Takipçi</p>
                            <h3 className="text-lg font-black text-black leading-none">{formatNumber(stats.followersCount)}</h3>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-900 border-2 border-black min-w-[72px] py-1.5 px-3 shadow-[2px_2px_0px_0px_#000] rounded-lg text-center group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-default"
                        >
                            <p className="text-[9px] font-black uppercase tracking-wider text-white/60 mb-0.5">Takip</p>
                            <h3 className="text-lg font-black text-white leading-none">{formatNumber(stats.followingCount)}</h3>
                        </motion.div>
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="relative pt-16 sm:pt-20 pb-6 px-4 sm:px-6">

                    {/* FLOATING AVATAR */}
                    <div className="absolute -top-12 left-4 sm:left-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group"
                        >
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#27272a] p-1 rounded-2xl shadow-[4px_4px_0px_0px_#000] border-2 border-black overflow-hidden relative z-10">
                                <Avatar className="w-full h-full rounded-xl border border-black/10">
                                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                    <AvatarFallback className="text-3xl font-black bg-[#FFC800] text-black rounded-none">
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            {/* Verified badge - Neo Pop */}
                            <div className="absolute -bottom-1 -right-1 bg-[#23A9FA] text-white p-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] z-20">
                                <ShieldCheck className="w-3.5 h-3.5 stroke-[3px]" />
                            </div>
                        </motion.div>
                    </div>

                    {/* NAME & HANDLE */}
                    <div className="mb-5">
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-1 drop-shadow-md">
                            <span className="bg-gradient-to-r from-transparent to-transparent hover:from-[#FFC800]/20 hover:to-[#FFC800]/20 transition-all duration-300 rounded px-1 -ml-1">
                                {profile?.full_name || "New User"}
                            </span>
                        </h1>
                        <span className="inline-block text-[11px] font-bold bg-zinc-900 text-zinc-400 px-2.5 py-0.5 rounded-md border border-zinc-700/50 hover:bg-black hover:text-[#FFC800] hover:border-[#FFC800] transition-all cursor-pointer">
                            @{profile?.username || "username"}
                        </span>
                    </div>

                    {/* BIO */}
                    {profile?.bio && (
                        <div className="mb-6 max-w-2xl">
                            <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* META INFO */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-zinc-500 mb-8 border-b border-black/20 pb-6 border-dashed">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5 text-zinc-400 hover:text-[#23A9FA] transition-colors">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#FFC800] transition-colors group">
                                <LinkIcon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-inherit" />
                                <span className="truncate max-w-[150px] decoration-zinc-600 underline-offset-4 group-hover:underline">{profile.website.replace(/^https?:\/\//, '')}</span>
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
                                        <button className="flex items-center gap-2 bg-white text-black px-4 py-2.5 font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#FFC800] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                            <Edit3 className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            Düzenle
                                        </button>
                                    </Link>
                                    <Link href="/mesajlar">
                                        <button className="flex items-center gap-2 bg-[#27272a] text-white px-4 py-2.5 font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#23A9FA] hover:text-white transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                            <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            Mesajlar
                                        </button>
                                    </Link>
                                    {profile?.is_writer && (
                                        <Link href="/yazar/yeni">
                                            <button className="flex items-center gap-2 bg-[#FFC800] text-black px-4 py-2.5 font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#FFA000] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                                <PenSquare className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                Yaz
                                            </button>
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <>
                                            <Link href="/yonetim/hikaye-olustur">
                                                <button className="flex items-center gap-2 bg-[#9333EA] text-white px-4 py-2.5 font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#7E22CE] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                                    <PlusCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                    Hikaye Ekle
                                                </button>
                                            </Link>
                                            <Link href="/admin">
                                                <button className="flex items-center gap-2 bg-[#FF3366] text-white px-4 py-2.5 font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#E6004C] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                                    <Settings className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                    Admin
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <FollowButton
                                        targetUserId={profile.id}
                                        initialIsFollowing={isFollowing}
                                        className="px-5 py-2.5 text-xs font-black rounded-lg shadow-[2px_2px_0px_0px_#000] border-2 border-black hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                    />
                                    <Link href={`/mesajlar?to=${profile.id}`}>
                                        <button className="flex items-center gap-2 bg-[#27272a] text-white px-4 py-2.5 font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#23A9FA] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                            <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            Mesaj
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* HUB SCORE - Brutalist Pill */}
                        <div className="flex items-center gap-2 bg-zinc-900 border-2 border-black rounded-full px-4 py-1.5 shadow-[2px_2px_0px_0px_#000]">
                            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Hub Puan</span>
                            <span className="text-sm font-black text-white tracking-tight">{formatNumber(stats.reputation)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
