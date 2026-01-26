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
        <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#FFC800] selection:text-black pb-24">
            
            {/* 1. COVER PHOTO SECTION */}
            <div className="relative w-full h-32 md:h-48 lg:h-60 bg-zinc-900 border-b-2 border-black overflow-hidden group">
                {profile?.cover_url ? (
                    <img 
                        src={profile.cover_url} 
                        alt="Kapak Fotoğrafı" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black opacity-50" />
                )}
                
                {/* Overlay Text/Texture */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-90" />
            </div>

            {/* 2. PROFILE INFO CONTAINER */}
            <div className="container max-w-4xl mx-auto px-4 relative -mt-16 z-10">
                <div className="flex flex-col md:flex-row gap-6 md:items-end">
                    
                    {/* AVATAR */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-[#09090b] bg-[#18181b] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-20 group">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={profile?.avatar_url} className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                <AvatarFallback className="bg-[#FFC800] text-black text-4xl font-black rounded-none">
                                    {profile?.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Status Indicator (Online/Offline logic could go here) */}
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-[#09090b] rounded-full z-30" />
                    </motion.div>

                    {/* TEXT INFO */}
                    <div className="flex-1 space-y-2 md:pb-4 text-center md:text-left">
                        <div>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3">
                                <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-2">
                                    {profile?.full_name}
                                    {userBadges?.some((b: any) => b.badges?.category === 'verified') && (
                                        <span className="text-blue-500" title="Onaylı Hesap">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                        </span>
                                    )}
                                </h1>
                                <span className="text-zinc-500 font-mono text-sm md:text-base py-1">@{profile?.username}</span>
                            </div>
                            
                            {/* Tags / Roles */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                {profile?.roles?.includes('admin') && (
                                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">Admin</span>
                                )}
                                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                    {stats.reputation > 500 ? 'Bilim Sever' : 'Kullanıcı'}
                                </span>
                            </div>
                        </div>

                        {/* Bio */}
                        {profile?.bio && (
                            <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed mx-auto md:mx-0">
                                {profile.bio}
                            </p>
                        )}

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-zinc-500 font-medium pt-1">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Katıldı: {format(new Date(profile?.created_at || Date.now()), 'MMM yyyy', { locale: tr })}</span>
                            </div>
                            {profile?.website && (
                                <a href={profile.website} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-[#3B82F6] transition-colors">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[150px]">{profile.website.replace(/^https?:\/\//, '')}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ACTIONS (Desktop) */}
                    <div className="hidden md:flex flex-col gap-3 pb-4">
                        {isOwnProfile ? (
                            <div className="flex gap-2">
                                <Link href="/profil/duzenle">
                                    <Button variant="outline" className="h-10 bg-black border border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-300 rounded-lg transition-all font-bold">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Profili Düzenle
                                    </Button>
                                </Link>
                                <Link href="/ayarlar">
                                    <Button size="icon" variant="outline" className="h-10 w-10 bg-black border border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-300 rounded-lg transition-all">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button className="h-10 bg-[#3B82F6] hover:bg-[#2563EB] text-white border-b-4 border-[#1D4ED8] active:border-b-0 active:translate-y-1 font-bold rounded-lg transition-all">
                                    Takip Et
                                </Button>
                                <Button size="icon" className="h-10 w-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg">
                                    <MessageSquare className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* STATS GRID (Mobile + Desktop Unified) */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mt-8">
                    {[
                        { label: "REPÜTASYON", value: formatNumber(stats.reputation), icon: Zap, color: "text-[#FFC800]" },
                        { label: "TAKİPÇİ", value: formatNumber(stats.followersCount), icon: null, color: "text-white" },
                        { label: "TAKİP", value: formatNumber(stats.followingCount), icon: null, color: "text-white" },
                        { label: "MAKALE", value: stats.articlesCount, icon: null, color: "text-zinc-400" },
                        { label: "SORU", value: stats.questionsCount, icon: null, color: "text-zinc-400" },
                        { label: "CEVAP", value: stats.answersCount, icon: null, color: "text-zinc-400" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#18181b]/50 border border-zinc-800/50 hover:border-zinc-700 p-3 rounded-xl flex flex-col items-center justify-center transition-colors group cursor-default">
                            <span className={cn("text-xl md:text-2xl font-black font-mono leading-none mb-1 group-hover:scale-110 transition-transform", stat.color)}>
                                {stat.value}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* MOBILE ACTIONS */}
                <div className="md:hidden flex gap-2 mt-6">
                    {isOwnProfile ? (
                        <>
                            <Link href="/profil/duzenle" className="flex-1">
                                <Button className="w-full bg-[#27272a] border border-zinc-700 text-white font-bold h-11 rounded-xl hover:bg-zinc-800">
                                    Profili Düzenle
                                </Button>
                            </Link>
                            <Link href="/ayarlar">
                                <Button size="icon" className="bg-[#27272a] border border-zinc-700 text-zinc-400 h-11 w-11 rounded-xl">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/mesajlar">
                                <Button size="icon" className="bg-[#27272a] border border-zinc-700 text-zinc-400 h-11 w-11 rounded-xl relative">
                                    <MessageSquare className="w-5 h-5" />
                                    {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#27272a]" />}
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                             <Button className="flex-1 bg-[#3B82F6] text-white border-b-4 border-[#1D4ED8] active:border-b-0 active:translate-y-1 font-bold h-11 rounded-xl font-bold">
                                Takip Et
                            </Button>
                            <Button size="icon" className="bg-[#27272a] border border-zinc-700 text-zinc-400 h-11 w-11 rounded-xl">
                                <MessageSquare className="w-5 h-5" />
                            </Button>
                        </>
                    )}
                </div>

                {/* TABS & CONTENT */}
                <div className="mt-10">
                    <Tabs defaultValue="articles" className="w-full">
                        <TabsList className="bg-transparent border-b border-zinc-800 w-full justify-start h-auto p-0 rounded-none gap-6 md:gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'articles', label: 'Makaleler', count: articles.length },
                                { id: 'questions', label: 'Sorular', count: questions.length },
                                { id: 'drafts', label: 'Taslaklar', count: drafts.length, hidden: !isOwnProfile },
                                { id: 'badges', label: 'Rozetler', count: userBadges?.length || 0 },
                            ].filter(t => !t.hidden).map(tab => (
                                <TabsTrigger 
                                    key={tab.id} 
                                    value={tab.id}
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#FFC800] data-[state=active]:text-[#FFC800] text-zinc-500 rounded-none px-0 py-3 font-bold text-sm md:text-base transition-all hover:text-zinc-300"
                                >
                                    {tab.label} 
                                    <span className="ml-2 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-full text-zinc-400 group-data-[state=active]:text-black group-data-[state=active]:bg-[#FFC800]">
                                        {tab.count}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="mt-6 min-h-[300px]">
                            {/* ARTICLES CONTENT */}
                            <TabsContent value="articles" className="space-y-4">
                                {articles.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {articles.map((article) => (
                                            <Link href={`/makale/${article.slug}`} key={article.id} className="group">
                                                <article className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden hover:border-[#3B82F6] transition-all group-hover:shadow-[0px_0px_20px_-10px_rgba(59,130,246,0.5)]">
                                                    <div className="flex h-32 md:h-40">
                                                        <div className="w-1/3 relative overflow-hidden">
                                                            <img 
                                                                src={article.cover_url || "/placeholder-science.jpg"} 
                                                                alt={article.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute inset-0 bg-black/20" />
                                                        </div>
                                                        <div className="w-2/3 p-4 flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-[10px] font-bold text-[#3B82F6] bg-blue-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                                        {article.category || 'Genel'}
                                                                    </span>
                                                                    <span className="text-[10px] text-zinc-500">{format(new Date(article.created_at), 'd MMM', { locale: tr })}</span>
                                                                </div>
                                                                <h3 className="font-bold text-zinc-100 leading-snug line-clamp-2 md:text-lg group-hover:text-[#3B82F6] transition-colors">
                                                                    {article.title}
                                                                </h3>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-2">
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
                                            <div className="bg-[#18181b] border border-zinc-800 p-5 rounded-xl hover:border-[#FFC800] transition-all flex items-start gap-4">
                                                <div className="mt-1 bg-zinc-900 p-2 rounded-lg text-zinc-500 group-hover:text-[#FFC800] transition-colors">
                                                    <Microscope className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-zinc-200 group-hover:text-[#FFC800] transition-colors mb-1">
                                                        {q.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                                        <span>{format(new Date(q.created_at), 'd MMMM yyyy', { locale: tr })}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1 text-zinc-400">
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
                                                    <div className="bg-[#18181b]/50 border border-dashed border-zinc-700 p-4 rounded-xl hover:bg-[#18181b] hover:border-solid hover:border-white transition-all">
                                                        <div className="flex justify-between items-center">
                                                            <h3 className="font-bold text-zinc-400 group-hover:text-white transition-colors">
                                                                {draft.title || 'Başlıksız Taslak'}
                                                            </h3>
                                                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20">
                                                                TASLAK
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-zinc-600 mt-1 line-clamp-1">{draft.excerpt || 'İçerik girilmemiş...'}</p>
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
                                            <div key={ub.id || Math.random()} className="bg-[#18181b] border border-zinc-800 p-4 rounded-xl flex flex-col items-center text-center gap-3 hover:border-zinc-600 transition-colors">
                                                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-3xl">
                                                     {/* Assuming badge icon logic or generic placeholder */}
                                                     🏆
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-white">{ub.badges?.name || 'Rozet'}</h4>
                                                    <p className="text-[10px] text-zinc-500 mt-1">{ub.badges?.description}</p>
                                                </div>
                                                <div className="text-[10px] text-zinc-600 font-mono mt-auto">
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
        <div className="flex flex-col items-center justify-center py-16 text-zinc-600 bg-[#18181b]/30 border border-zinc-800/50 dashed border rounded-xl">
            <Icon className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">{text}</p>
        </div>
    );
}
