"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, PenSquare, Twitter, Github, LinkIcon, Settings, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProfileSettingsButton } from "@/components/profile/profile-settings-button";
import { StartChatButton } from "@/components/messaging/start-chat-button";
import { FollowButton } from "@/components/profile/follow-button";

interface ProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    targetUserId?: string;
    stats?: any;
    badges?: any[];
    createdAt?: string;
}

export function ProfileHero({
    profile,
    user,
    isOwnProfile,
    isFollowing,
    targetUserId
}: ProfileHeroProps) {
    const socialLinks = profile?.social_links || {};

    return (
        /* V16 CARD: Clean White, 2px Black Border, Sharp Shadow */
        <div className="w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000000] overflow-hidden mb-6 group relative">

            {/* 1. Compact Banner */}
            <div className="relative h-40 md:h-52 w-full border-b-2 border-black bg-zinc-100">
                {profile?.cover_url ? (
                    <Image
                        src={profile.cover_url}
                        alt="Cover"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#f4f4f5] bg-[backgroundImage:radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px]" />
                )}
            </div>

            {/* 2. Content Container */}
            <div className="px-4 pb-6 relative">

                {/* Floating Avatar */}
                <div className="absolute -top-12 left-6 md:-top-16 md:left-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] border-black bg-white p-1 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                        <Avatar className="w-full h-full rounded-full border border-zinc-200">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-3xl font-bold bg-zinc-100 text-zinc-500">
                                {profile?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {profile?.is_verified && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm" title="Onaylı">
                                <BadgeCheck className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Right Actions (Desktop) */}
                <div className="flex justify-end pt-4 mb-10 md:mb-12 gap-2">
                    {socialLinks.twitter && (
                        <a href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-black">
                            <Twitter className="w-5 h-5" />
                        </a>
                    )}
                    {socialLinks.github && (
                        <a href={`https://github.com/${socialLinks.github}`} target="_blank" className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-black">
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-black">
                            <LinkIcon className="w-5 h-5" />
                        </a>
                    )}
                </div>

                {/* Info & Main Actions */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                    {/* User Text Info */}
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black flex items-center gap-2">
                            {profile?.full_name}
                            {profile?.role === 'admin' && (
                                <Badge variant="outline" className="border-black text-black text-[10px] px-1.5 h-5 rounded bg-amber-300">ADMIN</Badge>
                            )}
                        </h1>
                        <p className="font-medium text-zinc-500">@{profile?.username}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {isOwnProfile ? (
                            <>
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
                                    <Button variant="outline" className="h-10 border-2 border-black rounded-lg hover:bg-zinc-50 font-bold px-6 shadow-[2px_2px_0px_#000] active:translate-y-[2px] active:shadow-none transition-all">
                                        AYARLAR
                                    </Button>
                                </ProfileSettingsButton>

                                {(profile?.role === 'writer' || profile?.role === 'admin') && (
                                    <Link href="/yazar/yeni">
                                        <Button className="h-10 bg-black text-white border-2 border-black rounded-lg hover:bg-zinc-800 font-bold px-6 shadow-[2px_2px_0px_#888] active:translate-y-[2px] active:shadow-none transition-all">
                                            <PenSquare className="w-4 h-4 mr-2" />
                                            Yazı Yaz
                                        </Button>
                                    </Link>
                                )}
                            </>
                        ) : targetUserId ? (
                            <>
                                <FollowButton targetUserId={targetUserId} initialIsFollowing={isFollowing || false} />
                                <StartChatButton otherUserId={targetUserId} />
                            </>
                        ) : null}
                    </div>
                </div>

            </div>
        </div>
    );
}
