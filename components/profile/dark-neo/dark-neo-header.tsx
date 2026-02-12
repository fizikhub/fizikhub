"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, ShieldCheck, MessageCircle, Settings, Users } from "lucide-react";
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
        <div className="w-full font-sans">
            {/* COVER AREA */}
            <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-black dark:border-white/10 shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] bg-zinc-100 dark:bg-zinc-900 group">
                {hasCoverPhoto ? (
                    <img
                        src={profile.cover_url}
                        alt="Kapak"
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#09090b] dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                        {/* Abstract Geometric Pattern */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)',
                                backgroundSize: '24px 24px'
                            }}
                        />
                        <div className="w-64 h-64 bg-yellow-400/10 rounded-full blur-[100px] absolute -top-10 -right-10" />
                        <div className="w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] absolute -bottom-10 -left-10" />
                    </div>
                )}
            </div>

            {/* PROFILE INFO & STATS GRID */}
            <div className="relative px-2 sm:px-4 -mt-10 sm:-mt-12 flex flex-col lg:flex-row gap-6 lg:items-end">

                {/* AVATAR */}
                <div className="relative flex-shrink-0 z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white dark:border-[#09090b] shadow-xl overflow-hidden bg-white dark:bg-black"
                    >
                        <Avatar className="w-full h-full rounded-none">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="rounded-none bg-zinc-100 dark:bg-zinc-900 text-3xl font-black text-black dark:text-white">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>
                    {/* Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-1.5 rounded-lg border-2 border-white dark:border-[#09090b] shadow-sm transform rotate-6">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                </div>

                {/* INFO */}
                <div className="flex-1 pt-2 lg:pt-0 lg:pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight leading-none mb-1">
                                {profile?.full_name || "İsimsiz Kullanıcı"}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="bg-black/5 dark:bg-white/10 text-black dark:text-white px-2 py-0.5 rounded text-xs font-bold font-mono">
                                    @{profile?.username || "username"}
                                </span>
                                {isAdmin && (
                                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            {isOwnProfile ? (
                                <Link href="/profil/duzenle" className="flex-1 sm:flex-none">
                                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 rounded-lg font-bold text-sm shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                        <Edit3 className="w-4 h-4" />
                                        <span>Düzenle</span>
                                    </button>
                                </Link>
                            ) : (
                                <>
                                    <FollowButton
                                        targetUserId={profile.id}
                                        initialIsFollowing={isFollowing}
                                        className="flex-1 sm:flex-none px-6 py-2 bg-black text-white rounded-lg font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                                    />
                                    <Link href={`/mesajlar?to=${profile.id}`}>
                                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                            <MessageCircle className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* BIO */}
                    {profile?.bio && (
                        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl font-medium">
                            {profile.bio}
                        </p>
                    )}

                    {/* META GRID */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-500">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors underline decoration-dotted">
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span>Website</span>
                            </a>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(profile?.created_at).getFullYear()}'den beri üye</span>
                        </div>
                    </div>
                </div>

                {/* BIG STATS */}
                <div className="hidden lg:flex gap-3">
                    <StatBox label="Takipçi" value={stats.followersCount} />
                    <StatBox label="Takip" value={stats.followingCount} />
                    <StatBox label="Hub Puan" value={stats.reputation} highlight />
                </div>
            </div>

            {/* MOBILE STATS SCROLL - Visible only on mobile/tablet */}
            <div className="lg:hidden mt-6 px-1 grid grid-cols-3 gap-2">
                <StatBox label="Takipçi" value={stats.followersCount} />
                <StatBox label="Takip" value={stats.followingCount} />
                <StatBox label="Hub Puan" value={stats.reputation} highlight />
            </div>
        </div>
    );
}

function StatBox({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl border-2 min-w-[80px]",
            highlight
                ? "bg-black dark:bg-zinc-100 border-black dark:border-white text-white dark:text-black"
                : "bg-white dark:bg-zinc-900 border-black/5 dark:border-white/10"
        )}>
            <span className={cn(
                "text-[10px] uppercase tracking-wider font-bold mb-0.5",
                highlight ? "text-white/60 dark:text-black/60" : "text-zinc-400"
            )}>
                {label}
            </span>
            <span className="text-xl font-black">{formatNumber(value)}</span>
        </div>
    );
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}
