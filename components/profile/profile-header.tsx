"use client";

import { AvatarUpload } from "@/components/profile/avatar-upload";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Calendar, Link as LinkIcon, FileText, Twitter, Github, Instagram, Linkedin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
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
        <div className="relative mb-8 p-6 rounded-3xl bg-black/40 backdrop-blur-md border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Orbit Avatar Section */}
                <div className="relative z-10 mx-auto md:mx-0">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                        {/* Rotating Orbit Ring - Gold */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute -inset-2 rounded-full border border-amber-500/20"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Avatar Container */}
                        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.4)] bg-black">
                            <AvatarUpload
                                currentAvatarUrl={profile?.avatar_url}
                                userInitial={profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                                className="h-full w-full"
                            />
                        </div>

                        {/* Verified Badge */}
                        {profile?.is_verified && (
                            <div className="absolute bottom-0 right-0 bg-black border border-amber-500 rounded-full p-1.5 shadow-[0_0_10px_orange]">
                                <BadgeCheck className="h-5 w-5 text-amber-400 fill-amber-400/10" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Personnel Data Section */}
                <div className="flex-1 w-full text-center md:text-left space-y-4 pt-2">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] uppercase">
                                {profile?.full_name || "İSİMSİZ PERSONEL"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="font-mono text-sm text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur-sm">
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
                                    <Button variant="outline" size="icon" className="rounded-full border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-400 text-amber-100 transition-all" title="Yazar Paneli">
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
                        <div className="relative pl-4 border-l-2 border-amber-500/50 bg-gradient-to-r from-amber-950/20 to-transparent py-2 max-w-2xl mx-auto md:mx-0 text-left rounded-r-lg">
                            <p className="text-amber-100/80 text-sm md:text-base font-medium leading-relaxed font-sans">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* Meta Data */}
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-amber-200/50 justify-center md:justify-start border-t border-amber-500/10 pt-4 mt-2">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-amber-600" />
                            <span>KAYIT: {format(new Date(user.created_at), 'MM.yyyy', { locale: tr }).toUpperCase()}</span>
                        </div>
                        {profile?.website && (
                            <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                            >
                                <LinkIcon className="h-3 w-3" />
                                <span>{profile.website.replace(/^https?:\/\//, '').toUpperCase()}</span>
                            </a>
                        )}

                        {/* Social Links */}
                        {(profile?.social_links?.twitter || profile?.social_links?.github || profile?.social_links?.linkedin || profile?.social_links?.instagram) && (
                            <div className="flex gap-3 ml-2 pl-2 border-l border-amber-500/20">
                                {profile.social_links?.twitter && (
                                    <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                                        <Twitter className="h-3 w-3" />
                                    </a>
                                )}
                                {profile.social_links?.github && (
                                    <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                                        <Github className="h-3 w-3" />
                                    </a>
                                )}
                                {profile.social_links?.linkedin && (
                                    <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                                        <Linkedin className="h-3 w-3" />
                                    </a>
                                )}
                                {profile.social_links?.instagram && (
                                    <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
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
