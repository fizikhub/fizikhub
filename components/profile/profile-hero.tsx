"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, PenSquare, Twitter, Github, Linkedin, Instagram, LinkIcon, Settings, MessageCircle } from "lucide-react";
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
    stats?: any; // Kept for interface compatibility but not used in header
    badges?: any[]; // Kept for interface compatibility
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
        <div className="w-full bg-[#FAF9F6] dark:bg-[#09090b] border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] overflow-hidden mb-6">

            {/* 1. Header Banner (40% Height approx) */}
            <div className="relative h-48 md:h-64 w-full bg-gray-100 dark:bg-zinc-900 border-b-2 border-black dark:border-white">
                {profile?.cover_url ? (
                    <Image
                        src={profile.cover_url}
                        alt="Cover"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                )}
                {/* Overlay for contrast */}
                <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* 2. Avatar & Info Section */}
            <div className="relative px-6 pb-6 pt-16 md:pt-20 text-center flex flex-col items-center">

                {/* Floating Avatar */}
                <div className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[4px] border-black dark:border-white bg-[#FAF9F6] dark:bg-[#09090b] p-1 shadow-lg">
                        <Avatar className="w-full h-full rounded-full border-2 border-gray-200 dark:border-zinc-800">
                            <AvatarImage src={profile?.avatar_url} className="object-cover" />
                            <AvatarFallback className="text-4xl font-black bg-gray-100 text-gray-500">
                                {profile?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {profile?.is_verified && (
                            <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Doğrulanmış">
                                <BadgeCheck className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Name & Title */}
                <h1 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-2">
                    {profile?.full_name}
                </h1>

                <div className="flex items-center gap-2 mb-4 justify-center">
                    <Badge variant="outline" className="border-2 border-black dark:border-white text-black dark:text-white font-bold px-3 py-1 bg-transparent hover:bg-black hover:text-white transition-colors">
                        @{profile?.username}
                    </Badge>
                    {profile?.role === 'admin' && (
                        <Badge className="bg-red-500 text-white border-2 border-black font-bold">ADMIN</Badge>
                    )}
                </div>

                {/* Socials Row */}
                <div className="flex items-center gap-3 mb-6">
                    {socialLinks.twitter && (
                        <a href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" className="p-2 rounded-lg border-2 border-black dark:border-white hover:bg-[#1DA1F2] hover:text-white hover:border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
                            <Twitter className="w-5 h-5" />
                        </a>
                    )}
                    {socialLinks.github && (
                        <a href={`https://github.com/${socialLinks.github}`} target="_blank" className="p-2 rounded-lg border-2 border-black dark:border-white hover:bg-black hover:text-white hover:border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" className="p-2 rounded-lg border-2 border-black dark:border-white hover:bg-green-500 hover:text-white hover:border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
                            <LinkIcon className="w-5 h-5" />
                        </a>
                    )}
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center gap-3 w-full justify-center max-w-sm">
                    {isOwnProfile ? (
                        <>
                            <div className="flex-1">
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
                                />
                            </div>
                            {(profile?.role === 'writer' || profile?.role === 'admin') && (
                                <Link href="/yazar/yeni">
                                    <Button className="w-full border-2 border-black bg-amber-400 text-black hover:bg-amber-500 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                        <PenSquare className="w-4 h-4 mr-2" />
                                        Yazı Yaz
                                    </Button>
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <FollowButton targetUserId={targetUserId} initialIsFollowing={isFollowing || false} />
                            <StartChatButton otherUserId={targetUserId} />
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
