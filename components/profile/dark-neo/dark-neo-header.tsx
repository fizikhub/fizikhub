"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, MessageCircle, Settings, PenSquare, Share2 } from "lucide-react";
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
        <div className="w-full relative">
            {/* COVER SECTION */}
            <div className="relative h-48 sm:h-64 border-b-3 border-black dark:border-white overflow-hidden bg-zinc-100 dark:bg-zinc-900 group">
                {hasCoverPhoto ? (
                    <img
                        src={profile.cover_url}
                        alt="Kapak fotoğrafı"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full relative overflow-hidden bg-[#FFDE59] dark:bg-[#1A1A1A]">
                        {/* Abstract Geometric Pattern */}
                        <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[radial-gradient(circle_at_2px_2px,_black_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[size:24px_24px]" />
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-black dark:bg-white clip-path-polygon-[0_0,_100%_0,_100%_100%] opacity-10" />
                        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-black dark:border-white rounded-full" />
                        <div className="absolute top-10 right-20 w-16 h-16 bg-black dark:bg-white rotate-45" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
            </div>

            {/* PROFILE INFO & ACTIONS */}
            <div className="px-4 sm:px-8 pb-8">
                <div className="flex flex-col md:flex-row items-end -mt-16 md:-mt-20 relative z-10 gap-6">
                    
                    {/* AVATAR */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white dark:bg-black border-3 border-black dark:border-white shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#FFF]">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-4xl font-black bg-primary text-black rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </motion.div>

                    {/* NAME & BIO */}
                    <div className="flex-1 min-w-0 mb-2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white leading-none tracking-tighter uppercase mb-2">
                            {profile?.full_name || "New User"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
                            <span className="bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 transform -skew-x-12">
                                @{profile?.username || "username"}
                            </span>
                            {profile?.location && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    {profile.location}
                                </span>
                            )}
                        </div>
                        
                        {profile?.bio && (
                            <p className="mt-4 text-base font-medium leading-relaxed max-w-2xl text-black/80 dark:text-white/80 border-l-4 border-primary pl-4 py-1">
                                {profile.bio}
                            </p>
                        )}
                        
                        {/* URL & DATE */}
                        <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            {profile?.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    {profile.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Joined {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mb-2">
                        {isOwnProfile ? (
                            <>
                                <Link href="/profil/duzenle" className="w-full md:w-auto">
                                    <button className="neo-button-primary w-full md:w-full gap-2">
                                        <Edit3 className="w-4 h-4" />
                                        Düzenle
                                    </button>
                                </Link>
                                <div className="flex gap-3">
                                    <Link href="/mesajlar" className="flex-1">
                                        <button className="neo-button-secondary w-full gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                            Mesaj
                                        </button>
                                    </Link>
                                    <button className="neo-button-secondary px-3">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {profile?.is_writer && (
                                    <Link href="/yazar/yeni" className="w-full md:w-auto">
                                        <button className="neo-button-secondary w-full gap-2 bg-yellow-100 dark:bg-zinc-800">
                                            <PenSquare className="w-4 h-4" />
                                            Yaz
                                        </button>
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <FollowButton
                                    targetUserId={profile.id}
                                    initialIsFollowing={isFollowing}
                                    className="neo-button-primary w-full md:w-48"
                                />
                                <div className="flex gap-3">
                                    <Link href={`/mesajlar?to=${profile.id}`} className="flex-1">
                                        <button className="neo-button-secondary w-full gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                            Mesaj
                                        </button>
                                    </Link>
                                    <button className="neo-button-secondary px-3">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* STATS BAR */}
                <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8 border-t-2 border-black/10 dark:border-white/10 pt-6">
                    <StatItem label="Takipçi" value={stats.followersCount} delay={0.1} />
                    <StatItem label="Takip" value={stats.followingCount} delay={0.2} />
                    <StatItem label="Hub Puan" value={stats.reputation} delay={0.3} isHighlighted />
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, delay, isHighlighted = false }: any) {
    return (
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay }}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#FFF] ${isHighlighted ? 'bg-primary text-black' : 'bg-white dark:bg-zinc-900'}`}
        >
            <span className="text-xl sm:text-3xl font-black tabular-nums tracking-tight">
                {formatNumber(value)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-70">
                {label}
            </span>
        </motion.div>
    );
}
