"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import Link from "next/link";
import Image from "next/image";
import { Clock, Atom, Telescope, Cpu, Dna, FlaskConical, Globe, ArrowRight, Sparkles, ChevronDown, Flame, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";
import { useEffect, useRef, useState } from "react";
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
    { id: 'fizik', label: 'Fizik', icon: Atom, color: '#FACC15', bg: 'bg-[#FACC15]' },
    { id: 'uzay', label: 'Uzay', icon: Telescope, color: '#FF0080', bg: 'bg-[#FF0080]' },
    { id: 'teknoloji', label: 'Teknoloji', icon: Cpu, color: '#23A9FA', bg: 'bg-[#23A9FA]' },
    { id: 'biyoloji', label: 'Biyoloji', icon: Dna, color: '#F472B6', bg: 'bg-[#F472B6]' },
    { id: 'kimya', label: 'Kimya', icon: FlaskConical, color: '#4ADE80', bg: 'bg-[#4ADE80]' },
    { id: 'genel', label: 'Genel', icon: Globe, color: '#FFFFFF', bg: 'bg-white' },
];

const PHYSICS_QUOTES = [
    { quote: "Evren yalnızca düşünülenlerden daha tuhaf değildir, düşünülebileceklerden de tuhafdır.", author: "J.B.S. Haldane" },
    { quote: "Hayal gücü bilgiden daha önemlidir.", author: "Albert Einstein" },
    { quote: "Doğa basitliği ve birliği sever.", author: "Johannes Kepler" },
    { quote: "Eğer kuantum mekaniği sizi şaşırtmadıysa, onu anlamamışsınızdır.", author: "Niels Bohr" },
    { quote: "Bilim organize edilmiş bilgidir. Bilgelik organize edilmiş yaşamdır.", author: "Immanuel Kant" },
];

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems }: ArticleFeedProps) {
    const heroArticles = articles.slice(0, 1);
    const spotlightArticles = articles.slice(1, 3);
    const editorialArticles = articles.slice(3);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroParallax = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    const randomQuote = PHYSICS_QUOTES[Math.floor(Math.random() * PHYSICS_QUOTES.length)];
    const issueNumber = new Date().getMonth() + 42;
    const issueDate = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date());

    const featured = heroArticles[0];

    return (
        <main className="min-h-screen bg-[#0a0a0a] relative selection:bg-yellow-500/30 overflow-x-hidden">
            {/* NOISE TEXTURE */}
            <div className="fixed inset-0 opacity-[0.025] pointer-events-none mix-blend-multiply z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 1: IMMERSIVE MAGAZINE COVER HERO   */}
            {/* ═══════════════════════════════════════════ */}
            {!activeCategory && sortParam === 'latest' && featured && (
                <div ref={heroRef} className="relative h-[85vh] sm:h-[90vh] overflow-hidden">
                    {/* Parallax Background Image */}
                    <motion.div
                        style={{ y: heroParallax, scale: heroScale }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src={featured.cover_url || featured.image_url || "/images/placeholder-hero.jpg"}
                            alt={featured.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#0a0a0a] z-10" />

                    {/* Magazine Issue Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="absolute top-20 sm:top-24 left-4 sm:left-8 z-20"
                    >
                        <div className="bg-[#FACC15] border-[3px] border-black px-3 py-1.5 sm:px-5 sm:py-2 shadow-[4px_4px_0px_0px_#000] -rotate-2">
                            <span className="text-black font-black text-[10px] sm:text-xs uppercase tracking-[0.3em]">
                                Sayı #{issueNumber} • {issueDate}
                            </span>
                        </div>
                    </motion.div>

                    {/* Cover Content */}
                    <motion.div
                        style={{ opacity: heroOpacity }}
                        className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-10 lg:p-16 pb-16 sm:pb-24"
                    >
                        {/* Category + Meta */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 text-[#FACC15] text-[10px] sm:text-xs font-black uppercase tracking-widest rounded">
                                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                Kapak Konusu
                            </span>
                            <span className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                {featured.category}
                            </span>
                        </motion.div>

                        {/* TITLE — Stagger reveal */}
                        <Link href={`/blog/${featured.slug}`} className="group block">
                            <motion.h1
                                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase leading-[0.9] tracking-tighter max-w-5xl mb-4 sm:mb-6 group-hover:text-[#FACC15] transition-colors duration-300"
                            >
                                {featured.title.split(' ').map((word: string, i: number) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                        className="inline-block mr-[0.3em]"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.h1>
                        </Link>

                        {/* Excerpt */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="text-white/70 text-sm sm:text-lg max-w-2xl leading-relaxed font-medium mb-6 line-clamp-2 sm:line-clamp-3"
                        >
                            {featured.excerpt || (featured.content ? featured.content.substring(0, 200).replace(/<[^>]*>?/gm, '').trim() + "..." : "")}
                        </motion.p>

                        {/* Author + CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            className="flex items-center gap-4 sm:gap-6"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white/80 overflow-hidden bg-black/50">
                                    <Image
                                        src={featured.author?.avatar_url || "/images/default-avatar.png"}
                                        alt={featured.author?.full_name || "Yazar"}
                                        width={44}
                                        height={44}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-xs sm:text-sm">{featured.author?.full_name}</span>
                                    <span className="text-white/50 text-[10px] sm:text-xs font-medium">
                                        {formatDistanceToNow(new Date(featured.created_at), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>
                            </div>

                            <Link href={`/blog/${featured.slug}`} className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-white border-[3px] border-black text-black font-black uppercase text-sm tracking-wide shadow-[4px_4px_0px_0px_#000] hover:bg-[#FACC15] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                Devamını Oku <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1"
                    >
                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em]">Keşfet</span>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <ChevronDown className="w-4 h-4 text-white/40" />
                        </motion.div>
                    </motion.div>
                </div>
            )}

            <div className="relative z-10">
                {/* ═══════════════════════════════════════════ */}
                {/* SECTION 2: HORIZONTAL TOPIC DISCOVERY      */}
                {/* ═══════════════════════════════════════════ */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="py-8 sm:py-12"
                >
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-6 sm:mb-8">
                            <div className="h-[3px] w-8 sm:w-12 bg-[#FACC15]" />
                            <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-[0.3em]">Konuları Keşfet</h2>
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>

                        {/* Horizontal Scroll Topics */}
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            {TOPICS.map((topic, i) => (
                                <Link key={topic.id} href={`/makale?category=${topic.label}`} className="snap-start flex-shrink-0 group">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08 }}
                                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                        className={cn(
                                            "relative w-[130px] sm:w-[160px] h-[160px] sm:h-[200px] rounded-2xl border-[3px] border-black overflow-hidden transition-all",
                                            "shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]",
                                            activeCategory === topic.label
                                                ? "bg-[#FACC15] border-[#FACC15]"
                                                : "bg-[#18181b] hover:bg-[#202023]"
                                        )}
                                    >
                                        {/* Icon */}
                                        <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4 p-4">
                                            <div className={cn(
                                                "w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-[2.5px] border-black flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6",
                                                activeCategory === topic.label ? "bg-black" : topic.bg
                                            )}>
                                                <topic.icon className={cn(
                                                    "w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5px]",
                                                    activeCategory === topic.label ? "text-[#FACC15]" : "text-black"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "font-black uppercase tracking-wider text-sm sm:text-base text-center",
                                                activeCategory === topic.label ? "text-black" : "text-zinc-400 group-hover:text-white"
                                            )}>
                                                {topic.label}
                                            </span>

                                            {/* Article count */}
                                            <span className={cn(
                                                "text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                                                activeCategory === topic.label ? "text-black/60" : "text-zinc-600"
                                            )}>
                                                {articles.filter(a => a.category === topic.label).length} yazı
                                            </span>
                                        </div>

                                        {/* Active indicator */}
                                        {activeCategory === topic.label && (
                                            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black" />
                                        )}
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════════════════════════════════════ */}
                {/* DIAGONAL DIVIDER                           */}
                {/* ═══════════════════════════════════════════ */}
                <div className="relative h-6 sm:h-10 overflow-hidden">
                    <div className="absolute inset-0 flex">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-6 sm:w-10 h-full bg-[#FACC15] transform -skew-x-12 mr-1" style={{ opacity: i % 2 === 0 ? 0.15 : 0.05 }} />
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════ */}
                {/* SECTION 3: TRENDING NEWS TICKER            */}
                {/* ═══════════════════════════════════════════ */}
                {!activeCategory && newsItems.length > 0 && (
                    <div className="py-6 sm:py-8">
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                            <TrendingMarquee items={newsItems} />
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* SECTION 4: SPOTLIGHT DUO (2 articles)       */}
                {/* ═══════════════════════════════════════════ */}
                {!activeCategory && sortParam === 'latest' && spotlightArticles.length >= 2 && (
                    <section className="py-8 sm:py-12">
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                            <div className="flex items-center gap-4 mb-6 sm:mb-8">
                                <div className="h-[3px] w-8 sm:w-12 bg-[#FF0080]" />
                                <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-[0.3em]">
                                    <Flame className="w-4 h-4 inline-block text-[#FF0080] mr-2 -mt-0.5" />
                                    Öne Çıkanlar
                                </h2>
                                <div className="h-px flex-1 bg-zinc-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                {spotlightArticles.map((article, i) => (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.15 }}
                                    >
                                        <Link href={`/blog/${article.slug}`} className="group block">
                                            <article className={cn(
                                                "relative h-[300px] sm:h-[380px] rounded-2xl overflow-hidden border-[3px] border-black",
                                                "shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]",
                                                "hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
                                            )}>
                                                <Image
                                                    src={article.cover_url || article.image_url || "/images/placeholder.jpg"}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                                {/* Badge */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className={cn(
                                                        "px-3 py-1 border-2 border-black text-black text-[10px] sm:text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] -rotate-1",
                                                        i === 0 ? "bg-[#FF0080]" : "bg-[#23A9FA]"
                                                    )}>
                                                        {article.category}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-10">
                                                    <h3 className="text-xl sm:text-3xl font-black text-white uppercase leading-[0.95] tracking-tight mb-3 group-hover:text-[#FACC15] transition-colors">
                                                        {article.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full border-2 border-white/60 overflow-hidden bg-black/40">
                                                            <Image
                                                                src={article.author?.avatar_url || "/images/default-avatar.png"}
                                                                alt={article.author?.full_name || "Yazar"}
                                                                width={28}
                                                                height={28}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <span className="text-white/70 text-xs font-bold">{article.author?.full_name}</span>
                                                        <span className="text-white/30 text-[10px]">•</span>
                                                        <span className="text-white/50 text-[10px] font-medium">
                                                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* SECTION 5: PHYSICS QUOTE BLOCK              */}
                {/* ═══════════════════════════════════════════ */}
                {!activeCategory && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="py-10 sm:py-16"
                    >
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                            <div className="relative border-l-[4px] sm:border-l-[6px] border-[#FACC15] pl-6 sm:pl-10 py-4">
                                <div className="absolute -left-[14px] sm:-left-[18px] top-4 w-6 h-6 sm:w-8 sm:h-8 bg-[#FACC15] border-[2px] sm:border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                    <span className="text-black text-xs sm:text-sm font-black">"</span>
                                </div>
                                <blockquote className="text-xl sm:text-3xl md:text-4xl font-black text-white/90 leading-tight tracking-tight italic max-w-3xl">
                                    {randomQuote.quote}
                                </blockquote>
                                <p className="mt-3 sm:mt-4 text-zinc-500 font-bold text-xs sm:text-sm uppercase tracking-[0.2em]">
                                    — {randomQuote.author}
                                </p>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* SECTION 6: EDITORIAL GRID                   */}
                {/* ═══════════════════════════════════════════ */}
                <section className="py-8 sm:py-12 pb-12 sm:pb-20">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-4 mb-6 sm:mb-8">
                            <div className="h-[3px] w-8 sm:w-12 bg-white" />
                            <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-[0.3em]">
                                <BookOpen className="w-4 h-4 inline-block text-zinc-500 mr-2 -mt-0.5" />
                                {activeCategory ? `${activeCategory} Arşivi` : "Tüm Yazılar"}
                            </h2>
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>

                        {(activeCategory || sortParam !== 'latest' ? articles : editorialArticles).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                                {(activeCategory || sortParam !== 'latest' ? articles : editorialArticles).map((article, index) => (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: Math.min(index * 0.05, 0.4) }}
                                        className={cn(
                                            "col-span-1",
                                            // Every 7th article gets a spotlight 2-col span on desktop
                                            index % 7 === 0 && index !== 0 ? "md:col-span-2 lg:col-span-2" : ""
                                        )}
                                    >
                                        <NeoArticleCard article={article} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-16 sm:py-24 text-center bg-[#18181b] border-[3px] border-dashed border-zinc-700 rounded-3xl"
                            >
                                <p className="text-zinc-400 font-bold text-lg mb-4">Bu sayıda içerik bulunamadı.</p>
                                <Link href="/makale">
                                    <button className="px-6 py-3 bg-white text-black font-black uppercase tracking-wide rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                        Kapağa Dön
                                    </button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* SECTION 7: WRITER CTA                       */}
                {/* ═══════════════════════════════════════════ */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
                    <GoldenTicketCTA />
                </div>
            </div>
        </main>
    );
}
