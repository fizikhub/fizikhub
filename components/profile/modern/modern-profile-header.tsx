"use client";

import { cn } from "@/lib/utils";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import {
    Calendar,
    Link as LinkIcon,
    Share2,
    Twitter,
    Github,
    Instagram,
    Linkedin,
    BadgeCheck,
    Mail,
    Settings,
    MapPin,
    Edit3
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

const GRADIENTS = [
    "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
    "bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500",
    "bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500",
    "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500",
];

interface ModernProfileHeaderProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
    userBadges?: any[];
    unreadCount?: number;
}

export function ModernProfileHeader({
    profile,
    user,
    isOwnProfile,
    isFollowing = false,
    stats,
    userBadges = [],
    unreadCount = 0
}: ModernProfileHeaderProps) {
    const gradientIndex = profile?.id ?
        profile.id.charCodeAt(0) % GRADIENTS.length : 0;
    const gradient = GRADIENTS[gradientIndex];

    const isAdmin = profile?.is_admin;
    const isWriter = profile?.is_writer;
    const isVerified = profile?.is_verified;

    return (
        <div className="w-full flex flex-col relative mb-4">

            {/* === IMMERSIVE COVER IMAGE === */}
            {/* Reduced height on mobile as requested, kept immersive on desktop */}
            <div className="relative h-[200px] sm:h-[350px] w-full overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[4rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] z-0">
                <div className={cn("w-full h-full", !profile?.cover_url && gradient)}>
                    {profile?.cover_url && (
                        <img
                            src={profile.cover_url}
                            alt="Cover"
                            className="w-full h-full object-cover brightness-[0.9]"
                        />
                    )}
                </div>
                {/* Refined gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />

                {/* ACTION BUTTONS */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 hover:scale-105 transition-all active:scale-95"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    {isOwnProfile && (
                        <div className="relative">
                            <Link
                                href="/mesajlar"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 hover:scale-105 transition-all active:scale-95"
                            >
                                <Mail className="w-5 h-5" />
                            </Link>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-transparent shadow-lg animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* === CENTERED AVATAR === */}
            {/* Adjusted top position for smaller mobile cover */}
            <div className="absolute top-[140px] sm:top-[270px] left-1/2 -translate-x-1/2 z-10">
                <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full p-1.5 bg-background shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                    <div className="w-full h-full rounded-full overflow-hidden relative group cursor-pointer border-2 border-muted/20">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-black text-muted-foreground">
                                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute bottom-1 right-1">
                    {isVerified && (
                        <div className="bg-background text-blue-500 rounded-full p-1 shadow-lg">
                            <BadgeCheck className="w-6 h-6 fill-current" />
                        </div>
                    )}
                </div>
            </div>

            {/* === PROFILE CONTENT === */}
            <div className="px-4 pt-16 sm:pt-20 pb-2 flex flex-col items-center text-center">

                {/* NAME & HANDLE */}
                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-none uppercase italic text-foreground drop-shadow-sm">
                        {profile?.full_name || "İsimsiz"}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground font-mono font-bold">@{profile?.username || "yok"}</span>
                        {isAdmin && <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black rounded uppercase shadow-sm">ADMIN</span>}
                        {isWriter && !isAdmin && <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded uppercase shadow-sm">YAZAR</span>}
                    </div>
                </div>

                {/* BIO */}
                {profile?.bio && (
                    <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-muted-foreground/90 font-medium">
                        {profile.bio}
                    </p>
                )}

                {/* METADATA */}
                <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-80">
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Web Sİtesİ</span>
                        </a>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span>
                    </div>
                </div>

                {/* COOL POP STATS */}
                <div className="mt-8 flex justify-center gap-4 w-full max-w-md px-2">
                    <PopStat
                        value={stats.followersCount}
                        label="Gözlemci"
                        emoji="👀"
                        color="bg-[#A0E7E5] dark:bg-[#A0E7E5]" // Pastel Cyan
                    />
                    <PopStat
                        value={stats.followingCount}
                        label="Takip"
                        emoji="🛸"
                        color="bg-[#B4F8C8] dark:bg-[#B4F8C8]" // Pastel Green
                    />
                    <PopStat
                        value={stats.reputation}
                        label="Beyin Gücü"
                        emoji="🧠"
                        color="bg-[#FBE7C6] dark:bg-[#FBE7C6]" // Pastel Yellow
                    />
                </div>

                {/* PRIMARY ACTIONS - Moved below stats for better flow */}
                <div className="mt-8 flex items-center justify-center gap-3 w-full max-w-xs">
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
                                <button className="w-full py-3 rounded-xl font-black text-sm border-[3px] border-black dark:border-white bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                                    <Edit3 className="w-4 h-4" />
                                    DÜZENLE
                                </button>
                            }
                        />
                    ) : (
                        <div className="flex gap-3 w-full">
                            <div className="flex-1">
                                <FollowButton
                                    targetUserId={profile?.id}
                                    initialIsFollowing={isFollowing}
                                    targetUsername={profile?.username}
                                    variant="modern"
                                />
                            </div>
                            <button className="w-12 h-12 flex items-center justify-center rounded-xl border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function PopStat({ value, label, emoji, color }: { value: number, label: string, emoji: string, color: string }) {
    return (
        <div className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 rounded-xl border-[3px] border-black transition-all hover:-translate-y-1 hover:rotate-3 cursor-default shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
            color
        )}>
            <div className="text-2xl mb-1 filter drop-shadow-md animate-bounce-slow" style={{ animationDuration: '3s' }}>{emoji}</div>
            <span className="text-xl sm:text-2xl font-black text-black leading-none tabular-nums">
                {value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value}
            </span>
            <span className="text-[10px] font-black text-black/70 uppercase tracking-widest mt-1">{label}</span>
        </div>
    );
}
