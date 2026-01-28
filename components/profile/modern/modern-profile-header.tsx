"use client";

import { cn } from "@/lib/utils";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import {
    Share2,
    Calendar,
    Link as LinkIcon,
    MapPin,
    MoreHorizontal,
    Mail,
    Edit3,
    CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

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

    // Format numbers nicely (e.g. 1.2K)
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
        }).format(num);
    };

    return (
        <div className="w-full flex flex-col bg-background text-foreground animate-in fade-in duration-700">

            {/* === COVER IMAGE === */}
            {/* Clean, edge-to-edge, immersive but not overwhelming */}
            <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                {profile?.cover_url ? (
                    <img
                        src={profile.cover_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900" />
                )}
                {/* Subtle gradient for text readability if needed, but mostly clean */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />

                {/* Top Actions (Share, etc) - Absolute Positioned */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="p-2 rounded-full bg-black/10 backdrop-blur-md text-white/90 hover:bg-black/20 transition-all border border-white/10"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                    {isOwnProfile && (
                        <Link href="/mesajlar" className="relative p-2 rounded-full bg-black/10 backdrop-blur-md text-white/90 hover:bg-black/20 transition-all border border-white/10">
                            <Mail className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-transparent" />
                            )}
                        </Link>
                    )}
                </div>
            </div>

            {/* === PROFILE IDENTITY SECTION === */}
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative text-center sm:text-left">

                <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6 gap-6">

                    {/* AVATAR */}
                    <div className="relative group">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[4px] border-background bg-background overflow-hidden relative shadow-sm">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-4xl font-light text-neutral-400">
                                    {profile?.full_name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute bottom-2 right-2 sm:right-4 bg-blue-500 text-white p-1 rounded-full border-[3px] border-background shadow-sm" title="Doğrulanmış Hesap">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    {/* IDENTITY & ACTIONS */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 w-full">

                        {/* Name & Bio */}
                        <div className="flex flex-col items-center sm:items-start pb-1">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                {profile?.full_name || "İsimsiz Kullanıcı"}
                            </h1>
                            <span className="text-muted-foreground font-medium text-lg">@{profile?.username}</span>

                            {/* Unified Stats Line - Minimalist */}
                            <div className="flex items-center gap-4 mt-3 text-sm font-medium text-foreground/80">
                                <div className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
                                    <span className="font-bold">{formatNumber(stats.followersCount)}</span>
                                    <span className="text-muted-foreground">Takipçi</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                <div className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
                                    <span className="font-bold">{formatNumber(stats.followingCount)}</span>
                                    <span className="text-muted-foreground">Takip</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                <div className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
                                    <span className="font-bold">{formatNumber(stats.reputation)}</span>
                                    <span className="text-muted-foreground">Puan</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mb-1">
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
                                        <button className="px-6 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2">
                                            <Edit3 className="w-4 h-4" />
                                            <span>Profili Düzenle</span>
                                        </button>
                                    }
                                />
                            ) : (
                                <>
                                    <div className="w-32">
                                        <FollowButton
                                            targetUserId={profile?.id}
                                            initialIsFollowing={isFollowing}
                                            targetUsername={profile?.username}
                                            variant="modern" // We can keep this or simplify the button too
                                        />
                                    </div>
                                    <button className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                        <MoreHorizontal className="w-5 h-5 opacity-70" />
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                {/* USER BIO & DETAILS - Clean & Readable */}
                <div className="max-w-xl mx-auto sm:mx-0 mb-8 flex flex-col sm:items-start items-center text-center sm:text-left">
                    {profile?.bio && (
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {profile.bio}
                        </p>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs sm:text-sm text-muted-foreground font-medium">
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-500 hover:underline transition-all">
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Katıldı: {format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
