"use client";

import { useRef } from "react";
import { m as motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Zap, ArrowUpRight, Sparkles, Telescope, Cpu, Dna, FlaskConical, Globe, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   Category Config (matching homepage palette)
   ───────────────────────────────────────────── */
const CATEGORY_CONFIG: Record<string, { icon: typeof Zap; color: string; bg: string }> = {
    'Astrofizik': { icon: Telescope, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    'Uzay': { icon: Telescope, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    'Teknoloji': { icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    'Biyoloji': { icon: Dna, color: 'text-green-400', bg: 'bg-green-500/20' },
    'Fizik': { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    'Kimya': { icon: FlaskConical, color: 'text-pink-400', bg: 'bg-pink-500/20' },
    'Popüler Bilim': { icon: Sparkles, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    'Modern Fizik': { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    'Genel': { icon: Globe, color: 'text-zinc-400', bg: 'bg-zinc-500/20' },
};

const TABS = [
    { id: 'TÜMÜ', icon: LayoutGrid },
    { id: 'Uzay', icon: Telescope },
    { id: 'Teknoloji', icon: Cpu },
    { id: 'Biyoloji', icon: Dna },
    { id: 'Fizik', icon: Zap },
    { id: 'Kimya', icon: FlaskConical },
    { id: 'Genel', icon: Globe },
];

/* ─────────────────────────────────────────────
   Sticky Magazine Card — The Hero Component
   ───────────────────────────────────────────── */
function MagazineCard({ article, index, total }: {
    article: {
        id: string;
        title: string;
        excerpt?: string;
        image: string;
        category: string;
        date: string;
        author: string;
        slug: string;
        readingTime: number;
    };
    index: number;
    total: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    // Outer Card Transforms (Scale down and fade as it goes up)
    const scale = useTransform(scrollYProgress, [0.4, 1], [1, 0.90]);
    const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0.2]);
    
    // Parallax effect for the image inside the card (moves down slightly as you scroll down)
    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    const catConfig = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG['Genel'];
    const CatIcon = catConfig.icon;
    const isNew = new Date().getTime() - new Date(article.date).getTime() < 3 * 24 * 60 * 60 * 1000;
    const isHero = index === 0;

    return (
        <motion.div
            ref={cardRef}
            style={{ scale, opacity }}
            // Initial staggered entrance animation
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like ease out
            className="sticky top-[140px] sm:top-[160px] will-change-transform"
        >
            <Link href={`/makale/${article.slug}`} className="block group">
                <article
                    className={cn(
                        "relative overflow-hidden transition-all duration-300",
                        // Perfected border and shadows
                        "bg-zinc-950 border-[3px] border-zinc-800 rounded-[20px]",
                        "shadow-[4px_4px_0px_0px_rgba(39,39,42,0.8)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]",
                        "hover:border-[#FFBD2E] hover:shadow-[6px_6px_0px_0px_rgba(255,189,46,0.3)]",
                        "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                        isHero ? "min-h-[500px] sm:min-h-[560px]" : "min-h-[420px] sm:min-h-[460px]"
                    )}
                >
                    {/* Parallax Image Container */}
                    <motion.div style={{ y: imageY }} className="absolute inset-[-10%] z-0 h-[120%] w-[120%]">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                            className="object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                            priority={index < 2}
                        />
                    </motion.div>
                    
                    {/* Perfected Gradient Overlay — richer dark at the bottom for text legibility */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-transparent/10 opacity-95 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content Layer */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">
                        
                        {/* Top Bar: Category + Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                {/* Category Badge */}
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFBD2E] text-black text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-lg border-[1.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                                    <CatIcon className="w-3 h-3 stroke-[2.5px]" />
                                    {article.category}
                                </span>
                                {isNew && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 backdrop-blur-md rounded-lg border border-emerald-500/30">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Yeni</span>
                                    </span>
                                )}
                            </div>
                            {isHero && (
                                <span className="px-3 py-1.5 bg-white/5 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                                    ★ Kapak Konusu
                                </span>
                            )}
                        </div>

                        {/* Bottom Content: Title, Excerpt, Meta */}
                        <div className="mt-auto">
                            {/* Date & Author Pill */}
                            <div className="flex items-center gap-2 mb-3.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[10px] sm:text-[11px] font-bold text-zinc-300 uppercase tracking-widest">
                                    {formatDistanceToNow(new Date(article.date), { locale: tr })} önce
                                </span>
                                <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                <span className="text-[10px] sm:text-[11px] font-black text-zinc-300 uppercase tracking-widest truncate max-w-[150px]">
                                    {article.author}
                                </span>
                            </div>

                            {/* Title — refined typography */}
                            <h3 className={cn(
                                "font-black text-white leading-[1.15] tracking-tight group-hover:text-[#FFBD2E] transition-colors duration-300 mb-4 drop-shadow-md",
                                isHero
                                    ? "text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]"
                                    : "text-2xl sm:text-3xl md:text-4xl line-clamp-3"
                            )}>
                                {article.title}
                            </h3>

                            {/* Excerpt — increased line-height for editorial feel */}
                            {article.excerpt && (
                                <p className={cn(
                                    "text-zinc-300 font-medium leading-[1.7] mb-6 drop-shadow-sm",
                                    isHero
                                        ? "text-base sm:text-lg line-clamp-3 max-w-[90%]"
                                        : "text-sm sm:text-base line-clamp-2 max-w-[95%]"
                                )}>
                                    {article.excerpt}
                                </p>
                            )}

                            {/* Footer Bar & Interactive Button */}
                            <div className="flex items-center justify-between pt-4 border-t-[1.5px] border-white/10 group-hover:border-white/20 transition-colors duration-300">
                                <div className="flex items-center gap-2 text-zinc-400 text-[10px] sm:text-[11px] font-black tracking-widest uppercase">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{article.readingTime} dk okuma</span>
                                </div>
                                {/* Micro-interaction: Bouncy Arrow Button */}
                                <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] bg-white/5 backdrop-blur-md border-[1.5px] border-white/20 text-white group-hover:bg-[#FFBD2E] group-hover:text-black group-hover:border-black group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-lg">
                                    <ArrowUpRight className="w-5 h-5 stroke-[2.5px] group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Main Export: ArticleFeed
   ───────────────────────────────────────────── */
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
        <div className="min-h-screen bg-background text-foreground pb-32">
            {/* Trending News */}
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            {/* Paper Texture Background */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.04]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            <main className="relative z-10 max-w-[700px] mx-auto px-4 sm:px-6">

                {/* ── STICKY GLASSMORPHIC HEADER ── */}
                <div className="sticky top-14 sm:top-[72px] z-40 bg-background/80 backdrop-blur-xl border-b-[3px] border-zinc-200 dark:border-zinc-800/60 pt-6 sm:pt-8 pb-5 mb-8 sm:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <header className="mb-4 sm:mb-5">
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="w-1.5 h-6 bg-[#FFBD2E] rounded-sm border border-black dark:border-yellow-600" />
                            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                                Bilim & Makale
                            </h1>
                        </div>
                        <p className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest pl-4">
                            Evrenin sırlarından derinlemesine analizler
                        </p>
                    </header>

                    {/* Filter Bar */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            {['latest', 'popular'].map((s) => {
                                const isActive = sortParam === s;
                                return (
                                    <Link
                                        key={s}
                                        href={`/makale?sort=${s}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-[2.5px] text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-200",
                                            isActive
                                                ? "bg-[#FFBD2E] text-black border-black shadow-[3px_3px_0px_0px_#000] -translate-y-[1px]"
                                                : "bg-transparent border-zinc-300 dark:border-zinc-700 text-muted-foreground hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white"
                                        )}
                                    >
                                        {s === 'latest' ? <Clock className="w-3.5 h-3.5 stroke-[2.5px]" /> : <Sparkles className="w-3.5 h-3.5 stroke-[2.5px]" />}
                                        {s === 'latest' ? 'En Yeni' : 'Popüler'}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Horizontal scroll pills */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border-[2px] text-[10px] font-black uppercase tracking-wider whitespace-nowrap flex-shrink-0 transition-all duration-200",
                                            isActive
                                                ? "bg-foreground text-background border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]"
                                                : "bg-transparent border-zinc-300 dark:border-zinc-700 text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5 stroke-[2.5px]" />
                                        {tab.id}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── MAGAZINE CARD STACK ── */}
                {ARTICLES.length > 0 ? (
                    <div className="flex flex-col gap-10 sm:gap-14 pb-20 relative z-20">
                        {ARTICLES.map((article, index) => (
                            <MagazineCard
                                key={article.id}
                                article={article}
                                index={index}
                                total={ARTICLES.length}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center border-[3px] border-dashed border-zinc-700 rounded-2xl bg-card relative z-20"
                    >
                        <div className="w-14 h-14 rounded-xl bg-[#FFBD2E]/20 border-[2.5px] border-zinc-700 flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(39,39,42,0.8)]">
                            <Zap className="w-7 h-7 text-yellow-400 stroke-[2.5px]" />
                        </div>
                        <p className="text-foreground font-black text-lg uppercase tracking-tight mb-2">İçerik Bulunamadı</p>
                        <p className="text-muted-foreground text-xs font-bold max-w-[250px]">
                            Bu kategori için henüz yayınlanmış içerik bulunmuyor.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
