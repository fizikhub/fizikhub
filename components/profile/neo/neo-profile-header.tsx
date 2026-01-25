"use client";

import { cn } from "@/lib/utils";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { EditableCover } from "@/components/profile/editable-cover";
import { BadgeDisplay } from "@/components/badge-display";
import { EditProfileButton } from "@/components/profile/edit-profile-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ProfileMessagesButton } from "@/components/profile/profile-messages-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { CreateArticleDialog } from "@/components/profile/create-article-dialog";
import { RapidScienceButton } from "@/components/profile/rapid-science-button";
import { FollowButton } from "@/components/profile/follow-button";
import { ReputationDisplay } from "@/components/reputation-display";
import {
    Calendar,
    Link as LinkIcon,
    Share2,
    FileText,
    Twitter,
    Github,
    Instagram,
    Linkedin,
    BadgeCheck,
    Shield,
    PenLine
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

// Random gradient for cover fallback
const GRADIENTS = [
    "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
    "bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500",
    "bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500",
    "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500",
];

interface NeoProfileHeaderProps {
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
}

export function NeoProfileHeader({
    profile,
    user,
    isOwnProfile,
    isFollowing = false,
    stats,
    userBadges = []
}: NeoProfileHeaderProps) {
    // Deterministic gradient based on user id
    const gradientIndex = profile?.id ?
        profile.id.charCodeAt(0) % GRADIENTS.length : 0;
    const gradient = GRADIENTS[gradientIndex];

    const isAdmin = profile?.is_admin;
    const isWriter = profile?.is_writer;
    const isVerified = profile?.is_verified;

    return (
        <div className="w-full">
            {/* === COVER SECTION === */}
            <EditableCover
                url={profile?.cover_url}
                gradient={gradient}
                editable={isOwnProfile}
            />

            {/* === MAIN PROFILE CARD === */}
            <div className="relative -mt-16 mx-2 sm:mx-0">
                <div className="bg-card border-3 border-black dark:border-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] overflow-hidden">

                    {/* TOP SECTION: Avatar + Actions */}
                    <div className="px-4 sm:px-6 pt-4 pb-4">
                        <div className="flex items-end justify-between gap-4">
                            {/* Avatar with Neo border */}
                            <div className="relative -mt-20 shrink-0">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-black dark:border-white bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] overflow-hidden">
                                    <AvatarUpload
                                        currentAvatarUrl={profile?.avatar_url}
                                        userInitial={profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                                        className="h-full w-full"
                                    />
                                </div>

                                {/* Verified/Admin Badge */}
                                {(isVerified || isAdmin) && (
                                    <div className="absolute -bottom-1 -right-1 bg-primary border-2 border-black rounded-full p-1 shadow-md">
                                        {isAdmin ? (
                                            <Shield className="h-4 w-4 text-black fill-black/20" />
                                        ) : (
                                            <BadgeCheck className="h-4 w-4 text-black fill-black/20" />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {isOwnProfile ? (
                                    <>
                                        {/* Share Button */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                            }}
                                            className="neo-button-sm bg-primary"
                                            title="Profili Paylaş"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </button>

                                        {/* Write Article */}
                                        <Link
                                            href="/makale/yaz"
                                            className="neo-button-primary flex items-center gap-2"
                                        >
                                            <PenLine className="h-4 w-4" />
                                            <span className="hidden sm:inline">Yazı Yaz</span>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {/* Share Button */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                            }}
                                            className="neo-button-sm bg-primary"
                                            title="Profili Paylaş"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </button>

                                        {/* Follow Button */}
                                        <FollowButton
                                            targetUserId={profile?.id}
                                            initialIsFollowing={isFollowing}
                                            targetUsername={profile?.username}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* USER INFO SECTION */}
                    <div className="px-4 sm:px-6 pb-4">
                        {/* Name + Username + Role Badge */}
                        <div className="mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                                    {profile?.full_name || "İsimsiz Kullanıcı"}
                                </h1>

                                {/* Role Badges */}
                                {isAdmin && (
                                    <span className="neo-badge bg-primary text-black">
                                        ADMİN
                                    </span>
                                )}
                                {isWriter && !isAdmin && (
                                    <span className="neo-badge bg-emerald-400 text-black">
                                        YAZAR
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                <span className="font-semibold text-sm">@{profile?.username || "kullanici"}</span>
                                <span>•</span>
                                <span className="text-xs flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    yaklaşık {format(new Date(user?.created_at || Date.now()), 'MM.yyyy', { locale: tr })} önce
                                </span>
                            </div>
                        </div>

                        {/* Bio */}
                        {profile?.bio && (
                            <p className="text-foreground/80 text-sm leading-relaxed mb-3 max-w-lg">
                                {profile.bio}
                            </p>
                        )}

                        {/* Website & Social Links */}
                        <div className="flex items-center gap-4 flex-wrap text-sm mb-4">
                            {profile?.website && (
                                <a
                                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:underline font-medium"
                                >
                                    <LinkIcon className="h-3.5 w-3.5" />
                                    <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                                </a>
                            )}

                            {/* Social Icons */}
                            {(profile?.social_links?.twitter || profile?.social_links?.github || profile?.social_links?.linkedin || profile?.social_links?.instagram) && (
                                <div className="flex items-center gap-3">
                                    {profile.social_links?.twitter && (
                                        <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Twitter className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.github && (
                                        <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Github className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.linkedin && (
                                        <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.instagram && (
                                        <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Instagram className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === STATS GRID === */}
                    <div className="grid grid-cols-3 border-t-3 border-black dark:border-white">
                        {/* Followers */}
                        <StatCell
                            value={stats.followersCount}
                            label="TAKİPÇİ"
                            className="border-r-3 border-black dark:border-white"
                        />
                        {/* Following */}
                        <StatCell
                            value={stats.followingCount}
                            label="TAKİP"
                            className="border-r-3 border-black dark:border-white"
                        />
                        {/* Reputation - Highlighted */}
                        <StatCell
                            value={stats.reputation}
                            label="REPÜTASYON"
                            highlight
                        />
                    </div>

                    {/* Secondary Stats Row */}
                    <div className="grid grid-cols-3 border-t-3 border-black dark:border-white">
                        <StatCell
                            value={stats.articlesCount}
                            label="MAKALE"
                            className="border-r-3 border-black dark:border-white"
                        />
                        <StatCell
                            value={stats.questionsCount}
                            label="SORU"
                            className="border-r-3 border-black dark:border-white"
                        />
                        <StatCell
                            value={stats.answersCount}
                            label="CEVAP"
                        />
                    </div>
                </div>
            </div>

            {/* === STICKER COLLECTION === */}
            {userBadges && userBadges.length > 0 && (
                <div className="mt-6 flex justify-center px-4">
                    <BadgeDisplay userBadges={userBadges} size="md" maxDisplay={4} />
                </div>
            )}
        </div>
    );
}

// Stat Cell Component
function StatCell({
    value,
    label,
    highlight = false,
    className = ""
}: {
    value: number;
    label: string;
    highlight?: boolean;
    className?: string;
}) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-4 px-2 transition-colors",
            highlight ? "bg-primary text-black" : "bg-card hover:bg-muted/50",
            className
        )}>
            <span className={cn(
                "text-2xl sm:text-3xl font-black tracking-tight",
                highlight ? "text-black" : "text-foreground"
            )}>
                {value.toLocaleString('tr-TR')}
            </span>
            <span className={cn(
                "text-[10px] font-bold tracking-widest mt-0.5",
                highlight ? "text-black/70" : "text-muted-foreground"
            )}>
                {label}
            </span>
        </div>
    );
}
