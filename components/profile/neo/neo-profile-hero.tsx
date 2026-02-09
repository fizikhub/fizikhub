"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
    MapPin, Calendar, Link as LinkIcon, Edit3, Share2,
    UserPlus, Check, MessageSquare, ShieldCheck, Trophy,
    TrendingUp, Award, Zap
} from "lucide-react";
import Image from "next/image"; // Ensure next/image usage
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FollowButton } from "../follow-button";
import { formatNumber } from "@/lib/utils";

interface NeoProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing: boolean;
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
}

export function NeoProfileHero({
    profile,
    user,
    isOwnProfile,
    isFollowing,
    stats
}: NeoProfileHeroProps) {
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        setIsSharing(true);
        try {
            await navigator.clipboard.writeText(window.location.href);
            // toast.success("Profil bağlantısı kopyalandı!");
        } catch (err) {
            console.error("Failed to copy:", err);
        }
        setTimeout(() => setIsSharing(false), 2000);
    };

    // Stagger animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="w-full relative mb-12">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* 1. COVER IMAGE AREA - Massive & Immersive */}
                <div className="relative h-48 md:h-64 lg:h-72 w-full overflow-hidden rounded-t-3xl border-x-[3px] border-t-[3px] border-black dark:border-white bg-zinc-100 dark:bg-zinc-900 group">
                    <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay z-10 pointer-events-none"></div>

                    {profile?.cover_url ? (
                        <Image
                            src={profile.cover_url}
                            alt="Cover"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#4169E1_0,#4169E1_20px,#3152c1_20px,#3152c1_40px)] opacity-20"></div>
                    )}

                    {/* Decorative Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0"></div>
                </div>

                {/* 2. MAIN CONTENT AREA - Where the magic happens */}
                <div className="relative bg-white dark:bg-black border-[3px] border-black dark:border-white rounded-b-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 md:p-8 -mt-1 z-20 overflow-visible">

                    {/* FLOATING HEADER GRID */}
                    <div className="flex flex-col md:flex-row gap-6 items-start -mt-20 md:-mt-24 relative z-30 mb-8">

                        {/* AVATAR - Breaking the Grid */}
                        <motion.div
                            variants={itemVariants}
                            className="relative shrink-0"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-[4px] border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(240,204,21,1)] overflow-hidden rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
                                {profile?.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt={profile.full_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#FACC15] text-black font-black text-5xl">
                                        {profile?.full_name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>

                            {/* Verified Badge */}
                            <div className="absolute -bottom-2 -right-2 bg-[#4169E1] text-white p-1.5 rounded-lg border-[3px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-40">
                                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </motion.div>

                        {/* USER INFO & ACTIONS */}
                        <div className="flex-1 pt-4 md:pt-24 lg:pt-24 space-y-4 w-full">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">

                                {/* TEXT BIO */}
                                <motion.div variants={itemVariants} className="space-y-1 md:space-y-2 max-w-2xl">
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.9] font-head">
                                        {profile?.full_name || "İsimsiz Kullanıcı"}
                                    </h1>
                                    <a
                                        href={`/kullanici/${profile?.username}`}
                                        className="inline-block text-lg md:text-xl font-bold bg-[#FACC15] text-black px-2 py-0.5 border-2 border-black transform -skew-x-12 hover:skew-x-0 transition-transform cursor-pointer"
                                    >
                                        @{profile?.username}
                                    </a>

                                    {profile?.bio && (
                                        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed max-w-xl mt-4 border-l-4 border-[#4169E1] pl-3 py-1">
                                            {profile.bio}
                                        </p>
                                    )}
                                </motion.div>

                                {/* ACTION BUTTONS (Desktop) */}
                                <motion.div variants={itemVariants} className="flex flex-wrap gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                                    {isOwnProfile ? (
                                        <Link href="/profil/duzenle" className="w-full sm:w-auto">
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider border-[3px] border-transparent hover:border-black dark:hover:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] active:translate-y-[2px] active:shadow-none">
                                                <Edit3 className="w-4 h-4" />
                                                <span>Düzenle</span>
                                            </button>
                                        </Link>
                                    ) : (
                                        <>
                                            {/* Follow Button Wrapper for Consistent Height */}
                                            <div className="w-full sm:w-auto min-h-[48px] flex">
                                                <FollowButton
                                                    targetUserId={profile.id}
                                                    initialIsFollowing={isFollowing}
                                                    className="w-full h-full min-h-[48px] px-8 text-sm font-black uppercase tracking-wider rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#4169E1] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center bg-[#4169E1] text-white hover:bg-[#3152c1]"
                                                />
                                            </div>
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 text-black dark:text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider border-[3px] border-black dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none text-center">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>Mesaj</span>
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={handleShare}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 p-3 bg-[#FACC15] text-black rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFE066] active:translate-y-[2px] active:shadow-none transition-all"
                                        title="Profili Paylaş"
                                    >
                                        {isSharing ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                                        <span className="sm:hidden font-bold">PAYLAŞ</span>
                                    </button>
                                </motion.div>
                            </div>

                            {/* META INFO ROW */}
                            <motion.div variants={itemVariants} className="flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm font-bold text-zinc-500 dark:text-zinc-400 border-t-2 border-zinc-100 dark:border-zinc-800 mt-6">
                                {profile?.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-[#FF0080]" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile?.website && (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#4169E1] hover:underline transition-colors">
                                        <LinkIcon className="w-4 h-4 text-[#4169E1]" />
                                        <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-[#FACC15]" />
                                    <span>Katılım: {new Date(profile.created_at || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* 3. BENTO GRID STATS - Integrated into Hero */}
                    <div className="mt-8 pt-8 border-t-[3px] border-black dark:border-white border-dashed">
                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {/* HUB POINTS - MAIN CARD */}
                            <div className="col-span-2 md:col-span-1 bg-[#4169E1] text-white p-5 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                <div className="absolute top-0 right-0 p-2 opacity-20">
                                    <Trophy className="w-20 h-20 transform rotate-12 text-white" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Hub Puan</p>
                                <h3 className="text-5xl font-black font-head">{formatNumber(stats.reputation)}</h3>
                                <div className="mt-3 text-[10px] font-bold bg-black/20 text-white inline-block px-2 py-1 rounded max-w-fit backdrop-blur-sm">
                                    ELİT ÜYE
                                </div>
                            </div>

                            {/* FOLLOWERS */}
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-transform group">
                                <div className="flex justify-between items-start mb-3">
                                    <UserPlus className="w-6 h-6 text-zinc-400 group-hover:text-[#FACC15] transition-colors" />
                                    <span className="text-[10px] font-black uppercase text-zinc-300">Social</span>
                                </div>
                                <h3 className="text-4xl font-black text-black dark:text-white">{formatNumber(stats.followersCount)}</h3>
                                <p className="text-xs font-bold text-zinc-500 uppercase mt-1">Takipçi</p>
                            </div>

                            {/* FOLLOWING */}
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-transform group">
                                <div className="flex justify-between items-start mb-3">
                                    <TrendingUp className="w-6 h-6 text-zinc-400 group-hover:text-[#FF0080] transition-colors" />
                                    <span className="text-[10px] font-black uppercase text-zinc-300">Network</span>
                                </div>
                                <h3 className="text-4xl font-black text-black dark:text-white">{formatNumber(stats.followingCount)}</h3>
                                <p className="text-xs font-bold text-zinc-500 uppercase mt-1">Takip</p>
                            </div>

                            {/* TOTAL CONTENT */}
                            <div className="bg-[#FACC15] text-black p-5 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform relative overflow-hidden">
                                <div className="absolute -bottom-4 -right-4 opacity-10">
                                    <Zap className="w-24 h-24 rotate-[-12deg]" />
                                </div>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-8 h-8 rounded-full bg-black text-[#FACC15] flex items-center justify-center font-bold">
                                        <Zap className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                                <h3 className="text-4xl font-black text-black relative z-10">{stats.articlesCount + stats.questionsCount + stats.answersCount}</h3>
                                <p className="text-xs font-black opacity-70 uppercase relative z-10 mt-1">Katkı</p>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </div>

    );
}
