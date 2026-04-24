"use client";

import { useRef } from "react";
import { m as motion, useScroll, useTransform } from "framer-motion";
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
   Each card is sticky so that on scroll, the
   next card slides OVER the previous one,
   like flipping through a science magazine.
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

    // As user scrolls past this card, scale it down and push it back slightly
    const scale = useTransform(scrollYProgress, [0.4, 1], [1, 0.92]);
    const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0.3]);

    const catConfig = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG['Genel'];
    const CatIcon = catConfig.icon;
    const isNew = new Date().getTime() - new Date(article.date).getTime() < 3 * 24 * 60 * 60 * 1000;
    const isHero = index === 0;

    return (
        <motion.div
            ref={cardRef}
            style={{ scale, opacity }}
            className="sticky top-[70px] sm:top-[80px] will-change-transform"
        >
            <Link href={`/makale/${article.slug}`} className="block group">
                <article
                    className={cn(
                        "relative overflow-hidden transition-all duration-300",
                        // Fizikhub Design DNA: rounded-2xl, border-2/3, shadow offset, bg-zinc-950
                        "bg-zinc-950 border-[3px] border-zinc-800 rounded-2xl",
                        "shadow-[4px_4px_0px_0px_rgba(39,39,42,0.8)]",
                        "hover:border-yellow-400/60 hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.3)]",
                        "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                        isHero ? "min-h-[480px] sm:min-h-[520px]" : "min-h-[400px] sm:min-h-[420px]"
                    )}
                >
                    {/* Full-bleed Cover Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            priority={index < 2}
                        />
                        {/* Premium Gradient Overlay — fading from bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-8">
                        
                        {/* Top Bar: Category + Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {/* Category Badge — matching homepage yellow badges */}
                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400 text-zinc-900 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg border border-yellow-500/50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                                    <CatIcon className="w-3 h-3 stroke-[2.5px]" />
                                    {article.category}
                                </span>
                                {isNew && (
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                                        <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">Yeni</span>
                                    </span>
                                )}
                            </div>
                            {isHero && (
                                <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/20">
                                    ★ Öne Çıkan
                                </span>
                            )}
                        </div>

                        {/* Bottom Content: Title, Excerpt, Meta */}
                        <div className="mt-auto">
                            {/* Date & Author Pill */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-wider">
                                    {formatDistanceToNow(new Date(article.date), { locale: tr })} önce
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-wider truncate max-w-[120px]">
                                    {article.author}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className={cn(
                                "font-black text-white leading-[1.1] tracking-tight group-hover:text-yellow-300 transition-colors duration-300 mb-3",
                                isHero
                                    ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                                    : "text-xl sm:text-2xl md:text-3xl line-clamp-3"
                            )}>
                                {article.title}
                            </h3>

                            {/* Excerpt */}
                            {article.excerpt && (
                                <p className={cn(
                                    "text-white/60 font-medium leading-relaxed mb-5",
                                    isHero
                                        ? "text-sm sm:text-base line-clamp-3"
                                        : "text-xs sm:text-sm line-clamp-2"
                                )}>
                                    {article.excerpt}
                                </p>
                            )}

                            {/* Footer Bar */}
                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                <div className="flex items-center gap-1.5 text-white/40 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">
                                    <Clock className="w-3 h-3" />
                                    <span>{article.readingTime} dk okuma</span>
                                </div>
                                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white group-hover:bg-yellow-400 group-hover:text-black group-hover:border-yellow-500 transition-all duration-300">
                                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px] group-hover:rotate-45 transition-transform duration-300" />
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
        <div className="min-h-screen bg-background text-foreground pb-24">
            {/* Trending News */}
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            {/* Paper Texture Background (subtle, matching footer) */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.04]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            <main className="relative z-10 max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">

                {/* ── HEADER ── */}
                <header className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-1.5 h-6 bg-yellow-400 rounded-sm border border-yellow-500" />
                        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                            Bilim & Makale
                        </h1>
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Evrenin sırlarından derinlemesine analizler
                    </p>
                </header>

                {/* ── FILTER BAR (matching homepage pills) ── */}
                <div className="flex flex-col gap-3 mb-8 sm:mb-10">
                    {/* Sort */}
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
                                            : "bg-card border-zinc-800 text-muted-foreground hover:border-yellow-400/50 hover:text-foreground"
                                    )}
                                >
                                    {s === 'latest' ? <Clock className="w-3 h-3 stroke-[2.5px]" /> : <Sparkles className="w-3 h-3 stroke-[2.5px]" />}
                                    {s === 'latest' ? 'En Yeni' : 'Popüler'}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Categories — horizontal scroll pills */}
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
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase tracking-wider whitespace-nowrap flex-shrink-0 transition-all duration-200",
                                        isActive
                                            ? "bg-foreground text-background border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]"
                                            : "bg-transparent border-zinc-300 dark:border-zinc-700 text-muted-foreground hover:border-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-3 h-3 stroke-[2.5px]" />
                                    {tab.id}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* ── MAGAZINE CARD STACK ── */}
                {ARTICLES.length > 0 ? (
                    <div className="flex flex-col gap-8 sm:gap-10">
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
                    <div className="flex flex-col items-center justify-center py-20 text-center border-[3px] border-dashed border-zinc-700 rounded-2xl bg-card">
                        <div className="w-14 h-14 rounded-xl bg-[#FFBD2E]/20 border-[2.5px] border-zinc-700 flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(39,39,42,0.8)]">
                            <Zap className="w-7 h-7 text-yellow-400 stroke-[2.5px]" />
                        </div>
                        <p className="text-foreground font-black text-lg uppercase tracking-tight mb-2">İçerik Bulunamadı</p>
                        <p className="text-muted-foreground text-xs font-bold max-w-[250px]">
                            Bu kategori için henüz yayınlanmış içerik bulunmuyor.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
