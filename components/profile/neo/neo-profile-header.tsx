"use client";

import { cn } from "@/lib/utils";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { EditableCover } from "@/components/profile/editable-cover";
import { BadgeDisplay } from "@/components/badge-display";
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
    PenLine,
    Mail,
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
    const gradientIndex = profile?.id ?
        profile.id.charCodeAt(0) % GRADIENTS.length : 0;
    const gradient = GRADIENTS[gradientIndex];

    const isAdmin = profile?.is_admin;
    const isWriter = profile?.is_writer;
    const isVerified = profile?.is_verified;

    return (
        <div className="w-full flex flex-col gap-6 relative">
            {/* === MODULAR BLOCK 1: MAIN PROFILE CARD === */}
            <div className="flex flex-col rounded-[32px] bg-card border-[3px] border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.8)] overflow-hidden">
                {/* Cover & Avatar Header Section */}
                <div className="relative">
                    <div className="h-40 sm:h-52 overflow-hidden">
                        {/* Display Only Cover - Editing is now in Settings */}
                        <div className={cn("w-full h-full", !profile?.cover_url && gradient)}>
                            {profile?.cover_url && (
                                <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
                            )}
                        </div>
                    </div>

                    {/* Avatar - Positioned to peek over cover */}
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-card bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden p-1">
                            {/* Display Only Avatar - Editing is now in Settings */}
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-black text-muted-foreground">
                                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar Overlay on Cover (Top Right) */}
                    <div className="absolute top-6 right-6 flex gap-2">
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
                            />
                        ) : (
                            <button className="neo-button-sm bg-white border-2 border-black">
                                <Mail className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            className="neo-button-sm bg-primary border-2 border-black"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Area - Padded top for Avatar overlap */}
                <div className="px-8 pt-20 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none">
                                    {profile?.full_name || "BİLİNİP DURULMAMIŞ"}
                                </h1>
                                {isVerified && <BadgeCheck className="w-8 h-8 text-primary" />}
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="font-mono text-lg font-black text-muted-foreground opacity-60">
                                    @{profile?.username || "yok"}
                                </p>
                                {isAdmin && <span className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-widest">SİSTEM ADMİNİ</span>}
                                {isWriter && !isAdmin && <span className="px-3 py-1 bg-emerald-400 text-black text-[10px] font-black rounded-full uppercase tracking-widest">YAZAR</span>}
                            </div>
                        </div>

                        {!isOwnProfile && (
                            <div className="shrink-0 scale-110 origin-right">
                                <FollowButton
                                    targetUserId={profile?.id}
                                    initialIsFollowing={isFollowing}
                                    targetUsername={profile?.username}
                                />
                            </div>
                        )}
                    </div>

                    {/* Bio & Social Details Container */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            {profile?.bio && (
                                <p className="text-lg font-bold leading-[1.3] text-foreground/80 font-heading">
                                    {profile.bio}
                                </p>
                            )}
                            <div className="flex items-center gap-5 text-sm font-black text-muted-foreground italic">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{format(new Date(user?.created_at || Date.now()), 'd MMMM yyyy', { locale: tr })}</span>
                                </div>
                                {profile?.website && (
                                    <a href={profile.website} target="_blank" className="flex items-center gap-2 text-primary">
                                        <LinkIcon className="w-4 h-4" />
                                        <span>WEBSITE</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Social Icons Card */}
                        <div className="flex items-center gap-4 justify-start md:justify-end">
                            {profile.social_links?.twitter && <SocialIcon icon={Twitter} />}
                            {profile.social_links?.github && <SocialIcon icon={Github} />}
                            {profile.social_links?.instagram && <SocialIcon icon={Instagram} />}
                            {profile.social_links?.linkedin && <SocialIcon icon={Linkedin} />}
                        </div>
                    </div>
                </div>

                {/* === STATS SECTION (MODULAR) === */}
                <div className="grid grid-cols-3 border-t-[4px] border-black dark:border-white">
                    <StatBox value={stats.reputation} label="REPÜTASYON" color="bg-primary" border />
                    <StatBox value={stats.followersCount} label="TAKİPÇİ" border />
                    <StatBox value={stats.followingCount} label="TAKİP" />

                    <StatBox value={stats.articlesCount} label="MAKALE" topBorder border />
                    <StatBox value={stats.questionsCount} label="SORU" topBorder border />
                    <StatBox value={stats.answersCount} label="CEVAP" topBorder />
                </div>
            </div>

            {/* === MODULAR BLOCK 2: STICKER COLLECTION === */}
            {userBadges && userBadges.length > 0 && (
                <div className="bg-card border-[3px] border-black dark:border-white rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)] p-6">
                    <div className="flex items-center justify-between mb-6 px-4">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter">STICKER Koleksiyonun</h2>
                        <div className="h-[2px] flex-1 mx-6 bg-black/10 dark:bg-white/10" />
                        <span className="font-mono font-black text-muted-foreground opacity-50">{userBadges.length} ADET</span>
                    </div>
                    <div className="flex justify-center">
                        <BadgeDisplay userBadges={userBadges} size="md" maxDisplay={6} />
                    </div>
                </div>
            )}
        </div>
    );
}

function StatBox({ value, label, color = "", border = false, topBorder = false }: any) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-8 transition-colors hover:bg-muted/30",
            color,
            border && "border-r-[4px] border-black dark:border-white",
            topBorder && "border-t-[4px] border-black dark:border-white",
            (color === "bg-primary") && "dark:text-black"
        )}>
            <span className="text-3xl sm:text-5xl font-black tracking-tighter tabular-nums leading-none mb-2">
                {value.toLocaleString('tr-TR')}
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase opacity-60">
                {label}
            </span>
        </div>
    );
}

function SocialIcon({ icon: Icon }: any) {
    return (
        <div className="w-12 h-12 flex items-center justify-center bg-card border-[3px] border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer">
            <Icon className="w-5 h-5" />
        </div>
    );
}
