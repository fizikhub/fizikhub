"use client";

import { Card } from "@/components/ui/card";
import { Calendar, LinkIcon, Twitter, Github, Linkedin, Instagram, Award, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { BadgeDisplay } from "@/components/badge-display";
import { SiteLogo } from "@/components/icons/site-logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { ProfileTimeLimitDisplay } from "@/components/time-limit/profile-time-limit-display";

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

    // Level calculation
    const getLevel = (rep: number) => {
        if (rep >= 5000) return "Evrensel Zeka";
        if (rep >= 1000) return "Teorisyen";
        if (rep >= 500) return "Araştırmacı";
        if (rep >= 100) return "Gözlemci";
        return "Çaylak";
    };

    return (
        <aside className="space-y-4">
            {/* Time Limit Display */}
            <ProfileTimeLimitDisplay />

            {/* HubPuan Card */}
            <Popover>
                <PopoverTrigger asChild>
                    <Card className="p-4 border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-md">
                                    <SiteLogo className="!w-5 !h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                        HubPuan
                                        <HelpCircle className="w-3 h-3" />
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">{profile?.reputation || 0}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">Seviye</div>
                                <div className="text-sm font-medium text-foreground">{getLevel(profile?.reputation || 0)}</div>
                            </div>
                        </div>
                    </Card>
                </PopoverTrigger>
                <PopoverContent side="bottom" className="max-w-[280px] p-4">
                    <div className="space-y-2">
                        <p className="font-medium text-foreground">HubPuan Nedir?</p>
                        <p className="text-sm text-muted-foreground">
                            Makale yazarak, soru sorarak, cevap vererek ve beğeni alarak puan kazanırsınız.
                        </p>
                        <Link href="/puanlar-nedir" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                            Daha fazla bilgi →
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Stats */}
            <Card className="p-4 border border-border bg-card">
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                        <div className="text-lg font-bold text-foreground">{stats.followersCount}</div>
                        <div className="text-[10px] text-muted-foreground">Takipçi</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-foreground">{stats.followingCount}</div>
                        <div className="text-[10px] text-muted-foreground">Takip</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-foreground">{stats.articlesCount}</div>
                        <div className="text-[10px] text-muted-foreground">Makale</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-foreground">{stats.questionsCount}</div>
                        <div className="text-[10px] text-muted-foreground">Soru</div>
                    </div>
                </div>
            </Card>

            {/* About Card */}
            <Card className="p-4 border border-border bg-card">
                <h3 className="text-xs font-medium text-muted-foreground mb-3">Hakkında</h3>

                {/* Bio */}
                {profile?.bio && (
                    <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                        {profile.bio}
                    </p>
                )}

                {/* Links */}
                {(profile?.website || hasSocialLinks) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {profile?.website && (
                            <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded bg-muted/50 hover:bg-muted"
                            >
                                <LinkIcon className="w-3 h-3" />
                                <span className="truncate max-w-[100px]">{profile.website.replace(/^https?:\/\//, '').split('/')[0]}</span>
                            </a>
                        )}
                        {socialLinks.twitter && (
                            <a href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50 hover:bg-muted">
                                <Twitter className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.github && (
                            <a href={`https://github.com/${socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50 hover:bg-muted">
                                <Github className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.linkedin && (
                            <a href={`https://linkedin.com/in/${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50 hover:bg-muted">
                                <Linkedin className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.instagram && (
                            <a href={`https://instagram.com/${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50 hover:bg-muted">
                                <Instagram className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                )}

                {/* Member Since */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-border">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(createdAt), 'MMMM yyyy', { locale: tr })} tarihinden beri üye</span>
                </div>
            </Card>

            {/* Badges */}
            {badges && badges.length > 0 && (
                <Card className="p-4 border border-border bg-card">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Award className="w-3 h-3" />
                            Rozetler
                        </h3>
                        <span className="text-[10px] text-muted-foreground">{badges.length}</span>
                    </div>
                    <BadgeDisplay userBadges={badges} maxDisplay={4} size="sm" />
                </Card>
            )}
        </aside>
    );
}
