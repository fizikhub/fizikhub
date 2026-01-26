"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MessageSquare, Link as LinkIcon, Activity,
    Settings, Edit, Zap, FileText, Calendar, ChevronRight, MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompactProfileViewProps {
    profile: any;
    isOwnProfile: boolean;
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
    userBadges: any[];
    articles: any[];
    questions: any[];
    drafts?: any[];
    unreadCount?: number;
}

export function CompactProfileView({
    profile,
    isOwnProfile,
    stats,
    userBadges,
    articles,
    questions,
    drafts = [],
    unreadCount = 0
}: CompactProfileViewProps) {

    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    // Compact list item component for reuse
    const ContentListItem = ({ title, meta1, meta2, link, image, isDraft }: any) => (
        <Link href={link} className="block group">
            <div className="flex gap-4 py-3 border-b border-border/40 group-last:border-0 hover:bg-zinc-900/50 transition-colors -mx-2 px-2 rounded-lg">
                {/* Thumbnail - Fixed Size */}
                <div className="w-20 h-20 flex-shrink-0 bg-secondary rounded-lg overflow-hidden border border-border relative">
                    {image ? (
                        <img src={image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                            <FileText className="w-6 h-6 opacity-20" />
                        </div>
                    )}
                    {isDraft && <span className="absolute top-1 left-1 w-2 h-2 bg-yellow-500 rounded-full" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-[15px] font-semibold leading-snug text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <span>{meta1}</span>
                        {meta2 && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                <span>{meta2}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center text-zinc-700">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-background pb-20 font-sans">

            {/* 1. COMPACT HEADER */}
            <div className="relative">
                {/* Cover - Efficient Height */}
                <div className="h-32 w-full bg-zinc-900 overflow-hidden relative">
                    {profile?.cover_url && (
                        <img src={profile.cover_url} alt="" className="w-full h-full object-cover opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                    {/* Top Actions */}
                    <div className="absolute top-2 right-2 flex gap-2">
                        {isOwnProfile ? (
                            <Link href="/ayarlar">
                                <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/50 text-white rounded-full backdrop-blur-sm">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Identity Row - Overlapping */}
                <div className="px-4 -mt-10 flex flex-col relative z-10">
                    <div className="flex justify-between items-end">
                        <div className="w-24 h-24 rounded-2xl border-[3px] border-background bg-zinc-800 overflow-hidden shadow-lg">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="bg-primary text-black text-2xl font-bold rounded-none">
                                    {profile?.full_name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Action Buttons - Right of Avatar */}
                        <div className="flex gap-2 pb-1">
                            {isOwnProfile ? (
                                <Link href="/profil/duzenle" className="flex-1">
                                    <Button size="sm" variant="outline" className="h-9 px-4 rounded-full border-border bg-background text-xs font-bold shadow-sm">
                                        Düzenle
                                    </Button>
                                </Link>
                            ) : (
                                <Button size="sm" className="h-9 px-6 rounded-full bg-primary text-black font-bold text-xs hover:bg-primary/90">
                                    Takip Et
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="mt-3">
                        <h1 className="text-2xl font-black text-foreground leading-tight flex items-center gap-1">
                            {profile?.full_name}
                            {userBadges?.some((b: any) => b.badges?.category === 'verified') && (
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            )}
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium mb-2">@{profile?.username}</p>

                        {profile?.bio && (
                            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 font-medium">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Joined {format(new Date(profile?.created_at || Date.now()), 'MMM yyyy')}
                            </span>
                            {profile?.website && (
                                <a href={profile.website} target="_blank" className="flex items-center gap-1 text-primary">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    Web
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. STATS STRIP - Horizontal Scroll */}
            <div className="flex items-center gap-6 px-4 py-4 mt-4 overflow-x-auto no-scrollbar border-b border-border/40">
                <div className="flex flex-col flex-shrink-0">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Repütasyon</span>
                    <span className="text-lg font-black text-primary font-mono">{formatNumber(stats.reputation)}</span>
                </div>
                <div className="w-[1px] h-8 bg-border/40 flex-shrink-0" />
                <div className="flex flex-col flex-shrink-0">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Takipçi</span>
                    <span className="text-lg font-black text-foreground font-mono">{formatNumber(stats.followersCount)}</span>
                </div>
                <div className="flex flex-col flex-shrink-0">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Takip</span>
                    <span className="text-lg font-black text-foreground font-mono">{formatNumber(stats.followingCount)}</span>
                </div>
                <div className="w-[1px] h-8 bg-border/40 flex-shrink-0" />
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-zinc-400 bg-secondary/30 px-2 py-1 rounded-md">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{stats.articlesCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 bg-secondary/30 px-2 py-1 rounded-md">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{stats.questionsCount}</span>
                    </div>
                </div>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="px-4 mt-2">
                <Tabs defaultValue="articles" className="w-full">
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-30 pt-2 pb-2">
                        <TabsList className="bg-transparent w-full justify-start h-auto p-0 border-b border-border/40 rounded-none gap-6">
                            {[
                                { id: 'articles', label: 'Makaleler' },
                                { id: 'questions', label: 'Sorular' },
                                { id: 'drafts', label: 'Taslaklar', hidden: !isOwnProfile },
                            ].filter(t => !t.hidden).map(tab => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-zinc-500 rounded-none px-0 py-3 font-bold text-sm transition-all"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="pt-2 min-h-[300px]">
                        <TabsContent value="articles" className="space-y-1">
                            {articles.map((article) => (
                                <ContentListItem
                                    key={article.id}
                                    title={article.title}
                                    link={`/makale/${article.slug}`}
                                    image={article.cover_url}
                                    meta1={format(new Date(article.created_at), 'd MMM')}
                                    meta2={`${article.views || 0} okuma`}
                                />
                            ))}
                            {articles.length === 0 && <div className="text-center py-10 text-zinc-500 text-sm">İçerik bulunamadı.</div>}
                        </TabsContent>

                        <TabsContent value="questions" className="space-y-1">
                            {questions.map((q) => (
                                <ContentListItem
                                    key={q.id}
                                    title={q.title}
                                    link={`/forum/${q.id}`}
                                    image={null} // Questions usually don't have covers in list view unless logic changes
                                    meta1={format(new Date(q.created_at), 'd MMM')}
                                    meta2={`${q.answers_count || 0} cevap`}
                                />
                            ))}
                            {questions.length === 0 && <div className="text-center py-10 text-zinc-500 text-sm">Soru bulunamadı.</div>}
                        </TabsContent>

                        {isOwnProfile && (
                            <TabsContent value="drafts" className="space-y-1">
                                {drafts.map((d) => (
                                    <ContentListItem
                                        key={d.id}
                                        title={d.title || "Adsız Taslak"}
                                        link={`/makale/duzenle/${d.id}`}
                                        image={d.cover_url}
                                        meta1="Düzenlemeye devam et"
                                        isDraft={true}
                                    />
                                ))}
                            </TabsContent>
                        )}
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
