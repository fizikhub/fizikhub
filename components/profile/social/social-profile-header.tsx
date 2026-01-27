"use client";

import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import {
    Calendar,
    Link as LinkIcon,
    Mail,
    MapPin,
    MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

interface SocialProfileHeaderProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    stats: {
        followersCount: number;
        followingCount: number;
    };
    unreadCount?: number;
}

export function SocialProfileHeader({
    profile,
    user,
    isOwnProfile,
    isFollowing = false,
    stats,
    unreadCount = 0
}: SocialProfileHeaderProps) {

    return (
        <div className="w-full flex flex-col relative pb-4">
            {/* Cover Image */}
            <div className="h-32 sm:h-48 w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative group">
                {profile?.cover_url ? (
                    <img
                        src={profile.cover_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900" />
                )}
            </div>

            {/* Avatar & Actions Row */}
            <div className="px-4 flex justify-between items-start relative">
                {/* Avatar */}
                <div className="absolute -top-16 sm:-top-20">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-[4px] border-[#F5F5F5] dark:border-[#0A0A0A] bg-white dark:bg-black overflow-hidden shadow-sm">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-neutral-500 font-bold text-4xl">
                                {profile?.full_name?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Spacing for Avatar */}
                <div className="w-32 sm:w-36" />

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                    {isOwnProfile ? (
                        <>
                            <Link href="/mesajlar" className="relative group">
                                <div className={cn(
                                    "w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                                    unreadCount > 0 && "border-[#facc15] text-[#facc15]"
                                )}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
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
                                    <button className="px-4 py-1.5 text-sm font-bold border border-neutral-300 dark:border-neutral-700 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                        Profili Düzenle
                                    </button>
                                }
                            />
                        </>
                    ) : (
                        <>
                            <button className="w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            <button className="w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <Mail className="w-5 h-5" />
                            </button>
                            <FollowButton
                                targetUserId={profile?.id}
                                initialIsFollowing={isFollowing}
                                targetUsername={profile?.username}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-4 mt-4 space-y-3">
                <div>
                    <div className="flex items-center gap-1">
                        <h1 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                            {profile?.full_name || "İsimsiz Kullanıcı"}
                        </h1>
                        {profile?.is_verified && (
                            <BadgeCheck className="w-5 h-5 text-[#facc15]" />
                        )}
                    </div>
                    <p className="text-muted-foreground text-sm">@{profile?.username}</p>
                </div>

                {profile?.bio && (
                    <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {profile.bio}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {/* Location Placeholder if we had it, enabling layout demo */}
                    {/* <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 opacity-70" />
                        <span>İstanbul, Türkiye</span>
                    </div> */}

                    {profile?.website && (
                        <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#facc15] hover:underline"
                        >
                            <LinkIcon className="w-4 h-4 opacity-70" />
                            <span className="truncate max-w-[200px] font-medium">{profile.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}

                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 opacity-70" />
                        <span>{format(new Date(user?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })} tarihinde katıldı</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <Link href="#" className="hover:underline">
                        <span className="font-bold text-foreground">{stats.followingCount}</span>
                        <span className="text-muted-foreground ml-1">Takip Edilen</span>
                    </Link>
                    <Link href="#" className="hover:underline">
                        <span className="font-bold text-foreground">{stats.followersCount}</span>
                        <span className="text-muted-foreground ml-1">Takipçi</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
