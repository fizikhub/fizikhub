"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Link as LinkIcon, Edit3, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
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

    return (
        <div className="w-full">
            {/* COVER BANNER */}
            <div className="relative h-44 sm:h-52 md:h-60 overflow-visible rounded-t-2xl border-2 border-b-0 border-white/10">
                {/* Deep royal blue gradient base */}
                <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-br from-[#0f1a2e] via-[#1E3A5F] to-[#0a1628]" />

                {/* Animated subtle glow */}
                <motion.div
                    animate={{
                        opacity: [0.15, 0.25, 0.15],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -left-20 w-56 h-56 bg-[#2C5282]/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-12 -right-12 w-40 h-40 bg-yellow-500/15 rounded-full blur-3xl"
                />

                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden opacity-50 rounded-t-2xl">
                    <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-6 left-8 text-yellow-400/60 text-lg"
                    >✦</motion.span>
                    <span className="absolute top-10 right-16 text-white/30 text-sm">✦</span>
                    <motion.span
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute bottom-12 left-24 text-yellow-400/50 text-xs"
                    >✧</motion.span>
                    <span className="absolute bottom-14 right-1/3 text-white/20 text-sm">★</span>
                    <div className="absolute top-10 right-14 w-5 h-5 border-2 border-yellow-400/20 rotate-12 rounded-sm" />
                    <div className="absolute bottom-16 left-12 w-3 h-3 bg-white/10 rounded-full" />
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 rounded-t-2xl bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* FOLLOWER/FOLLOWING BOXES - Equal size */}
                <div className="absolute -bottom-7 right-4 sm:right-6 flex gap-2 z-20">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="bg-card/95 backdrop-blur-md border-2 border-border/40 rounded-xl w-20 sm:w-24 py-3 shadow-xl text-center cursor-default"
                    >
                        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Takipçi</p>
                        <h3 className="text-lg sm:text-xl font-black text-foreground tabular-nums">{formatNumber(stats.followersCount)}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="bg-card/95 backdrop-blur-md border-2 border-border/40 rounded-xl w-20 sm:w-24 py-3 shadow-xl text-center cursor-default"
                    >
                        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Takip</p>
                        <h3 className="text-lg sm:text-xl font-black text-foreground tabular-nums">{formatNumber(stats.followingCount)}</h3>
                    </motion.div>
                </div>
            </div>

            {/* CONTENT CARD */}
            <div className="relative bg-background border-2 border-white/10 border-t-0 rounded-b-2xl pt-16 sm:pt-20 pb-6 px-4 sm:px-6">

                {/* FLOATING AVATAR with glow */}
                <div className="absolute -top-12 sm:-top-14 left-4 sm:left-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="relative group"
                    >
                        {/* Avatar glow effect */}
                        <div className="absolute inset-0 bg-[#1E3A5F]/30 rounded-xl blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-background rounded-xl border-2 border-white/20 shadow-[4px_4px_0_#1E3A5F] overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] text-white rounded-none">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Verified badge with pulse */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-1.5 rounded-lg border-2 border-black shadow-sm"
                        >
                            <ShieldCheck className="w-3 h-3" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* NAME & HANDLE */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-5"
                >
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
                        {profile?.full_name || "New User"}
                    </h1>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] sm:text-xs font-bold bg-[#1E3A5F] text-white px-2.5 py-1 rounded-md">
                        @{profile?.username || "username"}
                    </span>
                </motion.div>

                {/* ACTION BUTTONS */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-2 mb-5"
                >
                    {isOwnProfile ? (
                        <>
                            <Link href="/profil/duzenle" className="flex-1">
                                <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-black px-4 py-3 rounded-xl font-bold text-sm border-2 border-black shadow-[3px_3px_0_#1E3A5F] hover:shadow-[1px_1px_0_#1E3A5F] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-[0.98]">
                                    <Edit3 className="w-4 h-4" />
                                    Profili Düzenle
                                </button>
                            </Link>
                            <Link href="/mesajlar">
                                <button className="flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#2C5282] text-white px-4 py-3 rounded-xl font-bold text-sm border-2 border-black shadow-[3px_3px_0_#000] hover:shadow-[1px_1px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-[0.98]">
                                    <MessageCircle className="w-4 h-4" />
                                    Mesajlar
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <FollowButton
                                targetUserId={profile.id}
                                initialIsFollowing={isFollowing}
                                className="flex-1 px-4 py-3 text-sm font-bold rounded-xl border-2 border-black shadow-[3px_3px_0_#1E3A5F]"
                            />
                            <Link href={`/mesajlar?to=${profile.id}`}>
                                <button className="flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#2C5282] text-white px-4 py-3 rounded-xl font-bold text-sm border-2 border-black shadow-[3px_3px_0_#000] hover:shadow-[1px_1px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-[0.98]">
                                    <MessageCircle className="w-4 h-4" />
                                    Mesaj
                                </button>
                            </Link>
                        </>
                    )}
                </motion.div>

                {/* BIO */}
                {profile?.bio && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground text-sm leading-relaxed mb-5 border-l-3 border-[#1E3A5F] pl-4 py-1 italic"
                    >
                        "{profile.bio}"
                    </motion.p>
                )}

                {/* META INFO */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground mb-5"
                >
                    {profile?.location && (
                        <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-pink-400" />
                            <span>{profile.location}</span>
                        </div>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#2C5282] transition-colors group">
                            <LinkIcon className="w-3.5 h-3.5 text-[#2C5282]" />
                            <span className="group-hover:underline">{profile.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{new Date(profile?.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </motion.div>

                {/* HUB PUAN - Premium card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    whileHover={{ scale: 1.01 }}
                    className="relative bg-gradient-to-br from-[#1E3A5F] to-[#0f1a2e] p-4 rounded-xl border border-white/10 overflow-hidden cursor-default"
                >
                    {/* Decorative sparkle */}
                    <Sparkles className="absolute top-3 right-3 w-4 h-4 text-yellow-400/40" />

                    <div className="relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Hub Puan</p>
                        <h3 className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                            {formatNumber(stats.reputation)}
                        </h3>
                    </div>

                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shine_3s_infinite]" />
                </motion.div>
            </div>
        </div>
    );
}
