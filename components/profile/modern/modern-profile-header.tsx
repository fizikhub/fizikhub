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
    MapPin
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
        <div className="w-full flex flex-col bg-background/50 backdrop-blur-sm">

            {/* === COVER IMAGE === */}
            <div className="relative h-32 sm:h-48 w-full overflow-hidden bg-muted">
                <div className={cn("w-full h-full", !profile?.cover_url && gradient)}>
                    {profile?.cover_url && (
                        <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
                    )}
                </div>
            </div>

            {/* === PROFILE CONTENT === */}
            <div className="px-4 pb-4">
                
                {/* TOP ROW: Avatar & Action Buttons */}
                <div className="flex justify-between items-start">
                    
                    {/* AVATAR (Overlaps Cover) */}
                    <div className="-mt-[12%] sm:-mt-[10%] relative">
                        <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-[4px] border-background bg-background overflow-hidden relative group cursor-pointer transition-transform hover:scale-105">
                             {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-3xl font-black text-muted-foreground">
                                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ACTIONS (Right Aligned) */}
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        
                        {isOwnProfile ? (
                            <>
                                <Link
                                    href="/mesajlar"
                                    className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors relative"
                                >
                                    <Mail className="w-4 h-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
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
                                        <button className="px-4 h-9 flex items-center justify-center rounded-full border border-border font-bold text-sm bg-background hover:bg-muted transition-colors">
                                            Profili Düzenle
                                        </button>
                                    }
                                />
                            </>
                        ) : (
                             <>
                                <button className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors">
                                    <Mail className="w-4 h-4" />
                                </button>
                                <FollowButton
                                    targetUserId={profile?.id}
                                    initialIsFollowing={isFollowing}
                                    targetUsername={profile?.username}
                                    variant="modern" 
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* USER INFO */}
                <div className="mt-3">
                    <div className="flex items-center gap-1">
                        <h1 className="text-xl sm:text-2xl font-black leading-tight">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        {isVerified && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <p className="text-sm sm:text-base font-medium">@{profile?.username || "yok"}</p>
                        {isAdmin && <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-md">ADMIN</span>}
                        {isWriter && !isAdmin && <span className="px-1.5 py-0.5 bg-emerald-900 text-emerald-300 text-[10px] font-bold rounded-md">YAZAR</span>}
                    </div>
                </div>

                {/* BIO */}
                {profile?.bio && (
                    <p className="mt-3 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                        {/* Render simple text, maybe enhance with links later */}
                        {profile.bio}
                    </p>
                )}

                {/* METADATA ROW */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span>
                    </div>
                    {profile?.website && (
                         <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">
                            <LinkIcon className="w-4 h-4" />
                            <span>{new URL(profile.website).hostname}</span>
                        </a>
                    )}
                 </div>

                {/* STATS ROW */}
                <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 hover:underline cursor-pointer">
                        <span className="font-bold text-foreground">{stats.followingCount}</span>
                        <span className="text-muted-foreground">Takip Edilen</span>
                    </div>
                    <div className="flex items-center gap-1 hover:underline cursor-pointer">
                        <span className="font-bold text-foreground">{stats.followersCount}</span>
                        <span className="text-muted-foreground">Takipçi</span>
                    </div>
                     <div className="flex items-center gap-1">
                        <span className="font-bold text-foreground">{stats.reputation}</span>
                        <span className="text-muted-foreground">Rep</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
