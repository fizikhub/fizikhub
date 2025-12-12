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
        <aside className="space-y-5">
            {/* Bio Card */}
            {profile?.bio && (
                <Card className="p-5 border-2 border-foreground/10 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                    <h3 className="text-xs font-black uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                        <div className="w-0.5 h-4 bg-foreground" />
                        Hakkında
                    </h3>
                    <p className="text-foreground/80 leading-relaxed text-sm">
                        {profile.bio}
                    </p>
                </Card>
            )}

            {/* Stats Card */}
            <Card className="p-5 border-2 border-foreground/10 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                <h3 className="text-xs font-black uppercase text-muted-foreground mb-4 tracking-wider flex items-center gap-2">
                    <div className="w-0.5 h-4 bg-foreground" />
                    İstatistikler
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    {/* Articles */}
                    <div className="text-center p-3 border-2 border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors">
                        <FileText className="w-4 h-4 text-foreground mx-auto mb-1.5" />
                        <div className="text-xl font-black text-foreground">{stats.articlesCount}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Makale</div>
                    </div>

                    {/* Questions */}
                    <div className="text-center p-3 border-2 border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors">
                        <MessageSquare className="w-4 h-4 text-foreground mx-auto mb-1.5" />
                        <div className="text-xl font-black text-foreground">{stats.questionsCount}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Soru</div>
                    </div>

                    {/* Followers */}
                    <div className="text-center p-3 border-2 border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors">
                        <Users className="w-4 h-4 text-foreground mx-auto mb-1.5" />
                        <div className="text-xl font-black text-foreground">{stats.followersCount}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Takipçi</div>
                    </div>

                    {/* Following */}
                    <div className="text-center p-3 border-2 border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors">
                        <UserPlus className="w-4 h-4 text-foreground mx-auto mb-1.5" />
                        <div className="text-xl font-black text-foreground">{stats.followingCount}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Takip</div>
                    </div>
                </div>

                {/* Reputation */}
                <div className="border-t-2 border-foreground/10 mt-4 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Reputasyon</span>
                        <ReputationDisplay reputation={profile?.reputation || 0} size="sm" showLabel={false} />
                    </div>
                </div>
            </Card>

            {/* Links Card */}
            {(profile?.website || hasSocialLinks) && (
                <Card className="p-5 border-2 border-foreground/10 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                    <h3 className="text-xs font-black uppercase text-muted-foreground mb-4 tracking-wider flex items-center gap-2">
                        <div className="w-0.5 h-4 bg-foreground" />
                        Bağlantılar
                    </h3>

                    <div className="space-y-2.5">
                        {/* Website */}
                        {profile?.website && (
                            <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-foreground/70 hover:text-foreground transition-colors font-medium"
                            >
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}

                        {/* Social Links */}
                        {socialLinks.twitter && (
                            <a
                                href={`https://twitter.com/${socialLinks.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-foreground/70 hover:text-foreground transition-colors font-medium"
                            >
                                <Twitter className="w-3.5 h-3.5" />
                                <span>@{socialLinks.twitter}</span>
                            </a>
                        )}

                        {socialLinks.github && (
                            <a
                                href={`https://github.com/${socialLinks.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-foreground/70 hover:text-foreground transition-colors font-medium"
                            >
                                <Github className="w-3.5 h-3.5" />
                                <span>{socialLinks.github}</span>
                            </a>
                        )}

                        {socialLinks.linkedin && (
                            <a
                                href={`https://linkedin.com/in/${socialLinks.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-foreground/70 hover:text-foreground transition-colors font-medium"
                            >
                                <Linkedin className="w-3.5 h-3.5" />
                                <span>{socialLinks.linkedin}</span>
                            </a>
                        )}

                        {socialLinks.instagram && (
                            <a
                                href={`https://instagram.com/${socialLinks.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-foreground/70 hover:text-foreground transition-colors font-medium"
                            >
                                <Instagram className="w-3.5 h-3.5" />
                                <span>@{socialLinks.instagram}</span>
                            </a>
                        )}
                    </div>
                </Card>
            )}

            {/* Member Since */}
            <Card className="p-5 border-2 border-foreground/10 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                        {format(new Date(createdAt), 'MMMM yyyy', { locale: tr })} tarihinden beri üye
                    </span>
                </div>
            </Card>

            {/* Badges */}
            {badges && badges.length > 0 && (
                <Card className="p-5 border-2 border-foreground/10 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                    <h3 className="text-xs font-black uppercase text-muted-foreground mb-4 tracking-wider flex items-center gap-2">
                        <div className="w-0.5 h-4 bg-foreground" />
                        Rozetler
                    </h3>
                    <BadgeDisplay userBadges={badges} maxDisplay={6} size="sm" />
                </Card>
            )}
        </aside>
    );
}
