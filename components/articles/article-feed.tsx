"use client";

import { motion } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
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
    { id: 'fizik', label: 'Fizik', icon: Atom, color: '#FACC15' },
    { id: 'uzay', label: 'Uzay', icon: Telescope, color: '#FF0080' },
    { id: 'teknoloji', label: 'Teknoloji', icon: Cpu, color: '#23A9FA' },
    { id: 'biyoloji', label: 'Biyoloji', icon: Dna, color: '#F472B6' },
    { id: 'kimya', label: 'Kimya', icon: FlaskConical, color: '#4ADE80' },
    { id: 'genel', label: 'Genel', icon: Globe, color: '#a1a1aa' },
];

function ago(d: string) {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr });
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    const home = !activeCategory && sortParam === "latest";
    const lead = home ? articles[0] : null;
    const side = home ? articles.slice(1, 3) : [];
    const rest = home ? articles.slice(3) : articles;

    return (
        <main className="min-h-screen bg-[#27272a] selection:bg-yellow-400/30">
            {/* noise */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />

            <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10">

                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-3">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase">
                            Makaleler
                        </h1>
                        <div className="hidden sm:block bg-[#FACC15] border-[3px] border-black px-3 py-1 shadow-[3px_3px_0px_0px_#000] -rotate-3">
                            <span className="text-black font-black text-[10px] uppercase tracking-widest">
                                {articles.length} yazı
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── CATEGORY PILLS ── */}
                <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-12">
                    <Link
                        href="/makale"
                        className={cn(
                            "px-4 py-2 text-[11px] font-black uppercase tracking-wider border-[2.5px] border-black rounded-lg transition-all",
                            !activeCategory
                                ? "bg-white text-black shadow-[3px_3px_0px_0px_#000]"
                                : "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        )}
                    >
                        Tümü
                    </Link>
                    {TOPICS.map(t => (
                        <Link
                            key={t.id}
                            href={`/makale?category=${t.label}`}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-wider border-[2.5px] border-black rounded-lg transition-all",
                                activeCategory === t.label
                                    ? "text-black shadow-[3px_3px_0px_0px_#000]"
                                    : "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            )}
                            style={activeCategory === t.label ? { backgroundColor: t.color } : {}}
                        >
                            <t.icon className="w-3.5 h-3.5" />
                            {t.label}
                        </Link>
                    ))}
                </div>

                {/* ── FEATURED BENTO ── */}
                {lead && (
                    <section className="mb-10 sm:mb-14">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                            {/* LEAD — big card */}
                            <Link href={`/blog/${lead.slug}`} className="lg:col-span-8 group block">
                                <article className="relative h-[340px] sm:h-[420px] lg:h-full lg:min-h-[480px] w-full rounded-2xl overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 bg-zinc-900">
                                    <Image
                                        src={lead.cover_url || lead.image_url || "/images/placeholder-hero.jpg"}
                                        alt={lead.title} fill priority
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FACC15] border-[2.5px] border-black text-black text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] -rotate-2 group-hover:rotate-0 transition-transform">
                                            <Sparkles className="w-3 h-3" /> Kapak
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10">
                                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[.2em] text-[#FACC15]/80 block mb-2">{lead.category}</span>
                                        <h2 className="text-2xl sm:text-4xl font-black text-white leading-[1] tracking-tight mb-3 group-hover:text-[#FACC15] transition-colors">
                                            {lead.title}
                                        </h2>
                                        <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 max-w-lg mb-3 leading-relaxed">
                                            {lead.excerpt || lead.summary || (lead.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "…") || ""}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {lead.author?.avatar_url && (
                                                <Image src={lead.author.avatar_url} alt="" width={24} height={24}
                                                    className="rounded-full border border-zinc-600 w-6 h-6 object-cover" />
                                            )}
                                            <span className="text-zinc-300 text-[11px] font-semibold">{lead.author?.full_name}</span>
                                            <span className="text-zinc-700 text-[10px]">·</span>
                                            <span className="text-zinc-500 text-[10px]">{ago(lead.created_at)}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>

                            {/* SIDE — 2 stacked cards */}
                            <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5">
                                {side.map((a, i) => (
                                    <Link key={a.id} href={`/blog/${a.slug}`} className="group block flex-1">
                                        <article className="relative h-full min-h-[200px] sm:min-h-[230px] rounded-2xl overflow-hidden border-[3px] border-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 bg-zinc-900">
                                            <Image
                                                src={a.cover_url || a.image_url || "/images/placeholder.jpg"}
                                                alt={a.title} fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/55 group-hover:bg-black/65 transition-colors" />

                                            <div className="absolute top-3 left-3 z-10">
                                                <span className={cn(
                                                    "px-2.5 py-1 border-[2px] border-black text-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#000]",
                                                    i === 0 ? "bg-[#FF0080]" : "bg-[#23A9FA]"
                                                )}>{a.category}</span>
                                            </div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                                                <h3 className="text-base sm:text-xl font-black text-white leading-tight tracking-tight mb-2 group-hover:text-[#FACC15] transition-colors line-clamp-2">
                                                    {a.title}
                                                </h3>
                                                <span className="text-zinc-400 text-[10px] font-medium">{a.author?.full_name} · {ago(a.created_at)}</span>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── NEWS TICKER ── */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="mb-10 sm:mb-14">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* ── ARTICLE GRID ── */}
                <section>
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <div className="w-6 h-1.5 bg-white rounded-full" />
                        <h3 className="text-sm font-black uppercase tracking-[.15em] text-zinc-300">
                            {activeCategory ? `${activeCategory} Arşivi` : "Tüm Yazılar"}
                        </h3>
                        <div className="h-px flex-1 bg-zinc-700/50" />
                        {activeCategory && (
                            <Link href="/makale" className="text-[10px] text-zinc-500 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                                Temizle <ArrowRight className="w-3 h-3" />
                            </Link>
                        )}
                    </div>

                    {rest.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {rest.map((article, i) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-30px" }}
                                    transition={{ delay: Math.min(i * 0.04, 0.25), duration: 0.3 }}
                                    className={cn(
                                        "col-span-1",
                                        i % 7 === 0 && i !== 0 ? "lg:col-span-2" : ""
                                    )}
                                >
                                    <NeoArticleCard article={article} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-[#202023] border-[3px] border-dashed border-zinc-700 rounded-2xl">
                            <p className="text-zinc-400 font-bold mb-3">Henüz içerik yok.</p>
                            <Link href="/makale">
                                <button className="px-5 py-2.5 bg-white text-black font-black uppercase text-xs tracking-wide border-[2.5px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all">
                                    Tümünü Gör
                                </button>
                            </Link>
                        </div>
                    )}
                </section>

                {/* ── CTA ── */}
                <div className="mt-12 sm:mt-16">
                    <GoldenTicketCTA />
                </div>
            </div>
        </main>
    );
}
