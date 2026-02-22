"use client";

import { motion } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import Link from "next/link";
import Image from "next/image";
import { Atom, Telescope, Cpu, Dna, FlaskConical, Globe, ArrowRight } from "lucide-react";
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
    { id: 'genel', label: 'Genel', icon: Globe, color: '#71717a' },
];

function timeAgo(date: string) {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr });
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    const isDefault = !activeCategory && sortParam === "latest";
    const lead = isDefault ? articles[0] : null;
    const picks = isDefault ? articles.slice(1, 4) : [];
    const grid = isDefault ? articles.slice(4) : articles;

    return (
        <main className="min-h-screen bg-[#111113] text-zinc-100">

            {/* ▬▬ MASTHEAD ▬▬ */}
            <header className="border-b border-zinc-800">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-6 sm:pb-8">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none text-white">
                                MAKALE
                            </h1>
                            <p className="text-zinc-500 text-sm sm:text-base mt-2 font-medium">Bilimin nabzı burada atıyor.</p>
                        </div>
                        <p className="hidden sm:block text-zinc-600 text-xs font-mono tracking-wider text-right">
                            {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                    </div>
                </div>
            </header>

            {/* ▬▬ TOPIC FILTER ▬▬ */}
            <div className="border-b border-zinc-800 bg-[#111113]/80 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-3 -mx-1">
                        <Link
                            href="/makale"
                            className={cn(
                                "shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors",
                                !activeCategory
                                    ? "bg-white text-black border-white"
                                    : "text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
                            )}
                        >
                            Hepsi
                        </Link>
                        {TOPICS.map(t => (
                            <Link
                                key={t.id}
                                href={`/makale?category=${t.label}`}
                                className={cn(
                                    "shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors",
                                    activeCategory === t.label
                                        ? "text-black border-transparent"
                                        : "text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
                                )}
                                style={activeCategory === t.label ? { backgroundColor: t.color, borderColor: t.color } : {}}
                            >
                                <t.icon className="w-3 h-3" />
                                {t.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-5 sm:px-8">

                {/* ▬▬ LEAD SPREAD ▬▬ */}
                {lead && (
                    <Link href={`/blog/${lead.slug}`} className="group block py-10 sm:py-14 border-b border-zinc-800/60">
                        <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                            {/* Image */}
                            <div className="relative aspect-[4/3] lg:aspect-[3/2] w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/50">
                                <Image
                                    src={lead.cover_url || lead.image_url || "/images/placeholder-hero.jpg"}
                                    alt={lead.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                    priority
                                />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col justify-center">
                                <span className="text-[11px] font-bold uppercase tracking-[.25em] text-[#FACC15] mb-3">
                                    {lead.category || "Genel"} · Editörün Seçimi
                                </span>
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-4 group-hover:text-[#FACC15] transition-colors duration-200">
                                    {lead.title}
                                </h2>
                                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed line-clamp-3 mb-5">
                                    {lead.excerpt || lead.summary || (lead.content?.replace(/<[^>]*>/g, "").slice(0, 180).trim() + "…") || ""}
                                </p>
                                <div className="flex items-center gap-3">
                                    {lead.author?.avatar_url && (
                                        <Image src={lead.author.avatar_url} alt="" width={28} height={28}
                                            className="rounded-full border border-zinc-700 w-7 h-7 object-cover" />
                                    )}
                                    <span className="text-zinc-300 text-xs font-semibold">{lead.author?.full_name}</span>
                                    <span className="text-zinc-700">·</span>
                                    <span className="text-zinc-600 text-xs">{timeAgo(lead.created_at)}</span>
                                </div>
                            </div>
                        </article>
                    </Link>
                )}

                {/* ▬▬ EDITOR'S PICKS (3-up horizontal) ▬▬ */}
                {picks.length > 0 && (
                    <section className="py-10 sm:py-14 border-b border-zinc-800/60">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-[#FF0080]" />
                            <h3 className="text-xs font-bold uppercase tracking-[.2em] text-zinc-400">Öne Çıkanlar</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {picks.map(a => (
                                <Link key={a.id} href={`/blog/${a.slug}`} className="group block">
                                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-zinc-900 mb-3 border border-zinc-800/40">
                                        <Image
                                            src={a.cover_url || a.image_url || "/images/placeholder.jpg"}
                                            alt={a.title} fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[.2em] text-zinc-600 block mb-1.5">{a.category}</span>
                                    <h4 className="text-sm sm:text-base font-bold leading-snug text-zinc-100 group-hover:text-[#FACC15] transition-colors line-clamp-2 mb-1.5">
                                        {a.title}
                                    </h4>
                                    <span className="text-[11px] text-zinc-600">{a.author?.full_name} · {timeAgo(a.created_at)}</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ▬▬ NEWS TICKER ▬▬ */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="py-4 border-b border-zinc-800/60">
                        <TrendingMarquee items={newsItems} />
                    </div>
                )}

                {/* ▬▬ ARTICLE GRID ▬▬ */}
                <section className="py-10 sm:py-14">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white" />
                            <h3 className="text-xs font-bold uppercase tracking-[.2em] text-zinc-400">
                                {activeCategory ? activeCategory : "Tüm Yazılar"}
                            </h3>
                        </div>
                        {activeCategory && (
                            <Link href="/makale" className="text-[11px] text-zinc-500 hover:text-white font-medium flex items-center gap-1 transition-colors">
                                Filtreyi Temizle <ArrowRight className="w-3 h-3" />
                            </Link>
                        )}
                    </div>

                    {grid.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {grid.map((article, i) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-30px" }}
                                    transition={{ delay: Math.min(i * 0.03, 0.25), duration: 0.35 }}
                                >
                                    <NeoArticleCard article={article} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-zinc-600 text-sm mb-3">Burada henüz bir şey yok.</p>
                            <Link href="/makale" className="text-sm text-[#FACC15] hover:underline font-medium">
                                Tüm yazılara dön →
                            </Link>
                        </div>
                    )}
                </section>

                {/* ▬▬ WRITER CTA ▬▬ */}
                <div className="pb-14 sm:pb-20">
                    <GoldenTicketCTA />
                </div>
            </div>
        </main>
    );
}
