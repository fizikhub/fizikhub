"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
import { OptimizedImage, OptimizedAvatar } from "@/components/ui/optimized-image";
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
    { label: 'Fizik', icon: Atom, accent: '#FACC15' },
    { label: 'Uzay', icon: Telescope, accent: '#FF0080' },
    { label: 'Teknoloji', icon: Cpu, accent: '#23A9FA' },
    { label: 'Biyoloji', icon: Dna, accent: '#F472B6' },
    { label: 'Kimya', icon: FlaskConical, accent: '#4ADE80' },
    { label: 'Genel', icon: Globe, accent: '#71717a' },
];

const CAT_COLOR: Record<string, string> = {
    Fizik: '#FACC15', Uzay: '#FF0080', Teknoloji: '#23A9FA',
    Biyoloji: '#F472B6', Kimya: '#4ADE80', Genel: '#71717a',
};

function ago(d: string) {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr });
}

function plain(html: string | null | undefined) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/* ═══════════════════════════════════════
   COVER CARD — featured article, massive
═══════════════════════════════════════ */
function CoverCard({ article }: { article: any }) {
    return (
        <Link href={`/blog/${article.slug}`} className="group block">
            <article className={cn(
                "relative overflow-hidden rounded-[8px]",
                "bg-card border-3 border-border shadow-neo",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover",
                "transition-all duration-200"
            )}>
                {/* Image */}
                <div className="relative aspect-[2/1] sm:aspect-[2.4/1] w-full border-b-3 border-border bg-primary">
                    <OptimizedImage
                        src={article.cover_url || article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="inline-block bg-primary border-2 border-primary-foreground text-primary-foreground px-2.5 py-0.5 sm:px-3 sm:py-1 font-black text-[10px] sm:text-xs uppercase shadow-neo-xs -rotate-2 group-hover:rotate-0 transition-transform">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* Text */}
                <div className="p-4 sm:p-6 relative">
                    {/* Noise */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                    />

                    <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-card-foreground leading-[1.05] tracking-tight mb-3 uppercase">
                        <span className="bg-gradient-to-r from-transparent to-transparent group-hover:from-primary/20 group-hover:to-primary/20 transition-all duration-300">
                            {article.title}
                        </span>
                    </h2>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 max-w-2xl mb-4">
                        {article.excerpt || article.summary || plain(article.content)?.slice(0, 180) + "…"}
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 flex-shrink-0 rounded-full border-2 border-border overflow-hidden shadow-neo-xs">
                            <OptimizedAvatar
                                src={article.author?.avatar_url || "/images/default-avatar.png"}
                                alt={article.author?.full_name || ""}
                                size={32}
                                className="w-full h-full"
                            />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wide text-foreground">
                            {article.author?.full_name || "Anonim"}
                        </span>
                        <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ago(article.created_at)}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

/* ═══════════════════════════════════════
   INDEX ROW — magazine table of contents feel
═══════════════════════════════════════ */
function IndexRow({ article, num }: { article: any; num: number }) {
    const [open, setOpen] = useState(false);
    const color = CAT_COLOR[article.category] || "#71717a";

    return (
        <div className="border-b border-border/30 last:border-b-0">
            {/* Desktop */}
            <Link href={`/blog/${article.slug}`} className="hidden sm:flex group items-center gap-4 py-4 px-2 -mx-2 rounded-lg hover:bg-muted/40 transition-colors">
                <span className="font-mono text-xs text-muted-foreground w-6 text-right tabular-nums shrink-0">
                    {String(num).padStart(2, "0")}
                </span>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <h3 className="flex-1 font-heading text-base md:text-lg font-black text-foreground leading-tight tracking-tight truncate group-hover:text-primary transition-colors uppercase">
                    {article.title}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 px-2 py-0.5 border border-border/50 rounded">
                    {article.category || "Genel"}
                </span>
                <span className="hidden lg:block text-xs text-muted-foreground font-medium w-24 text-right truncate shrink-0">
                    {article.author?.full_name}
                </span>
                <span className="hidden md:block text-[10px] text-muted-foreground/60 w-20 text-right shrink-0">
                    {ago(article.created_at)}
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
            </Link>

            {/* Mobile — tap to expand */}
            <div className="sm:hidden">
                <button onClick={() => setOpen(!open)} className="w-full text-left py-3.5 flex items-start gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground w-5 text-right mt-0.5 shrink-0 tabular-nums">
                        {String(num).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color }}>{article.category}</span>
                        </div>
                        <h3 className="font-heading text-sm font-black text-foreground leading-snug uppercase tracking-tight">
                            {article.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                            {article.author?.full_name} · {ago(article.created_at)}
                        </span>
                    </div>
                    <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-muted-foreground text-base mt-0.5 shrink-0">+</motion.span>
                </button>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                        >
                            <Link href={`/blog/${article.slug}`} className="block pb-4 pl-8">
                                {(article.cover_url || article.image_url) && (
                                    <div className="relative aspect-[16/9] w-full rounded-[6px] overflow-hidden mb-2 border-2 border-border">
                                        <Image src={article.cover_url || article.image_url} alt={article.title} fill className="object-cover" />
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-1.5">
                                    {article.excerpt || article.summary || plain(article.content)?.slice(0, 160) + "…"}
                                </p>
                                <span className="text-[11px] font-black text-primary uppercase tracking-wide">Oku →</span>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN FEED
═══════════════════════════════════════ */
export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    const isDefault = !activeCategory && sortParam === "latest";
    const cover = isDefault && articles.length > 0 ? articles[0] : null;
    const duo = isDefault ? articles.slice(1, 3) : [];
    const rest = isDefault ? articles.slice(3) : articles;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-10 sm:pb-16">

                {/* ▬ HEADER ▬ */}
                <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none uppercase mb-2">
                    Makaleler
                </h1>
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="h-1 w-10 bg-primary rounded-full" />
                    <p className="text-muted-foreground text-xs sm:text-sm">{articles.length} yazı</p>
                </div>

                {/* ▬ CATEGORY PILLS ▬ */}
                <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
                    <Link
                        href="/makale"
                        className={cn(
                            "px-3 py-1.5 rounded-[6px] text-[11px] font-black uppercase tracking-wider border-2 border-border transition-all",
                            !activeCategory
                                ? "bg-primary text-primary-foreground shadow-neo-xs"
                                : "bg-card text-muted-foreground hover:bg-muted"
                        )}
                    >
                        Tümü
                    </Link>
                    {TOPICS.map(t => (
                        <Link
                            key={t.label}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[11px] font-black uppercase tracking-wider border-2 border-border transition-all",
                                activeCategory === t.label
                                    ? "shadow-neo-xs text-primary-foreground"
                                    : "bg-card text-muted-foreground hover:bg-muted"
                            )}
                            style={activeCategory === t.label ? { backgroundColor: t.accent, borderColor: 'hsl(var(--border))' } : {}}
                        >
                            <t.icon className="w-3 h-3" />
                            {t.label}
                        </Link>
                    ))}
                </div>

                {/* ▬ COVER ▬ */}
                {cover && <div className="mb-8 sm:mb-10"><CoverCard article={cover} /></div>}

                {/* ▬ DUO ROW ▬ */}
                {duo.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10">
                        {duo.map(a => <NeoArticleCard key={a.id} article={a} />)}
                    </div>
                )}

                {/* ▬ NEWS TICKER ▬ */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-8 sm:mb-10 rounded-[6px] border-2 border-border overflow-hidden shadow-neo-xs">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* ▬ İÇİNDEKİLER / ARTICLE INDEX ▬ */}
                {rest.length > 0 && (
                    <section className="mb-10 sm:mb-14">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-5 h-1 bg-foreground rounded-full" />
                            <h2 className="text-xs font-black uppercase tracking-[.2em] text-muted-foreground">
                                {activeCategory ? `${activeCategory} Arşivi` : "İçindekiler"}
                            </h2>
                            <div className="h-px flex-1 bg-border/30" />
                        </div>

                        <div className="border-t border-border/30">
                            {rest.map((article, i) => (
                                <IndexRow
                                    key={article.id}
                                    article={article}
                                    num={cover ? i + 4 : i + 1}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty state */}
                {articles.length === 0 && (
                    <div className="py-16 text-center border-2 border-dashed border-border rounded-[8px] bg-card">
                        <p className="text-muted-foreground text-sm mb-2">Henüz içerik yok.</p>
                        <Link href="/makale" className="text-sm text-primary hover:underline font-black uppercase">Tüm yazılar →</Link>
                    </div>
                )}

                {/* ▬ CTA ▬ */}
                <div className="mt-10 sm:mt-14">
                    <GoldenTicketCTA />
                </div>
            </div>
        </main>
    );
}
