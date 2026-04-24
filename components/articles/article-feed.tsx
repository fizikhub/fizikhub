"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, Zap, LayoutList, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ArticleFeedProps {
    articles: {
        id: string;
        title: string;
        excerpt?: string;
        summary?: string;
        image_url?: string;
        cover_url?: string;
        category?: string;
        created_at: string;
        slug: string;
        content?: string;
        author?: { full_name?: string };
        profiles?: { full_name?: string };
        [key: string]: unknown;
    }[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TABS = [
    { id: 'TÜMÜ', icon: LayoutList },
    { id: 'Uzay', icon: Telescope },
    { id: 'Teknoloji', icon: Cpu },
    { id: 'Biyoloji', icon: Dna },
    { id: 'Fizik', icon: Zap },
    { id: 'Kimya', icon: FlaskConical },
    { id: 'Genel', icon: Globe },
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

    const featured = ARTICLES[0];
    const rest = ARTICLES.slice(1);

    return (
        <div className="min-h-screen bg-background text-foreground pb-24">
            {/* Trending Marquee */}
            {newsItems && newsItems.length > 0 && (
                <div className="border-b-[4px] border-black dark:border-zinc-800">
                    <TrendingMarquee items={newsItems} />
                </div>
            )}

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                
                {/* Massive Hero Header */}
                <header className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[3.5rem] sm:text-7xl md:text-8xl lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.9] mb-6"
                    >
                        BİLİM <span className="text-[#FACC15] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:drop-shadow-[4px_4px_0px_rgba(255,255,255,0.15)]">&</span> MAKALE
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-500 dark:text-zinc-400 max-w-3xl leading-snug"
                    >
                        Evrenin sırlarından teknolojik atılımlara kadar derinlemesine analizler. Dergi kalitesinde bilimsel içerikler.
                    </motion.p>
                </header>

                {/* Premium Control Bar */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-14 border-y-[4px] border-black dark:border-zinc-800 py-6">
                    {/* Category Filters */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full xl:w-auto pb-2 xl:pb-0 -mx-4 px-4 xl:mx-0 xl:px-0">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isAll = tab.id === 'TÜMÜ';
                            const isActive = isAll ? !activeCategory : activeCategory === tab.id;

                            if (!isAll && !categories.includes(tab.id) && !isActive) return null;

                            return (
                                <Link
                                    key={tab.id}
                                    href={isAll ? '/makale' : `/makale?category=${tab.id}${sortParam !== 'latest' ? `&sort=${sortParam}` : ''}`}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3.5 border-[3px] font-black text-sm uppercase tracking-wider transition-all duration-200 flex-shrink-0 group rounded-xl",
                                        isActive
                                            ? `bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.2)] -translate-y-1 -translate-x-1`
                                            : "bg-background border-black dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:-translate-x-1"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4 stroke-[3px]", isActive ? "stroke-current" : "")} />
                                    <span>{tab.id}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-3 shrink-0">
                        {['latest', 'popular'].map((s) => {
                            const isActive = sortParam === s;
                            return (
                                <Link
                                    key={s}
                                    href={`/makale?sort=${s}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3.5 border-[3px] font-black text-sm uppercase tracking-wider transition-all duration-200 rounded-xl",
                                        isActive
                                            ? "bg-[#FACC15] text-black border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1"
                                            : "bg-background border-black dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:-translate-x-1"
                                    )}
                                >
                                    {s === 'latest' ? <Clock className="w-4 h-4 stroke-[3px]" /> : <Flame className="w-4 h-4 stroke-[3px]" />}
                                    {s === 'latest' ? 'En Yeni' : 'Popüler'}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Content Grid */}
                {ARTICLES.length > 0 ? (
                    <div className="flex flex-col gap-12">
                        
                        {/* 🌟 HERO: Featured Article 🌟 */}
                        {featured && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group block"
                            >
                                <Link href={`/makale/${featured.slug}`} className="block">
                                    <div className="relative w-full h-[65vh] min-h-[500px] md:h-[75vh] md:min-h-[650px] rounded-[1.5rem] border-[4px] border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-zinc-800 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2">
                                        <Image
                                            src={featured.image}
                                            alt={featured.title}
                                            fill
                                            priority
                                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                                        
                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-16 z-10 flex flex-col justify-end h-full">
                                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                                <span className="bg-[#FACC15] text-black px-4 py-2 border-[3px] border-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                                    {featured.category}
                                                </span>
                                                <span className="bg-white text-black px-4 py-2 border-[3px] border-black font-bold uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                                    <Clock className="w-4 h-4 stroke-[3px]" />
                                                    {formatDistanceToNow(new Date(featured.date), { locale: tr })} ÖNCE
                                                </span>
                                            </div>
                                            
                                            <h2 className="text-white font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.05] tracking-tight max-w-[95%] mb-6 drop-shadow-2xl group-hover:text-[#FACC15] transition-colors duration-300">
                                                {featured.title}
                                            </h2>
                                            
                                            <p className="text-zinc-300 font-medium text-base md:text-xl lg:text-2xl max-w-4xl line-clamp-2 md:line-clamp-3 mb-8 drop-shadow-md">
                                                {featured.excerpt}
                                            </p>
                                            
                                            <div className="flex flex-wrap items-center justify-between gap-6">
                                                <div className="flex items-center gap-4 text-white">
                                                    <div className="w-12 h-12 rounded-full bg-zinc-800 border-[3px] border-white flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                                                        {featured.author.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm md:text-base uppercase tracking-wider">{featured.author}</p>
                                                        <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">{featured.readingTime} DK OKUMA</p>
                                                    </div>
                                                </div>
                                                <div className="flex w-14 h-14 rounded-full bg-white text-black items-center justify-center border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#FACC15] transition-all duration-300 group-hover:rotate-45">
                                                    <ArrowUpRight className="w-7 h-7 stroke-[3px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        {/* 🧱 BENTO GRID: Remaining Articles 🧱 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {rest.map((article, index) => {
                                // Make specific items span 2 columns to create an asymmetric, dynamic grid
                                const isLarge = index === 0 || index === 5 || index === 10;
                                
                                return (
                                    <motion.div 
                                        key={article.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: (index % 4) * 0.1, duration: 0.4 }}
                                        className={cn(
                                            "block h-full",
                                            isLarge ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                                        )}
                                    >
                                        <Link href={`/makale/${article.slug}`} className="block h-full">
                                            <article className="group flex flex-col h-full bg-background border-[4px] border-black rounded-[1.2rem] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-zinc-800 dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)]">
                                                
                                                {/* Image Container */}
                                                <div className={cn(
                                                    "relative overflow-hidden border-b-[4px] border-black dark:border-zinc-800",
                                                    isLarge ? "h-72 sm:h-80" : "h-60 sm:h-64"
                                                )}>
                                                    <Image 
                                                        src={article.image}
                                                        alt={article.title}
                                                        fill
                                                        sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    {/* Category Badge */}
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <span className="bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 border-[2px] border-transparent font-black uppercase text-[11px] tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                                                            {article.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="p-6 md:p-8 flex flex-col flex-grow bg-card transition-colors duration-300 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/50">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
                                                        <span>{formatDistanceToNow(new Date(article.date), { locale: tr })} ÖNCE</span>
                                                        <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-none" />
                                                        <span className="truncate">{article.author}</span>
                                                    </div>
                                                    
                                                    <h3 className={cn(
                                                        "font-black leading-[1.15] mb-4 group-hover:text-[#FACC15] transition-colors duration-200",
                                                        isLarge ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl"
                                                    )}>
                                                        {article.title}
                                                    </h3>
                                                    
                                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base font-medium line-clamp-3 mb-8 flex-grow leading-relaxed">
                                                        {article.excerpt}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between pt-5 border-t-[3px] border-black/10 dark:border-white/10 mt-auto">
                                                        <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                                                            <Clock className="w-4 h-4 stroke-[3px]" />
                                                            <span>{article.readingTime} Dk Okuma</span>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black group-hover:bg-[#FACC15] group-hover:text-black transition-all duration-300 group-hover:rotate-45">
                                                            <ArrowUpRight className="w-5 h-5 stroke-[3px]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center border-[4px] border-black dark:border-zinc-800 rounded-2xl bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="w-20 h-20 bg-[#FACC15] flex items-center justify-center mb-6 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Zap className="w-10 h-10 text-black stroke-[3px]" />
                        </div>
                        <p className="text-foreground font-black text-3xl md:text-4xl mb-4 uppercase tracking-tight">GÖRÜNEN O Kİ BOŞLUĞA DÜŞTÜK</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-md leading-relaxed font-bold">Bu kategoride henüz yayınlanmış bir makale bulunmuyor. Yakında burası bilimle dolacak.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
