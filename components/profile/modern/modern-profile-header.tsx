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
            {/* Taller on mobile for impact */}
            <div className="relative h-[280px] sm:h-[350px] w-full overflow-hidden rounded-b-[3rem] sm:rounded-b-[4rem] shadow-xl z-0">
                <div className={cn("w-full h-full", !profile?.cover_url && gradient)}>
                    {profile?.cover_url && (
                        <img
                            src={profile.cover_url}
                            alt="Cover"
                            className="w-full h-full object-cover brightness-[0.85]"
                        />
                    )}
                </div>
                {/* Gradient overlay for text readability if we ever put text on cover, currently mostly aesthetic */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />

                {/* ACTION BUTTONS - FLOATING ON COVER (Top Right & Left) */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-black/40 transition-all"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    {isOwnProfile && (
                        <div className="relative">
                            <Link
                                href="/mesajlar"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-black/40 transition-all"
                            >
                                <Mail className="w-5 h-5" />
                            </Link>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-transparent">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* === CENTERED AVATAR === */}
            {/* Overlaps the bottom curve */}
            <div className="absolute top-[210px] sm:top-[270px] left-1/2 -translate-x-1/2 z-10">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-background shadow-2xl">
                    <div className="w-full h-full rounded-full overflow-hidden relative group cursor-pointer border-2 border-muted/20">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-black text-muted-foreground">
                                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute bottom-1 right-1">
                    {isVerified && (
                        <div className="bg-background text-blue-500 rounded-full p-1 shadow-sm">
                            <BadgeCheck className="w-6 h-6 fill-current" />
                        </div>
                    )}
                </div>
            </div>

            {/* === PROFILE CONTENT (Centered) === */}
            <div className="px-4 pt-16 sm:pt-20 pb-2 flex flex-col items-center text-center">

                {/* NAME & HANDLE */}
                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-none uppercase italic">
                        {profile?.full_name || "İsimsiz"}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground font-mono font-bold">@{profile?.username || "yok"}</span>
                        {isAdmin && <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black rounded uppercase">SYS OP</span>}
                        {isWriter && !isAdmin && <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded uppercase">YAZAR</span>}
                    </div>
                </div>

                {/* PRIMARY ACTION BUTTONS (Below Name) */}
                <div className="mt-4 flex items-center gap-3">
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
                                <button className="px-6 py-2 rounded-full font-bold text-sm border-2 border-foreground bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" />
                                    Profili Düzenle
                                </button>
                            }
                        />
                    ) : (
                        <>
                            <FollowButton
                                targetUserId={profile?.id}
                                initialIsFollowing={isFollowing}
                                targetUsername={profile?.username}
                                variant="modern"
                            />
                            <button className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-border hover:bg-muted transition-colors">
                                <Mail className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* BIO */}
                {profile?.bio && (
                    <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed text-muted-foreground/90 font-medium">
                        {profile.bio}
                    </p>
                )}

                {/* METADATA (Website & Date) */}
                <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
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

                {/* STATS (Cards) */}
                <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-sm">
                    <StatCard value={stats.followersCount} label="Takipçi" />
                    <StatCard value={stats.followingCount} label="Takip" />
                    <StatCard value={stats.reputation} label="Puan" highlighted />
                </div>

            </div>
        </div>
    );
}

function StatCard({ value, label, highlighted = false }: { value: number, label: string, highlighted?: boolean }) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-3 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all hover:scale-105",
            highlighted ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_-5px_var(--primary)]" : "border-border"
        )}>
            <span className={cn(
                "text-lg sm:text-xl font-black tabular-nums",
                highlighted ? "text-primary" : "text-foreground"
            )}>
                {value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value}
            </span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</span>
        </div>
    );
}
