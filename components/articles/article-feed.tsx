"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
import { useCallback, useRef, useState } from "react";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TOPICS = [
    { label: 'Fizik', icon: Atom, color: '#FACC15' },
    { label: 'Uzay', icon: Telescope, color: '#FF0080' },
    { label: 'Teknoloji', icon: Cpu, color: '#23A9FA' },
    { label: 'Biyoloji', icon: Dna, color: '#F472B6' },
    { label: 'Kimya', icon: FlaskConical, color: '#4ADE80' },
    { label: 'Genel', icon: Globe, color: '#71717a' },
];

const CATEGORY_COLORS: Record<string, string> = {
    'Fizik': '#FACC15',
    'Uzay': '#FF0080',
    'Teknoloji': '#23A9FA',
    'Biyoloji': '#F472B6',
    'Kimya': '#4ADE80',
    'Genel': '#71717a',
};

function ago(d: string) {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr });
}

function strip(html: string | null | undefined) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/* ─────────────────────────────────────
   ARTICLE ROW — hover reveals image (desktop)
   tap expands (mobile)
───────────────────────────────────── */
function ArticleRow({ article, index, onHover, onLeave }: {
    article: any;
    index: number;
    onHover: (article: any, y: number) => void;
    onLeave: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const rowRef = useRef<HTMLDivElement>(null);
    const catColor = CATEGORY_COLORS[article.category] || "#71717a";
    const preview = article.excerpt || article.summary || strip(article.content)?.slice(0, 200) + "…";

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        onHover(article, e.clientY);
    }, [article, onHover]);

    return (
        <div ref={rowRef}>
            {/* Desktop Row */}
            <Link
                href={`/blog/${article.slug}`}
                className="group hidden sm:block"
                onMouseEnter={handleMouseMove}
                onMouseMove={handleMouseMove}
                onMouseLeave={onLeave}
            >
                <div className="flex items-center gap-4 md:gap-6 py-5 md:py-6 border-b border-zinc-800/60 transition-colors hover:bg-zinc-900/40 px-2 -mx-2 rounded-lg">
                    {/* Index */}
                    <span className="text-zinc-700 font-mono text-sm w-8 text-right shrink-0 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Category dot */}
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: catColor }} />

                    {/* Title */}
                    <h3 className="flex-1 text-lg md:text-2xl font-black text-zinc-200 leading-tight tracking-tight group-hover:text-white transition-colors line-clamp-1 min-w-0">
                        {article.title}
                    </h3>

                    {/* Category */}
                    <span
                        className="shrink-0 text-[10px] font-bold uppercase tracking-[.15em] px-2.5 py-1 rounded border border-zinc-700 transition-colors"
                        style={{ color: catColor }}
                    >
                        {article.category || "Genel"}
                    </span>

                    {/* Author */}
                    <span className="hidden lg:block shrink-0 text-xs text-zinc-500 font-medium w-28 truncate text-right">
                        {article.author?.full_name || "Anonim"}
                    </span>

                    {/* Time */}
                    <span className="hidden md:block shrink-0 text-[11px] text-zinc-600 w-24 text-right">
                        {ago(article.created_at)}
                    </span>
                </div>
            </Link>

            {/* Mobile Card */}
            <div className="sm:hidden border-b border-zinc-800/50">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full text-left py-4 flex items-start gap-3"
                >
                    <span className="text-zinc-700 font-mono text-xs mt-1 w-6 text-right shrink-0">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: catColor }} />
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: catColor }}>
                                {article.category || "Genel"}
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-200 leading-snug pr-4">
                            {article.title}
                        </h3>
                        <span className="text-[11px] text-zinc-600 mt-1 block">
                            {article.author?.full_name} · {ago(article.created_at)}
                        </span>
                    </div>
                    <motion.span
                        animate={{ rotate: expanded ? 45 : 0 }}
                        className="text-zinc-600 text-lg mt-1 shrink-0"
                    >
                        +
                    </motion.span>
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                        >
                            <Link href={`/blog/${article.slug}`} className="block pb-4 pl-9">
                                {(article.cover_url || article.image_url) && (
                                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-3 border border-zinc-800">
                                        <Image
                                            src={article.cover_url || article.image_url}
                                            alt={article.title} fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-2">{preview}</p>
                                <span className="text-xs font-bold text-[#FACC15]">Devamını Oku →</span>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────
   FLOATING IMAGE PREVIEW (desktop only)
───────────────────────────────────── */
function FloatingPreview({ article, mouseY }: { article: any | null; mouseY: number }) {
    if (!article) return null;
    const imgSrc = article.cover_url || article.image_url;
    if (!imgSrc) return null;

    return (
        <AnimatePresence>
            {article && (
                <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="fixed right-8 lg:right-16 z-50 pointer-events-none hidden sm:block"
                    style={{ top: Math.max(100, Math.min(mouseY - 120, window.innerHeight - 320)) }}
                >
                    <div className="w-[280px] lg:w-[340px] rounded-xl overflow-hidden border-[3px] border-black shadow-[8px_8px_0px_0px_#000] bg-zinc-900">
                        <div className="relative aspect-[16/10]">
                            <Image src={imgSrc} alt={article.title} fill className="object-cover" />
                        </div>
                        <div className="p-3 bg-zinc-950">
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                {article.excerpt || article.summary || strip(article.content)?.slice(0, 100) + "…"}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─────────────────────────────────────
   MAIN FEED
───────────────────────────────────── */
export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    const [hoveredArticle, setHoveredArticle] = useState<any>(null);
    const [mouseY, setMouseY] = useState(0);

    const handleHover = useCallback((article: any, y: number) => {
        setHoveredArticle(article);
        setMouseY(y);
    }, []);

    const handleLeave = useCallback(() => {
        setHoveredArticle(null);
    }, []);

    const lead = !activeCategory && sortParam === "latest" ? articles[0] : null;
    const list = !activeCategory && sortParam === "latest" ? articles.slice(1) : articles;

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <FloatingPreview article={hoveredArticle} mouseY={mouseY} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-14 sm:pb-20">

                {/* MASTHEAD */}
                <div className="mb-6 sm:mb-10">
                    <h1 className="text-5xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none text-white uppercase">
                        Makaleler
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="h-1 w-12 bg-[#FACC15] rounded-full" />
                        <p className="text-zinc-600 text-xs sm:text-sm font-medium">
                            {articles.length} yazı · Bilimin nabzı
                        </p>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="flex items-center gap-2 mb-8 sm:mb-12 overflow-x-auto scrollbar-hide pb-1">
                    <Link
                        href="/makale"
                        className={cn(
                            "shrink-0 px-3.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider border-2 transition-all",
                            !activeCategory
                                ? "bg-white text-black border-black shadow-[2px_2px_0px_0px_#000]"
                                : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                        )}
                    >
                        Hepsi
                    </Link>
                    {TOPICS.map(t => (
                        <Link
                            key={t.label}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider border-2 transition-all",
                                activeCategory === t.label
                                    ? "text-black border-black shadow-[2px_2px_0px_0px_#000]"
                                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                            )}
                            style={activeCategory === t.label ? { backgroundColor: t.color } : {}}
                        >
                            <t.icon className="w-3 h-3" />
                            {t.label}
                        </Link>
                    ))}
                </div>

                {/* COVER STORY */}
                {lead && (
                    <Link href={`/blog/${lead.slug}`} className="group block mb-10 sm:mb-14">
                        <article className="relative rounded-2xl overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200">
                            <div className="relative aspect-[21/9] sm:aspect-[2.5/1] w-full bg-zinc-900">
                                <Image
                                    src={lead.cover_url || lead.image_url || "/images/placeholder-hero.jpg"}
                                    alt={lead.title} fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[.2em] text-[#FACC15]/80">{lead.category}</span>
                                </div>
                                <h2 className="text-xl sm:text-4xl md:text-5xl font-black leading-[1] tracking-tight text-white group-hover:text-[#FACC15] transition-colors max-w-3xl mb-3">
                                    {lead.title}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {lead.author?.avatar_url && (
                                        <Image src={lead.author.avatar_url} alt="" width={24} height={24}
                                            className="rounded-full border border-zinc-600 w-6 h-6 object-cover" />
                                    )}
                                    <span className="text-zinc-300 text-[11px] font-medium">{lead.author?.full_name}</span>
                                    <span className="text-zinc-700">·</span>
                                    <span className="text-zinc-500 text-[10px]">{ago(lead.created_at)}</span>
                                </div>
                            </div>
                        </article>
                    </Link>
                )}

                {/* NEWS */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-10 sm:mb-14 rounded-lg border border-zinc-800/60 overflow-hidden">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* INTERACTIVE ARTICLE INDEX */}
                <section>
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-[.2em] text-zinc-500">
                            {activeCategory ? `${activeCategory} — Arşiv` : "İçindekiler"}
                        </h2>
                        <div className="h-px flex-1 bg-zinc-800" />
                        <span className="text-[10px] text-zinc-700 font-mono">{list.length} yazı</span>
                    </div>

                    {list.length > 0 ? (
                        <div>
                            {list.map((article, i) => (
                                <ArticleRow
                                    key={article.id}
                                    article={article}
                                    index={lead ? i + 1 : i}
                                    onHover={handleHover}
                                    onLeave={handleLeave}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl">
                            <p className="text-zinc-600 text-sm mb-2">Bu kategoride henüz yazı yok.</p>
                            <Link href="/makale" className="text-sm text-[#FACC15] hover:underline font-medium">
                                Tüm yazılara dön →
                            </Link>
                        </div>
                    )}
                </section>

                {/* CTA */}
                <div className="mt-14 sm:mt-20">
                    <GoldenTicketCTA />
                </div>
            </div>
        </main>
    );
}
