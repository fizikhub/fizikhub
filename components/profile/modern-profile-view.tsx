"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MessageSquare, Twitter, Github, Linkedin, Instagram,
    Calendar, Link as LinkIcon, Microscope, Activity,
    Settings, Edit, Zap, FileText, Bell, Share2, LogOut,
    MapPin, Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModernProfileViewProps {
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

export function ModernProfileView({
    profile,
    isOwnProfile,
    stats,
    userBadges,
    articles,
    questions,
    drafts = [],
    unreadCount = 0
}: ModernProfileViewProps) {

    // Helper to format large numbers
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-24">

            {/* 1. COVER PHOTO SECTION */}
            {/* Increased mobile height to h-48 as requested */}
            <div className="relative w-full h-48 md:h-64 bg-zinc-900 border-b-2 border-border overflow-hidden group">
                {profile?.cover_url ? (
                    <img
                        src={profile.cover_url}
                        alt="Kapak Fotoğrafı"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black opacity-50" />
                )}

                {/* Overlay Text/Texture - Subtler noise */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            </div>

            {/* 2. PROFILE INFO CONTAINER */}
            <div className="container max-w-5xl mx-auto px-4 relative -mt-20 z-10">
                <div className="flex flex-col md:flex-row gap-6 md:items-end">

                    {/* AVATAR */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        {/* Larger, premium border */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-[4px] border-background bg-zinc-900 overflow-hidden shadow-[0px_4px_20px_-5px_rgba(0,0,0,0.5)] relative z-20 group">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                <AvatarFallback className="bg-[#FFC800] text-black text-4xl font-black rounded-none">
                                    {profile?.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Status Indicator */}
                        <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 border-4 border-background rounded-full z-30 shadow-sm" />
                    </motion.div>

                    {/* TEXT INFO */}
                    <div className="flex-1 space-y-2 md:pb-6 text-center md:text-left pt-2 md:pt-0">
                        <div>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2 text-foreground">
                                    {profile?.full_name}
                                    {userBadges?.some((b: any) => b.badges?.category === 'verified') && (
                                        <span className="text-blue-500" title="Onaylı Hesap">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                        </span>
                                    )}
                                </h1>
                                <span className="text-muted-foreground font-mono text-sm md:text-base py-1">@{profile?.username}</span>
                            </div>

                            {/* Tags / Roles */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                                {profile?.roles?.includes('admin') && (
                                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">Admin</span>
                                )}
                                <span className="px-2 py-0.5 bg-secondary text-secondary-foreground border border-border text-[10px] font-bold uppercase tracking-wider rounded-md">
                                    {stats.reputation > 500 ? 'Bilim Sever' : 'Kullanıcı'}
                                </span>
                            </div>
                        </div>

                        {/* Bio */}
                        {profile?.bio && (
                            <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed mx-auto md:mx-0 font-medium">
                                {profile.bio}
                            </p>
                        )}

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-semibold pt-2">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Katıldı: {format(new Date(profile?.created_at || Date.now()), 'MMM yyyy', { locale: tr })}</span>
                            </div>
                            {profile?.website && (
                                <a href={profile.website} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[150px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ACTIONS (Desktop) */}
                    <div className="hidden md:flex flex-col gap-3 pb-6">
                        {isOwnProfile ? (
                            <div className="flex gap-2">
                                <Link href="/profil/duzenle">
                                    <Button variant="outline" className="h-10 bg-background border-2 border-border hover:bg-secondary hover:text-foreground text-muted-foreground rounded-lg transition-all font-bold shadow-sm">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Profili Düzenle
                                    </Button>
                                </Link>
                                <Link href="/ayarlar">
                                    <Button size="icon" variant="outline" className="h-10 w-10 bg-background border-2 border-border hover:bg-secondary hover:text-foreground text-muted-foreground rounded-lg transition-all shadow-sm">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 font-bold rounded-lg transition-all">
                                    Takip Et
                                </Button>
                                <Button size="icon" className="h-10 w-10 bg-secondary hover:bg-secondary/80 border border-border rounded-lg">
                                    <MessageSquare className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* STATS GRID (Simplified & Professional) */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mt-10">
                    {[
                        { label: "REPÜTASYON", value: formatNumber(stats.reputation), color: "text-[#FFC800]" },
                        { label: "TAKİPÇİ", value: formatNumber(stats.followersCount), color: "text-foreground" },
                        { label: "TAKİP", value: formatNumber(stats.followingCount), color: "text-foreground" },
                        { label: "MAKALE", value: stats.articlesCount, color: "text-muted-foreground" },
                        { label: "SORU", value: stats.questionsCount, color: "text-muted-foreground" },
                        { label: "CEVAP", value: stats.answersCount, color: "text-muted-foreground" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card border border-border/60 p-3 rounded-xl flex flex-col items-center justify-center transition-all hover:bg-secondary/30">
                            <span className={cn("text-xl md:text-2xl font-black font-mono leading-none mb-1", stat.color)}>
                                {stat.value}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* MOBILE ACTIONS */}
                <div className="md:hidden flex gap-3 mt-8">
                    {isOwnProfile ? (
                        <>
                            <Link href="/profil/duzenle" className="flex-1">
                                <Button className="w-full bg-secondary border border-border text-foreground font-bold h-12 rounded-xl hover:bg-secondary/80">
                                    Profili Düzenle
                                </Button>
                            </Link>
                            <Link href="/ayarlar">
                                <Button size="icon" className="bg-secondary border border-border text-muted-foreground h-12 w-12 rounded-xl">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/mesajlar">
                                <Button size="icon" className="bg-secondary border border-border text-muted-foreground h-12 w-12 rounded-xl relative">
                                    <MessageSquare className="w-5 h-5" />
                                    {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-secondary" />}
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button className="flex-1 bg-blue-600 text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 font-bold h-12 rounded-xl">
                                Takip Et
                            </Button>
                            <Button size="icon" className="bg-secondary border border-border text-muted-foreground h-12 w-12 rounded-xl">
                                <MessageSquare className="w-5 h-5" />
                            </Button>
                        </>
                    )}
                </div>

                {/* TABS & CONTENT */}
                <div className="mt-12">
                    <Tabs defaultValue="articles" className="w-full">
                        <TabsList className="bg-transparent border-b border-border/60 w-full justify-start h-auto p-0 rounded-none gap-6 md:gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'articles', label: 'Makaleler', count: articles.length },
                                { id: 'questions', label: 'Sorular', count: questions.length },
                                { id: 'drafts', label: 'Taslaklar', count: drafts.length, hidden: !isOwnProfile },
                                { id: 'badges', label: 'Rozetler', count: userBadges?.length || 0 },
                            ].filter(t => !t.hidden).map(tab => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#FFC800] data-[state=active]:text-[#FFC800] text-muted-foreground rounded-none px-0 py-3 font-bold text-sm md:text-base transition-all hover:text-foreground"
                                >
                                    {tab.label}
                                    <span className="ml-2 text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground group-data-[state=active]:text-black group-data-[state=active]:bg-[#FFC800]">
                                        {tab.count}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="mt-8 min-h-[300px]">
                            {/* ARTICLES CONTENT */}
                            <TabsContent value="articles" className="space-y-4">
                                {articles.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {articles.map((article) => (
                                            <Link href={`/makale/${article.slug}`} key={article.id} className="group">
                                                <article className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-[#3B82F6] transition-all group-hover:shadow-lg">
                                                    <div className="flex h-32 md:h-40">
                                                        <div className="w-1/3 relative overflow-hidden">
                                                            <img
                                                                src={article.cover_url || "/placeholder-science.jpg"}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute inset-0 bg-black/10" />
                                                        </div>
                                                        <div className="w-2/3 p-4 flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-[10px] font-bold text-[#3B82F6] bg-blue-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                                        {article.category || 'Genel'}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground">{format(new Date(article.created_at), 'd MMM', { locale: tr })}</span>
                                                                </div>
                                                                <h3 className="font-bold text-foreground leading-snug line-clamp-2 md:text-lg group-hover:text-[#3B82F6] transition-colors">
                                                                    {article.title}
                                                                </h3>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                                                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {article.views || 0}</span>
                                                                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {article.likes_count || 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState icon={FileText} text="Henüz yayınlanmış bir makale yok." />
                                )}
                            </TabsContent>

                            {/* QUESTIONS CONTENT */}
                            <TabsContent value="questions" className="space-y-3">
                                {questions.length > 0 ? (
                                    questions.map((q) => (
                                        <Link href={`/forum/${q.id}`} key={q.id} className="block group">
                                            <div className="bg-card border border-border/60 p-5 rounded-xl hover:border-[#FFC800] transition-all flex items-start gap-4 hover:bg-secondary/20">
                                                <div className="mt-1 bg-secondary p-2 rounded-lg text-muted-foreground group-hover:text-[#FFC800] transition-colors">
                                                    <Microscope className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-foreground group-hover:text-[#FFC800] transition-colors mb-1">
                                                        {q.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span>{format(new Date(q.created_at), 'd MMMM yyyy', { locale: tr })}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="w-3 h-3" /> {q.answers_count || 0} cevap
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <EmptyState icon={Microscope} text="Henüz sorulmuş bir soru yok." />
                                )}
                            </TabsContent>

                            {/* DRAFTS CONTENT */}
                            {isOwnProfile && (
                                <TabsContent value="drafts">
                                    {drafts.length > 0 ? (
                                        <div className="space-y-3">
                                            {drafts.map((draft) => (
                                                <Link href={`/makale/duzenle/${draft.id}`} key={draft.id} className="block group">
                                                    <div className="bg-secondary/30 border border-dashed border-border p-4 rounded-xl hover:bg-secondary/50 hover:border-solid hover:border-foreground/20 transition-all">
                                                        <div className="flex justify-between items-center">
                                                            <h3 className="font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                                                                {draft.title || 'Başlıksız Taslak'}
                                                            </h3>
                                                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20">
                                                                TASLAK
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground/60 mt-1 line-clamp-1">{draft.excerpt || 'İçerik girilmemiş...'}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState icon={FileText} text="Taslak bulunmuyor." />
                                    )}
                                </TabsContent>
                            )}

                            {/* BADGES CONTENT */}
                            <TabsContent value="badges" className="space-y-4">
                                {userBadges && userBadges.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {userBadges.map((ub: any) => (
                                            <div key={ub.id || Math.random()} className="bg-card border border-border/60 p-4 rounded-xl flex flex-col items-center text-center gap-3 hover:border-foreground/30 transition-colors">
                                                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center text-3xl">
                                                    🏆
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-foreground">{ub.badges?.name || 'Rozet'}</h4>
                                                    <p className="text-[10px] text-muted-foreground mt-1">{ub.badges?.description}</p>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground/60 font-mono mt-auto">
                                                    {ub.awarded_at ? format(new Date(ub.awarded_at), 'd MMM yyyy', { locale: tr }) : ''}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState icon={Zap} text="Henüz kazanılmış bir rozet yok." />
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-secondary/10 border border-dashed border-border/50 rounded-xl">
            <Icon className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">{text}</p>
        </div>
    );
}
