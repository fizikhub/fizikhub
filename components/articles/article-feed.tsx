"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Zap } from "lucide-react";
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
    { id: 'TÜMÜ' },
    { id: 'Uzay' },
    { id: 'Teknoloji' },
    { id: 'Biyoloji' },
    { id: 'Fizik' },
    { id: 'Kimya' },
    { id: 'Genel' },
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
        <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
            <style jsx>{`
                .zine-marquee {
                    animation: zineMarquee 20s linear infinite;
                }
                @keyframes zineMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            {/* ZINE HEADER: News Marquee styled harshly */}
            {newsItems && newsItems.length > 0 ? (
                <div className="border-b-[4px] border-black dark:border-zinc-800 bg-[#FACC15] text-black">
                    <TrendingMarquee items={newsItems} />
                </div>
            ) : (
                <div className="border-b-[4px] border-black dark:border-zinc-800 bg-[#FACC15] text-black overflow-hidden py-2 border-t-[4px]">
                    <div className="flex whitespace-nowrap zine-marquee w-[200%]">
                        {[...Array(20)].map((_, i) => (
                            <span key={i} className="text-xs sm:text-sm font-black uppercase tracking-widest mx-4">
                                FİZİKHUB YAYINCILIK // OKU, ÖĞREN, SORGULA // BİLİM & MAKALE //
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                
                {/* HEADER & FILTERS */}
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[4px] border-black dark:border-zinc-800 pb-8">
                    <div>
                        <h1 className="text-5xl sm:text-7xl md:text-[6rem] font-black uppercase tracking-tighter leading-[0.85] mb-4">
                            MAKALE
                        </h1>
                        <p className="text-sm sm:text-base font-bold tracking-tight text-zinc-500 dark:text-zinc-400 max-w-sm uppercase">
                            Dijital Bilim Dergisi. Keskin analizler ve derin okumalar.
                        </p>
                    </div>

                    <div className="flex flex-col gap-5 w-full md:w-auto">
                        {/* Sort Options */}
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 hidden sm:block">SIRALA:</span>
                            {['latest', 'popular'].map((s) => {
                                const isActive = sortParam === s;
                                return (
                                    <Link
                                        key={s}
                                        href={`/makale?sort=${s}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                        className={cn(
                                            "flex-1 md:flex-none text-center px-4 py-1.5 border-[3px] font-black text-[11px] uppercase tracking-wider transition-colors rounded-none",
                                            isActive
                                                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] -translate-y-[2px]"
                                                : "bg-transparent border-black/20 text-zinc-500 hover:border-black hover:text-black dark:border-white/20 dark:text-zinc-400 dark:hover:border-white dark:hover:text-white"
                                        )}
                                    >
                                        {s === 'latest' ? 'En Yeni' : 'Popüler'}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Category Filters */}
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                            {TABS.map((tab) => {
                                const isAll = tab.id === 'TÜMÜ';
                                const isActive = isAll ? !activeCategory : activeCategory === tab.id;

                                if (!isAll && !categories.includes(tab.id) && !isActive) return null;

                                return (
                                    <Link
                                        key={tab.id}
                                        href={isAll ? '/makale' : `/makale?category=${tab.id}${sortParam !== 'latest' ? `&sort=${sortParam}` : ''}`}
                                        className={cn(
                                            "flex items-center px-4 py-1.5 border-[3px] font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap rounded-none",
                                            isActive
                                                ? `bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] -translate-y-[2px]`
                                                : "bg-transparent border-black/20 text-zinc-500 hover:border-black hover:text-black dark:border-white/20 dark:text-zinc-400 dark:hover:border-white dark:hover:text-white"
                                        )}
                                    >
                                        {tab.id}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </header>

                {/* Content Grid */}
                {ARTICLES.length > 0 ? (
                    <div className="flex flex-col gap-0">
                        
                        {/* 🌟 HERO: Editorial Zine Cover 🌟 */}
                        {featured && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-16 md:mb-20 border-[4px] border-black dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] group overflow-hidden bg-black"
                            >
                                <Link href={`/makale/${featured.slug}`} className="flex flex-col lg:flex-row w-full">
                                    {/* Image Half */}
                                    <div className="relative w-full lg:w-[60%] aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[550px] xl:h-[650px] border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black dark:border-zinc-800 overflow-hidden bg-zinc-900">
                                        <Image
                                            src={featured.image}
                                            alt={featured.title}
                                            fill
                                            priority
                                            className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="bg-white text-black px-3 py-1.5 border-[3px] border-black font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                                GÜNÜN MAKALESİ
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Zine Text Half */}
                                    <div className="w-full lg:w-[40%] bg-[#FACC15] flex flex-col p-6 sm:p-10 lg:p-12 transition-colors duration-500">
                                        <div className="flex items-center justify-between text-[11px] font-black text-black uppercase tracking-widest mb-6 border-b-[3px] border-black pb-4">
                                            <span className="bg-black text-white px-2 py-0.5">{featured.category}</span>
                                            <span>{formatDistanceToNow(new Date(featured.date), { locale: tr })} ÖNCE</span>
                                        </div>
                                        
                                        <h2 className="text-black font-black text-4xl sm:text-5xl lg:text-5xl xl:text-6xl leading-[0.95] tracking-tight mb-6 uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                                            {featured.title}
                                        </h2>
                                        
                                        <p className="text-black/80 font-bold text-base sm:text-lg lg:text-xl line-clamp-3 md:line-clamp-4 mb-8 flex-grow">
                                            {featured.excerpt}
                                        </p>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t-[3px] border-black">
                                            <div>
                                                <p className="font-black text-black uppercase tracking-wider text-sm md:text-base">{featured.author}</p>
                                                <p className="text-black/60 font-black text-[10px] sm:text-[11px] uppercase tracking-widest mt-0.5">{featured.readingTime} DK OKUMA</p>
                                            </div>
                                            <div className="flex items-center justify-center w-12 h-12 bg-black text-white border-[3px] border-transparent group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all duration-300">
                                                <Zap className="w-6 h-6 stroke-[3px]" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        {/* 🧱 EDITORIAL LIST: Harsh Rows 🧱 */}
                        <div className="flex flex-col border-t-[4px] border-black dark:border-zinc-800">
                            {rest.map((article, index) => (
                                <motion.div 
                                    key={article.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: 0.05 }}
                                >
                                    <Link href={`/makale/${article.slug}`} className="group block py-8 md:py-12 border-b-[4px] border-black dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors duration-300">
                                        <article className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                            
                                            {/* Harsh Image Box */}
                                            <div className="relative w-full md:w-[35%] lg:w-[30%] shrink-0 aspect-[16/10] md:aspect-[4/3] border-[4px] border-black dark:border-zinc-700 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 bg-muted">
                                                <Image 
                                                    src={article.image}
                                                    alt={article.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            
                                            {/* Zine Text Content */}
                                            <div className="flex flex-col justify-start flex-grow w-full pt-1 md:pt-0">
                                                <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">
                                                    <span className="border-[2px] border-black dark:border-white text-black dark:text-white px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                                                        {article.category}
                                                    </span>
                                                    <span>{formatDistanceToNow(new Date(article.date), { locale: tr })} ÖNCE</span>
                                                </div>
                                                
                                                <h3 className="font-black text-2xl sm:text-3xl lg:text-4xl leading-[1.05] mb-4 uppercase group-hover:text-[#FACC15] transition-colors duration-200 tracking-tight">
                                                    {article.title}
                                                </h3>
                                                
                                                <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-bold line-clamp-3 mb-6 max-w-3xl leading-relaxed">
                                                    {article.excerpt}
                                                </p>
                                                
                                                <div className="flex items-center gap-4 mt-auto">
                                                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-1">
                                                        {article.author}
                                                    </span>
                                                    <span className="font-black text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 stroke-[3px]" />
                                                        {article.readingTime} DK OKUMA
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center border-[4px] border-black dark:border-zinc-800 rounded-none bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="w-20 h-20 bg-[#FACC15] flex items-center justify-center mb-6 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Zap className="w-10 h-10 text-black stroke-[3px]" />
                        </div>
                        <p className="text-foreground font-black text-3xl md:text-4xl mb-4 uppercase tracking-tight">İÇERİK YOK</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-md leading-relaxed font-bold">Bu alanda gösterilecek bir yazı bulunamadı.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
