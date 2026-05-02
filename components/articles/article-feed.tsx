"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Telescope, Cpu, Dna, Zap, FlaskConical, Globe, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
    searchQuery?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
    'Astrofizik': { icon: Telescope, color: 'bg-purple-400', bg: 'text-purple-950' },
    'Uzay': { icon: Telescope, color: 'bg-blue-400', bg: 'text-blue-950' },
    'Teknoloji': { icon: Cpu, color: 'bg-cyan-400', bg: 'text-cyan-950' },
    'Biyoloji': { icon: Dna, color: 'bg-green-400', bg: 'text-green-950' },
    'Fizik': { icon: Zap, color: 'bg-yellow-400', bg: 'text-yellow-950' },
    'Kimya': { icon: FlaskConical, color: 'bg-pink-400', bg: 'text-pink-950' },
    'Popüler Bilim': { icon: BookOpen, color: 'bg-orange-400', bg: 'text-orange-950' },
    'Modern Fizik': { icon: Zap, color: 'bg-amber-400', bg: 'text-amber-950' },
    'Genel': { icon: Globe, color: 'bg-zinc-300', bg: 'text-zinc-900' },
};

function EncyclopediaCard({ article, index }: { article: any, index: number }) {
    const catConfig = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG['Genel'];
    const CatIcon = catConfig.icon;
    const isNew = new Date().getTime() - new Date(article.date).getTime() < 3 * 24 * 60 * 60 * 1000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group block h-full"
        >
            <Link href={`/makale/${article.slug}`} className="block h-full outline-none focus-visible:ring-4 focus-visible:ring-[#FFBD2E]">
                <article className={cn(
                    "h-full flex flex-col relative overflow-hidden transition-all duration-300",
                    "bg-[#fdfdfd] dark:bg-zinc-900 border-[3px] border-black dark:border-white rounded-xl",
                    "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]",
                    "hover:-translate-y-1 hover:translate-x-[-1px] hover:shadow-[8px_8px_0px_0px_rgba(255,189,46,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,189,46,1)]",
                    "hover:border-[#FFBD2E] dark:hover:border-[#FFBD2E]"
                )}>
                    {/* Spine color line on the left */}
                    <div className={cn("absolute left-0 top-0 bottom-0 w-2 border-r-[3px] border-black dark:border-white z-20", catConfig.color)} />
                    
                    <div className="flex-1 flex flex-col pl-2">
                        {/* Image Section - styled like an embedded illustration */}
                        <div className="relative h-48 sm:h-56 border-b-[3px] border-black dark:border-white bg-zinc-100 overflow-hidden">
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover filter sepia-[0.2] contrast-[1.1] grayscale-[0.2] mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105 group-hover:filter-none"
                            />
                            {/* Texture overlay on image */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                        </div>

                        {/* Content Section */}
                        <div className="p-5 sm:p-6 flex flex-col flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/stucco.png')] dark:bg-none">
                            
                            {/* Top Meta */}
                            <div className="flex items-center justify-between mb-4">
                                <span className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border-[2px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                                    catConfig.color, catConfig.bg
                                )}>
                                    <CatIcon className="w-3.5 h-3.5 stroke-[2.5px]" />
                                    {article.category}
                                </span>
                                {isNew && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        YENİ
                                    </span>
                                )}
                            </div>

                            {/* Title (Editorial style) */}
                            <h3 className="font-black text-black dark:text-white text-xl sm:text-2xl leading-[1.15] mb-3 group-hover:text-[#FFBD2E] transition-colors line-clamp-3 uppercase tracking-tighter">
                                {article.title}
                            </h3>

                            {/* Excerpt */}
                            {article.excerpt && (
                                <p className="text-zinc-700 dark:text-zinc-300 text-sm font-medium leading-relaxed line-clamp-2 mb-6 flex-1">
                                    {article.excerpt}
                                </p>
                            )}

                            {/* Footer / Author Block */}
                            <div className="mt-auto pt-4 border-t-[3px] border-dashed border-black/20 dark:border-white/20 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-black dark:text-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                                        Yazar / Editör
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-wider truncate max-w-[150px]">
                                        {article.author}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-black dark:text-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                                        Yayın Tarihi
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                        {formatDistanceToNow(new Date(article.date), { locale: tr })} önce
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems, searchQuery }: ArticleFeedProps) {
    const router = useRouter();
    const [inputValue, setInputValue] = useState(searchQuery || "");

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

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (inputValue.trim()) params.set("q", inputValue.trim());
        if (activeCategory) params.set("category", activeCategory);
        if (sortParam !== 'latest') params.set("sort", sortParam);
        
        router.push(`/makale?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-950 text-foreground pb-32 selection:bg-[#FFBD2E] selection:text-black">
            {/* Trending News */}
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            {/* Paper Texture Background */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] dark:opacity-[0.02]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            <main className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 mt-6 sm:mt-10">
                
                {/* ── HEADER & SEARCH ── */}
                <div className="mb-10 sm:mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b-[4px] border-black dark:border-white pb-6">
                        <div>
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-black dark:text-white flex items-center gap-3">
                                <span className="text-[#FFBD2E]">*</span>
                                ANSİKLOPEDİ
                            </h1>
                            <p className="mt-2 text-sm sm:text-base font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></span>
                                Evrenin Sırları Kütüphanesi
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative w-full md:w-[450px]">
                            <div className="relative flex items-center bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
                                <div className="pl-4 flex-shrink-0 text-black dark:text-white">
                                    <Search className="w-5 h-5 stroke-[3px]" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Kavram, Teori veya Yazar Ara..." 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full bg-transparent py-4 px-4 outline-none font-bold placeholder:text-zinc-400 text-black dark:text-white text-sm uppercase tracking-wider"
                                />
                                <button type="submit" className="bg-[#FFBD2E] border-l-[3px] border-black dark:border-white h-full px-6 text-black font-black uppercase tracking-widest hover:bg-yellow-400 active:bg-yellow-500 transition-colors flex items-center justify-center">
                                    Bul
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Filter Bar (Index Tabs) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Link 
                                href={`/makale${searchQuery ? `?q=${searchQuery}` : ''}`}
                                className={cn(
                                    "px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-widest border-[3px] transition-all",
                                    !activeCategory 
                                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-[3px_3px_0px_0px_rgba(255,189,46,1)]" 
                                        : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
                                )}
                            >
                                TÜM DİZİN
                            </Link>
                            {categories.map(cat => {
                                const isActive = activeCategory === cat;
                                return (
                                    <Link 
                                        key={cat}
                                        href={`/makale?category=${cat}${searchQuery ? `&q=${searchQuery}` : ''}`}
                                        className={cn(
                                            "px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-widest border-[3px] transition-all",
                                            isActive 
                                                ? "bg-[#FFBD2E] text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]" 
                                                : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
                                        )}
                                    >
                                        {cat}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── ENCYCLOPEDIA GRID ── */}
                {ARTICLES.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pb-20">
                        {ARTICLES.map((article, index) => (
                            <EncyclopediaCard
                                key={article.id}
                                article={article}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 text-center border-[4px] border-dashed border-black/20 dark:border-white/20 rounded-none bg-white/50 dark:bg-zinc-900/50"
                    >
                        <div className="w-20 h-20 bg-[#FFBD2E] border-[4px] border-black flex items-center justify-center mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Search className="w-10 h-10 text-black stroke-[3px]" />
                        </div>
                        <h2 className="text-black dark:text-white font-black text-2xl md:text-3xl uppercase tracking-tighter mb-4">
                            KAYIT BULUNAMADI
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest max-w-md">
                            Aradığınız terime veya kategoriye uygun bir ansiklopedi girdisi mevcut değil. Lütfen aramanızı genişletin.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
