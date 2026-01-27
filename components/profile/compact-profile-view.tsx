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

            {/* 1. COMPACT HEADER - Proportional Design */}
            <div className="relative">
                {/* Cover - Viewport Proportional (35% of screen height) */}
                <div className="h-[35vh] min-h-[260px] max-h-[400px] w-full bg-zinc-900 overflow-hidden relative">
                    {profile?.cover_url && (
                        <img src={profile.cover_url} alt="" className="w-full h-full object-cover" />
                    )}
                    {/* Cinematic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-black/20" /> {/* Dimmer */}

                    {/* Top Actions */}
                    <div className="absolute top-2 right-2 flex gap-2 z-20">
                        {isOwnProfile ? (
                            <Link href="/ayarlar">
                                <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/20 text-white rounded-full backdrop-blur-md hover:bg-black/40 ring-1 ring-white/10 transition-all">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </Link>
                        ) : (
                            <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/20 text-white rounded-full backdrop-blur-md hover:bg-black/40 ring-1 ring-white/10">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Identity Row - Perfectly Centered Overlap */}
                <div className="px-5 relative z-10 w-full mb-6 -mt-[72px]">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="w-36 h-36 rounded-3xl border-[4px] border-background bg-zinc-800 overflow-hidden shadow-2xl relative group">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="bg-primary text-black text-5xl font-black rounded-none">
                                    {profile?.full_name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            {/* Verified Badge inside Avatar if desired, or kept outside */}
                        </div>

                        {/* Name & Badge */}
                        <div className="mt-4 flex flex-col items-center">
                            <h1 className="text-3xl font-black text-foreground leading-tight flex items-center justify-center gap-2">
                                {profile?.full_name}
                                {userBadges?.some((b: any) => b.badges?.category === 'verified') && (
                                    <Zap className="w-6 h-6 text-primary fill-primary" />
                                )}
                            </h1>
                            <p className="text-zinc-500 font-medium text-base mt-1">@{profile?.username}</p>
                        </div>

                        {/* Bio */}
                        {profile?.bio && (
                            <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 mt-3 max-w-[90%] font-medium opacity-90">
                                {profile.bio}
                            </p>
                        )}

                        {/* Actions Row - Centered */}
                        <div className="flex items-center gap-3 mt-5 w-full justify-center">
                            {isOwnProfile ? (
                                <Link href="/profil/duzenle" className="w-full max-w-[200px]">
                                    <Button className="w-full h-11 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Profili Düzenle
                                    </Button>
                                </Link>
                            ) : (
                                <Button className="w-full max-w-[200px] h-11 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 shadow-lg shadow-primary/20">
                                    Takip Et
                                </Button>
                            )}

                            {profile?.website && (
                                <a href={profile.website} target="_blank">
                                    <Button size="icon" variant="outline" className="h-11 w-11 rounded-xl border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-700">
                                        <LinkIcon className="w-5 h-5" />
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. STATS - Balanced Grid */}
            <div className="px-4 mb-6">
                <div className="grid grid-cols-3 gap-2 bg-zinc-900/40 rounded-2xl border border-white/5 p-4 backdrop-blur-sm">
                    <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                        <span className="text-2xl font-black text-primary font-mono tracking-tight">{formatNumber(stats.reputation)}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Puan</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border-x border-white/5">
                        <span className="text-xl font-bold text-white font-mono">{formatNumber(stats.followersCount)}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Takipçi</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="text-xl font-bold text-white font-mono">{formatNumber(stats.followingCount)}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Takip</span>
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
