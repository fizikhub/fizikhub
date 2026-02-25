"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, Clock, Flame, Eye, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TOPICS = [
    { label: 'Fizik', icon: Atom },
    { label: 'Uzay', icon: Telescope },
    { label: 'Teknoloji', icon: Cpu },
    { label: 'Biyoloji', icon: Dna },
    { label: 'Kimya', icon: FlaskConical },
    { label: 'Genel', icon: Globe },
];

const SORT_OPTS = [
    { value: 'latest', label: 'En Yeni', icon: Clock },
    { value: 'popular', label: 'Popüler', icon: Flame },
];

function ago(d: string) {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr });
}

function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    return (
        <div className="min-h-screen pt-20 sm:pt-28 pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* ── HEADER ── */}
                <motion.header
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                                Makaleler
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1.5">
                                Bilim, teknoloji ve evrenin sınırlarında {articles.length} makale.
                            </p>
                        </div>

                        {/* Sort Toggle */}
                        <div className="flex items-center p-1 bg-foreground/5 border border-border/40 rounded-full w-fit">
                            {SORT_OPTS.map(s => (
                                <Link
                                    key={s.value}
                                    href={`/makale?sort=${s.value}${activeCategory ? `&category=${activeCategory}` : ''}`}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                                        sortParam === s.value
                                            ? "bg-primary/20 text-primary border border-primary/40"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <s.icon className="w-3.5 h-3.5" />
                                    {s.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.header>

                {/* ── CATEGORY PILLS ── */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                    <Link
                        href="/makale"
                        className={cn(
                            "snap-start flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                            !activeCategory
                                ? "bg-primary/15 text-primary border border-primary/40"
                                : "bg-foreground/5 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-foreground/10"
                        )}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        Hepsi
                    </Link>

                    {TOPICS.map((t) => (
                        <Link
                            key={t.label}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "snap-start flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                                activeCategory === t.label
                                    ? "bg-primary/15 text-primary border border-primary/40"
                                    : "bg-foreground/5 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-foreground/10"
                            )}
                        >
                            <t.icon className="w-3.5 h-3.5" />
                            {t.label}
                        </Link>
                    ))}
                </div>

                {/* ── NEWS TICKER ── */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-8">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* ── ARTICLE LIST ── */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary rounded-full" />
                            <h2 className="text-lg font-bold text-foreground">Tüm Yazılar</h2>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                            {articles.length} sonuç
                        </span>
                    </div>

                    {articles.length > 0 ? (
                        <div className="flex flex-col rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                            {articles.map((article, i) => (
                                <Link
                                    key={article.id}
                                    href={`/blog/${article.slug}`}
                                    className="group flex gap-4 p-4 md:p-5 border-b border-border/30 last:border-0 hover:bg-foreground/[0.02] transition-colors"
                                >
                                    {/* Cover Thumbnail */}
                                    {(article.cover_url || article.image_url) && (
                                        <div className="relative w-20 h-20 md:w-28 md:h-20 rounded-lg overflow-hidden shrink-0 border border-border/30 bg-muted/20">
                                            <Image
                                                src={article.cover_url || article.image_url}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        {/* Meta */}
                                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground/70 mb-1">
                                            {article.category && (
                                                <>
                                                    <span className="text-amber-500/80 font-medium">{article.category}</span>
                                                    <span>•</span>
                                                </>
                                            )}
                                            <span>{ago(article.created_at)}</span>
                                            {article.author?.full_name && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-medium text-foreground/60">{article.author.full_name}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-1">
                                            {article.title}
                                        </h3>

                                        {/* Excerpt */}
                                        {(article.summary || article.excerpt) && (
                                            <p className="hidden md:block text-xs text-muted-foreground line-clamp-1 mt-0.5 leading-relaxed">
                                                {article.summary || article.excerpt}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center gap-3 mt-1.5">
                                            {article.views !== undefined && (
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                                                    <Eye className="w-3 h-3" />
                                                    <span>{article.views}</span>
                                                </div>
                                            )}
                                            {article.likes_count !== undefined && article.likes_count > 0 && (
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                                                    <span>♥</span>
                                                    <span>{article.likes_count}</span>
                                                </div>
                                            )}
                                            {article.content && (
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{calculateReadingTime(article.content)}dk</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="hidden sm:flex items-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/40 pr-1">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border/40 bg-card/30">
                            <Cpu className="w-10 h-10 mb-3 text-muted-foreground/20" />
                            <h3 className="text-lg font-bold text-foreground mb-1">Sonuç bulunamadı</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">Bu filtrede hiçbir makale bulunamadı.</p>
                            <Link
                                href="/makale"
                                className="mt-5 px-5 py-2 rounded-full bg-primary/15 text-primary text-sm font-semibold border border-primary/30 hover:bg-primary/25 transition-colors"
                            >
                                Tümünü Göster
                            </Link>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
