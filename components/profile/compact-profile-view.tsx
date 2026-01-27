"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Settings, MoreHorizontal, Zap, Edit, Link as LinkIcon,
    MapPin, Calendar, FileText, MessageSquare, ChevronRight,
    Share2, ArrowLeft, ShieldCheck, Atom, Fingerprint, Activity
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

    const { scrollY } = useScroll();
    const coverY = useTransform(scrollY, [0, 300], [0, 150]);
    const coverOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
    const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    // --- Aesthetic Components ---

    const NoiseOverlay = () => (
        <div className="fixed inset-0 pointer-events-none z-[5] opacity-[0.03] mix-blend-overlay"
            style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
            }}
        />
    );

    const StatBox = ({ label, value, icon: Icon, delay }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors"
        >
            {/* Tech Decoration */}
            <div className="absolute top-1 right-1 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 bg-primary rounded-full" />
            </div>

            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tighter group-hover:scale-110 transition-transform duration-300">
                {formatNumber(value)}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                {label}
            </span>
        </motion.div>
    );

    const FeedItem = ({ title, meta, date, image, link, type = "article", index }: any) => (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
        >
            <Link href={link} className="block group">
                <div className="relative flex gap-4 py-4 px-4 sm:px-0 border-b border-border/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-all rounded-xl -mx-4 sm:mx-0 sm:px-2">

                    {/* Visual Thumb */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-zinc-800 rounded-xl overflow-hidden border border-white/10 relative group-hover:shadow-lg group-hover:border-primary/30 transition-all">
                        {image ? (
                            <img src={image} alt="" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                                {type === 'article' ? <FileText size={24} /> : <MessageSquare size={24} />}
                            </div>
                        )}
                        {/* Type Tag */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-0.5 text-[9px] font-bold text-center text-white/80 uppercase tracking-wider">
                            {type === 'article' ? 'Makale' : 'Soru'}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                        <h3 className="text-[15px] sm:text-[16px] font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} className="opacity-70" />
                                {date}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            <span className="flex items-center gap-1">
                                <Activity size={12} className="opacity-70" />
                                {meta}
                            </span>
                        </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                        <ChevronRight className="text-primary w-5 h-5" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-primary/30">
            <NoiseOverlay />

            {/* Sticky Navigation Header */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center pointer-events-none"
                style={{ backdropFilter: `blur(${headerBlur}px)` }}
            >
                <div className="pointer-events-auto">
                    <Link href="/">
                        <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/30 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/50 hover:border-white/20 transition-all">
                            <ArrowLeft size={18} />
                        </Button>
                    </Link>
                </div>
                <div className="pointer-events-auto flex gap-2">
                    <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/30 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/50 hover:border-white/20 transition-all">
                        <Share2 size={18} />
                    </Button>
                    {isOwnProfile ? (
                        <Link href="/ayarlar">
                            <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/30 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/50 hover:border-white/20 transition-all">
                                <Settings size={18} />
                            </Button>
                        </Link>
                    ) : (
                        <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/30 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/50 hover:border-white/20 transition-all">
                            <MoreHorizontal size={18} />
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Parallax Cover Area */}
            <div className="relative w-full h-[40vh] min-h-[320px] overflow-hidden">
                <motion.div style={{ y: coverY, opacity: coverOpacity }} className="absolute inset-0 w-full h-full">
                    {profile?.cover_url ? (
                        <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        // Fallback Abstract Art
                        <div className="w-full h-full bg-[#0a0a0a] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-black to-amber-900/20" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full opacity-50 mix-blend-screen animate-pulse" />
                            <div className="w-full h-full absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.1) 2px, transparent 0)', backgroundSize: '40px 40px' }}
                            />
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                </motion.div>
            </div>

            {/* Main Content Container - Pulls up over cover */}
            <div className="relative z-10 -mt-32 px-4 sm:px-6 w-full max-w-2xl mx-auto pb-20">

                {/* Identity Card: Glass-Tek Style */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden"
                >
                    {/* Glowing border effect */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                            <div className="w-28 h-28 rounded-2xl p-1 bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-xl rotate-3 hover:rotate-0 transition-all duration-500">
                                <Avatar className="w-full h-full rounded-xl">
                                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                    <AvatarFallback className="bg-primary/20 text-primary text-4xl font-black rounded-xl">
                                        {profile?.full_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            {userBadges?.some((b: any) => b.badges?.category === 'verified') && (
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-[3px] border-[#0a0a0a] shadow-lg"
                                >
                                    <ShieldCheck size={16} fill="white" className="text-blue-500" />
                                </motion.div>
                            )}
                        </div>

                        {/* Name & Title */}
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            {profile?.full_name}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 mb-4">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-zinc-400">
                                @{profile?.username}
                            </span>
                            {/* Level/Role badge placeholder */}
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-mono text-primary font-bold">
                                LVL 1
                            </span>
                        </div>

                        {/* Bio */}
                        {profile?.bio && (
                            <p className="text-sm text-zinc-300 font-medium leading-relaxed max-w-sm mx-auto opacity-90">
                                {profile.bio}
                            </p>
                        )}

                        {/* Metadata Row */}
                        <div className="flex flex-wrap justify-center gap-3 mt-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                            {profile?.location && (
                                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                                    <MapPin size={12} />
                                    {profile.location}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                                <Calendar size={12} />
                                Katılım: 2024
                            </div>
                            {profile?.website && (
                                <a href={profile.website} target="_blank" className="flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
                                    <LinkIcon size={12} />
                                    Website
                                </a>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-6 w-full max-w-xs">
                            {isOwnProfile ? (
                                <Link href="/profil/duzenle" className="flex-1">
                                    <Button className="w-full rounded-xl bg-white text-black font-bold h-11 hover:bg-zinc-200 transition-colors">
                                        <Edit size={16} className="mr-2" />
                                        Düzenle
                                    </Button>
                                </Link>
                            ) : (
                                <Button className="flex-1 rounded-xl bg-primary text-black font-bold h-11 hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                    Takip Et
                                </Button>
                            )}
                            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white">
                                <Fingerprint size={20} />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-3 gap-3 my-6">
                    <StatBox label="Takipçi" value={stats.followersCount} icon={Fingerprint} delay={0.3} />
                    <StatBox label="Takip" value={stats.followingCount} icon={LinkIcon} delay={0.4} />
                    <StatBox label="Reputasyon" value={stats.reputation} icon={Atom} delay={0.5} />
                </div>

                {/* Content Tabs area */}
                <div className="mt-8">
                    <Tabs defaultValue="articles" className="w-full">
                        <TabsList className="w-full bg-transparent border-b border-white/10 justify-start h-auto p-0 mb-6 gap-6 rounded-none">
                            {[
                                { id: 'articles', label: 'Makaleler' },
                                { id: 'questions', label: 'Sorular' },
                                { id: 'drafts', label: 'Taslaklar', hide: !isOwnProfile }
                            ].filter(t => !t.hide).map(tab => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-zinc-500 font-bold tracking-tight text-sm transition-all"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="articles" className="space-y-2">
                            {articles.map((article, i) => (
                                <FeedItem
                                    key={article.id}
                                    index={i}
                                    title={article.title}
                                    link={`/makale/${article.slug}`}
                                    image={article.cover_url}
                                    date={format(new Date(article.created_at), 'd MMM', { locale: tr })}
                                    meta={`${article.views || 0} okuma`}
                                />
                            ))}
                            {articles.length === 0 && (
                                <div className="py-12 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-2xl">
                                    <FileText className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">Henüz içerik yok.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="questions" className="space-y-2">
                            {questions.map((q, i) => (
                                <FeedItem
                                    key={q.id}
                                    index={i}
                                    type="question"
                                    title={q.title}
                                    link={`/forum/${q.id}`}
                                    date={format(new Date(q.created_at), 'd MMM', { locale: tr })}
                                    meta={`${q.answers_count || 0} cevap`}
                                />
                            ))}
                            {questions.length === 0 && (
                                <div className="py-12 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-2xl">
                                    <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">Soru bulunamadı.</p>
                                </div>
                            )}
                        </TabsContent>

                        {isOwnProfile && (
                            <TabsContent value="drafts" className="space-y-2">
                                {drafts.map((d, i) => (
                                    <FeedItem
                                        key={d.id}
                                        index={i}
                                        title={d.title || "İsimsiz Taslak"}
                                        link={`/makale/duzenle/${d.id}`}
                                        image={d.cover_url}
                                        date="Taslak"
                                        meta="Düzenle"
                                    />
                                ))}
                            </TabsContent>
                        )}
                    </Tabs>
                </div>

            </div>
        </div>
    );
}
