"use client";

import { AvatarUpload } from "@/components/profile/avatar-upload";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Calendar, Link as LinkIcon, FileText, Twitter, Github, Instagram, Linkedin, Shield } from "lucide-react";
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
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* ID Card Avatar Section */}
                <div className="relative -mt-12 md:-mt-16 z-10 mx-auto md:mx-0">
                    <div className="h-32 w-32 md:h-40 md:w-40 bg-background border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center overflow-hidden relative group">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 bg-black dark:bg-white z-20" />
                        <div className="absolute top-0 right-0 w-2 h-2 bg-black dark:bg-white z-20" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-black dark:bg-white z-20" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-black dark:bg-white z-20" />

                        <AvatarUpload
                            currentAvatarUrl={profile?.avatar_url}
                            userInitial={profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                            className="h-full w-full rounded-none"
                        />
                    </div>
                    {profile?.is_verified && (
                        <div className="absolute -bottom-2 -right-2 bg-background border-2 border-black dark:border-white p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                            <BadgeCheck className="h-5 w-5 text-primary fill-primary/10" />
                        </div>
                    )}
                </div>

                {/* Personnel Data Section */}
                <div className="flex-1 w-full text-center md:text-left space-y-4 pt-2">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
                                {profile?.full_name || "İSİMSİZ PERSONEL"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="font-mono text-sm bg-muted px-2 py-0.5 border border-black/20 dark:border-white/20">
                                    @{profile?.username || "kullanici"}
                                </span>
                                <ReputationDisplay reputation={profile?.reputation || 0} size="sm" showLabel={true} />
                            </div>
                        </div>

                        {/* Action Toolbar */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                            <div className="md:hidden">
                                <ModeToggle />
                            </div>
                            {profile?.is_writer && (
                                <Link href="/yazar">
                                    <Button variant="outline" size="icon" className="rounded-none border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Yazar Paneli">
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
                            <SignOutButton />
                        </div>
                    </div>

                    {/* Mission Statement (Bio) */}
                    {profile?.bio && (
                        <div className="relative border-l-4 border-primary/50 pl-4 py-1 bg-muted/30 max-w-2xl mx-auto md:mx-0 text-left">
                            <p className="text-muted-foreground text-sm md:text-base font-medium">
                                "{profile.bio}"
                            </p>
                        </div>
                    )}

                    {/* Meta Data */}
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground justify-center md:justify-start border-t border-dashed border-border pt-3 mt-2">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>KAYIT: {format(new Date(user.created_at), 'MM.yyyy', { locale: tr }).toUpperCase()}</span>
                        </div>
                        {profile?.website && (
                            <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-primary transition-colors"
                            >
                                <LinkIcon className="h-3 w-3" />
                                <span>{profile.website.replace(/^https?:\/\//, '').toUpperCase()}</span>
                            </a>
                        )}

                        {/* Social Links */}
                        {(profile?.social_links?.twitter || profile?.social_links?.github || profile?.social_links?.linkedin || profile?.social_links?.instagram) && (
                            <div className="flex gap-3 ml-2 pl-2 border-l border-border">
                                {profile.social_links?.twitter && (
                                    <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        <Twitter className="h-3 w-3" />
                                    </a>
                                )}
                                {profile.social_links?.github && (
                                    <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        <Github className="h-3 w-3" />
                                    </a>
                                )}
                                {profile.social_links?.linkedin && (
                                    <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        <Linkedin className="h-3 w-3" />
                                    </a>
                                )}
                                {profile.social_links?.instagram && (
                                    <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        <Instagram className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
