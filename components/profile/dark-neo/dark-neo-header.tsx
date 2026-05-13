"use client";

import { m as motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, ShieldCheck, MessageCircle, Settings, PenSquare, PlusCircle, Sparkles, UserRound } from "lucide-react";
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
            <div className="relative overflow-hidden rounded-[18px] border-[3px] border-black bg-[#27272a] text-white shadow-[5px_5px_0px_0px_#000] sm:rounded-[24px] sm:shadow-[8px_8px_0px_0px_#000]">

                {/* COVER BANNER */}
                <div className="relative h-44 overflow-visible border-b-[3px] border-black bg-[#18181b] shadow-inner sm:h-64 lg:h-72">
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
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,200,0,0.24),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(35,169,250,0.22),transparent_28%),linear-gradient(135deg,#18181b,#27272a_55%,#111)]" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
                    <div className="absolute inset-x-0 top-0 h-10 border-b border-white/10 bg-black/25 opacity-80 [background-image:linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:36px_100%]" />

                    <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FFC800] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000] sm:left-6 sm:top-6 sm:text-xs">
                        <Sparkles className="h-3.5 w-3.5 stroke-[3px]" />
                        Fizikhub Profili
                    </div>

                    <div className="absolute bottom-4 right-3 z-20 flex flex-row gap-2 sm:bottom-6 sm:right-7 sm:gap-3">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="min-w-[74px] rounded-[12px] border-[3px] border-black bg-white px-3 py-2 text-center text-black shadow-[3px_3px_0px_0px_#000] transition-transform hover:-translate-y-0.5 sm:min-w-[92px] sm:px-4"
                        >
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-black/55">Takipçi</p>
                            <h3 className="text-base sm:text-2xl font-black leading-none">{formatNumber(stats.followersCount)}</h3>
                        </motion.div>

                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="min-w-[74px] rounded-[12px] border-[3px] border-black bg-zinc-950 px-3 py-2 text-center text-white shadow-[3px_3px_0px_0px_#000] transition-transform hover:-translate-y-0.5 sm:min-w-[92px] sm:px-4"
                        >
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-white/55">Takip</p>
                            <h3 className="text-base sm:text-2xl font-black leading-none">{formatNumber(stats.followingCount)}</h3>
                        </motion.div>
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="relative bg-[#27272a] px-4 pb-5 pt-16 sm:px-7 sm:pb-7 sm:pt-20 lg:px-8">

                    {/* FLOATING AVATAR */}
                    <div className="absolute -top-12 left-4 sm:-top-16 sm:left-7">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group"
                        >
                            <div className="relative z-10 h-24 w-24 overflow-hidden rounded-[22px] border-[3px] border-black bg-white p-1.5 shadow-[4px_4px_0px_0px_#000] transition-transform group-hover:scale-[1.02] sm:h-36 sm:w-36 sm:rounded-[28px]">
                                <Avatar className="h-full w-full rounded-[16px] border border-black/10 sm:rounded-[20px]">
                                    <AvatarImage src={profile?.avatar_url} className="object-cover scale-110" />
                                    <AvatarFallback className="text-3xl font-black bg-[#FFC800] text-black rounded-none">
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            {/* Verified badge - Neo Pop */}
                            <div className="absolute -bottom-1 -right-1 z-20 rounded-full border-[3px] border-black bg-[#23A9FA] p-1.5 text-white shadow-[2px_2px_0px_0px_#000]">
                                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                        <div className="min-w-0">
                            {/* NAME & HANDLE */}
                            <div className="mb-3 flex min-w-0 flex-col items-start gap-2 sm:mb-4">
                                <h1 className="max-w-full break-words text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[2px_2px_0px_#000] sm:text-5xl lg:text-6xl">
                                    {profile?.full_name || "Yeni Kullanıcı"}
                                </h1>
                                <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-[10px] border-2 border-black bg-[#18181b] px-3 py-1 text-xs font-black text-zinc-300 shadow-[2px_2px_0px_0px_#000] transition-all hover:text-[#FFC800] sm:text-sm">
                                    <UserRound className="h-3.5 w-3.5 shrink-0" />
                                    @{profile?.username || "kullaniciadi"}
                                </span>
                            </div>

                            {/* BIO */}
                            <div className="mb-4 max-w-3xl sm:mb-5">
                                <p className="text-sm font-semibold leading-relaxed text-zinc-200 sm:text-base">
                                    {profile?.bio || "Fizikhub'da bilim, fizik ve merak dolu içerikler peşinde."}
                                </p>
                            </div>

                            {/* META INFO */}
                            <div className="flex flex-col gap-2 border-t-2 border-dashed border-white/10 pt-4 text-xs font-bold text-zinc-400 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                                {profile?.location && (
                                    <div className="flex items-center gap-1.5 transition-colors hover:text-[#23A9FA]">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile?.website && (
                                    <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 items-center gap-1.5 transition-colors hover:text-[#FFC800]">
                                        <LinkIcon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-inherit" />
                                        <span className="max-w-full truncate underline-offset-4 group-hover:underline sm:max-w-[260px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                                    <span>Katıldı: {joinedLabel}</span>
                                </div>
                            </div>
                        </div>

                        {/* HUB SCORE */}
                        <div className="rounded-[16px] border-[3px] border-black bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_#000] lg:min-w-[220px]">
                            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">Hub Puanı</span>
                            <div className="mt-1 flex items-end justify-between gap-3">
                                <span className="text-4xl font-black leading-none text-[#FFC800] sm:text-5xl">{formatNumber(stats.reputation)}</span>
                                <Sparkles className="h-7 w-7 text-[#23A9FA]" />
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-5 border-t-2 border-dashed border-white/10 pt-4">
                        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                            {isOwnProfile ? (
                                <>
                                    <Link prefetch={false} href="/profil/duzenle" onClick={handleActionClick} className="min-w-[126px] flex-shrink-0 sm:min-w-0">
                                        <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] border-[3px] border-black bg-white px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-pink hover:text-white hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto">
                                            <Edit3 className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Düzenle</span>
                                        </button>
                                    </Link>
                                    <Link prefetch={false} href="/mesajlar" onClick={handleActionClick} className="min-w-[126px] flex-shrink-0 sm:min-w-0">
                                        <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] border-[3px] border-black bg-zinc-950 px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-blue hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto">
                                            <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Mesajlar</span>
                                        </button>
                                    </Link>
                                    {profile?.is_writer && (
                                        <Link prefetch={false} href="/yazar/yeni" onClick={handleActionClick} className="min-w-[126px] flex-shrink-0 sm:min-w-0">
                                            <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] border-[3px] border-black bg-[#FFBD2E] px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#FFD268] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto">
                                                <PenSquare className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                <span>Yaz</span>
                                            </button>
                                        </Link>
                                    )}
                                    {isAuthorMode && (
                                        <Link prefetch={false} href="/yazar-paneli" onClick={handleActionClick} className="min-w-[126px] flex-shrink-0 sm:min-w-0">
                                            <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] border-[3px] border-black bg-[#33EAA1] px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#20CA86] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto">
                                                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                <span>Paneli</span>
                                            </button>
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <>
                                            <Link prefetch={false} href="/yonetim/hikaye-olustur" onClick={handleActionClick} className="min-w-[126px] flex-shrink-0 sm:min-w-0">
                                                <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] border-[3px] border-black bg-[#9333EA] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#7E22CE] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto">
                                                    <PlusCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                    Hikaye
                                                </button>
                                            </Link>
                                            <Link prefetch={false} href="/admin" onClick={handleActionClick} className="min-w-[126px] flex-shrink-0 sm:min-w-0">
                                                <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] border-[3px] border-black bg-[#FF3366] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#E6004C] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto">
                                                    <Settings className="w-3.5 h-3.5 stroke-[2.5px]" />
                                                    Admin
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="min-w-[126px] flex-shrink-0 sm:min-w-0" onClick={handleActionClick}>
                                        <FollowButton
                                            targetUserId={profile.id}
                                            initialIsFollowing={isFollowing}
                                            className="min-h-12 w-full justify-center rounded-[12px] border-[3px] border-black px-5 py-2 text-sm font-black shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto"
                                        />
                                    </div>
                                    <Link prefetch={false} href={`/mesajlar?to=${profile.id}`} onClick={handleActionClick} className="min-w-[126px] flex-shrink-0 sm:min-w-0">
                                        <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] border-[3px] border-black bg-zinc-950 px-5 py-2 text-sm font-black text-white shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-neo-blue hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:scale-95 active:shadow-none sm:w-auto">
                                            <MessageCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            <span>Mesaj</span>
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
