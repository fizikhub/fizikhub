"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Settings, MoreHorizontal, Zap, Edit, Link as LinkIcon,
    MapPin, Calendar, FileText, MessageSquare, ChevronRight,
    Share2, ArrowLeft, ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
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

    // --- Components ---

    const StatItem = ({ label, value, icon: Icon }: any) => (
        <div className="flex flex-col items-center justify-center flex-1 p-2 active:scale-95 transition-transform duration-200 cursor-pointer group">
            <span className="text-xl font-black text-foreground font-mono group-hover:text-primary transition-colors">
                {formatNumber(value)}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {label}
            </span>
        </div>
    );

    const FeedItem = ({ title, meta, date, image, link, type = "article" }: any) => (
        <Link href={link} className="block group">
            <div className="flex gap-3 py-4 border-b border-border/50 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                {/* Thumb */}
                <div className="w-16 h-16 flex-shrink-0 bg-secondary rounded-lg border-2 border-border/50 overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-none">
                    {image ? (
                        <img src={image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
                            {type === 'article' ? <FileText size={18} /> : <MessageSquare size={18} />}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <h3 className="text-[14px] font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <span className="text-primary">{type === 'article' ? 'Makale' : 'Soru'}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{date}</span>
                        {meta && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>{meta}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-background font-sans max-w-md mx-auto border-x border-border/40 shadow-2xl">

            {/* Header Area */}
            <div className="relative mb-14">
                {/* Nav Bar Overlay */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start pointer-events-none">
                    <div className="pointer-events-auto">
                        <Link href="/">
                            <div className="h-10 w-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 shadow-lg active:scale-90 transition-transform">
                                <ArrowLeft size={20} />
                            </div>
                        </Link>
                    </div>
                    <div className="pointer-events-auto flex gap-2">
                        {isOwnProfile ? (
                            <Link href="/ayarlar">
                                <div className="h-10 w-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 shadow-lg active:scale-90 transition-transform">
                                    <Settings size={20} />
                                </div>
                            </Link>
                        ) : (
                            <div className="h-10 w-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 shadow-lg active:scale-90 transition-transform">
                                <MoreHorizontal size={20} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Cover Image */}
                <div className="h-44 w-full bg-zinc-800 relative overflow-hidden">
                    {profile?.cover_url ? (
                        <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opactiy-50" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-10 left-4 z-10 p-1 bg-background rounded-2xl">
                    <Avatar className="w-24 h-24 rounded-xl border-2 border-background shadow-xl">
                        <AvatarImage src={profile?.avatar_url} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-primary text-primary-foreground text-3xl font-black">
                            {profile?.full_name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    {/* Verify Badge */}
                    {userBadges?.some((b: any) => b.badges?.category === 'verified') && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-background shadow-sm" title="Onaylı Hesap">
                            <ShieldCheck size={14} fill="white" className="text-blue-500" />
                        </div>
                    )}
                </div>

                {/* Top Action (Mobile Style) */}
                <div className="absolute -bottom-10 right-4 flex gap-2">
                    {isOwnProfile ? (
                        <Link href="/profil/duzenle">
                            <Button variant="outline" size="sm" className="h-9 rounded-full px-4 border-2 font-bold text-xs bg-transparent hover:bg-secondary/50">
                                Profili Düzenle
                            </Button>
                        </Link>
                    ) : (
                        <Button size="sm" className="h-9 rounded-full px-6 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                            Takip Et
                        </Button>
                    )}
                </div>
            </div>

            {/* Identity Info */}
            <div className="px-4 pt-2 pb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                        {profile?.full_name}
                    </h1>
                    <span className="text-sm font-medium text-muted-foreground/80">@{profile?.username}</span>
                </div>

                {profile?.bio && (
                    <p className="mt-3 text-[13px] leading-relaxed font-medium text-foreground/80 max-w-sm">
                        {profile.bio}
                    </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs font-medium text-muted-foreground">
                    {profile?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            {profile.location}
                        </div>
                    )}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <LinkIcon size={12} />
                            {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        Ocak 2024'te katıldı
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="px-4 py-2 border-y border-border/40 mb-2">
                <div className="flex items-center justify-between divide-x divide-border/30">
                    <StatItem label="Takipçi" value={stats.followersCount} />
                    <StatItem label="Takip" value={stats.followingCount} />
                    <StatItem label="Puan" value={stats.reputation} />
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="articles" className="w-full">
                <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/40">
                    <TabsList className="w-full h-12 bg-transparent justify-start px-2 gap-6 rounded-none">
                        {[
                            { id: 'articles', label: 'Makaleler' },
                            { id: 'questions', label: 'Sorular' },
                            { id: 'drafts', label: 'Taslaklar', hide: !isOwnProfile }
                        ].filter(t => !t.hide).map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="h-full rounded-none border-b-[3px] border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground font-bold text-sm px-1 transition-all"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="min-h-[300px]">
                    <TabsContent value="articles" className="mt-0">
                        {articles.map((article) => (
                            <FeedItem
                                key={article.id}
                                title={article.title}
                                link={`/makale/${article.slug}`}
                                image={article.cover_url}
                                date={format(new Date(article.created_at), 'd MMM yyyy')}
                                meta={`${article.views || 0} görüntülenme`}
                            />
                        ))}
                        {articles.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <FileText className="w-12 h-12 opacity-20 mb-3" />
                                <p className="text-sm font-medium">Henüz bir makale yok.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="questions" className="mt-0">
                        {questions.map((q) => (
                            <FeedItem
                                key={q.id}
                                type="question"
                                title={q.title}
                                link={`/forum/${q.id}`}
                                date={format(new Date(q.created_at), 'd MMM yyyy')}
                                meta={`${q.answers_count || 0} cevap`}
                            />
                        ))}
                        {questions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <MessageSquare className="w-12 h-12 opacity-20 mb-3" />
                                <p className="text-sm font-medium">Henüz bir soru yok.</p>
                            </div>
                        )}
                    </TabsContent>

                    {isOwnProfile && (
                        <TabsContent value="drafts" className="mt-0">
                            {drafts.map((d) => (
                                <FeedItem
                                    key={d.id}
                                    title={d.title || "Adsız Taslak"}
                                    link={`/makale/duzenle/${d.id}`}
                                    image={d.cover_url}
                                    date="Düzenlemeye devam et"
                                />
                            ))}
                            {drafts.length === 0 && (
                                <div className="py-10 text-center text-sm text-muted-foreground">Taslak yok.</div>
                            )}
                        </TabsContent>
                    )}
                </div>
            </Tabs>

        </div>
    );
}
