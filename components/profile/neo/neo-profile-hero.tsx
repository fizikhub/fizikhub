"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import { Mail, Copy, Check, ShieldCheck, Settings, Share2, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
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
        <div className="w-full relative font-[family-name:var(--font-outfit)] mb-8">
            {/* NEO-BRUTALIST CONTAINER */}
            <div className="relative bg-[#f0f0f0] dark:bg-[#09090b] border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] rounded-xl overflow-hidden">

                {/* COVER IMAGE AREA */}
                <div className="h-[140px] sm:h-[220px] w-full border-b-[3px] border-black dark:border-white relative bg-zinc-200 dark:bg-zinc-900 pattern-grid-lg">
                    {profile?.cover_url ? (
                        <img src={profile.cover_url} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                        <div className="w-full h-full bg-[#FFDE59] dark:bg-[#4169E1] relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                            </div>
                        </div>
                    )}
                </div>

                {/* PROFILE CONTENT */}
                <div className="px-4 pb-6 pt-0 sm:px-8 sm:pb-8 relative">

                    {/* AVATAR & ACTIONS ROW */}
                    <div className="flex justify-between items-end -mt-10 sm:-mt-14 mb-4">
                        {/* AVATAR */}
                        <div className="relative group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-[3px] border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#FF5757] text-white text-3xl font-black uppercase">
                                        {profile?.full_name?.charAt(0) || "?"}
                                    </div>
                                )}
                            </div>
                            {profile?.is_verified && (
                                <div className="absolute -bottom-2 -right-2 bg-[#4169E1] text-white w-7 h-7 flex items-center justify-center rounded-full border-2 border-black z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        {/* DESKTOP ACTIONS */}
                        <div className="hidden sm:flex gap-3 mb-1">
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
                                            <button className="h-10 px-5 bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white font-bold text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all uppercase rounded-lg flex items-center gap-2">
                                                <Settings className="w-4 h-4" />
                                                Profili Düzenle
                                            </button>
                                        }
                                    />
                                    <Link href="/mesajlar" className="h-10 w-10 flex items-center justify-center bg-[#FFDE59] border-2 border-black text-black rounded-lg hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                                        <Mail className="w-5 h-5" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleShareProfile}
                                        className="h-10 px-4 flex items-center gap-2 bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white font-bold rounded-lg hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Paylaş
                                    </button>
                                    <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="neo" />
                                </>
                            )}
                        </div>

                        {/* MOBILE ACTIONS */}
                        <div className="flex sm:hidden gap-2 mb-0.5">
                            {isOwnProfile ? (
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
                                        <button className="h-9 px-4 bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase rounded-lg">
                                            Düzenle
                                        </button>
                                    }
                                />
                            ) : (
                                <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="neo-sm" />
                            )}

                            <button onClick={handleShareProfile} className="h-9 w-9 flex items-center justify-center bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* NAME & BIO SECTION */}
                    <div className="space-y-3">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-black text-black dark:text-white uppercase leading-none tracking-tight">
                                {profile?.full_name || "İsimsiz"}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-bold">@{profile?.username}</span>
                                <button
                                    onClick={handleCopyUsername}
                                    className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
                                >
                                    {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                                </button>
                            </div>
                        </div>

                        {/* BIO */}
                        {profile?.bio && (
                            <div className="p-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-lg max-w-2xl relative">
                                <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                                    {profile.bio}
                                </p>
                            </div>
                        )}

                        {/* META INFO */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Katıldı: {new Date(user?.created_at || profile?.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            {profile?.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#4169E1] hover:underline transition-all">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    <span>Website</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* STATS BAR - COMPACT NEO */}
                    <div className="grid grid-cols-3 sm:flex sm:items-center gap-3 sm:gap-6 mt-6 py-4 border-t-2 border-black/10 dark:border-white/10">

                        {/* HUB SCORE */}
                        <Link href="/yardim/puanlar" className="col-span-3 sm:col-span-1 group">
                            <div className="flex items-center justify-between sm:justify-start gap-3 px-3 py-2 bg-[#4169E1] text-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                                <div className="font-black text-2xl">{formatNumber(stats?.reputation || 0)}</div>
                                <div className="text-[10px] font-black uppercase text-white/80 leading-tight text-right sm:text-left">
                                    Hub<br />Puan
                                </div>
                            </div>
                        </Link>

                        <div className="flex flex-col items-center sm:items-start p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                            <span className="font-black text-xl text-black dark:text-white">{formatNumber(stats?.followersCount || 0)}</span>
                            <span className="text-[10px] uppercase font-bold text-zinc-500">Takipçi</span>
                        </div>

                        <div className="flex flex-col items-center sm:items-start p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                            <span className="font-black text-xl text-black dark:text-white">{formatNumber(stats?.followingCount || 0)}</span>
                            <span className="text-[10px] uppercase font-bold text-zinc-500">Takip</span>
                        </div>

                        <div className="flex flex-col items-center sm:items-start p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <span className="font-black text-xl text-black dark:text-white">{formatNumber(stats?.articlesCount || 0)}</span>
                            <span className="text-[10px] uppercase font-bold text-zinc-500">Makale</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

