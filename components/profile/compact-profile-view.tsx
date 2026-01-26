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
                {/* Cover - INCREASED HEIGHT */}
                <div className="h-64 w-full bg-zinc-900 overflow-hidden relative">
                    {profile?.cover_url && (
                        <img src={profile.cover_url} alt="" className="w-full h-full object-cover" />
                    )}
                    {/* Stronger Gradient for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                    {/* Top Actions */}
                    <div className="absolute top-2 right-2 flex gap-2 z-20">
                        {isOwnProfile ? (
                            <Link href="/ayarlar">
                                <Button size="icon" variant="ghost" className="h-9 w-9 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 ring-1 ring-white/10">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </Link>
                        ) : (
                            <Button size="icon" variant="ghost" className="h-9 w-9 bg-black/40 text-white rounded-full backdrop-blur-md">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Identity Row - Refined Layout */}
                <div className="px-5 -mt-16 flex flex-col relative z-10 w-full mb-6">
                    <div className="flex justify-between items-end w-full">
                        {/* Larger Avatar */}
                        <div className="w-32 h-32 rounded-2xl border-[4px] border-background bg-zinc-800 overflow-hidden shadow-2xl">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="bg-primary text-black text-4xl font-black rounded-none">
                                    {profile?.full_name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Action Button - Better positioning */}
                        <div className="mb-2">
                            {isOwnProfile ? (
                                <Link href="/profil/duzenle">
                                    <Button size="sm" className="h-10 px-6 rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md font-bold text-xs hover:bg-white/10 shadow-lg">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Düzenle
                                    </Button>
                                </Link>
                            ) : (
                                <Button size="sm" className="h-10 px-8 rounded-xl bg-primary text-black font-black text-xs hover:bg-primary/90 shadow-lg shadow-primary/20">
                                    Takip Et
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h1 className="text-3xl font-black text-foreground leading-none flex items-center gap-2 mb-1">
                            {profile?.full_name}
                            {userBadges?.some((b: any) => b.badges?.category === 'verified') && (
                                <Zap className="w-6 h-6 text-primary fill-primary" />
                            )}
                        </h1>
                        <p className="text-zinc-500 font-medium text-base mb-3">@{profile?.username}</p>

                        {profile?.bio && (
                            <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 max-w-[90%]">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500 font-medium uppercase tracking-wide">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-zinc-600" />
                                {format(new Date(profile?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}
                            </span>
                            {profile?.website && (
                                <a href={profile.website} target="_blank" className="flex items-center gap-1.5 text-primary hover:underline">
                                    <LinkIcon className="w-4 h-4" />
                                    Web
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. STATS - Premium Dashboard Look */}
            <div className="mx-4 bg-zinc-900/50 rounded-2xl border border-white/5 p-4 mb-2 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-2xl font-black text-primary font-mono tracking-tight">{formatNumber(stats.reputation)}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Repütasyon</span>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10" />
                    <div className="flex flex-col gap-0.5 text-center px-4">
                        <span className="text-lg font-bold text-white font-mono">{formatNumber(stats.followersCount)}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Takipçi</span>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10" />
                    <div className="flex flex-col gap-0.5 text-right">
                        <span className="text-lg font-bold text-white font-mono">{formatNumber(stats.followingCount)}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Takip</span>
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
