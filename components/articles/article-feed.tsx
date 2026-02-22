"use client";

import { motion } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
import { useRef } from "react";
import { type ScienceNewsItem } from "@/lib/rss";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useScroll, useTransform } from "framer-motion";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
}

const TOPICS = [
    { id: 'fizik', label: 'Fizik', icon: Atom, color: '#FACC15' },
    { id: 'uzay', label: 'Uzay', icon: Telescope, color: '#FF0080' },
    { id: 'teknoloji', label: 'Teknoloji', icon: Cpu, color: '#23A9FA' },
    { id: 'biyoloji', label: 'Biyoloji', icon: Dna, color: '#F472B6' },
    { id: 'kimya', label: 'Kimya', icon: FlaskConical, color: '#4ADE80' },
    { id: 'genel', label: 'Genel', icon: Globe, color: '#a1a1aa' },
];

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    const lead = articles[0];
    const secondary = articles.slice(1, 4);
    const rest = articles.slice(4);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

    const showHero = !activeCategory && sortParam === "latest" && lead;

    return (
        <main className="min-h-screen bg-zinc-950">

            {/* ── COVER ── */}
            {showHero && (
                <section ref={heroRef} className="relative h-[92vh] sm:h-screen overflow-hidden">
                    {/* bg image with parallax */}
                    <motion.div style={{ y: imgY }} className="absolute inset-0 -top-[10%] bottom-0 z-0">
                        <Image
                            src={lead.cover_url || lead.image_url || "/images/placeholder-hero.jpg"}
                            alt={lead.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* gradient overlay */}
                    <div className="absolute inset-0 z-[1]"
                        style={{ background: "linear-gradient(to top, #09090b 0%, rgba(9,9,11,.7) 40%, rgba(9,9,11,.25) 100%)" }}
                    />

                    {/* content pinned bottom */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-10 lg:p-14 pb-10 sm:pb-14">
                        <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[.25em] text-[#FACC15] mb-3 sm:mb-4 opacity-80">
                            {lead.category || "Genel"}
                        </span>

                        <Link href={`/blog/${lead.slug}`} className="group block">
                            <h1 className="text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[.95] tracking-tight max-w-4xl mb-4 sm:mb-5 group-hover:text-[#FACC15] transition-colors duration-200">
                                {lead.title}
                            </h1>
                        </Link>

                        <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed line-clamp-2 mb-5 sm:mb-6">
                            {lead.excerpt || lead.summary || (lead.content ? lead.content.replace(/<[^>]*>/g, "").slice(0, 160).trim() + "…" : "")}
                        </p>

                        <div className="flex items-center gap-3">
                            {lead.author?.avatar_url && (
                                <Image
                                    src={lead.author.avatar_url}
                                    alt={lead.author.full_name || ""}
                                    width={32} height={32}
                                    className="rounded-full border border-white/20 object-cover w-8 h-8"
                                />
                            )}
                            <span className="text-zinc-300 text-xs sm:text-sm font-medium">{lead.author?.full_name}</span>
                            <span className="text-zinc-600 text-xs">·</span>
                            <span className="text-zinc-500 text-xs">
                                {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: tr })}
                            </span>
                        </div>
                    </div>
                </section>
            )}

            {/* ── TOPICS ── */}
            <nav className="border-b border-zinc-800/80 sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto flex items-center gap-1 px-4 overflow-x-auto scrollbar-hide py-3">
                    <Link
                        href="/makale"
                        className={cn(
                            "flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors",
                            !activeCategory ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        Tümü
                    </Link>
                    {TOPICS.map(t => (
                        <Link
                            key={t.id}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors",
                                activeCategory === t.label
                                    ? "text-black"
                                    : "text-zinc-500 hover:text-white"
                            )}
                            style={activeCategory === t.label ? { backgroundColor: t.color } : {}}
                        >
                            <t.icon className="w-3.5 h-3.5" />
                            {t.label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* ── SECONDARY STORIES (3-up) ── */}
            {showHero && secondary.length > 0 && (
                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                        {secondary.map((a, i) => (
                            <Link key={a.id} href={`/blog/${a.slug}`} className="group block">
                                <article className="flex flex-col gap-3">
                                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-zinc-900">
                                        <Image
                                            src={a.cover_url || a.image_url || "/images/placeholder.jpg"}
                                            alt={a.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[.2em] text-zinc-500">{a.category}</span>
                                    <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug group-hover:text-[#FACC15] transition-colors line-clamp-2">
                                        {a.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                                        <span className="font-medium text-zinc-400">{a.author?.full_name}</span>
                                        <span>·</span>
                                        <span>{formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: tr })}</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── NEWS TICKER ── */}
            {!activeCategory && newsItems.length > 0 && (
                <div className="border-y border-zinc-800/60 py-3">
                    <TrendingMarquee items={newsItems} />
                </div>
            )}

            {/* ── EDITORIAL GRID ── */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                {/* Section title */}
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                    <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
                        {activeCategory || "Son Yazılar"}
                    </h2>
                    {activeCategory && (
                        <Link href="/makale" className="text-xs font-medium text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                            Tümünü Gör <ArrowRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>

                {(activeCategory || sortParam !== "latest" ? articles : rest).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {(activeCategory || sortParam !== "latest" ? articles : rest).map((article, i) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.4 }}
                            >
                                <NeoArticleCard article={article} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-zinc-500 mb-4">Bu kategoride henüz yazı yok.</p>
                        <Link href="/makale" className="text-sm font-medium text-[#FACC15] hover:underline">
                            Tüm yazılara dön
                        </Link>
                    </div>
                )}
            </section>

            {/* ── WRITER CTA ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
                <GoldenTicketCTA />
            </div>
        </main>
    );
}
