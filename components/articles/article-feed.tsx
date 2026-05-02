"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { m as motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Telescope, Cpu, Dna, Zap, FlaskConical, Globe, BookOpen, Clock, ChevronRight, BookMarked, Atom } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
    searchQuery?: string;
}

/* ─────────────────────────────────────────────
   Category Colors — spine + accent
   ───────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, { spine: string; accent: string; text: string }> = {
    'Astrofizik':     { spine: '#8B5CF6', accent: 'rgba(139,92,246,0.15)', text: '#A78BFA' },
    'Uzay':           { spine: '#3B82F6', accent: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
    'Teknoloji':      { spine: '#06B6D4', accent: 'rgba(6,182,212,0.15)',  text: '#22D3EE' },
    'Biyoloji':       { spine: '#22C55E', accent: 'rgba(34,197,94,0.15)',  text: '#4ADE80' },
    'Fizik':          { spine: '#EAB308', accent: 'rgba(234,179,8,0.15)',  text: '#FACC15' },
    'Kimya':          { spine: '#EC4899', accent: 'rgba(236,72,153,0.15)', text: '#F472B6' },
    'Popüler Bilim':  { spine: '#F97316', accent: 'rgba(249,115,22,0.15)', text: '#FB923C' },
    'Modern Fizik':   { spine: '#F59E0B', accent: 'rgba(245,158,11,0.15)', text: '#FBBF24' },
    'Kuantum Fiziği': { spine: '#A855F7', accent: 'rgba(168,85,247,0.15)', text: '#C084FC' },
    'Mekanik':        { spine: '#14B8A6', accent: 'rgba(20,184,166,0.15)', text: '#2DD4BF' },
    'Bilim Tarihi':   { spine: '#78716C', accent: 'rgba(120,113,108,0.15)', text: '#A8A29E' },
    'Termodinamik':   { spine: '#EF4444', accent: 'rgba(239,68,68,0.15)', text: '#F87171' },
    'Parçacık Fiziği':{ spine: '#6366F1', accent: 'rgba(99,102,241,0.15)', text: '#818CF8' },
    'Kitap İncelemesi':{ spine: '#D97706', accent: 'rgba(217,119,6,0.15)', text: '#FBBF24' },
    'Genel':          { spine: '#71717A', accent: 'rgba(113,113,122,0.15)', text: '#A1A1AA' },
};

const getColor = (cat: string) => CATEGORY_COLORS[cat] || CATEGORY_COLORS['Genel'];

/* ─────────────────────────────────────────────
   Book Card — Gerçek Kitap Hissiyatı
   ───────────────────────────────────────────── */
function BookCard({ article, index }: { article: any; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const colors = getColor(article.category);
    const isNew = Date.now() - new Date(article.date).getTime() < 3 * 24 * 60 * 60 * 1000;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{
                duration: 0.6,
                delay: (index % 6) * 0.08,
                ease: [0.16, 1, 0.3, 1]
            }}
            className="perspective-[1200px]"
        >
            <Link href={`/makale/${article.slug}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-[#FFC800] rounded-lg">
                <div className="relative flex overflow-hidden rounded-lg
                    bg-card border-2 border-border
                    shadow-[4px_4px_0px_0px_hsl(var(--border))]
                    transition-all duration-300 ease-out
                    group-hover:shadow-[6px_6px_0px_0px_#FFC800]
                    group-hover:border-[#FFC800]
                    group-hover:-translate-y-1
                    group-active:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px]
                    min-h-[200px] sm:min-h-[220px]"
                >
                    {/* ── Book Spine ── */}
                    <div
                        className="w-3 sm:w-4 flex-shrink-0 relative z-10"
                        style={{ backgroundColor: colors.spine }}
                    >
                        {/* Spine texture lines */}
                        <div className="absolute inset-0 flex flex-col justify-between py-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full h-[1px] bg-black/20" />
                            ))}
                        </div>
                        {/* Gold foil accent on spine */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-8 bg-[#FFC800]/60 rounded-full" />
                    </div>

                    {/* ── Book Cover Image ── */}
                    <div className="w-[140px] sm:w-[200px] flex-shrink-0 relative overflow-hidden border-r-2 border-border">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 640px) 140px, 200px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        {/* Subtle page-edge effect on image */}
                        <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />

                        {/* Category badge floated on image */}
                        <div className="absolute top-3 left-3">
                            <span
                                className="inline-block px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                                style={{ backgroundColor: colors.spine, color: '#000' }}
                            >
                                {article.category}
                            </span>
                        </div>

                        {/* "New" indicator */}
                        {isNew && (
                            <div className="absolute bottom-3 left-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    Yeni
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── Book Content / Back Cover ── */}
                    <div className="flex-1 flex flex-col p-4 sm:p-5 relative overflow-hidden">
                        {/* Subtle paper texture */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
                            }}
                        />

                        {/* Title */}
                        <h3 className="relative font-black text-foreground text-base sm:text-lg leading-[1.2] tracking-tight group-hover:text-[#FFC800] transition-colors duration-300 line-clamp-3 mb-2">
                            {article.title}
                        </h3>

                        {/* Excerpt */}
                        {article.excerpt && (
                            <p className="relative text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 mb-auto">
                                {article.excerpt}
                            </p>
                        )}

                        {/* Bottom meta — like a book's colophon */}
                        <div className="relative mt-3 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 text-muted-foreground text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {article.readingTime} dk
                                </span>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                                <span className="truncate max-w-[100px]">
                                    {article.author}
                                </span>
                            </div>

                            {/* Arrow button */}
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md border-2 border-border flex items-center justify-center
                                bg-background
                                group-hover:bg-[#FFC800] group-hover:border-black group-hover:text-black
                                transition-all duration-300">
                                <ChevronRight className="w-4 h-4 stroke-[3px] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Hero / Featured Book Card — First Article
   ───────────────────────────────────────────── */
function HeroBookCard({ article }: { article: any }) {
    const colors = getColor(article.category);
    const isNew = Date.now() - new Date(article.date).getTime() < 3 * 24 * 60 * 60 * 1000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/makale/${article.slug}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-[#FFC800] rounded-xl">
                <div className="relative overflow-hidden rounded-xl
                    bg-card border-[3px] border-border
                    shadow-[6px_6px_0px_0px_hsl(var(--border))]
                    transition-all duration-300 ease-out
                    group-hover:shadow-[8px_8px_0px_0px_#FFC800]
                    group-hover:border-[#FFC800]
                    group-hover:-translate-y-1
                    group-active:shadow-none group-active:translate-x-[3px] group-active:translate-y-[3px]"
                >
                    {/* Spine accent at top */}
                    <div className="h-2" style={{ backgroundColor: colors.spine }} />

                    {/* Image */}
                    <div className="relative h-[220px] sm:h-[300px] overflow-hidden">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 700px"
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Floating badges */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span
                                className="inline-block px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest border-[3px] border-black shadow-[3px_3px_0px_0px_#000]"
                                style={{ backgroundColor: colors.spine, color: '#000' }}
                            >
                                {article.category}
                            </span>
                            {isNew && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white border-[3px] border-black shadow-[3px_3px_0px_0px_#000]">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    Yeni
                                </span>
                            )}
                        </div>

                        <div className="absolute top-4 right-4">
                            <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-[#FFC800] text-black border-[3px] border-black shadow-[3px_3px_0px_0px_#000]">
                                ★ Öne Çıkan
                            </span>
                        </div>

                        {/* Title overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                            <h3 className="font-black text-white text-2xl sm:text-3xl md:text-4xl leading-[1.1] tracking-tight group-hover:text-[#FFC800] transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                {article.title}
                            </h3>
                        </div>
                    </div>

                    {/* Bottom info bar */}
                    <div className="p-4 sm:p-5 flex items-center justify-between border-t-2 border-border">
                        <div className="flex items-center gap-4 text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readingTime} dk okuma
                            </span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span>{article.author}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span>{formatDistanceToNow(new Date(article.date), { locale: tr })} önce</span>
                        </div>

                        <div className="w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center
                            bg-background
                            group-hover:bg-[#FFC800] group-hover:border-black group-hover:text-black
                            transition-all duration-300">
                            <ChevronRight className="w-5 h-5 stroke-[3px]" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Main Export: ArticleFeed
   ───────────────────────────────────────────── */
export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems, searchQuery }: ArticleFeedProps) {
    const router = useRouter();
    const [inputValue, setInputValue] = useState(searchQuery || "");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

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

    const heroArticle = ARTICLES[0];
    const restArticles = ARTICLES.slice(1);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (inputValue.trim()) params.set("q", inputValue.trim());
        if (activeCategory) params.set("category", activeCategory);
        if (sortParam !== 'latest') params.set("sort", sortParam);
        router.push(`/makale?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-32 selection:bg-[#FFC800] selection:text-black">
            {/* Trending News */}
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            <main className="relative z-10 max-w-[750px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">

                {/* ── HEADER ── */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-border bg-[#FFC800] flex items-center justify-center shadow-[3px_3px_0px_0px_hsl(var(--border))]">
                            <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5px]" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                                Makale Kütüphanesi
                            </h1>
                            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                {ARTICLES.length} bilimsel eser
                            </p>
                        </div>
                    </div>
                </motion.header>

                {/* ── SEARCH BAR ── */}
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6"
                >
                    <div className={cn(
                        "flex items-center border-2 rounded-lg overflow-hidden transition-all duration-200",
                        "bg-card shadow-[3px_3px_0px_0px_hsl(var(--border))]",
                        isSearchFocused
                            ? "border-[#FFC800] shadow-[3px_3px_0px_0px_#FFC800]"
                            : "border-border"
                    )}>
                        <div className="pl-4 text-muted-foreground">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                        </div>
                        <input
                            type="text"
                            placeholder="Makale, konu veya yazar ara..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full bg-transparent py-3 sm:py-3.5 px-3 outline-none font-bold placeholder:text-muted-foreground/60 text-foreground text-sm"
                        />
                        <button
                            type="submit"
                            className="px-4 sm:px-5 h-full py-3 sm:py-3.5 bg-[#FFC800] text-black font-black text-xs uppercase tracking-wider
                                border-l-2 border-border
                                hover:bg-yellow-400 active:bg-yellow-500 transition-colors"
                        >
                            Ara
                        </button>
                    </div>
                </motion.form>

                {/* ── CATEGORY FILTERS ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap gap-2 mb-8 sm:mb-10"
                >
                    <Link
                        href={`/makale${searchQuery ? `?q=${searchQuery}` : ''}`}
                        className={cn(
                            "px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border-2 rounded-md transition-all duration-200",
                            !activeCategory
                                ? "bg-foreground text-background border-foreground shadow-[2px_2px_0px_0px_#FFC800]"
                                : "bg-card border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        )}
                    >
                        Tümü
                    </Link>
                    {categories.map(cat => {
                        const isActive = activeCategory === cat;
                        const catColor = getColor(cat);
                        return (
                            <Link
                                key={cat}
                                href={`/makale?category=${cat}${searchQuery ? `&q=${searchQuery}` : ''}`}
                                className={cn(
                                    "px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border-2 rounded-md transition-all duration-200",
                                    isActive
                                        ? "text-black border-black shadow-[2px_2px_0px_0px_#000]"
                                        : "bg-card border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                                )}
                                style={isActive ? { backgroundColor: catColor.spine } : {}}
                            >
                                {cat}
                            </Link>
                        );
                    })}
                </motion.div>

                {/* ── Search result info ── */}
                {searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-6 px-4 py-3 border-2 border-dashed border-border rounded-lg bg-card"
                    >
                        <p className="text-sm font-bold text-muted-foreground">
                            <span className="text-foreground">&quot;{searchQuery}&quot;</span> için{" "}
                            <span className="text-[#FFC800] font-black">{ARTICLES.length}</span> sonuç bulundu
                        </p>
                    </motion.div>
                )}

                {/* ── CONTENT ── */}
                {ARTICLES.length > 0 ? (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Hero Card */}
                        {heroArticle && <HeroBookCard article={heroArticle} />}

                        {/* Rest of articles as book cards */}
                        {restArticles.length > 0 && (
                            <div className="space-y-4 sm:space-y-5">
                                {restArticles.map((article, index) => (
                                    <BookCard
                                        key={article.id}
                                        article={article}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-card"
                    >
                        <div className="w-16 h-16 rounded-xl bg-[#FFC800]/20 border-2 border-border flex items-center justify-center mb-5 shadow-[3px_3px_0px_0px_hsl(var(--border))]">
                            <BookOpen className="w-8 h-8 text-[#FFC800] stroke-[2.5px]" />
                        </div>
                        <h2 className="font-black text-lg uppercase tracking-tight mb-2">Raflar Boş</h2>
                        <p className="text-muted-foreground text-sm font-bold max-w-[280px]">
                            Bu kategori veya arama için henüz yayınlanmış bir makale bulunamadı.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
