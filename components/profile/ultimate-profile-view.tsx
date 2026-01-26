"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MessageSquare, Link as LinkIcon, Microscope, Activity,
    Settings, Edit, Zap, FileText, Calendar, ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UltimateProfileViewProps {
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

export function UltimateProfileView({
    profile,
    isOwnProfile,
    stats,
    userBadges,
    articles,
    questions,
    drafts = [],
    unreadCount = 0
}: UltimateProfileViewProps) {

    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-32">

            {/* 1. HERO SECTION - IMMERSIVE COVER */}
            <div className="relative w-full h-[280px] md:h-[350px] group overflow-hidden">
                {profile?.cover_url ? (
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        <img
                            src={profile.cover_url}
                            alt="Cover"
                            className="w-full h-full object-cover opacity-90 transition-opacity duration-700 hover:opacity-100"
                        />
                    </motion.div>
                ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                        <div className="text-zinc-800 text-9xl font-black opacity-10 tracking-tighter">FIZIKHUB</div>
                    </div>
                )}
                {/* Cinema Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>

            {/* 2. PROFILE INTERFACE */}
            <div className="container max-w-6xl mx-auto px-4 relative -mt-32 md:-mt-40 z-10">

                {/* IDENTITY CARD */}
                <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
                    {/* AVATAR STACK */}
                    <div className="relative mx-auto md:mx-0">
                        <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl border-[6px] border-background bg-zinc-950 shadow-2xl relative z-20 group overflow-hidden">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-5xl font-black rounded-none">
                                    {profile?.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Professional Badge if applicable */}
                        {profile?.roles?.includes('admin') && (
                            <div className="absolute -bottom-3 -right-3 z-30 bg-red-600 text-white p-2 rounded-lg border-4 border-background shadow-lg" title="Yönetici">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                        )}
                    </div>

                    {/* TEXT INFO */}
                    <div className="flex-1 text-center md:text-left md:pb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-4 mb-2">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-foreground">
                                {profile?.full_name}
                            </h1>
                            {userBadges?.some((b: any) => b.badges?.category === 'verified') && (
                                <span className="text-blue-500 pb-2">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-muted-foreground font-medium mb-4">
                            <span className="font-mono text-lg text-primary">@{profile?.username}</span>
                            <span className="hidden md:inline text-border">•</span>
                            <div className="flex items-center gap-1.5 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(profile?.created_at || Date.now()), 'MMMM yyyy', { locale: tr })}</span>
                            </div>
                            {profile?.website && (
                                <>
                                    <span className="hidden md:inline text-border">•</span>
                                    <a href={profile.website} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
                                        <LinkIcon className="w-4 h-4" />
                                        <span className="truncate max-w-[200px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                </>
                            )}
                        </div>

                        {profile?.bio && (
                            <p className="text-base md:text-lg text-zinc-400 max-w-3xl leading-relaxed mx-auto md:mx-0">
                                {profile.bio}
                            </p>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex md:flex-col gap-3 md:pb-6 mx-auto md:mx-0">
                        {isOwnProfile ? (
                            <Link href="/profil/duzenle">
                                <Button className="h-12 px-8 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Düzenle
                                </Button>
                            </Link>
                        ) : (
                            <Button className="h-12 px-8 bg-primary text-black border-b-4 border-yellow-700 hover:border-b-0 hover:translate-y-1 rounded-xl font-black text-lg transition-all shadow-lg">
                                TAKİP ET
                            </Button>
                        )}
                    </div>
                </div>

                {/* 3. DASHBOARD STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-16 h-16" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Repütasyon</p>
                            <p className="text-4xl font-black text-primary font-mono">{formatNumber(stats.reputation)}</p>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-16 h-16" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Etkileşim</p>
                            <div className="flex gap-4">
                                <div>
                                    <span className="text-2xl font-bold text-white">{formatNumber(stats.followersCount)}</span>
                                    <span className="text-[10px] text-zinc-500 ml-1">Takipçi</span>
                                </div>
                                <div className="w-[1px] bg-border h-8"></div>
                                <div>
                                    <span className="text-2xl font-bold text-white">{formatNumber(stats.followingCount)}</span>
                                    <span className="text-[10px] text-zinc-500 ml-1">Takip</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-border p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
                        <div className="flex gap-8 md:gap-16 z-10">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Makale</p>
                                <p className="text-3xl font-black text-white">{stats.articlesCount}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Soru</p>
                                <p className="text-3xl font-black text-white">{stats.questionsCount}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Cevap</p>
                                <p className="text-3xl font-black text-white">{stats.answersCount}</p>
                            </div>
                        </div>
                        {/* Abstract Shape */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-zinc-800 rounded-full blur-3xl opacity-20"></div>
                    </div>
                </div>

                {/* 4. CONTENT SECTIONS */}
                <Tabs defaultValue="articles" className="w-full">
                    <TabsList className="bg-zinc-900/50 p-1 rounded-xl w-full md:w-auto h-auto grid grid-cols-4 md:flex md:inline-flex mb-8 gap-1">
                        {[
                            { id: 'articles', label: 'Makaleler' },
                            { id: 'questions', label: 'Forum' },
                            { id: 'drafts', label: 'Taslaklar', hidden: !isOwnProfile },
                            { id: 'badges', label: 'Rozetler' },
                        ].filter(t => !t.hidden).map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-bold py-2.5 transition-all text-xs md:text-sm"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="articles" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-6">
                            {articles.map((article) => (
                                <Link href={`/makale/${article.slug}`} key={article.id} className="group">
                                    <article className="h-full bg-card border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all hover:shadow-2xl hover:-translate-y-1">
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={article.cover_url || "/placeholder-science.jpg"}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wide">
                                                    {article.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-zinc-500 text-sm line-clamp-2 mb-4">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
                                                <span>{format(new Date(article.created_at), 'd MMM yyyy', { locale: tr })}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {article.views}</span>
                                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {article.likes_count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                            {articles.length === 0 && <EmptyBlock msg="Henüz makale bulunmuyor." icon={FileText} />}
                        </div>
                    </TabsContent>

                    <TabsContent value="questions" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-4">
                            {questions.map((q) => (
                                <Link href={`/forum/${q.id}`} key={q.id} className="block group">
                                    <div className="bg-card border border-zinc-800 p-6 rounded-2xl hover:border-primary/50 transition-all hover:bg-zinc-900">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-primary">
                                                <Microscope className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2">
                                                    {q.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                                                    <span className="bg-zinc-900 px-2 py-1 rounded text-zinc-400">{q.category}</span>
                                                    <span>{format(new Date(q.created_at), 'dd.MM.yyyy', { locale: tr })}</span>
                                                    <span className="flex items-center gap-1 text-white"><MessageSquare className="w-3 h-3" /> {q.answers_count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {questions.length === 0 && <EmptyBlock msg="Henüz soru bulunmuyor." icon={Microscope} />}
                        </div>
                    </TabsContent>

                    {isOwnProfile && (
                        <TabsContent value="drafts">
                            <div className="space-y-3">
                                {drafts.map((d) => (
                                    <Link href={`/makale/duzenle/${d.id}`} key={d.id} className="block group">
                                        <div className="bg-transparent border border-dashed border-zinc-700 p-4 rounded-xl hover:bg-zinc-900 transition-all flex justify-between items-center">
                                            <span className="font-bold text-zinc-400 group-hover:text-white transition-colors">{d.title || "Başlıksız Çalışma"}</span>
                                            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">TASLAK</span>
                                        </div>
                                    </Link>
                                ))}
                                {drafts.length === 0 && <EmptyBlock msg="Taslak bulunmuyor." icon={FileText} />}
                            </div>
                        </TabsContent>
                    )}

                    <TabsContent value="badges">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {userBadges.map((b) => (
                                <div key={b.id || Math.random()} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center text-center hover:border-zinc-600 transition-colors">
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-2xl mb-3 shadow-inner">
                                        🏆
                                    </div>
                                    <span className="font-bold text-sm text-white">{b.badges?.name}</span>
                                    <span className="text-[10px] text-zinc-500 mt-1">{b.badges?.description}</span>
                                </div>
                            ))}
                            {userBadges.length === 0 && <div className="col-span-full"><EmptyBlock msg="Henüz rozet kazanılmadı." icon={Zap} /></div>}
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}

function EmptyBlock({ msg, icon: Icon }: any) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600 border border-zinc-900 rounded-2xl bg-zinc-900/20">
            <Icon className="w-12 h-12 mb-4 opacity-20" />
            <p>{msg}</p>
        </div>
    )
}
