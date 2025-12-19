"use client";

import { Card } from "@/components/ui/card";
import { Calendar, LinkIcon, Twitter, Github, Linkedin, Instagram, FileText, MessageSquare, Users, Award, UserPlus, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { BadgeDisplay } from "@/components/badge-display";
import { SiteLogo } from "@/components/icons/site-logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

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

        <aside className="space-y-4">
            {/* HubPuan - Prominent Display with Tooltip */}
            {/* HubPuan - Prominent Display with Popover (Mobile Friendly) */}
            <Popover>
                <PopoverTrigger asChild>
                    <Card className="p-5 border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    <SiteLogo className="!w-7 !h-7" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1">
                                        HubPuan
                                        <HelpCircle className="w-3 h-3 opacity-60" />
                                    </div>
                                    <div className="text-3xl font-black text-foreground">{profile?.reputation || 0}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Seviye</div>
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {profile?.reputation >= 1000 ? "Uzman" : profile?.reputation >= 500 ? "Deneyimli" : profile?.reputation >= 100 ? "Aktif" : "Yeni"}
                                </div>
                            </div>
                        </div>
                    </Card>
                </PopoverTrigger>
                <PopoverContent side="bottom" className="max-w-[280px] p-4">
                    <div className="space-y-2">
                        <p className="font-bold text-foreground">HubPuan Nedir?</p>
                        <p className="text-sm text-muted-foreground">
                            HubPuan, topluluktaki katkılarınızı ölçen bir puanlama sistemidir. Makale yazarak, soru sorarak, cevap vererek ve beğeni alarak puan kazanırsınız.
                        </p>
                        <Link href="/puanlar-nedir" className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                            Daha fazla bilgi →
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Stats - Compact Single Row - Reordered: Takipçi, Takip, Makale, Soru */}
            <Card className="p-4 border-2 border-foreground/10 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-around text-center divide-x divide-foreground/10">
                    <div className="flex-1 px-2">
                        <div className="text-xl font-black text-foreground">{stats.followersCount}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Takipçi</div>
                    </div>
                    <div className="flex-1 px-2">
                        <div className="text-xl font-black text-foreground">{stats.followingCount}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Takip</div>
                    </div>
                    <div className="flex-1 px-2">
                        <div className="text-xl font-black text-foreground">{stats.articlesCount}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Makale</div>
                    </div>
                    <div className="flex-1 px-2">
                        <div className="text-xl font-black text-foreground">{stats.questionsCount}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Soru</div>
                    </div>
                </div>
            </Card>

            {/* About Card - Consolidated Bio + Links + Member Since */}
            <Card className="p-5 border-2 border-foreground/10 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]">
                <h3 className="text-xs font-black uppercase text-muted-foreground mb-4 tracking-wider flex items-center gap-2">
                    <div className="w-1 h-4 bg-foreground rounded-full" />
                    Hakkında
                </h3>

                {/* Bio */}
                {profile?.bio && (
                    <p className="text-foreground/80 leading-relaxed text-sm mb-4">
                        {profile.bio}
                    </p>
                )}

                {/* Links Section */}
                {(profile?.website || hasSocialLinks) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {profile?.website && (
                            <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground transition-colors bg-foreground/5 hover:bg-foreground/10 px-2.5 py-1.5 rounded-lg"
                            >
                                <LinkIcon className="w-3 h-3" />
                                <span className="truncate max-w-[100px]">{profile.website.replace(/^https?:\/\//, '').split('/')[0]}</span>
                            </a>
                        )}
                        {socialLinks.twitter && (
                            <a
                                href={`https://twitter.com/${socialLinks.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground transition-colors bg-foreground/5 hover:bg-foreground/10 px-2.5 py-1.5 rounded-lg"
                            >
                                <Twitter className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.github && (
                            <a
                                href={`https://github.com/${socialLinks.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground transition-colors bg-foreground/5 hover:bg-foreground/10 px-2.5 py-1.5 rounded-lg"
                            >
                                <Github className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.linkedin && (
                            <a
                                href={`https://linkedin.com/in/${socialLinks.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground transition-colors bg-foreground/5 hover:bg-foreground/10 px-2.5 py-1.5 rounded-lg"
                            >
                                <Linkedin className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.instagram && (
                            <a
                                href={`https://instagram.com/${socialLinks.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground transition-colors bg-foreground/5 hover:bg-foreground/10 px-2.5 py-1.5 rounded-lg"
                            >
                                <Instagram className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                )}

                {/* Member Since - Inline */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-foreground/10">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(createdAt), 'MMMM yyyy', { locale: tr })} tarihinden beri üye</span>
                </div>
            </Card>

            {/* Badges - Compact */}
            {badges && badges.length > 0 && (
                <Card className="p-4 border-2 border-foreground/10 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-black uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                            <Award className="w-3.5 h-3.5" />
                            Rozetler
                        </h3>
                        <span className="text-[10px] text-muted-foreground">{badges.length} rozet</span>
                    </div>
                    <BadgeDisplay userBadges={badges} maxDisplay={4} size="sm" />
                </Card>
            )}
        </aside>
    );
}
