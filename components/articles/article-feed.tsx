"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";

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
// Sadece iç sayfalara hafif bir kağıt dokusu, kapaklara müdahale yok.
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────
   Book Card — Gerçekçi 3D Açılan Kitap (Canlı Renkler, Floating Animasyon)
   ───────────────────────────────────────────── */
function BookCard({ article, index }: { article: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: (index % 12) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
        >
            <div className="relative w-[160px] h-[240px] sm:w-[220px] sm:h-[330px] [perspective:1500px]">
                {/* Mobilde ve masaüstünde canlılık katan sürekli "yüzme" animasyonu */}
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3 + (index % 4), repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full"
                >
                    <Link href={`/makale/${article.slug}`} className="block w-full h-full relative [transform-style:preserve-3d]">
                        
                        {/* Tüm kitap bloğu, varsayılan olarak hafif 3D açılı durur */}
                        <motion.div 
                            initial={{ rotateY: -15, rotateX: 5 }}
                            whileHover={{ rotateY: -25, rotateX: 10, scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full h-full relative [transform-style:preserve-3d] z-10 hover:z-50"
                        >
                            {/* --- THE PAGES INSIDE (Arka sayfa bloğu) --- */}
                            <div className="absolute inset-y-1 right-0 left-2 bg-[#Fdfbf7] rounded-r-md shadow-[inset_4px_0_10px_rgba(0,0,0,0.05),4px_4px_15px_rgba(0,0,0,0.1)] border-y border-r border-[#e5dfc5] z-0 overflow-hidden flex flex-col p-4 sm:p-5">
                                <div className="absolute inset-0 pointer-events-none mix-blend-multiply" style={{backgroundImage: PAPER_TEXTURE}} />
                                
                                <div className="relative z-10 flex flex-col h-full">
                                    <span className="text-blue-600 font-serif text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-blue-100 pb-1">{article.category}</span>
                                    <h4 className="text-slate-900 font-serif text-[11px] sm:text-xs font-black leading-snug line-clamp-3 mb-2">{article.title}</h4>
                                    <p className="text-slate-700 font-serif text-[9px] sm:text-[10px] leading-relaxed line-clamp-4 sm:line-clamp-6 italic">{article.excerpt}</p>
                                    
                                    <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-200">
                                        <span className="text-slate-500 font-serif text-[8px] sm:text-[9px]">{article.readingTime} dk</span>
                                        <span className="text-slate-900 font-bold uppercase tracking-widest text-[8px] sm:text-[9px] hover:text-blue-600 transition-colors">Oku →</span>
                                    </div>
                                </div>
                            </div>

                            {/* --- THE FRONT COVER (Kapak) --- */}
                            {/* Kapak hover anında tam açılır */}
                            <motion.div 
                                initial={{ rotateY: 0 }}
                                whileHover={{ rotateY: -110 }}
                                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                                className="absolute inset-0 origin-left [transform-style:preserve-3d] z-10 rounded-r-md shadow-[5px_5px_15px_rgba(0,0,0,0.3)]"
                            >
                                {/* Ön Yüz (Görsel - Canlı Renklerle) */}
                                <div className="absolute inset-0 [backface-visibility:hidden] rounded-r-md overflow-hidden bg-slate-900 shadow-[-10px_10px_20px_rgba(0,0,0,0.2)]">
                                    <Image src={article.image} alt={article.title} fill className="object-cover" />
                                    
                                    {/* Sadece yazının okunması için alttan hafif siyah geçiş */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                    
                                    {/* Cilt kıvrım gölgesi (sol kenar) */}
                                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/60 via-black/10 to-transparent z-20 pointer-events-none" />

                                    {/* Kapak İçeriği */}
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end z-30 pb-6">
                                        <h3 className="text-white font-serif font-black text-sm sm:text-base leading-tight drop-shadow-md">{article.title}</h3>
                                    </div>
                                </div>

                                {/* İç Kapak (Arka Yüz) */}
                                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-l-md bg-slate-800 border border-white/10 shadow-[inset_-5px_0_20px_rgba(0,0,0,0.6)] overflow-hidden">
                                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: PAPER_TEXTURE}} />
                                    <div className="absolute inset-2 bg-[#Fdfbf7] rounded-sm shadow-inner opacity-5" />
                                </div>
                            </motion.div>

                            {/* --- THE BOOK SPINE (Sırt Kısım) --- */}
                            <div className="absolute left-0 top-0 bottom-0 w-6 origin-right -translate-x-full rotate-y-90 bg-slate-900 border-l border-white/10 [backface-visibility:hidden] shadow-[-10px_0_20px_rgba(0,0,0,0.5)] z-0 flex flex-col items-center justify-center">
                                <span className="text-white/80 text-[7px] font-serif uppercase tracking-widest whitespace-nowrap -rotate-90 origin-center">{article.category}</span>
                            </div>

                        </motion.div>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Hero Encyclopedia Spread (Canlı Renkli Ana Makale)
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
                
                {/* ── MOBILE VIEW: High-end Closed Book ── */}
                <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="block md:hidden relative w-full aspect-[4/5] max-w-[320px] mx-auto rounded-r-lg shadow-[0_20px_40px_rgba(0,0,0,0.4)] bg-slate-900 overflow-hidden [transform-style:preserve-3d] [transform:rotateY(-10deg)_rotateX(5deg)]"
                >
                    {/* Canlı görsel */}
                    <Image src={article.image} alt={article.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-10" />
                    
                    <div className="absolute bottom-8 left-6 right-6 z-20">
                        <span className="text-white/90 text-[10px] font-serif uppercase tracking-widest mb-2 block">{article.category}</span>
                        <h2 className="text-white font-serif font-black text-2xl leading-[1.1] drop-shadow-lg">{article.title}</h2>
                    </div>
                </motion.div>

                {/* ── DESKTOP VIEW: Open Encyclopedia Spread ── */}
                <div className="hidden md:flex relative w-full h-[450px] lg:h-[550px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#Fdfbf7] rounded-md [transform-style:preserve-3d] transition-all duration-1000 ease-out group-hover:rotate-x-[2deg] group-hover:-translate-y-2 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                    
                    {/* Hafif kağıt dokusu */}
                    <div className="absolute inset-0 opacity-[0.1] mix-blend-multiply pointer-events-none z-30" style={{backgroundImage: PAPER_TEXTURE}} />
                    
                    {/* Kitap Kapak Altlığı */}
                    <div className="absolute -inset-1 lg:-inset-2 bg-slate-900 rounded-lg -z-10 shadow-2xl" />

                    {/* Left Page (Görsel) */}
                    <div className="w-1/2 h-full relative border-r border-black/5 overflow-hidden rounded-l-md">
                        {/* İç gölge (sayfa kıvrımı) */}
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/20 via-black/5 to-transparent z-20 pointer-events-none" />
                        <div className="absolute inset-0 p-8 lg:p-12 pb-16">
                            <div className="relative w-full h-full shadow-lg bg-slate-100 overflow-hidden rounded-sm group-hover:shadow-xl transition-shadow duration-1000">
                                {/* CANLI GÖRSEL, filtre yok */}
                                <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" priority />
                            </div>
                        </div>
                    </div>

                    {/* Ortadaki Cilt Kıvrımı */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-black/10 via-black/20 to-black/10 -translate-x-1/2 z-40" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-1/2 z-30 pointer-events-none" />

                    {/* Right Page (Yazı) */}
                    <div className="w-1/2 h-full relative overflow-hidden rounded-r-md flex flex-col justify-center px-12 lg:px-16 py-12">
                        {/* İç gölge (sayfa kıvrımı) */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/20 via-black/5 to-transparent z-20 pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-center">
                            <span className="text-blue-600 font-bold font-serif uppercase tracking-[0.1em] text-xs mb-4">{article.category}</span>
                            
                            <h2 className="text-slate-900 font-serif font-black text-3xl lg:text-5xl leading-[1.1] mb-6">
                                {article.title}
                            </h2>
                            
                            <p className="text-slate-700 font-serif text-sm lg:text-base leading-relaxed line-clamp-4 lg:line-clamp-5">
                                {article.excerpt}
                            </p>

                            <div className="mt-10 flex items-center gap-6">
                                <div className="px-6 py-2 border border-slate-900 text-slate-900 font-serif font-bold uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-colors duration-300">
                                    Okumaya Başla
                                </div>
                                <span className="text-slate-500 font-serif italic text-sm">{article.readingTime} dk okuma</span>
                            </div>
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
        <div className="min-h-screen bg-background text-foreground pb-32 selection:bg-blue-200 selection:text-foreground">
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
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 shadow-lg">
                        <BookMarked className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-serif font-black uppercase tracking-widest text-foreground mb-2">
                        Bilim Kütüphanesi
                    </h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="w-12 h-[1px] bg-muted-foreground/30" />
                        <p className="text-xs sm:text-sm font-serif italic tracking-wider">
                            {ARTICLES.length} Eser
                        </p>
                        <div className="w-12 h-[1px] bg-muted-foreground/30" />
                    </div>
                </motion.header>

                {/* ── SEARCH BAR ── */}
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-8 sm:mb-10 max-w-2xl mx-auto"
                >
                    <div className={cn(
                        "flex items-center rounded-md overflow-hidden transition-all duration-500 border border-border/20",
                        "bg-foreground/5 shadow-inner backdrop-blur-sm",
                        isSearchFocused
                            ? "border-blue-500/50 bg-foreground/10 ring-1 ring-blue-500/30"
                            : ""
                    )}>
                        <div className="pl-5 text-muted-foreground">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Katalogda eser ara..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full bg-transparent py-3.5 sm:py-4 px-4 outline-none font-serif text-foreground text-sm sm:text-base placeholder:text-muted-foreground/50 placeholder:italic"
                        />
                        <button
                            type="submit"
                            className="px-6 sm:px-8 h-full py-3.5 sm:py-4 bg-slate-900 text-white font-serif font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] hover:bg-black transition-colors border-l border-border/20"
                        >
                            Ara
                        </button>
                    </div>
                </motion.form>

                {/* ── CATEGORY FILTERS ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16"
                >
                    <Link
                        href={`/makale${searchQuery ? `?q=${searchQuery}` : ''}`}
                        className={cn(
                            "px-4 py-2 text-[9px] sm:text-[10px] font-serif font-bold uppercase tracking-[0.1em] rounded-md transition-all duration-300 border",
                            !activeCategory
                                ? "bg-slate-900 text-white border-slate-800 shadow-md"
                                : "bg-transparent border-border/20 text-muted-foreground hover:border-slate-500 hover:text-foreground"
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
                                    "px-4 py-2 text-[9px] sm:text-[10px] font-serif font-bold uppercase tracking-[0.1em] rounded-md transition-all duration-300 border",
                                    isActive
                                        ? "bg-slate-900 text-white border-slate-800 shadow-md"
                                        : "bg-transparent border-border/20 text-muted-foreground hover:border-slate-500 hover:text-foreground"
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
                            &quot;<span className="text-foreground not-italic">{searchQuery}</span>&quot; aranıyor... {" "}
                            <span className="text-blue-600 font-bold not-italic">{ARTICLES.length}</span> eser bulundu.
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
                        <h2 className="font-serif font-black text-xl uppercase tracking-widest mb-3">Sonuç Bulunamadı</h2>
                        <p className="text-muted-foreground font-serif italic max-w-sm">
                            Arşivlerimizde bu konuya dair bir kayıt mevcut değil.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
