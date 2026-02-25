"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, Zap, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TABS = [
    { id: 'TÜMÜ', icon: LayoutList, color: 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black' },
    { id: 'Uzay', icon: Telescope, color: 'bg-[#FF0080] text-white' },
    { id: 'Teknoloji', icon: Cpu, color: 'bg-[#23A9FA] text-white' },
    { id: 'Biyoloji', icon: Dna, color: 'bg-[#00F050] text-black' },
    { id: 'Fizik', icon: Zap, color: 'bg-[#FFC800] text-black' },
    { id: 'Kimya', icon: FlaskConical, color: 'bg-[#FF90E8] text-black' },
    { id: 'Genel', icon: Globe, color: 'bg-[#a1a1aa] text-black' },
];

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {

    const ARTICLES = articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.summary || a.excerpt,
        image: a.cover_url || a.image_url || "/images/placeholder-article.webp",
        category: a.category || "Genel",
        date: a.created_at,
        author: a.author?.full_name || a.profiles?.full_name || "FizikHub Editör",
        slug: a.slug,
        readingTime: Math.max(1, Math.ceil((a.content?.split(/\s+/).length || 500) / 200))
    }));

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {/* ── HEADER ── */}
                <header className="mb-10 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-dashed border-black/10 dark:border-white/10 pb-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter"
                        >
                            Bilim <span className="text-zinc-400 dark:text-zinc-600">&</span> Makale
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mt-3 text-sm sm:text-base font-bold tracking-tight text-zinc-500 max-w-xl"
                        >
                            Evrenin sırları ve teknolojik atılımlar hakkında derinlemesine analizler.
                        </motion.p>
                    </div>

                    <div className="flex gap-2">
                        {['latest', 'popular'].map((s) => (
                            <Link
                                key={s}
                                href={`/makale?sort=${s}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2",
                                    sortParam === s
                                        ? "bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,0.5)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.5)] translate-x-[-1px] translate-y-[-1px]"
                                        : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-foreground hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] dark:hover:shadow-[2px_2px_0px_rgba(255,255,255,0.3)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                                )}
                            >
                                {s === 'latest' ? <Clock className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                                {s === 'latest' ? 'En Yeni' : 'Popüler'}
                            </Link>
                        ))}
                    </div>
                </header>

                {/* ── PROFILE-STYLE DARK NEO TABS ── */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-6 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isAll = tab.id === 'TÜMÜ';
                        const isActive = isAll ? !activeCategory : activeCategory === tab.id;

                        // Sadece elimizde o kategori varsa veya "TÜMÜ" ise göster
                        if (!isAll && !categories.includes(tab.id) && !isActive) return null;

                        return (
                            <Link
                                key={tab.id}
                                href={isAll ? '/makale' : `/makale?category=${tab.id}${sortParam !== 'latest' ? `&sort=${sortParam}` : ''}`}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl font-black text-xs transition-all whitespace-nowrap flex-shrink-0 active:scale-95 group uppercase tracking-wider",
                                    isActive
                                        ? `${tab.color} border-black dark:border-transparent shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.2)] translate-x-[-1px] translate-y-[-1px]`
                                        : "bg-background border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-foreground hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_rgba(255,255,255,0.2)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                                )}
                            >
                                <Icon className={cn("w-3.5 h-3.5 stroke-[2.5px]", isActive && "stroke-current")} />
                                {tab.id}
                            </Link>
                        );
                    })}
                </div>

                {/* ── SLEEK DARK NEO CARDS GRID ── */}
                {ARTICLES.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {ARTICLES.map((article, index) => {
                            const isNew = new Date().getTime() - new Date(article.date).getTime() < 3 * 24 * 60 * 60 * 1000;
                            // Kartlara sıralı ve uyumlu renk dokunuşları
                            const accentColors = ['#FFC800', '#23A9FA', '#FF0080', '#00F050'];
                            const accentColor = accentColors[index % accentColors.length];

                            return (
                                <Link href={`/blog/${article.slug}`} key={article.id}>
                                    <motion.article
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (index % 10) * 0.05, duration: 0.3 }}
                                        className="group relative bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] dark:shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.8)] dark:hover:shadow-[4px_4px_0px_rgba(250,204,21,0.4)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full"
                                    >
                                        {/* Top Accent Line like Profile feed */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-[3px] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-20"
                                            style={{ backgroundColor: accentColor }}
                                        />

                                        {/* Image Container */}
                                        <div className="relative aspect-[16/10] z-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b-2 border-zinc-100 dark:border-zinc-800">
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                                            />
                                            {/* Gradient Overlay for subtle dark mode consistency */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                                            {/* Top badges over image */}
                                            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                                                <span
                                                    className="px-2 py-1 bg-black text-white text-[9px] font-black uppercase tracking-wider rounded-md border border-white/20 shadow-[1px_1px_0px_rgba(0,0,0,0.5)]"
                                                    style={{ borderBottomColor: accentColor, borderBottomWidth: '2px' }}
                                                >
                                                    {article.category}
                                                </span>
                                                {isNew && (
                                                    <span className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#00F050] animate-pulse shadow-[0_0_6px_rgba(0,240,80,0.6)]" />
                                                        <span className="text-[8px] font-bold text-[#00F050] uppercase tracking-wider">YENİ</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-4 sm:p-5 flex flex-col flex-grow relative z-10 dark:group-hover:bg-zinc-900/30 transition-colors">
                                            {/* Date & Author */}
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                                                <span>{formatDistanceToNow(new Date(article.date), { locale: tr })} ÖNCE</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                                <span className="truncate max-w-[100px]">{article.author}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 leading-tight mb-2 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors line-clamp-3">
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 mt-auto">
                                                {article.excerpt}
                                            </p>

                                            {/* Footer with Reading Time */}
                                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                                                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold tracking-wide uppercase">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{article.readingTime} dk okuma</span>
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                                    <Flame className="w-3 h-3 stroke-[3px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30">
                        <div className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-4 border-2 border-zinc-200 dark:border-zinc-800 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] dark:shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                            <Zap className="w-6 h-6 text-zinc-400 dark:text-zinc-600 stroke-[2.5px]" />
                        </div>
                        <p className="text-zinc-900 dark:text-zinc-300 font-black text-lg mb-1 uppercase tracking-tight">İçerik Bulunamadı</p>
                        <p className="text-zinc-500 text-sm max-w-[280px] leading-relaxed font-bold">Bu kategori için henüz veri işlenmemiş.</p>
                    </div>
                )}

                <div className="mt-16 sm:mt-24 pt-16 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <GoldenTicketCTA />
                </div>
            </main>
        </div>
    );
}
