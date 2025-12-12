"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, LinkIcon, Twitter, Github, Linkedin, Instagram, FileText, MessageSquare, Users, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { BadgeDisplay } from "@/components/badge-display";
import { ReputationDisplay } from "@/components/reputation-display";

interface ProfileAboutSidebarProps {
    profile: any;
    stats: {
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
        followersCount: number;
        followingCount: number;
    };
    badges: any[];
    createdAt: string;
}

export function ProfileAboutSidebar({ profile, stats, badges, createdAt }: ProfileAboutSidebarProps) {
    const socialLinks = profile?.social_links || {};
    const hasSocialLinks = socialLinks.twitter || socialLinks.github || socialLinks.linkedin || socialLinks.instagram;

    return (
        <aside className="space-y-6">
            {/* Bio Card */}
            {profile?.bio && (
                <Card className="p-6 border-gray-300/50 dark:border-gray-700/50 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)]">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                        <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                        Hakkında
                    </h3>
                    <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                        {profile.bio}
                    </p>
                </Card>
            )}

            {/* Stats Card */}
            <Card className="p-6 border-gray-300/50 dark:border-gray-700/50 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)]">
                <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                    İstatistikler
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Articles */}
                    <div className="text-center p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/15 transition-colors">
                        <FileText className="w-5 h-5 text-cyan-500 mx-auto mb-1.5" />
                        <div className="text-2xl font-bold text-foreground">{stats.articlesCount}</div>
                        <div className="text-xs text-muted-foreground font-medium">Makale</div>
                    </div>

                    {/* Questions */}
                    <div className="text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors">
                        <MessageSquare className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                        <div className="text-2xl font-bold text-foreground">{stats.questionsCount}</div>
                        <div className="text-xs text-muted-foreground font-medium">Soru</div>
                    </div>

                    {/* Followers */}
                    <div className="text-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/15 transition-colors">
                        <Users className="w-5 h-5 text-purple-500 mx-auto mb-1.5" />
                        <div className="text-2xl font-bold text-foreground">{stats.followersCount}</div>
                        <div className="text-xs text-muted-foreground font-medium">Takipçi</div>
                    </div>

                    {/* Following */}
                    <div className="text-center p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/15 transition-colors">
                        <UserPlus className="w-5 h-5 text-pink-500 mx-auto mb-1.5" />
                        <div className="text-2xl font-bold text-foreground">{stats.followingCount}</div>
                        <div className="text-xs text-muted-foreground font-medium">Takip</div>
                    </div>
                </div>

                {/* Reputation */}
                <div className="border-t border-gray-300/30 dark:border-gray-700/30 mt-4 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-medium">Reputasyon</span>
                        <ReputationDisplay reputation={profile?.reputation || 0} size="sm" showLabel={false} />
                    </div>
                </div>
            </Card>

            {/* Links Card */}
            {(profile?.website || hasSocialLinks) && (
                <Card className="p-6 border-gray-300/50 dark:border-gray-700/50 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)]">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                        <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                        Bağlantılar
                    </h3>

                    <div className="space-y-3">
                        {/* Website */}
                        {profile?.website && (
                            <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-foreground/80 hover:text-cyan-500 transition-colors group"
                            >
                                <LinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                                <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}

                        {/* Social Links */}
                        {socialLinks.twitter && (
                            <a
                                href={`https://twitter.com/${socialLinks.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-foreground/80 hover:text-cyan-500 transition-colors group"
                            >
                                <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                                <span>@{socialLinks.twitter}</span>
                            </a>
                        )}

                        {socialLinks.github && (
                            <a
                                href={`https://github.com/${socialLinks.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-foreground/80 hover:text-cyan-500 transition-colors group"
                            >
                                <Github className="w-4 h-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                                <span>{socialLinks.github}</span>
                            </a>
                        )}

                        {socialLinks.linkedin && (
                            <a
                                href={`https://linkedin.com/in/${socialLinks.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-foreground/80 hover:text-cyan-500 transition-colors group"
                            >
                                <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                                <span>{socialLinks.linkedin}</span>
                            </a>
                        )}

                        {socialLinks.instagram && (
                            <a
                                href={`https://instagram.com/${socialLinks.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-foreground/80 hover:text-cyan-500 transition-colors group"
                            >
                                <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                                <span>@{socialLinks.instagram}</span>
                            </a>
                        )}
                    </div>
                </Card>
            )}

            {/* Member Since */}
            <Card className="p-6 border-gray-300/50 dark:border-gray-700/50 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {format(new Date(createdAt), 'MMMM yyyy', { locale: tr })} tarihinden beri üye
                    </span>
                </div>
            </Card>

            {/* Badges */}
            {badges && badges.length > 0 && (
                <Card className="p-6 border-gray-300/50 dark:border-gray-700/50 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)]">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                        <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                        Rozetler
                    </h3>
                    <BadgeDisplay userBadges={badges} maxDisplay={6} size="sm" />
                </Card>
            )}
        </aside>
    );
}
