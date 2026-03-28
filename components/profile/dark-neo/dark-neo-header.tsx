"use client";

import { m as motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, ShieldCheck, MessageCircle, Settings, PenSquare, PlusCircle } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "../follow-button";
import { formatNumber, cn } from "@/lib/utils";
import Image from "next/image";
import { useUiSounds } from "@/hooks/use-ui-sounds";

interface DarkNeoHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
    isFollowing: boolean;
}

export function DarkNeoHeader({ profile, user, stats, isOwnProfile, isFollowing }: DarkNeoHeaderProps) {
    const initial = profile?.full_name?.[0]?.toUpperCase() || "U";
    const isAdmin = profile?.username === "baranbozkurt" || profile?.role === "admin";
    const isAuthorMode = isAdmin || profile?.role === "editor" || profile?.is_writer === true;
    const hasCoverPhoto = profile?.cover_url;
    const { playInteractSound } = useUiSounds();

    const handleActionClick = () => {
        playInteractSound();
    };

    return (
        <div className="w-full relative group">
            {/* NOISE TEXTURE - Global Quality Feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0 rounded-xl"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* MAIN CONTAINER - Article Card Style */}
            <div className="relative overflow-hidden bg-background border-[1.5px] sm:border-2 border-black dark:border-zinc-800 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] dark:sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">

                {/* COVER BANNER */}
                <div className="relative h-44 sm:h-52 md:h-60 overflow-visible border-b-[2px] border-black bg-zinc-900">
                    {/* Cover photo or pattern */}
                    {hasCoverPhoto ? (
                        <Image
                            src={profile.cover_url}
                            alt="Kapak fotoğrafı"
                            fill
                            className="object-cover opacity-90"
                            priority
                            fetchPriority="high"
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
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />

                    {/* FOLLOWER/FOLLOWING - Vivid Cards - Repositioned for mobile */}
                    <div className="absolute top-4 right-4 sm:top-auto sm:bottom-4 sm:right-6 flex flex-col sm:flex-row gap-2 sm:gap-3 z-20">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border-[1.5px] sm:border-2 border-black min-w-[56px] sm:min-w-[72px] py-1 px-1.5 sm:py-1.5 sm:px-3 shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] rounded-lg text-center group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-default"
                        >
                            <p className="text-[7.5px] sm:text-[9px] font-black uppercase tracking-wider text-black/60 mb-0.5 sm:mb-1">Takipçi</p>
                            <h3 className="text-sm sm:text-lg font-black text-black leading-none">{formatNumber(stats.followersCount)}</h3>
                        </motion.div>

                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-900 border-[1.5px] sm:border-2 border-black min-w-[56px] sm:min-w-[72px] py-1 px-1.5 sm:py-1.5 sm:px-3 shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] rounded-lg text-center group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-default"
                        >
                            <p className="text-[7.5px] sm:text-[9px] font-black uppercase tracking-wider text-white/60 mb-0.5 sm:mb-1">Takip</p>
                            <h3 className="text-sm sm:text-lg font-black text-white leading-none">{formatNumber(stats.followingCount)}</h3>
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
                            <div className="w-[72px] h-[72px] sm:w-28 sm:h-28 bg-background p-[3px] sm:p-1 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[1.5px] sm:border-2 border-black dark:border-zinc-800 overflow-hidden relative z-10">
                                <Avatar className="w-full h-full rounded-xl border border-black/10 dark:border-white/10">
                                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                    <AvatarFallback className="text-3xl font-black bg-[#FFC800] text-black rounded-none">
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            {/* Verified badge - Neo Pop */}
                            <div className="absolute -bottom-1 -right-1 bg-[#23A9FA] text-white p-0.5 sm:p-1 border-[1.5px] sm:border-2 border-black rounded-full shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] z-20">
                                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3px]" />
                            </div>
                        </motion.div>
                    </div>

                    {/* NAME & HANDLE */}
                    <div className="mb-5 mt-2 sm:mt-0">
                        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight mb-1 drop-shadow-md">
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
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        {/* Scrollable Action Toolbar for Mobile */}
                        <div className="flex gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                            {isOwnProfile ? (
                                <>
                                    <Link prefetch={true} href="/profil/duzenle" onClick={handleActionClick} className="flex-shrink-0">
                                        <button className="flex items-center gap-1.5 sm:gap-2 bg-white text-black px-3 py-2 sm:px-4 sm:py-2.5 font-black text-[11px] sm:text-xs rounded-lg border-[1.5px] sm:border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-pink hover:text-white transition-all active:scale-95 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                            <Edit3 className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Düzenle</span>
                                        </button>
                                    </Link>
                                    <Link prefetch={true} href="/mesajlar" onClick={handleActionClick} className="flex-shrink-0">
                                        <button className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 dark:bg-black text-white px-3 py-2 sm:px-4 sm:py-2.5 font-black text-[11px] sm:text-xs rounded-lg border-[1.5px] sm:border-2 border-black md:dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-blue transition-all active:scale-95 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                            <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Mesajlar</span>
                                        </button>
                                    </Link>
                                    {profile?.is_writer && (
                                        <Link prefetch={true} href="/yazar/yeni" onClick={handleActionClick} className="flex-shrink-0">
                                            <button className="flex items-center gap-1.5 sm:gap-2 bg-[#FFBD2E] text-black px-3 py-2 sm:px-4 sm:py-2.5 font-black text-[11px] sm:text-xs rounded-lg border-[1.5px] sm:border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#FFD268] transition-all active:scale-95 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                                <PenSquare className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                <span>Yaz</span>
                                            </button>
                                        </Link>
                                    )}
                                    {isAuthorMode && (
                                        <Link prefetch={true} href="/yazar-paneli" onClick={handleActionClick} className="flex-shrink-0">
                                            <button className="flex items-center gap-1.5 sm:gap-2 bg-[#33EAA1] text-black px-3 py-2 sm:px-4 sm:py-2.5 font-black text-[11px] sm:text-xs rounded-lg border-[1.5px] sm:border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#20CA86] transition-all active:scale-95 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                <span>Paneli</span>
                                            </button>
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <>
                                            <Link prefetch={true} href="/yonetim/hikaye-olustur" onClick={handleActionClick} className="flex-shrink-0">
                                                <button className="flex items-center gap-1.5 sm:gap-2 bg-[#9333EA] text-white px-3 py-2 sm:px-4 sm:py-2.5 font-black text-[11px] sm:text-xs rounded-lg border-[1.5px] sm:border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#7E22CE] transition-all active:scale-95 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                                    <PlusCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                    Hikaye
                                                </button>
                                            </Link>
                                            <Link prefetch={true} href="/admin" onClick={handleActionClick} className="flex-shrink-0">
                                                <button className="flex items-center gap-1.5 sm:gap-2 bg-[#FF3366] text-white px-3 py-2 sm:px-4 sm:py-2.5 font-black text-[11px] sm:text-xs rounded-lg border-[1.5px] sm:border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#E6004C] transition-all active:scale-95 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                                    <Settings className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                    Admin
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="flex-shrink-0" onClick={handleActionClick}>
                                        <FollowButton
                                            targetUserId={profile.id}
                                            initialIsFollowing={isFollowing}
                                            className="px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs font-black rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] border-[1.5px] sm:border-2 border-black hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all active:scale-95 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                        />
                                    </div>
                                    <Link prefetch={true} href={`/mesajlar?to=${profile.id}`} onClick={handleActionClick} className="flex-shrink-0">
                                        <button className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 dark:bg-black text-white px-4 py-2 sm:px-4 sm:py-2.5 font-black text-[11px] sm:text-xs rounded-lg border-[1.5px] sm:border-2 border-black dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-blue transition-all active:scale-95 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                            <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Mesaj</span>
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* HUB SCORE - Brutalist Pill */}
                        <div className="flex items-center justify-between sm:justify-start gap-4 bg-zinc-900 border-[1.5px] sm:border-2 border-black rounded-[8px] sm:rounded-full px-4 py-2 sm:px-4 sm:py-1.5 shadow-[2px_2px_0px_0px_#000] mt-2 sm:mt-0 active:scale-[0.98] transition-transform">
                            <span className="text-xs sm:text-[10px] font-black uppercase text-zinc-400 tracking-wider">Hub Puanı</span>
                            <span className="text-lg sm:text-sm font-black text-neo-yellow tracking-tight">{formatNumber(stats.reputation)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
