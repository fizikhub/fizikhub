"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, MessageCircle, Share2, PenSquare, Sparkles } from "lucide-react";
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

    return (
        <div className="w-full relative mb-12">
            {/* DECORATIVE BACKGROUND ELEMENTS - "Pop" Chaos */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-[hsl(var(--pop-pink))] border-3 border-black rounded-full opacity-20 animate-pulse" />
                <div className="absolute top-40 left-10 w-16 h-16 bg-[hsl(var(--pop-cyan))] border-3 border-black rotate-12 opacity-30" />
            </div>

            {/* MAIN CARD STACK CONTAINER */}
            <div className="relative mx-auto max-w-5xl px-4 pt-6">

                {/* 1. LAYER: COVER & INFO CARD */}
                <div className="neo-box-yellow p-0 relative transform rotate-[-1deg] hover:rotate-0 transition-transform duration-300 z-10">

                    {/* COVER AREA */}
                    <div className="h-48 sm:h-64 border-b-3 border-black relative overflow-hidden bg-white">
                        {profile?.cover_url ? (
                            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            // Default Pop Pattern
                            <div className="w-full h-full bg-[hsl(var(--pop-purple))] relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:16px_16px]" />
                                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[hsl(var(--pop-lime))] border-4 border-black rounded-full" />
                                <div className="absolute top-10 left-10 w-24 h-24 bg-[hsl(var(--pop-cyan))] border-4 border-black rotate-45" />
                            </div>
                        )}
                        {/* EDIT COVER BUTTON (If own profile) */}
                        {isOwnProfile && (
                            <button className="absolute top-4 right-4 neo-button-sm bg-white hover:bg-gray-100 rotate-2">
                                <Edit3 className="w-3 h-3 mr-1" /> Kapak
                            </button>
                        )}
                    </div>

                    {/* PROFILE CONTENT */}
                    <div className="px-6 pb-8 pt-16 sm:px-10 relative bg-white dark:bg-zinc-900">

                        {/* FLOATING AVATAR ("Sticker" style) */}
                        <div className="absolute -top-20 left-6 sm:left-10 z-20">
                            <motion.div
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: -3 }}
                                whileHover={{ scale: 1.05, rotate: 3 }}
                                className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-black bg-[hsl(var(--pop-lime))] shadow-[8px_8px_0_0_#000] p-1"
                            >
                                <Avatar className="w-full h-full rounded-none border-2 border-black">
                                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                    <AvatarFallback className="text-4xl font-black bg-[hsl(var(--pop-lime))] text-black rounded-none">
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>
                        </div>

                        {/* TEXT INFO */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">

                            <div className="mt-2 flex-1">
                                <h1 className="text-4xl sm:text-5xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.9] drop-shadow-sm">
                                    {profile?.full_name || "Anonim"}
                                </h1>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="neo-badge bg-[hsl(var(--pop-cyan))] text-base px-3 py-1 -rotate-2">
                                        @{profile?.username}
                                    </span>
                                    {profile?.location && (
                                        <span className="neo-badge bg-[hsl(var(--pop-pink))] text-base px-3 py-1 rotate-1">
                                            <MapPin className="w-3 h-3 mr-1" /> {profile.location}
                                        </span>
                                    )}
                                </div>
                                {profile?.bio && (
                                    <p className="mt-4 text-base font-bold leading-tight max-w-xl text-black border-l-4 border-[hsl(var(--pop-purple))] pl-3 dark:text-white">
                                        {profile.bio}
                                    </p>
                                )}

                                <div className="mt-4 flex gap-4 text-xs font-black uppercase text-muted-foreground">
                                    {profile?.website && (
                                        <a href={profile.website} target="_blank" className="hover:text-black dark:hover:text-white hover:underline flex items-center gap-1">
                                            <LinkIcon className="w-3 h-3" /> Website
                                        </a>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(profile?.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                {isOwnProfile ? (
                                    <div className="flex flex-col gap-2">
                                        <Link href="/profil/duzenle">
                                            <button className="neo-button-primary w-full md:w-48 bg-[hsl(var(--pop-lime))] text-black">
                                                <Edit3 className="w-4 h-4 mr-2" /> DÜZENLE
                                            </button>
                                        </Link>
                                        <div className="flex gap-2">
                                            <Link href="/mesajlar" className="flex-1">
                                                <button className="neo-button-secondary w-full">
                                                    <MessageCircle className="w-4 h-4 mr-2" /> Mesaj
                                                </button>
                                            </Link>
                                            <button className="neo-button-secondary px-3">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <FollowButton
                                            targetUserId={profile.id}
                                            initialIsFollowing={isFollowing}
                                            className="neo-button-primary w-full md:w-48 bg-[hsl(var(--pop-pink))]"
                                        />
                                        <div className="flex gap-2">
                                            <Link href={`/mesajlar?to=${profile.id}`} className="flex-1">
                                                <button className="neo-button-secondary w-full">
                                                    <MessageCircle className="w-4 h-4 mr-2" /> Mesaj
                                                </button>
                                            </Link>
                                            <button className="neo-button-secondary px-3">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. LAYER: STATS ROW (Sticking out from bottom) */}
                <div className="flex justify-center -mt-6 relative z-20">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <StatSticker label="Takipçi" value={stats.followersCount} color="var(--pop-cyan)" rotate={-2} />
                        <StatSticker label="Takip" value={stats.followingCount} color="var(--pop-pink)" rotate={2} />
                        <StatSticker label="Hub Puan" value={stats.reputation} color="var(--pop-yellow)" rotate={-1} icon={<Sparkles className="w-4 h-4" />} />
                    </div>
                </div>

            </div>
        </div>
    );
}

// "Sticker" for Stats
function StatSticker({ label, value, color, rotate, icon }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.1, rotate: 0 }}
            className="flex flex-col items-center justify-center w-24 h-24 border-3 border-black shadow-[4px_4px_0_0_#000] bg-white transition-all cursor-default"
            style={{
                backgroundColor: `hsl(${color})`,
                transform: `rotate(${rotate}deg)`
            }}
        >
            <span className="text-2xl font-black text-black">{formatNumber(value)}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-black flex items-center gap-1">
                {icon} {label}
            </span>
        </motion.div>
    );
}
