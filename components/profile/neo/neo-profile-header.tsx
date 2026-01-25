"use client";

import Image from "next/image";
import Link from "next/link";
import { Settings, PenSquare, Share2, MapPin, Link as LinkIcon, Calendar, Twitter, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSettingsButton } from "@/components/profile/profile-settings-button";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface NeoProfileHeaderProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
}

export function NeoProfileHeader({
    profile,
    user,
    isOwnProfile,
    stats
}: NeoProfileHeaderProps) {
    const socialLinks = profile?.social_links || {};

    const handleShare = () => {
        const url = `${window.location.origin}/kullanici/${profile?.username}`;
        navigator.clipboard.writeText(url);
        // Toast can be added here
    };

    return (
        <div className="w-full relative mb-8">
            {/* MAIN CARD CONTAINER */}
            <div className={cn(
                "relative bg-white dark:bg-[#18181b] overflow-hidden",
                "border-[3px] border-black rounded-xl",
                "shadow-[6px_6px_0px_0px_#000]"
            )}>

                {/* 1. COMPACT COVER & PATTERN */}
                <div className="h-32 sm:h-40 w-full relative border-b-[3px] border-black bg-[#FFC800] overflow-hidden">
                    {profile?.cover_url ? (
                        <Image
                            src={profile.cover_url}
                            alt="Cover"
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        // MEMPHIS PATTERN FALLBACK
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
                        />
                    )}

                    {/* Settings Button (Absolute Top Right) */}
                    {isOwnProfile && (
                        <div className="absolute top-3 right-3 z-20">
                            <ProfileSettingsButton
                                currentUsername={profile?.username || ""}
                                currentFullName={profile?.full_name || ""}
                                currentBio={profile?.bio || ""}
                                currentAvatarUrl={profile?.avatar_url || ""}
                                currentCoverUrl={profile?.cover_url || ""}
                                currentWebsite={profile?.website || ""}
                                currentSocialLinks={profile?.social_links}
                                userEmail={user?.email}
                                usernameChangeCount={profile?.username_changes_count || 0}
                            >
                                <button className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </ProfileSettingsButton>
                        </div>
                    )}
                </div>

                {/* 2. PROFILE INFO SECTION */}
                <div className="px-4 sm:px-6 pb-6 relative">

                    {/* AVATAR - Overlapping */}
                    <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)] overflow-hidden p-1">
                            <div className="w-full h-full relative bg-zinc-100 overflow-hidden rounded-lg border border-black/10">
                                {profile?.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt={profile.full_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-black/20">
                                        {profile?.full_name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS ROW (Next to Avatar) */}
                    <div className="flex justify-end pt-3 sm:pt-4 gap-2 mb-12 sm:mb-14">
                        {/* Social Links (Compact) */}
                        <div className="flex items-center gap-1 mr-auto pl-[110px] sm:pl-[140px] opacity-60 hidden sm:flex">
                            {socialLinks.twitter && <Twitter className="w-4 h-4" />}
                            {socialLinks.github && <Github className="w-4 h-4" />}
                        </div>

                        {/* Share Profile */}
                        <button
                            onClick={handleShare}
                            className="h-9 px-3 flex items-center gap-2 bg-[#A3E635] border-2 border-black rounded-lg font-bold text-sm shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Paylaş</span>
                        </button>

                        {/* Write Article (If Permitted) */}
                        {isOwnProfile && (profile?.role === 'writer' || profile?.role === 'admin') && (
                            <Link href="/yazar/yeni">
                                <button className="h-9 px-4 flex items-center gap-2 bg-black text-white border-2 border-black rounded-lg font-bold text-sm shadow-[2px_2px_0px_#888] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                                    <PenSquare className="w-4 h-4" />
                                    <span>Yazı Yaz</span>
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* NAME & BIO */}
                    <div className="flex flex-col gap-2 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black dark:text-white leading-none mb-1">
                                {profile?.full_name}
                                {profile?.role === 'admin' && (
                                    <span className="ml-2 inline-block text-[10px] bg-[#FFC800] border border-black px-1.5 py-0.5 rounded text-black align-middle transform -translate-y-1">
                                        ADMIN
                                    </span>
                                )}
                            </h1>
                            <div className="flex items-center gap-2 text-sm font-bold text-neutral-500">
                                <span>@{profile?.username}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {profile?.created_at && formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {profile?.bio && (
                            <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                                {profile.bio}
                            </p>
                        )}

                        {/* WEBSITE */}
                        {profile?.website && (
                            <a href={profile.website} target="_blank" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline w-fit">
                                <LinkIcon className="w-3 h-3" />
                                {profile.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </div>

                    {/* STATS GRID - COMPACT NEO */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 py-4 border-t-2 border-dashed border-black/10">
                        <StatBox label="Takipçi" value={stats.followersCount} />
                        <StatBox label="Takip" value={stats.followingCount} />
                        <StatBox label="Repütasyon" value={stats.reputation} highlight />
                        <StatBox label="Makale" value={stats.articlesCount} />
                        <StatBox label="Soru" value={stats.questionsCount} />
                        <StatBox label="Cevap" value={stats.answersCount} />
                    </div>

                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, highlight = false }: { label: string, value: number, highlight?: boolean }) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg border-2 border-black text-center transition-all hover:scale-105",
            highlight ? "bg-[#FFC800] shadow-[2px_2px_0px_#000]" : "bg-zinc-50 dark:bg-zinc-800 shadow-[2px_2px_0px_#ccc] dark:shadow-none"
        )}>
            <span className="text-xl sm:text-2xl font-black text-black dark:text-white leading-none mb-0.5">
                {value}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase text-neutral-500 dark:text-zinc-400">
                {label}
            </span>
        </div>
    );
}
