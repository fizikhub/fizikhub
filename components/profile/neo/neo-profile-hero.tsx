"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import { Mail, Copy, Check, ShieldCheck, PenTool, Share2, Info, Settings } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface NeoProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    stats?: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
}

export function NeoProfileHero({ profile, user, isOwnProfile, isFollowing = false, stats }: NeoProfileHeroProps) {
    const [isCopied, setIsCopied] = useState(false);

    const formatNumber = (num: number) =>
        new Intl.NumberFormat('tr-TR', { notation: "compact", maximumFractionDigits: 1 }).format(num);

    const handleCopyUsername = () => {
        if (!profile?.username) return;
        navigator.clipboard.writeText(`@${profile.username}`);
        setIsCopied(true);
        toast.success("Kullanıcı adı kopyalandı!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleShareProfile = () => {
        const url = `${window.location.origin}/p/${profile?.username || profile?.id}`;
        if (navigator.share) {
            navigator.share({
                title: `${profile?.full_name} - FizikHub Profili`,
                url: url,
            }).catch(() => {
                navigator.clipboard.writeText(url);
                toast.success("Profil linki kopyalandı!");
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Profil linki kopyalandı!");
        }
    };

    return (
        <div className="w-full relative group mb-2 sm:mb-8 font-[family-name:var(--font-outfit)]">
            {/* HERO BACKGROUND - COVER IMAGE */}
            <div className={cn(
                "relative overflow-hidden bg-zinc-950",
                "-mx-2 -mt-4 w-[calc(100%+1rem)] h-[180px] sm:h-[300px]", // Increased mobile/desktop height
                "border-b border-white/5 rounded-b-[32px] sm:rounded-b-none sm:border-b-0",
                "sm:mx-0 sm:mt-0 sm:w-full",
                "sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-2xl"
            )}>
                {/* STATIC COVER IMAGE */}
                <div className="absolute inset-0 z-0">
                    {profile?.cover_url ? (
                        <img src={profile.cover_url} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] opacity-80" />
                    )}
                </div>

                {/* VIGNETTE OVERLAY */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>

                {/* Desktop Identity Overlay */}
                <div className="absolute bottom-6 left-8 z-20 hidden sm:flex items-end gap-6 w-full pr-16">
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-2xl border-4 border-black bg-zinc-900 overflow-hidden shadow-2xl relative">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-black text-white">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-2 -right-2 bg-[#4169E1] text-white w-8 h-8 flex items-center justify-center rounded-full border-2 border-black z-20 shadow-lg">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-left pb-2">
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic drop-shadow-xl">{profile?.full_name || "İsimsiz"}</h1>
                        <p className="text-zinc-400 font-mono text-sm mt-1">@{profile?.username}</p>
                    </div>
                </div>
            </div>

            {/* MOBILE LAYOUT CONTENT */}
            <div className="relative px-4 sm:hidden z-30 -mt-12">
                <div className="flex items-end justify-between gap-4">
                    {/* Avatar - Mobile (Overlap) */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl border-[5px] border-background bg-zinc-900 overflow-hidden shadow-2xl">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-2xl font-black text-zinc-700">
                                    ?
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-1 -right-1 bg-[#4169E1] text-white p-1 rounded-full border-[3px] border-background z-20">
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                        )}
                    </div>

                    {/* Stats Overlap Block - Mobile */}
                    <div className="flex gap-1.5 flex-1 justify-end transform -translate-y-4">
                        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2.5 rounded-xl text-center min-w-[70px] shadow-2xl">
                            <span className="block font-black text-xl text-white leading-none tracking-tight">{formatNumber(stats?.followersCount || 0)}</span>
                            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-0.5 block">Takipçi</span>
                        </div>
                        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2.5 rounded-xl text-center min-w-[70px] shadow-2xl">
                            <span className="block font-black text-xl text-white leading-none tracking-tight">{formatNumber(stats?.followingCount || 0)}</span>
                            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-0.5 block">Takip</span>
                        </div>
                    </div>
                </div>

                {/* Name & Bio - Mobile */}
                <div className="mt-4 space-y-4">
                    <div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter leading-none">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <button onClick={handleCopyUsername} className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-1.5 bg-zinc-900/40 px-2 py-0.5 rounded-md border border-white/5 w-fit">
                            @{profile?.username}
                            {isCopied && <Check className="w-3 h-3 text-green-500" />}
                        </button>
                    </div>

                    {profile?.bio && (
                        <p className="text-[13px] text-zinc-400 leading-relaxed border-l-2 border-[#4169E1] pl-3 py-1">
                            {profile.bio}
                        </p>
                    )}

                    {/* Desktop/Tablet like actions bar on mobile */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5 mt-4 pt-4">
                        {/* HUB PUAN - MOBILE */}
                        <Link
                            href="/yardim/puanlar"
                            className="flex items-center gap-2.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all border-b-2"
                        >
                            <div className="flex items-center justify-center w-5 h-5 bg-[#4169E1] rounded-md text-white font-black text-[10px] shadow-lg shadow-blue-900/20">H</div>
                            <span className="text-xs font-black text-white tracking-wider">
                                {formatNumber(stats?.reputation || 0)} <span className="text-zinc-500">HUB PUAN</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-2 ml-auto">
                            {isOwnProfile ? (
                                <>
                                    {/* ADMIN BUTTON (Only for the owner @baranbozkurt) */}
                                    {profile?.username === 'baranbozkurt' && (
                                        <Link href="/admin" className="h-9 w-9 flex items-center justify-center bg-red-950/20 text-red-500 border border-red-900/30 rounded-xl hover:bg-red-950/40 transition-all">
                                            <Settings className="w-4 h-4" />
                                        </Link>
                                    )}

                                    <ProfileSettingsDialog
                                        currentUsername={profile?.username}
                                        currentFullName={profile?.full_name}
                                        currentBio={profile?.bio}
                                        currentAvatarUrl={profile?.avatar_url}
                                        currentCoverUrl={profile?.cover_url}
                                        currentWebsite={profile?.website}
                                        currentSocialLinks={profile?.social_links}
                                        userEmail={user?.email}
                                        trigger={
                                            <button className="h-9 px-5 bg-primary text-black font-black text-[10px] rounded-xl border border-black/10 active:scale-95 transition-all uppercase tracking-wider">
                                                DÜZENLE
                                            </button>
                                        }
                                    />
                                    <Link href="/mesajlar" className="w-9 h-9 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400">
                                        <Mail className="w-4 h-4" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleShareProfile}
                                        className="w-9 h-9 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="default" />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* DESKTOP ACTIONS BAR (Optional/Extra) */}
            <div className="hidden sm:flex mt-8 items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-white">{formatNumber(stats?.followersCount || 0)}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Takipçi</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-white">{formatNumber(stats?.followingCount || 0)}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Takip</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    {isOwnProfile && profile?.username === 'baranbozkurt' && (
                        <Link href="/admin">
                            <button className="px-4 py-2 bg-red-950/20 text-red-500 font-bold text-xs rounded-lg border border-red-900/30 hover:bg-red-950/40">
                                ADMIN PANELİ
                            </button>
                        </Link>
                    )}

                    {isOwnProfile ? (
                        <>
                            <ProfileSettingsDialog
                                currentUsername={profile?.username}
                                currentFullName={profile?.full_name}
                                currentBio={profile?.bio}
                                currentAvatarUrl={profile?.avatar_url}
                                currentCoverUrl={profile?.cover_url}
                                currentWebsite={profile?.website}
                                currentSocialLinks={profile?.social_links}
                                userEmail={user?.email}
                                trigger={
                                    <button className="px-6 py-2 bg-primary text-black font-black uppercase text-xs rounded-lg border border-black/10 hover:shadow-lg transition-all">
                                        PROFİLİ DÜZENLE
                                    </button>
                                }
                            />
                        </>
                    ) : (
                        <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="modern" />
                    )}
                </div>
            </div>
        </div>
    );
}
