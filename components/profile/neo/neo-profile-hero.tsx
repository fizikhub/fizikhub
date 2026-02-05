"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import { Mail, Copy, Check, ShieldCheck, PenTool, Share2, Info } from "lucide-react";
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
        <div className="w-full relative group mb-4 sm:mb-8">
            {/* HERO BACKGROUND - MATTE BLACK / COVER IMAGE */}
            <div className={cn(
                "relative overflow-hidden bg-[#050505]", // Matte Deep Black
                "-mx-2 -mt-4 w-[calc(100%+1rem)] h-[160px] sm:h-[280px]", // Compact Mobile
                "border-b border-black rounded-b-[24px] sm:rounded-b-none sm:border-b-0",
                "sm:mx-0 sm:mt-0 sm:w-full",
                "sm:rounded-xl sm:border-2 sm:border-black sm:shadow-[8px_8px_0px_#000]"
            )}>
                {/* STATIC COVER IMAGE */}
                <div className="absolute inset-0 z-0">
                    {profile?.cover_url ? (
                        <img src={profile.cover_url} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-black to-zinc-900 opacity-50" />
                    )}
                </div>

                {/* VIGNETTE & GRAIN OVERLAY */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
                <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>

                {/* DESKTOP CONTENT */}
                <div className="absolute inset-0 z-20 hidden sm:flex flex-col sm:flex-row items-center sm:items-end p-8 gap-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="relative shrink-0 group/avatar"
                    >
                        <div className="w-36 h-36 bg-black border-[3px] border-white shadow-[8px_8px_0px_#4169E1] overflow-hidden rounded-xl relative z-10 transition-transform duration-300 group-hover/avatar:-translate-y-2 group-hover/avatar:shadow-[12px_12px_0px_#4169E1]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-black text-white">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -top-3 -right-3 bg-[#4169E1] text-white w-8 h-8 flex items-center justify-center rounded-full border-2 border-black z-20 shadow-[2px_2px_0px_#000]">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        )}
                    </motion.div>

                    <div className="flex-1 text-left mb-2">
                        <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-md font-[family-name:var(--font-outfit)] italic uppercase">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <div className="flex items-center justify-start gap-4 mt-2">
                            <button
                                onClick={handleCopyUsername}
                                className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded border border-white/10 text-zinc-300 font-mono text-xs tracking-wide transition-colors hover:bg-white hover:text-black"
                            >
                                @{profile?.username}
                                {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <div className="h-4 w-[1px] bg-white/20"></div>

                            {/* HUB PUAN - DESKTOP */}
                            <Link
                                href="/yardim/puanlar"
                                className="group/rep flex items-center gap-2 px-3 py-1 bg-[#4169E1]/10 border border-[#4169E1]/30 rounded-lg transition-all hover:bg-[#4169E1]/20 relative"
                            >
                                <div className="flex items-center justify-center w-5 h-5 bg-[#4169E1] rounded-md text-white font-black text-[10px] shadow-[0_0_10px_rgba(65,105,225,0.4)]">H</div>
                                <span className="text-[#4169E1] font-black tracking-wide text-sm">{formatNumber(stats?.reputation || 0)} <span className="opacity-70">HUB PUAN</span></span>

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-black border-2 border-[#4169E1] text-white rounded-xl shadow-2xl opacity-0 group-hover/rep:opacity-100 transition-all pointer-events-none z-50 w-48 text-[11px] font-bold leading-normal">
                                    Hub Puanı, FizikHub bilimsel ekosistemindeki etkinliğinizi ve katkılarınızı simgeler.
                                    <div className="mt-1 flex items-center gap-1 text-[#4169E1]"><Info className="w-3 h-3" /> Detaylar için tıkla</div>
                                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#4169E1]"></div>
                                </div>
                            </Link>
                        </div>
                        {profile?.bio && (
                            <p className="mt-4 text-zinc-300 text-sm max-w-lg leading-relaxed line-clamp-2 border-l-2 border-[#4169E1] pl-3">
                                {profile.bio}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 shrink-0 mb-2 min-w-[180px]">
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
                                        <button className="w-full px-6 py-3 bg-[#FACC15] text-black font-black uppercase tracking-wider text-xs border-2 border-black rounded-lg hover:shadow-[4px_4px_0px_#fff] transition-all active:translate-y-1 active:shadow-none">
                                            DÜZENLE
                                        </button>
                                    }
                                />
                                <Link href="/mesajlar">
                                    <button className="w-full px-6 py-3 bg-zinc-900 text-white font-black uppercase tracking-wider text-xs border-2 border-zinc-700 rounded-lg hover:border-white transition-all flex items-center justify-center gap-2">
                                        <Mail className="w-3.5 h-3.5" /> MESAJLARIM
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="modern" />
                                <Link href="/mesajlar">
                                    <button className="w-full px-6 py-3 bg-white text-black font-black uppercase tracking-wider text-xs border-2 border-black rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none">
                                        <Mail className="w-3.5 h-3.5" /> MESAJ AT
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE LAYOUT (Compact & App-Like) */}
            <div className="relative px-4 sm:hidden -mt-10 z-30 font-[family-name:var(--font-outfit)]">
                <div className="flex items-end justify-between gap-4">
                    {/* Avatar - Mobile */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl border-[4px] border-[#050505] bg-[#09090b] overflow-hidden shadow-2xl ring-1 ring-white/10">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-2xl font-black text-zinc-700">
                                    ?
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-1.5 -right-1.5 bg-[#4169E1] text-white p-1 rounded-full border-[3px] border-[#050505] z-20 shadow-sm">
                                <ShieldCheck className="w-3 h-3" />
                            </div>
                        )}
                    </div>

                    {/* Stats Block - Mobile */}
                    <div className="flex gap-1.5 flex-1 justify-end pb-1">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/5 p-2 rounded-xl text-center min-w-[65px] active:scale-95 transition-transform">
                            <span className="block font-black text-lg text-white leading-none tracking-tight">{formatNumber(stats?.followersCount || 0)}</span>
                            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-0.5 block">Takipçi</span>
                        </div>
                        <div className="bg-black/60 backdrop-blur-xl border border-white/5 p-2 rounded-xl text-center min-w-[65px] active:scale-95 transition-transform">
                            <span className="block font-black text-lg text-white leading-none tracking-tight">{formatNumber(stats?.followingCount || 0)}</span>
                            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-0.5 block">Takip</span>
                        </div>
                    </div>
                </div>

                {/* Name & Bio - Compact Mobile */}
                <div className="mt-3 space-y-3">
                    <div>
                        <h1 className="text-2xl leading-none font-black text-white italic tracking-tighter">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <button
                            onClick={handleCopyUsername}
                            className="text-xs font-medium text-zinc-500 mt-1 flex items-center gap-1 font-mono"
                        >
                            @{profile?.username}
                            {isCopied && <Check className="w-3 h-3 text-green-500" />}
                        </button>
                    </div>

                    {profile?.bio && (
                        <p className="text-[12px] text-zinc-400 leading-snug line-clamp-3 border-l-2 border-[#4169E1] pl-3 py-0.5">
                            {profile.bio}
                        </p>
                    )}

                    {/* Actions Row - Mobile */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                        {/* HUB PUAN - MOBILE */}
                        <Link
                            href="/yardim/puanlar"
                            className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg active:scale-95 transition-all"
                        >
                            <div className="flex items-center justify-center w-4 h-4 bg-[#4169E1] rounded text-white font-black text-[8px] shadow-[0_0_8px_rgba(65,105,225,0.4)]">H</div>
                            <span className="text-[10px] font-black text-white tracking-wider">
                                {formatNumber(stats?.reputation || 0)} <span className="text-zinc-600">HUB PUAN</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-1.5">
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
                                            <button className="h-8 px-3 bg-[#FACC15] text-black font-black text-[9px] rounded-lg border border-yellow-600/20 active:scale-95 transition-all uppercase tracking-wide">
                                                DÜZENLE
                                            </button>
                                        }
                                    />
                                    <Link href="/mesajlar" className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 active:scale-95 transition-all">
                                        <Mail className="w-3.5 h-3.5" />
                                    </Link>
                                    {(profile?.role === 'author' || profile?.role === 'admin') && (
                                        <Link href="/yazar/yeni" className="h-8 px-2 flex items-center justify-center bg-zinc-950 text-emerald-500 border border-emerald-900/40 font-bold text-[9px] rounded-lg active:scale-95 transition-all">
                                            <PenTool className="w-3.5 h-3.5" />
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleShareProfile}
                                        className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 active:scale-95 transition-all"
                                    >
                                        <Share2 className="w-3.5 h-3.5" />
                                    </button>
                                    <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="default" />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
