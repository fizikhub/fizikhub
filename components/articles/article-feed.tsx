"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TOPICS = [
    { label: 'Fizik', icon: Atom, accent: '#FFC800', rotation: '-2deg' },
    { label: 'Uzay', icon: Telescope, accent: '#FF0080', rotation: '1deg' },
    { label: 'Teknoloji', icon: Cpu, accent: '#23A9FA', rotation: '-1deg' },
    { label: 'Biyoloji', icon: Dna, accent: '#F472B6', rotation: '2deg' },
    { label: 'Kimya', icon: FlaskConical, accent: '#00F050', rotation: '-1.5deg' },
    { label: 'Genel', icon: Globe, accent: '#a1a1aa', rotation: '0deg' },
];

const SORT_OPTS = [
    { value: 'latest', label: 'En Yeni', icon: Clock },
    { value: 'popular', label: 'Popüler', icon: Flame },
];

function ago(d: string) {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr });
}

// Custom hook for mouse position
function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, []);
    return mousePosition;
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    const showFeatured = !activeCategory && sortParam === "latest" && articles.length >= 4;
    const featured = showFeatured ? articles.slice(0, 4) : [];
    const restArticles = showFeatured ? articles.slice(4) : articles;

    const mousePos = useMousePosition();
    const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);

    // Smooth spring configuration for the floating image
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(mousePos.x, springConfig);
    const cursorY = useSpring(mousePos.y, springConfig);

    useEffect(() => {
        cursorX.set(mousePos.x);
        cursorY.set(mousePos.y);
    }, [mousePos, cursorX, cursorY]);

    return (
        <div className="min-h-screen bg-[#f4f4f0] dark:bg-[#121212] pt-20 sm:pt-28 pb-10 overflow-hidden text-black dark:text-white">

            {/* FLOATING IMAGE REVEAL (DESKTOP ONLY) */}
            <div className="hidden lg:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
                <AnimatePresence>
                    {hoveredArticle && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 2 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                x: cursorX,
                                y: cursorY,
                                translateX: "-50%",
                                translateY: "-50%",
                            }}
                            className="absolute w-[300px] h-[200px] border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] rounded-sm overflow-hidden"
                        >
                            <Image
                                src={hoveredArticle}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

                {/* MAGAZINE HEADER (APP-LIKE BRUTALISM) */}
                <header className="mb-10 sm:mb-16 border-b-4 border-black dark:border-white pb-6 relative">
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/2">
                        <Sparkles className="w-64 h-64" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10"
                    >
                        <div>
                            <div className="inline-block bg-[#FFC800] text-black font-black uppercase text-xs sm:text-sm px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#000] rotate-[-2deg] mb-4">
                                GÜNLÜK YAYIN
                            </div>
                            <h1 className="font-heading text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-black dark:text-white" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                                MAGAZINE<span className="text-[#FF0080]">.</span>
                            </h1>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                            <p className="max-w-xs text-sm sm:text-base font-bold leading-tight md:text-right border-l-4 md:border-l-0 md:border-r-4 border-[#23A9FA] pl-3 md:pl-0 md:pr-3">
                                Bilim, teknoloji ve evrenin sınırlarında dolaşan {articles.length} makale.
                            </p>

                            {/* Sort Options App-like Toggle */}
                            <div className="flex items-center p-1 bg-black/5 dark:bg-white/5 border-2 border-black dark:border-white rounded-full w-fit">
                                {SORT_OPTS.map(s => (
                                    <Link
                                        key={s.value}
                                        href={`/makale?sort=${s.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                        className={cn(
                                            "flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-xs uppercase transition-all",
                                            sortParam === s.value
                                                ? "bg-[#00F050] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                                                : "text-zinc-500 hover:text-black dark:hover:text-white"
                                        )}
                                    >
                                        <s.icon className="w-3.5 h-3.5 stroke-[3px]" />
                                        {s.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* CATEGORIES / FILTER CAROUSEL */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                    <Link
                        href="/makale"
                        className={cn(
                            "snap-start relative flex flex-col items-center justify-center min-w-[100px] h-[100px] border-3 rounded-2xl font-black transition-all active:scale-95 group",
                            !activeCategory
                                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                : "bg-white dark:bg-zinc-900 text-black dark:text-white border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"
                        )}
                    >
                        <Globe className={cn("w-8 h-8 mb-2 stroke-[2px]", !activeCategory ? "animate-spin-slow" : "group-hover:rotate-12 transition-transform")} />
                        <span className="text-xs uppercase tracking-widest">Hepsi</span>
                    </Link>

                    {TOPICS.map((t, i) => (
                        <Link
                            key={t.label}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "snap-start relative flex flex-col items-center justify-center min-w-[100px] h-[100px] border-3 border-black dark:border-white rounded-2xl font-black transition-all active:scale-95 group",
                                activeCategory === t.label
                                    ? "text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-1"
                                    : "bg-white dark:bg-zinc-900 text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"
                            )}
                            style={activeCategory === t.label ? { backgroundColor: t.accent, transform: `rotate(${t.rotation}) translateY(-4px)` } : {}}
                        >
                            <div className={cn("p-2 rounded-full mb-1 border-2 border-black", activeCategory === t.label ? "bg-white" : "bg-black dark:bg-white text-white dark:text-black")} style={activeCategory !== t.label ? { backgroundColor: t.accent } : {}}>
                                <t.icon className={cn("w-5 h-5 stroke-[2.5px]", activeCategory === t.label ? "text-black" : "text-black")} />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider">{t.label}</span>
                        </Link>
                    ))}
                </div>

                {/* NEWS TICKER */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-12 border-4 border-black dark:border-white bg-[#FFC800] text-black font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* FEATURED MAGAZINE SPREAD */}
                {showFeatured && (
                    <section className="mb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                            {/* HERO ARTICLE - LEFT SIDE */}
                            <div className="lg:col-span-7 h-[500px] sm:h-[600px] lg:h-[700px] group">
                                <ViewTransitionLink href={`/blog/${featured[0].slug}`} className="block w-full h-full relative border-4 border-black dark:border-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden bg-zinc-900">
                                    <Image
                                        src={featured[0].cover_url || featured[0].image_url || "/images/placeholder-article.webp"}
                                        alt={featured[0].title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex gap-2">
                                        <span className="bg-[#FF0080] text-white border-2 border-black font-black px-3 py-1 uppercase text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000]">
                                            KAPAK KONUSU
                                        </span>
                                        <span className="bg-white text-black border-2 border-black font-black px-3 py-1 uppercase text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000]">
                                            {featured[0].category}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20">
                                        <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] uppercase mb-4 tracking-tighter group-hover:text-[#FFC800] transition-colors drop-shadow-xl w-full sm:w-[90%]">
                                            {featured[0].title}
                                        </h2>

                                        <p className="hidden sm:block text-zinc-300 font-bold text-lg leading-snug mb-6 max-w-xl border-l-4 border-[#FFC800] pl-4">
                                            {featured[0].summary || "Yeni bir keşif ufukları açıyor. Bilimin sınırlarında heyecan verici gelişmeler."}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            {featured[0].author?.avatar_url && (
                                                <Image src={featured[0].author.avatar_url} alt="" width={48} height={48} className="rounded-full border-2 border-white shadow-[2px_2px_0px_0px_#fff]" />
                                            )}
                                            <div className="text-white">
                                                <p className="font-black uppercase text-sm">{featured[0].author?.full_name}</p>
                                                <p className="font-bold text-xs text-zinc-400">{ago(featured[0].created_at)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action button overlay */}
                                    <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-12 h-12 sm:w-16 sm:h-16 bg-[#00F050] border-3 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] rotate-45 group-hover:rotate-0 transition-transform duration-300">
                                        <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-black stroke-[3px]" />
                                    </div>
                                </ViewTransitionLink>
                            </div>

                            {/* RIGHT SIDE STACK */}
                            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
                                {featured.slice(1, 4).map((a, i) => (
                                    <ViewTransitionLink key={a.id} href={`/blog/${a.slug}`} className="group flex-1 min-h-[180px]">
                                        <article className="flex gap-4 h-full bg-white dark:bg-zinc-900 border-4 border-black dark:border-white rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all p-3 sm:p-4 relative overflow-hidden">

                                            <div className="w-1/3 sm:w-2/5 h-full relative border-2 border-black dark:border-white rounded-lg overflow-hidden shrink-0">
                                                <Image
                                                    src={a.cover_url || a.image_url || "/images/placeholder-article.webp"}
                                                    alt={a.title} fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                                />
                                                <div className="absolute top-2 left-2">
                                                    <span className={cn(
                                                        "bg-white text-black font-black text-[10px] px-2 py-0.5 border border-black uppercase shadow-[2px_2px_0px_0px_#000]",
                                                        i === 0 ? "bg-[#23A9FA]" : i === 1 ? "bg-[#FFC800]" : "bg-[#F472B6]"
                                                    )}>
                                                        {a.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-center flex-1 py-1">
                                                <span className="text-zinc-500 font-bold text-[10px] uppercase mb-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {ago(a.created_at)}
                                                </span>
                                                <h3 className="font-heading text-lg sm:text-2xl font-black uppercase leading-tight tracking-tight mb-2 group-hover:text-[#23A9FA] dark:group-hover:text-[#FFC800] transition-colors line-clamp-3">
                                                    {a.title}
                                                </h3>
                                                <div className="mt-auto font-bold text-xs uppercase flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full border border-black overflow-hidden relative">
                                                        <Image src={a.author?.avatar_url || '/images/default-avatar.png'} alt="" fill className="object-cover" />
                                                    </span>
                                                    {a.author?.full_name}
                                                </div>
                                            </div>
                                        </article>
                                    </ViewTransitionLink>
                                ))}
                            </div>

                        </div>
                    </section>
                )}

                {/* THE EDITORIAL LIST (ALL OTHER ARTICLES) */}
                <section>
                    <div className="flex items-center justify-between border-b-4 border-black dark:border-white pb-2 mb-8">
                        <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tighter">İndeks</h2>
                        <span className="bg-black dark:bg-white text-white dark:text-black font-black text-xl px-4 py-1 rounded-full uppercase">
                            {restArticles.length} Yazı
                        </span>
                    </div>

                    {restArticles.length > 0 ? (
                        <div className="flex flex-col border-b-4 border-black dark:border-white">
                            {restArticles.map((article, i) => (
                                <div
                                    key={article.id}
                                    onMouseEnter={() => setHoveredArticle(article.cover_url || article.image_url || "/images/placeholder-article.webp")}
                                    onMouseLeave={() => setHoveredArticle(null)}
                                >
                                    <ViewTransitionLink
                                        href={`/blog/${article.slug}`}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-4 border-black dark:border-white py-6 sm:py-8 hover:bg-[#FFC800] dark:hover:bg-[#FFC800] dark:hover:text-black transition-colors px-4 -mx-4 sm:mx-0 sm:px-4 cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4 sm:gap-8 flex-1">
                                            <div className="font-heading font-black text-3xl sm:text-5xl text-black/20 dark:text-white/20 group-hover:text-black/40 min-w-[50px]">
                                                {(i + 1).toString().padStart(2, '0')}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="font-black text-[10px] sm:text-xs uppercase border-2 border-black px-2 py-0.5 rounded-full bg-white text-black">
                                                        {article.category}
                                                    </span>
                                                    <span className="font-bold text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-black/70">
                                                        {ago(article.created_at)}
                                                    </span>
                                                </div>
                                                <h3 className="font-heading font-black text-2xl sm:text-4xl uppercase leading-tight tracking-tight">
                                                    {article.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Mobile Only Thumbnail (Since float image is hidden on mobile) */}
                                        <div className="block lg:hidden w-full h-48 sm:w-48 sm:h-32 relative border-4 border-black rounded-lg overflow-hidden shrink-0 mt-4 sm:mt-0">
                                            <Image
                                                src={article.cover_url || article.image_url || "/images/placeholder-article.webp"}
                                                alt={article.title} fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-full border-4 border-black bg-white group-hover:bg-black group-hover:text-[#FFC800] transition-colors shrink-0">
                                            <ArrowUpRight className="w-8 h-8 stroke-[3px]" />
                                        </div>
                                    </ViewTransitionLink>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center border-4 border-dashed border-black dark:border-white rounded-3xl bg-black/5 dark:bg-white/5">
                            <Cpu className="w-16 h-16 mb-6 opacity-20" />
                            <h3 className="font-heading font-black text-3xl uppercase mb-2">BOŞLUK.</h3>
                            <p className="font-bold text-zinc-500 max-w-sm">Bu filtrede hiçbir sinyal yakalanamadı. Lütfen rotayı değiştirin.</p>
                            <Link href="/makale" className="mt-8 bg-[#FF0080] text-white font-black uppercase px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                KAPSAMA ALANINA DÖN
                            </Link>
                        </div>
                    )}
                </section>

                <div className="mt-20 sm:mt-32">
                    <GoldenTicketCTA />
                </div>
            </div>
        </div>
    );
}
