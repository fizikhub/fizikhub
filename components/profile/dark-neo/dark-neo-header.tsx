"use client";

import { m as motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, ShieldCheck, MessageCircle, Settings, PenSquare, PlusCircle } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "../follow-button";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { useUiSounds } from "@/hooks/use-ui-sounds";

interface DarkNeoHeaderProps {
    profile: any;
    user: any;
    stats: any;
    isOwnProfile: boolean;
    isFollowing: boolean;
}

export function DarkNeoHeader({ profile, stats, isOwnProfile, isFollowing }: DarkNeoHeaderProps) {
    const initial = profile?.full_name?.[0]?.toUpperCase() || "U";
    const isAdmin = profile?.username === "baranbozkurt" || profile?.role === "admin";
    const isAuthorMode = isAdmin || profile?.role === "editor" || profile?.is_writer === true;
    const hasCoverPhoto = profile?.cover_url;
    const joinedLabel = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
        : "Bilinmiyor";
    const websiteHref = profile?.website
        ? profile.website.startsWith('http')
            ? profile.website
            : `https://${profile.website}`
        : "";
    const { playInteractSound } = useUiSounds();

    const handleActionClick = () => {
        playInteractSound();
    };

    return (
        <div className="w-full relative group">
            <div className="relative overflow-hidden bg-background border-[2px] border-black dark:border-zinc-800 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] dark:sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">

                {/* COVER BANNER */}
                <div className="relative h-36 overflow-visible border-b-[2.5px] border-black bg-[#27272a] shadow-inner sm:h-52 md:h-60">
                    {hasCoverPhoto ? (
                        <Image
                            src={profile.cover_url}
                            alt="Kapak fotoğrafı"
                            fill
                            className="object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                            priority
                            fetchPriority="high"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-[#27272a]" />
                    )}

                    <div className="absolute bottom-2 right-2 z-20 flex flex-row gap-1.5 sm:bottom-4 sm:right-6 sm:gap-3">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="min-w-[58px] rounded-lg border-2 border-black bg-white px-2 py-1 text-center shadow-[2px_2px_0px_0px_#000] transition-all sm:min-w-[72px] sm:px-3 sm:py-1.5"
                        >
                            <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider text-black/60">Takipçi</p>
                            <h3 className="text-xs sm:text-lg font-black text-black leading-tight">{formatNumber(stats.followersCount)}</h3>
                        </motion.div>

                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="min-w-[58px] rounded-lg border-2 border-black bg-zinc-950 px-2 py-1 text-center shadow-[2px_2px_0px_0px_#000] transition-all sm:min-w-[72px] sm:px-3 sm:py-1.5"
                        >
                            <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider text-white/60">Takip</p>
                            <h3 className="text-xs sm:text-lg font-black text-white leading-tight">{formatNumber(stats.followingCount)}</h3>
                        </motion.div>
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="relative px-4 pb-4 pt-16 sm:px-6 sm:pb-5 sm:pt-20">

                    {/* FLOATING AVATAR */}
                    <div className="absolute -top-12 left-4 sm:-top-14 sm:left-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group"
                        >
                            <div className="relative z-10 h-24 w-24 overflow-hidden rounded-2xl border-2 border-black bg-background p-1 shadow-[3px_3px_0px_0px_#000] transition-transform group-hover:scale-[1.02] dark:border-zinc-800 sm:h-32 sm:w-32 sm:shadow-[4px_4px_0px_0px_#000]">
                                <Avatar className="h-full w-full rounded-xl border border-black/10 dark:border-white/10">
                                    <AvatarImage src={profile?.avatar_url} className="object-cover scale-110" />
                                    <AvatarFallback className="text-3xl font-black bg-[#FFC800] text-black rounded-none">
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            {/* Verified badge - Neo Pop */}
                            <div className="absolute -bottom-1 -right-1 bg-[#23A9FA] text-white p-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] z-20">
                                <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5px]" />
                            </div>
                        </motion.div>
                    </div>

                    {/* NAME & HANDLE */}
                    <div className="mb-3 mt-1 flex min-w-0 flex-col items-start gap-1 sm:mb-4 sm:mt-0">
                        <h1 className="max-w-full break-words text-[1.28rem] font-black leading-[1.02] tracking-tight text-foreground drop-shadow-sm sm:text-3xl">
                            {profile?.full_name || "Yeni Kullanıcı"}
                        </h1>
                        <span className="inline-block max-w-full truncate rounded-md border border-black/50 bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-zinc-400 transition-all hover:bg-black hover:text-[#FFC800] sm:text-[11px]">
                            @{profile?.username || "kullaniciadi"}
                        </span>
                    </div>

                    {/* BIO */}
                    {profile?.bio && (
                        <div className="mb-4 max-w-2xl sm:mb-5">
                            <p className="text-xs font-medium leading-relaxed text-zinc-300 sm:text-sm">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* META INFO */}
                    <div className="mb-4 flex flex-col gap-1.5 border-b border-dashed border-black/20 pb-3 text-[11px] font-bold text-zinc-500 sm:mb-6 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:pb-5 sm:text-xs">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5 text-zinc-400 hover:text-[#23A9FA] transition-colors">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile?.website && (
                            <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 items-center gap-1.5 transition-colors hover:text-[#FFC800]">
                                <LinkIcon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-inherit" />
                                <span className="max-w-full truncate decoration-zinc-600 underline-offset-4 group-hover:underline sm:max-w-[220px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                            <span>Katıldı: {joinedLabel}</span>
                        </div>
                    </div>

                    {/* ACTION BUTTONS & HUB SCORE */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        {/* Action Toolbar */}
                        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-wrap sm:w-auto sm:pb-0">
                            {isOwnProfile ? (
                                <>
                                    <Link prefetch={false} href="/profil/duzenle" onClick={handleActionClick} className="w-full sm:w-auto">
                                        <button className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-white px-3 py-2 text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-pink hover:text-white hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs">
                                            <Edit3 className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Düzenle</span>
                                        </button>
                                    </Link>
                                    <Link prefetch={false} href="/mesajlar" onClick={handleActionClick} className="w-full sm:w-auto">
                                        <button className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-zinc-950 px-3 py-2 text-[11px] font-black text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-blue hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none md:dark:border-zinc-700 sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs">
                                            <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Mesajlar</span>
                                        </button>
                                    </Link>
                                    {profile?.is_writer && (
                                        <Link prefetch={false} href="/yazar/yeni" onClick={handleActionClick} className="w-full sm:w-auto">
                                            <button className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-[#FFBD2E] px-3 py-2 text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#FFD268] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs">
                                                <PenSquare className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                <span>Yaz</span>
                                            </button>
                                        </Link>
                                    )}
                                    {isAuthorMode && (
                                        <Link prefetch={false} href="/yazar-paneli" onClick={handleActionClick} className="w-full sm:w-auto">
                                            <button className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-[#33EAA1] px-3 py-2 text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#20CA86] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs">
                                                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                <span>Paneli</span>
                                            </button>
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <>
                                            <Link prefetch={false} href="/yonetim/hikaye-olustur" onClick={handleActionClick} className="w-full sm:w-auto">
                                                <button className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-[#9333EA] px-3 py-2 text-[11px] font-black text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#7E22CE] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs">
                                                    <PlusCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                    Hikaye
                                                </button>
                                            </Link>
                                            <Link prefetch={false} href="/admin" onClick={handleActionClick} className="w-full sm:w-auto">
                                                <button className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-[#FF3366] px-3 py-2 text-[11px] font-black text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#E6004C] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs">
                                                    <Settings className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                    Admin
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="w-full sm:w-auto" onClick={handleActionClick}>
                                        <FollowButton
                                            targetUserId={profile.id}
                                            initialIsFollowing={isFollowing}
                                            className="min-h-10 w-full justify-center rounded-lg border-2 border-black px-4 py-2 text-[11px] font-black shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto sm:px-5 sm:py-2.5 sm:text-xs"
                                        />
                                    </div>
                                    <Link prefetch={false} href={`/mesajlar?to=${profile.id}`} onClick={handleActionClick} className="w-full sm:w-auto">
                                        <button className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-zinc-950 px-4 py-2 text-[11px] font-black text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-blue hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none dark:border-zinc-700 sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs">
                                            <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Mesaj</span>
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* HUB SCORE - Brutalist Pill */}
                        <div className="flex min-h-11 w-full items-center justify-between gap-4 rounded-[10px] border-2 border-black bg-zinc-950 px-4 py-2 shadow-[2px_2px_0px_0px_#000] transition-transform active:scale-[0.98] sm:w-auto sm:justify-start sm:rounded-full sm:px-4 sm:py-1.5">
                            <span className="text-xs sm:text-[10px] font-black uppercase text-zinc-400 tracking-wider">Hub Puanı</span>
                            <span className="text-lg sm:text-sm font-black text-neo-yellow tracking-tight">{formatNumber(stats.reputation)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
