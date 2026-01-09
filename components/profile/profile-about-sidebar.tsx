"use client";

import { Card } from "@/components/ui/card";
import { Calendar, LinkIcon, Twitter, Github, Linkedin, Instagram, FileText, MessageSquare, Users, Award, UserPlus, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { BadgeDisplay } from "@/components/badge-display";
import { useTheme } from "next-themes";
import { SiteLogo } from "@/components/icons/site-logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { cn } from "@/lib/utils";
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

    const { theme } = useTheme();
    // Simplified since this component is client-side "use client"
    const isPink = theme === 'pink';
    const isDarkPink = theme === 'dark-pink';
    const isCute = isPink || isDarkPink;

    return (

        <aside className="space-y-4">
            {/* Time Limit Display for restricted users */}
            <ProfileTimeLimitDisplay />
            {/* HubPuan - Prominent Display with Tooltip */}
            {/* HubPuan - Prominent Display with Popover (Mobile Friendly) */}
            <Popover>
                <PopoverTrigger asChild>
                    <Card className={cn(
                        "p-3.5 border bg-blue-50/50 dark:bg-blue-900/10 rounded-xl cursor-pointer transition-all group hover:scale-[1.02]",
                        !isCute && "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700",
                        isPink && "border-pink-300 bg-pink-50/80 hover:border-pink-400 hover:shadow-[0_4px_10px_rgba(255,20,147,0.2)] rounded-[1.5rem]",
                        isDarkPink && "border-pink-700 bg-pink-950/30 hover:border-pink-500 hover:shadow-[0_4px_10px_rgba(255,20,147,0.2)] rounded-[1.5rem]"
                    )}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className={cn(
                                    "p-1.5 rounded-lg",
                                    !isCute && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                                    isPink && "bg-white text-pink-500 shadow-sm",
                                    isDarkPink && "bg-pink-900/50 text-pink-300 shadow-sm"
                                )}>
                                    <SiteLogo className="!w-5 !h-5" />
                                </div>
                                <div>
                                    <div className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                                        !isCute && "text-blue-600 dark:text-blue-400",
                                        isCute && "text-pink-500"
                                    )}>
                                        HubPuan
                                        <HelpCircle className="w-3 h-3 opacity-60" />
                                    </div>
                                    <div className="text-2xl font-black text-foreground group-hover:scale-105 transition-transform origin-left">{profile?.reputation || 0}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Seviye</div>
                                <div className={cn(
                                    "text-base font-bold",
                                    !isCute && "text-blue-600 dark:text-blue-400",
                                    isPink && "text-pink-600",
                                    isDarkPink && "text-pink-400"
                                )}>
                                    {profile?.reputation >= 5000 ? "Evrensel Zeka" : profile?.reputation >= 1000 ? "Teorisyen" : profile?.reputation >= 500 ? "Araştırmacı" : profile?.reputation >= 100 ? "Gözlemci" : "Çaylak"}
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
            <Card className={cn(
                "p-3 border-2 rounded-xl transition-all",
                !isCute && "border-foreground/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]",
                isPink && "border-pink-200 shadow-[4px_4px_0px_0px_rgba(255,192,203,0.5)] rounded-[1.2rem] bg-white/80",
                isDarkPink && "border-pink-800 shadow-[4px_4px_0px_0px_rgba(255,20,147,0.2)] rounded-[1.2rem] bg-card"
            )}>
                <div className="flex items-center justify-around text-center divide-x divide-foreground/10">
                    <div className="flex-1 px-1">
                        <div className={cn("text-lg font-black text-foreground", isCute && "text-pink-600")}>{stats.followersCount}</div>
                        <div className="text-[9px] text-muted-foreground font-medium uppercase">Takipçi</div>
                    </div>
                    <div className="flex-1 px-1">
                        <div className={cn("text-lg font-black text-foreground", isCute && "text-pink-600")}>{stats.followingCount}</div>
                        <div className="text-[9px] text-muted-foreground font-medium uppercase">Takip</div>
                    </div>
                    <div className="flex-1 px-1">
                        <div className={cn("text-lg font-black text-foreground", isCute && "text-pink-600")}>{stats.articlesCount}</div>
                        <div className="text-[9px] text-muted-foreground font-medium uppercase">Makale</div>
                    </div>
                    <div className="flex-1 px-1">
                        <div className={cn("text-lg font-black text-foreground", isCute && "text-pink-600")}>{stats.questionsCount}</div>
                        <div className="text-[9px] text-muted-foreground font-medium uppercase">Soru</div>
                    </div>
                </div>
            </Card>

            {/* About Card - Consolidated Bio + Links + Member Since */}
            <Card className={cn(
                "p-4 border-2 rounded-xl transition-all",
                !isCute && "border-foreground/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]",
                isPink && "border-pink-200 shadow-[4px_4px_0px_0px_rgba(255,192,203,0.5)] rounded-[1.5rem]",
                isDarkPink && "border-pink-800 shadow-[4px_4px_0px_0px_rgba(255,20,147,0.2)] rounded-[1.5rem]"
            )}>
                <h3 className={cn(
                    "text-[10px] font-black uppercase mb-3 tracking-wider flex items-center gap-2",
                    !isCute && "text-muted-foreground",
                    isCute && "text-pink-500"
                )}>
                    <div className={cn("w-1 h-3 rounded-full", isCute ? "bg-pink-500" : "bg-foreground")} />
                    Hakkında
                </h3>

                {/* Bio */}
                {profile?.bio && (
                    <p className="text-foreground/80 leading-relaxed text-xs mb-3">
                        {profile.bio}
                    </p>
                )}

                {/* Links Section */}
                {(profile?.website || hasSocialLinks) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {profile?.website && (
                            <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "flex items-center gap-1.5 text-[10px] text-foreground/60 hover:text-foreground transition-colors px-2 py-1 rounded-md",
                                    isPink ? "bg-pink-100 hover:bg-pink-200 text-pink-700" : (isDarkPink ? "bg-pink-900/50 hover:bg-pink-900/70 text-pink-300" : "bg-foreground/5 hover:bg-foreground/10")
                                )}
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
                                className={cn(
                                    "flex items-center gap-1.5 text-[10px] text-foreground/60 hover:text-foreground transition-colors px-2 py-1 rounded-md",
                                    isPink ? "bg-pink-100 hover:bg-pink-200 text-pink-700" : (isDarkPink ? "bg-pink-900/50 hover:bg-pink-900/70 text-pink-300" : "bg-foreground/5 hover:bg-foreground/10")
                                )}
                            >
                                <Twitter className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.github && (
                            <a
                                href={`https://github.com/${socialLinks.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "flex items-center gap-1.5 text-[10px] text-foreground/60 hover:text-foreground transition-colors px-2 py-1 rounded-md",
                                    isPink ? "bg-pink-100 hover:bg-pink-200 text-pink-700" : (isDarkPink ? "bg-pink-900/50 hover:bg-pink-900/70 text-pink-300" : "bg-foreground/5 hover:bg-foreground/10")
                                )}
                            >
                                <Github className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.linkedin && (
                            <a
                                href={`https://linkedin.com/in/${socialLinks.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "flex items-center gap-1.5 text-[10px] text-foreground/60 hover:text-foreground transition-colors px-2 py-1 rounded-md",
                                    isPink ? "bg-pink-100 hover:bg-pink-200 text-pink-700" : (isDarkPink ? "bg-pink-900/50 hover:bg-pink-900/70 text-pink-300" : "bg-foreground/5 hover:bg-foreground/10")
                                )}
                            >
                                <Linkedin className="w-3 h-3" />
                            </a>
                        )}
                        {socialLinks.instagram && (
                            <a
                                href={`https://instagram.com/${socialLinks.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "flex items-center gap-1.5 text-[10px] text-foreground/60 hover:text-foreground transition-colors px-2 py-1 rounded-md",
                                    isPink ? "bg-pink-100 hover:bg-pink-200 text-pink-700" : (isDarkPink ? "bg-pink-900/50 hover:bg-pink-900/70 text-pink-300" : "bg-foreground/5 hover:bg-foreground/10")
                                )}
                            >
                                <Instagram className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                )}

                {/* Member Since - Inline */}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-2 border-t border-foreground/10">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(createdAt), 'MMMM yyyy', { locale: tr })} tarihinden beri üye</span>
                </div>
            </Card>

            {/* Badges - Compact */}
            {badges && badges.length > 0 && (
                <Card className={cn(
                    "p-3 border-2 rounded-xl transition-all",
                    !isCute && "border-foreground/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]",
                    isPink && "border-pink-200 shadow-[4px_4px_0px_0px_rgba(255,192,203,0.5)] rounded-[1.2rem]",
                    isDarkPink && "border-pink-800 shadow-[4px_4px_0px_0px_rgba(255,20,147,0.2)] rounded-[1.2rem] bg-card"
                )}>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className={cn(
                            "text-[10px] font-black uppercase tracking-wider flex items-center gap-2",
                            !isCute && "text-muted-foreground",
                            isCute && "text-pink-500"
                        )}>
                            <Award className="w-3 h-3" />
                            Rozetler
                        </h3>
                        <span className="text-[9px] text-muted-foreground">{badges.length} rozet</span>
                    </div>
                    <BadgeDisplay userBadges={badges} maxDisplay={4} size="sm" />
                </Card>
            )}
        </aside>
    );
}
