"use client";

import { AvatarUpload } from "@/components/profile/avatar-upload";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Calendar, Link as LinkIcon, FileText, Twitter, Github, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { EditProfileButton } from "@/components/profile/edit-profile-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ProfileMessagesButton } from "@/components/profile/profile-messages-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ModeToggle } from "@/components/mode-toggle";
import { ReputationDisplay } from "@/components/reputation-display";

interface ProfileHeaderProps {
    profile: any;
    user: any;
}

export function ProfileHeader({ profile, user }: ProfileHeaderProps) {
    return (
        <div className="relative mb-8">
            <div className="flex flex-col gap-6 items-center">
                {/* Avatar */}
                <div className="relative -mt-12 md:-mt-16 mx-auto z-10">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-full ring-4 ring-background bg-background shadow-xl flex items-center justify-center overflow-hidden">
                        <AvatarUpload
                            currentAvatarUrl={profile?.avatar_url}
                            userInitial={profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                            className="h-full w-full"
                        />
                    </div>
                    {profile?.is_verified && (
                        <div className="absolute bottom-1 right-1 bg-background rounded-full p-1.5 shadow-sm ring-1 ring-border/50">
                            <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                        </div>
                    )}
                </div>

                {/* Main Info */}
                <div className="flex-1 text-center space-y-2 pb-2">
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{profile?.full_name || "İsimsiz Kullanıcı"}</h1>
                        <div className="flex items-center justify-center gap-2">
                            <Badge variant="secondary" className="font-mono text-xs">@{profile?.username || "kullanici"}</Badge>
                            <ReputationDisplay reputation={profile?.reputation || 0} size="sm" showLabel={true} />
                        </div>
                    </div>

                    {profile?.bio && (
                        <p className="text-muted-foreground max-w-2xl mx-auto text-base">{profile.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center pt-1">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 opacity-70" />
                            <span>{format(new Date(user.created_at), 'MMMM yyyy', { locale: tr })}</span>
                        </div>
                        {profile?.website && (
                            <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-primary transition-colors"
                            >
                                <LinkIcon className="h-4 w-4 opacity-70" />
                                <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                    <div className="flex gap-2 justify-center">
                        <div className="md:hidden">
                            <ModeToggle />
                        </div>
                        {profile?.is_writer && (
                            <Link href="/yazar">
                                <Button variant="outline" size="icon" title="Yazar Paneli">
                                    <FileText className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        <ProfileMessagesButton />
                        <div className="hidden md:block">
                            <NotificationBell />
                        </div>
                        <EditProfileButton
                            currentUsername={profile?.username || null}
                            currentFullName={profile?.full_name || null}
                            currentBio={profile?.bio || null}
                            currentAvatarUrl={profile?.avatar_url || null}
                            currentCoverUrl={profile?.cover_url || null}
                            currentWebsite={profile?.website || null}
                            currentSocialLinks={profile?.social_links || null}
                            userEmail={user?.email || null}
                        />
                    </div>

                    {/* Sign Out Button */}
                    <div className="flex justify-center">
                        <SignOutButton />
                    </div>

                    {/* Social Links Mini-Bar */}
                    {(profile?.social_links?.twitter || profile?.social_links?.github || profile?.social_links?.linkedin || profile?.social_links?.instagram) && (
                        <div className="flex gap-1 justify-center p-1 bg-muted/50 rounded-full backdrop-blur-sm">
                            {profile.social_links?.twitter && (
                                <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-background transition-all hover:text-[#1DA1F2]">
                                    <Twitter className="h-4 w-4" />
                                </a>
                            )}
                            {profile.social_links?.github && (
                                <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-background transition-all hover:text-foreground">
                                    <Github className="h-4 w-4" />
                                </a>
                            )}
                            {profile.social_links?.linkedin && (
                                <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-background transition-all hover:text-[#0077b5]">
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            )}
                            {profile.social_links?.instagram && (
                                <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-background transition-all hover:text-[#E1306C]">
                                    <Instagram className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
