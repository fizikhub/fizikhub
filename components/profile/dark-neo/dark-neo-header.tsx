"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, ShieldCheck, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "../follow-button";
import { formatNumber } from "@/lib/utils";

// True Royal Blue
const ROYAL_BLUE = "#1E3A5F";

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
            {/* COVER BANNER */}
            <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden rounded-t-3xl border-2 border-b-0 border-white/10">
                {/* Cover photo or default gradient */}
                {hasCoverPhoto ? (
                    <img
                        src={profile.cover_url}
                        alt="Kapak fotoğrafı"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1a2e] via-[#1E3A5F] to-[#0a1628]" />
                        <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#2C5282]/20 rounded-full blur-3xl" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    </>
                )}
                {hasCoverPhoto && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                )}
            </div>

            {/* CONTENT CARD - Modernized & Cleaned */}
            <div className="relative bg-background border-2 border-white/10 border-t-0 rounded-b-3xl pt-14 sm:pt-16 pb-6 px-5 sm:px-8">

                {/* FLOATING AVATAR */}
                <div className="absolute -top-12 sm:-top-16 left-6 sm:left-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-background rounded-3xl border-[3px] border-white/20 shadow-xl overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-3xl sm:text-4xl font-black bg-[#1E3A5F] text-white rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {isAdmin && (
                            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-1.5 rounded-xl border-2 border-black shadow-sm">
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* NAME & INTEGRATED STATS */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                            {profile?.full_name || "Yeni Kullanıcı"}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground">
                                @{profile?.username || "username"}
                            </span>
                            <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                            <div className="flex items-center gap-3">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black text-foreground">{formatNumber(stats.followersCount)}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Takipçi</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black text-foreground">{formatNumber(stats.followingCount)}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Takip</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS - Refined */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        {isOwnProfile ? (
                            <>
                                <Link href="/profil/duzenle" className="flex-1 sm:flex-none">
                                    <button className="h-10 px-5 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm">
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Düzenle
                                    </button>
                                </Link>
                                <Link href="/mesajlar" className="flex-1 sm:flex-none">
                                    <button className="h-10 px-5 rounded-xl border-2 border-border/50 bg-card hover:bg-muted font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Mesajlar
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <FollowButton
                                    targetUserId={profile.id}
                                    initialIsFollowing={isFollowing}
                                    className="h-10 px-6 font-bold text-xs rounded-xl"
                                />
                                <Link href={`/mesajlar?to=${profile.id}`}>
                                    <button className="h-10 px-5 rounded-xl border-2 border-border/50 bg-card hover:bg-muted font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Mesaj
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* BIO - cleaner */}
                {profile?.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-2xl">
                        {profile.bio}
                    </p>
                )}

                {/* FOOTER INFO & HUB PUAN */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground/80">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-red-400" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors text-blue-400">
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                            <span>{new Date(profile?.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })} Katıldı</span>
                        </div>
                    </div>

                    {/* Reputations / Hub Puan - More subtle but premium */}
                    <div className="flex items-center gap-3 bg-muted/30 border border-border/20 px-4 py-2.5 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hub Puan</p>
                            <h3 className="text-lg font-black text-foreground -mt-0.5">{formatNumber(stats.reputation)}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
