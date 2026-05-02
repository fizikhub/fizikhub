"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, BookMarked, ArrowRight } from "lucide-react";
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
   Textures & Constants
   ───────────────────────────────────────────── */
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;
const LEATHER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)' opacity='0.4' mix-blend-mode='overlay'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────
   Book Card — Gerçekçi 3D Açılan Kitap (Responsive grid format)
   ───────────────────────────────────────────── */
function BookCard({ article, index }: { article: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: (index % 12) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
        >
            {/* Book container with perspective */}
            <div className="group relative w-[160px] h-[240px] sm:w-[220px] sm:h-[330px] [perspective:1500px]">
                
                <Link href={`/makale/${article.slug}`} className="block w-full h-full relative [transform-style:preserve-3d] transition-transform duration-1000 ease-out group-hover:rotate-x-[5deg] group-hover:-rotate-y-[15deg] group-hover:scale-105 z-10 hover:z-50">
                    
                    {/* --- THE PAGES INSIDE (Right half of the book, fixed in place) --- */}
                    <div className="absolute inset-y-1 right-0 left-2 bg-[#Fdfbf7] rounded-r-md shadow-[inset_4px_0_10px_rgba(0,0,0,0.05),4px_4px_15px_rgba(0,0,0,0.1)] border-y border-r border-[#e5dfc5] z-0 overflow-hidden flex flex-col p-4 sm:p-5">
                        <div className="absolute inset-0 pointer-events-none mix-blend-multiply" style={{backgroundImage: PAPER_TEXTURE}} />
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <span className="text-red-800/80 font-serif text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-red-800/20 pb-1">{article.category}</span>
                            <h4 className="text-stone-900 font-serif text-[11px] sm:text-xs font-black leading-snug line-clamp-3 mb-2">{article.title}</h4>
                            <p className="text-stone-700 font-serif text-[9px] sm:text-[10px] leading-relaxed line-clamp-4 sm:line-clamp-6 italic">{article.excerpt}</p>
                            
                            <div className="mt-auto flex justify-between items-center pt-2 border-t border-stone-300">
                                <span className="text-stone-500 font-serif text-[8px] sm:text-[9px]">{article.readingTime} dk</span>
                                <span className="text-stone-900 font-bold uppercase tracking-widest text-[8px] sm:text-[9px] group-hover:text-red-700 transition-colors">Oku →</span>
                            </div>
                        </div>
                    </div>

                    {/* --- THE FRONT COVER (Hinged on the left, rotates to open) --- */}
                    <div className="absolute inset-0 origin-left [transform-style:preserve-3d] transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 group-hover:-rotate-y-[135deg] rounded-r-md shadow-[5px_5px_15px_rgba(0,0,0,0.5)] group-hover:shadow-none">
                        
                        {/* Front Face (Cover Art) */}
                        <div className="absolute inset-0 [backface-visibility:hidden] rounded-r-md overflow-hidden bg-stone-900 border border-white/10 group-hover:shadow-[-10px_10px_20px_rgba(0,0,0,0.4)] transition-shadow duration-1000">
                            <Image src={article.image} alt={article.title} fill className="object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700" />
                            
                            {/* Leather Texture */}
                            <div className="absolute inset-0" style={{backgroundImage: LEATHER_TEXTURE}} />
                            
                            {/* Spine Crease shadow */}
                            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
                            
                            {/* Cover Decor Frame */}
                            <div className="absolute inset-2 sm:inset-3 border border-[#d4af37]/40 rounded-sm z-20 pointer-events-none" />

                            {/* Content */}
                            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-end z-30 bg-gradient-to-t from-black/90 via-black/40 to-transparent pb-6 sm:pb-8">
                                <h3 className="text-white font-serif font-black text-sm sm:text-base leading-tight drop-shadow-lg">{article.title}</h3>
                            </div>

                            {/* Glare effect sweeping across on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-40 pointer-events-none transform -translate-x-full group-hover:translate-x-full transition-transform" style={{ transitionDuration: '1.5s' }} />
                        </div>

                        {/* Inside Cover (Back Face of the cover, seen when open) */}
                        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-l-md bg-stone-800 border border-white/5 shadow-[inset_-5px_0_20px_rgba(0,0,0,0.8)] overflow-hidden">
                            {/* Texture */}
                            <div className="absolute inset-0 opacity-20" style={{backgroundImage: PAPER_TEXTURE}} />
                            {/* Inner paper trim */}
                            <div className="absolute inset-2 bg-[#Fdfbf7] rounded-sm shadow-inner opacity-10" />
                        </div>

                    </div>

                    {/* --- THE BOOK SPINE (Left Edge for 3D thickness) --- */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 origin-right -translate-x-full rotate-y-90 bg-stone-900 border-l border-white/10 [backface-visibility:hidden] shadow-[-10px_0_20px_rgba(0,0,0,0.5)] z-0">
                        <div className="absolute inset-0" style={{backgroundImage: LEATHER_TEXTURE}} />
                        <div className="h-full flex flex-col items-center justify-between py-4 sm:py-6">
                            <div className="w-3 h-[1px] bg-[#d4af37]/40" />
                            <div className="w-3 h-[1px] bg-[#d4af37]/40 mt-1" />
                            
                            <span className="text-[#d4af37] text-[7px] sm:text-[8px] font-serif uppercase tracking-widest whitespace-nowrap -rotate-90 origin-center opacity-80 mt-auto mb-auto">{article.author}</span>
                            
                            <div className="w-3 h-[1px] bg-[#d4af37]/40 mb-1" />
                            <div className="w-3 h-[1px] bg-[#d4af37]/40" />
                        </div>
                    </div>

                </Link>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Hero Encyclopedia Spread (Top Article)
   ───────────────────────────────────────────── */
function HeroEncyclopedia({ article }: { article: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 sm:mb-20 relative w-full"
        >
            <Link href={`/makale/${article.slug}`} className="block group w-full [perspective:2000px]">
                
                {/* ── MOBILE VIEW: High-end Closed Leather Book ── */}
                <div className="block md:hidden relative w-full aspect-[3/4] max-w-[320px] mx-auto rounded-r-lg shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-stone-900 overflow-hidden [transform-style:preserve-3d] transition-transform duration-1000 group-hover:rotate-x-[2deg] group-hover:-rotate-y-[5deg]">
                    <Image src={article.image} alt={article.title} fill className="object-cover opacity-60 mix-blend-luminosity" priority />
                    <div className="absolute inset-0" style={{backgroundImage: LEATHER_TEXTURE}} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 mix-blend-multiply" />
                    
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/90 via-black/30 to-transparent z-10" />
                    <div className="absolute inset-4 sm:inset-5 border border-[#d4af37]/40 rounded-sm z-10 pointer-events-none" />
                    <div className="absolute inset-5 sm:inset-6 border border-[#d4af37]/20 rounded-sm z-10 pointer-events-none" />
                    
                    <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
                        <span className="text-[#d4af37] border border-[#d4af37]/40 px-4 py-1 text-[9px] font-serif uppercase tracking-[0.3em] backdrop-blur-sm bg-black/40 shadow-xl">Cilt I</span>
                    </div>

                    <div className="absolute bottom-10 left-8 right-8 z-20 text-center">
                        <span className="text-white/60 text-[10px] font-serif uppercase tracking-widest mb-3 block">{article.category}</span>
                        <h2 className="text-white font-serif font-black text-2xl leading-[1.1] drop-shadow-xl">{article.title}</h2>
                    </div>
                </div>

                {/* ── DESKTOP VIEW: Open Encyclopedia Spread ── */}
                <div className="hidden md:flex relative w-full h-[450px] lg:h-[550px] shadow-[0_30px_60px_rgba(0,0,0,0.7)] bg-[#Fdfbf7] rounded-md [transform-style:preserve-3d] transition-all duration-1000 ease-out group-hover:rotate-x-[2deg] group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
                    
                    {/* Paper Texture applied to both pages */}
                    <div className="absolute inset-0 opacity-[0.25] mix-blend-multiply pointer-events-none z-30" style={{backgroundImage: PAPER_TEXTURE}} />
                    
                    {/* Dark Background plate (the book cover under the pages) */}
                    <div className="absolute -inset-1 lg:-inset-2 bg-stone-900 rounded-lg -z-10 shadow-2xl">
                        <div className="absolute inset-0 opacity-40" style={{backgroundImage: LEATHER_TEXTURE}} />
                    </div>

                    {/* Left Page (Image) */}
                    <div className="w-1/2 h-full relative border-r border-black/10 overflow-hidden rounded-l-md">
                        {/* Inner shadow for the page curve towards the spine */}
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 via-black/5 to-transparent z-20 pointer-events-none" />
                        <div className="absolute inset-0 p-10 lg:p-14 pb-20">
                            <div className="relative w-full h-full border-[8px] border-[#Fdfbf7] shadow-xl bg-stone-200 overflow-hidden group-hover:shadow-2xl transition-shadow duration-1000">
                                <Image src={article.image} alt={article.title} fill className="object-cover sepia-[0.1] contrast-[1.1] group-hover:scale-105 transition-transform duration-1000" priority />
                            </div>
                        </div>
                        {/* Page number */}
                        <div className="absolute bottom-8 left-10 text-stone-400 font-serif text-sm">I</div>
                    </div>

                    {/* Spine Center Line / Crease */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-r from-black/30 to-white/10 -translate-x-1/2 z-40" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-1/2 z-30 pointer-events-none" />

                    {/* Right Page (Text) */}
                    <div className="w-1/2 h-full relative overflow-hidden rounded-r-md flex flex-col justify-center px-12 lg:px-20 py-12">
                        {/* Inner shadow for the page curve towards the spine */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/40 via-black/5 to-transparent z-20 pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-center">
                            <span className="text-red-800/80 font-bold font-serif uppercase tracking-[0.2em] text-[10px] lg:text-xs mb-4 border-b border-red-800/20 pb-2 inline-block self-start">{article.category}</span>
                            
                            <h2 className="text-stone-900 font-serif font-black text-3xl lg:text-5xl leading-[1.05] mb-6 decoration-[#d4af37]/40 underline-offset-8">
                                {article.title}
                            </h2>
                            
                            <p className="text-stone-700 font-serif text-sm lg:text-base leading-relaxed line-clamp-4 lg:line-clamp-5 
                                first-letter:text-5xl lg:first-letter:text-6xl first-letter:font-black first-letter:text-stone-900 first-letter:mr-2 first-letter:mt-1 first-letter:float-left">
                                {article.excerpt}
                            </p>

                            <div className="mt-10 lg:mt-12 flex items-center gap-6">
                                <div className="px-8 py-3 bg-stone-900 text-[#d4af37] font-serif font-bold uppercase tracking-[0.2em] text-[10px] lg:text-xs hover:bg-black hover:text-white transition-colors duration-300 flex items-center gap-2">
                                    Cildi İncele <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <span className="text-stone-500 font-serif italic text-xs lg:text-sm">{article.readingTime} dk okuma süresi</span>
                            </div>
                        </div>
                        {/* Page number */}
                        <div className="absolute bottom-8 right-10 text-stone-400 font-serif text-sm">II</div>
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
        <div className="min-h-screen bg-background text-foreground pb-32 selection:bg-[#d4af37]/30 selection:text-foreground">
            {/* Trending News */}
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            <main className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">

                {/* ── HEADER ── */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-8 sm:mb-12 flex flex-col items-center text-center"
                >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-stone-900 border-2 border-[#d4af37]/30 flex items-center justify-center mb-4 shadow-lg">
                        <BookMarked className="w-5 h-5 sm:w-7 sm:h-7 text-[#d4af37]" />
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-serif font-black uppercase tracking-widest text-foreground mb-2">
                        Büyük Kütüphane
                    </h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="w-12 h-[1px] bg-muted-foreground/30" />
                        <p className="text-xs sm:text-sm font-serif italic tracking-wider">
                            {ARTICLES.length} Eser Bulunuyor
                        </p>
                        <div className="w-12 h-[1px] bg-muted-foreground/30" />
                    </div>
                </motion.header>

                {/* ── SEARCH BAR (Library Catalog Style) ── */}
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-8 sm:mb-10 max-w-2xl mx-auto"
                >
                    <div className={cn(
                        "flex items-center rounded-sm overflow-hidden transition-all duration-500 border border-border/20",
                        "bg-foreground/5 shadow-inner backdrop-blur-sm",
                        isSearchFocused
                            ? "border-[#d4af37]/50 bg-foreground/10 ring-1 ring-[#d4af37]/30"
                            : ""
                    )}>
                        <div className="pl-5 text-muted-foreground">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Katalogda eser, konu veya yazar ara..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full bg-transparent py-3.5 sm:py-4 px-4 outline-none font-serif text-foreground text-sm sm:text-base placeholder:text-muted-foreground/50 placeholder:italic"
                        />
                        <button
                            type="submit"
                            className="px-6 sm:px-8 h-full py-3.5 sm:py-4 bg-stone-900 text-[#d4af37] font-serif font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] hover:bg-black transition-colors border-l border-border/20"
                        >
                            Ara
                        </button>
                    </div>
                </motion.form>

                {/* ── CATEGORY FILTERS (Book Plates Style) ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16"
                >
                    <Link
                        href={`/makale${searchQuery ? `?q=${searchQuery}` : ''}`}
                        className={cn(
                            "px-4 py-2 text-[9px] sm:text-[10px] font-serif font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 border",
                            !activeCategory
                                ? "bg-stone-900 text-[#d4af37] border-stone-800 shadow-md"
                                : "bg-transparent border-border/20 text-muted-foreground hover:border-[#d4af37]/50 hover:text-foreground"
                        )}
                    >
                        Tüm Ciltler
                    </Link>
                    {categories.map(cat => {
                        const isActive = activeCategory === cat;
                        return (
                            <Link
                                key={cat}
                                href={`/makale?category=${cat}${searchQuery ? `&q=${searchQuery}` : ''}`}
                                className={cn(
                                    "px-4 py-2 text-[9px] sm:text-[10px] font-serif font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 border",
                                    isActive
                                        ? "bg-stone-900 text-[#d4af37] border-stone-800 shadow-md"
                                        : "bg-transparent border-border/20 text-muted-foreground hover:border-[#d4af37]/50 hover:text-foreground"
                                )}
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
                        className="mb-8 text-center"
                    >
                        <p className="text-sm font-serif italic text-muted-foreground">
                            &quot;<span className="text-foreground not-italic">{searchQuery}</span>&quot; fihristi taranıyor... {" "}
                            <span className="text-[#d4af37] font-bold not-italic">{ARTICLES.length}</span> eser bulundu.
                        </p>
                    </motion.div>
                )}

                {/* ── CONTENT (The Library Shelves) ── */}
                {ARTICLES.length > 0 ? (
                    <div>
                        {/* Hero Encyclopedia */}
                        {heroArticle && <HeroEncyclopedia article={heroArticle} />}

                        {/* Rest of the Books Grid */}
                        {restArticles.length > 0 && (
                            <div className="mt-8 sm:mt-16 border-t border-border/10 pt-12 sm:pt-16">
                                <div className="flex items-center justify-center gap-4 mb-10 sm:mb-16">
                                    <div className="w-16 h-[1px] bg-border/20" />
                                    <h3 className="font-serif italic text-muted-foreground text-sm sm:text-base">Kütüphane Rafları</h3>
                                    <div className="w-16 h-[1px] bg-border/20" />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-12 sm:gap-y-16">
                                    {restArticles.map((article, index) => (
                                        <BookCard
                                            key={article.id}
                                            article={article}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-20 h-20 rounded-full border border-border/20 bg-foreground/5 flex items-center justify-center mb-6">
                            <Search className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h2 className="font-serif font-black text-xl uppercase tracking-widest mb-3">Sayfa Bulunamadı</h2>
                        <p className="text-muted-foreground font-serif italic max-w-sm">
                            Arşivlerimizde bu konuya dair bir fihrist kaydı mevcut değil.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
