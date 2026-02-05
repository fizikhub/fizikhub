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
            <div className="relative px-5 sm:hidden z-30 -mt-20">
                <div className="flex flex-col items-center text-center">
                    {/* Avatar - Mobile (Overlap) */}
                    <div className="relative mb-4">
                        <div className="w-28 h-28 rounded-[2rem] border-[6px] border-[#0a0a0a] bg-zinc-900 overflow-hidden shadow-2xl relative">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover scale-110" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-black text-zinc-700">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                            <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"></div>
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-1 -right-1 bg-[#4169E1] text-white p-1.5 rounded-full border-[4px] border-[#0a0a0a] z-20 shadow-lg">
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                        )}
                    </div>

                    {/* Identity Block */}
                    <div className="space-y-1.5 mb-5">
                        <h1 className="text-3xl font-black text-white italic tracking-tighter leading-none">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <div className="flex flex-col items-center gap-2">
                            <button onClick={handleCopyUsername} className="text-[11px] font-black tracking-widest uppercase text-zinc-500 flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1 rounded-full w-fit hover:bg-white/10 transition-all">
                                @{profile?.username}
                                {isCopied && <Check className="w-3 h-3 text-green-500" />}
                            </button>

                            {/* CLEAN STATS ROW - MOBILE */}
                            <div className="flex items-center gap-6 mt-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-black text-white">{formatNumber(stats?.followersCount || 0)}</span>
                                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Takipçi</span>
                                </div>
                                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-black text-white">{formatNumber(stats?.followingCount || 0)}</span>
                                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Takip</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {profile?.bio && (
                        <div className="w-full mb-6">
                            <p className="text-[13px] text-zinc-400 leading-relaxed font-medium bg-white/[0.02] border border-white/5 p-4 rounded-2xl italic">
                                "{profile.bio}"
                            </p>
                        </div>
                    )}

                    {/* ACTION BAR - MOBILE */}
                    <div className="w-full flex items-center justify-between gap-2.5 p-2.5 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl">
                        {/* HUB PUAN COMPACT */}
                        <Link
                            href="/yardim/puanlar"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-white/5 rounded-xl active:scale-95 transition-all"
                        >
                            <div className="flex items-center justify-center w-5 h-5 bg-[#4169E1] rounded-md text-white font-black text-[10px]">H</div>
                            <span className="text-xs font-black text-white whitespace-nowrap">
                                {formatNumber(stats?.reputation || 0)} <span className="text-white/30 ml-0.5">PTS</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-2">
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
                                            <button className="h-10 px-6 bg-[#FFC800] text-black font-black text-[10px] rounded-xl border border-black/10 active:scale-95 transition-all uppercase tracking-widest shadow-lg shadow-yellow-900/10">
                                                DÜZENLE
                                            </button>
                                        }
                                    />
                                    <Link href="/mesajlar" className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 active:scale-95 transition-all">
                                        <Mail className="w-4 h-4" />
                                    </Link>
                                    {profile?.username === 'baranbozkurt' && (
                                        <Link href="/admin" className="h-10 w-10 flex items-center justify-center bg-red-950/20 text-red-500 border border-red-900/20 rounded-xl active:scale-95 transition-all">
                                            <Settings className="w-4 h-4" />
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="default" />
                                    <button
                                        onClick={handleShareProfile}
                                        className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 active:scale-95 transition-all"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
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
