"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, PenSquare, Twitter, Github, Linkedin, Instagram, LinkIcon, MapPin, Calendar, Mail } from "lucide-react";
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
        /* V15 CARD CONTAINER: Deep Black BG, White Border, White Hard Shadow */
        <div className="w-full bg-[#050505] border-[3px] border-white rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden mb-8 relative group">

            {/* 1. Banner Image (Grayscale + Grain effect for 'Premium' feel) */}
            <div className="relative h-56 md:h-72 w-full border-b-[3px] border-white">
                {profile?.cover_url ? (
                    <>
                        <Image
                            src={profile.cover_url}
                            alt="Cover"
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-zinc-900 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-80" />
                )}
            </div>

            {/* 2. Avatar (Intersecting) */}
            <div className="absolute top-56 md:top-72 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-[4px] border-white bg-black p-1 shadow-[0px_10px_20px_rgba(0,0,0,0.5)]">
                    <Avatar className="w-full h-full rounded-full border-2 border-zinc-800">
                        <AvatarImage src={profile?.avatar_url} className="object-cover" />
                        <AvatarFallback className="text-5xl font-black bg-zinc-900 text-white">
                            {profile?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>

                    {profile?.is_verified && (
                        <div className="absolute bottom-2 right-2 bg-[#1D9BF0] text-white p-1 rounded-full border-[3px] border-black shadow-lg" title="Onaylı Hesap">
                            <BadgeCheck className="w-6 h-6" />
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Info Section */}
            <div className="pt-24 pb-8 px-6 md:px-12 text-center bg-[#050505] text-white relative z-10">

                {/* Name & Role */}
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 leading-none">
                    {profile?.full_name}
                </h1>
                <div className="flex items-center justify-center gap-2 mb-6 opacity-90">
                    <span className="font-mono text-zinc-400 font-bold tracking-wider">@{profile?.username}</span>
                    {profile?.role === 'admin' && (
                        <span className="bg-[#FF0055] text-white text-[10px] font-black px-2 py-0.5 rounded border border-white/20">ADMIN</span>
                    )}
                </div>

                {/* Social Actions Row */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                    {socialLinks.twitter && (
                        <a href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-white/20 hover:border-white hover:bg-white hover:text-black transition-all">
                            <Twitter className="w-5 h-5" />
                        </a>
                    )}
                    {socialLinks.github && (
                        <a href={`https://github.com/${socialLinks.github}`} target="_blank" className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-white/20 hover:border-white hover:bg-white hover:text-black transition-all">
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-white/20 hover:border-white hover:bg-[#FFC800] hover:text-black transition-all">
                            <LinkIcon className="w-5 h-5" />
                        </a>
                    )}
                </div>

                {/* Primary Actions (Big Buttons) */}
                <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto">
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
                                >
                                    <Button variant="outline" className="w-full h-12 rounded-xl border-[2px] border-white/30 text-white hover:bg-white hover:text-black hover:border-white font-bold tracking-tight text-base transition-all">
                                        AYARLAR
                                    </Button>
                                </ProfileSettingsButton>
                            </div>
                            {(profile?.role === 'writer' || profile?.role === 'admin') && (
                                <Link href="/yazar/yeni" className="flex-1">
                                    <Button className="w-full h-12 rounded-xl bg-[#FFC800] text-black border-[2px] border-[#FFC800] hover:bg-white hover:border-white font-black tracking-tight text-base shadow-[0px_0px_15px_rgba(255,200,0,0.4)] hover:shadow-none transition-all">
                                        <PenSquare className="w-5 h-5 mr-2" />
                                        YAZI YAZ
                                    </Button>
                                </Link>
                            )}
                        </>
                    ) : targetUserId ? (
                        <>
                            <div className="flex-1">
                                <FollowButton targetUserId={targetUserId} initialIsFollowing={isFollowing || false} />
                            </div>
                            <div className="flex-1">
                                <StartChatButton otherUserId={targetUserId} />
                            </div>
                        </>
                    ) : null}
                </div>

            </div>
        </div>
    );
}
