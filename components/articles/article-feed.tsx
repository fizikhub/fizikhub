"use client";

import { motion } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { NeoMagazineHero } from "@/components/articles/neo-magazine-hero";
import Link from "next/link";
import { Clock, Atom, Telescope, Cpu, Dna, FlaskConical, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { GoldenTicketCTA } from "@/components/ui/golden-ticket-cta";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
} as const;

const TOPICS = [
    { id: 'fizik', label: 'Fizik', icon: Atom, color: 'bg-[#FACC15]' },      // Yellow
    { id: 'uzay', label: 'Uzay', icon: Telescope, color: 'bg-[#FF0080]' },   // Pink
    { id: 'teknoloji', label: 'Teknoloji', icon: Cpu, color: 'bg-[#23A9FA]' }, // Blue
    { id: 'biyoloji', label: 'Biyoloji', icon: Dna, color: 'bg-[#F472B6]' },    // Light Pink
    { id: 'kimya', label: 'Kimya', icon: FlaskConical, color: 'bg-[#4ADE80]' }, // Green
    { id: 'genel', label: 'Genel', icon: Globe, color: 'bg-white' },          // White
];

export function ArticleFeed({ articles, categories, activeCategory, sortParam }: ArticleFeedProps) {
    // Split articles for Magazine Layout
    const heroArticles = articles.slice(0, 3);
    const gridArticles = articles.slice(3);

    return (
        <main className="min-h-screen bg-[#27272a] relative selection:bg-yellow-500/30 overflow-x-hidden">
            {/* NOISE TEXTURE */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">

                {/* 1. MAGAZINE HERO (Cover Story) */}
                {!activeCategory && sortParam === 'latest' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="mb-10 flex items-center justify-between">
                            <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_#000]">
                                MAKALELER
                            </h1>
                            <div className="hidden md:block w-32 h-1 bg-white/20 rounded-full" />
                            <p className="hidden md:block text-zinc-400 font-bold text-right text-sm tracking-widest uppercase">
                                Sayı #42 • 2026
                            </p>
                        </div>

                        <NeoMagazineHero articles={heroArticles} />

                        {/* NEW: TRENDING MARQUEE */}
                        <div className="my-12">
                            <TrendingMarquee />
                        </div>
                    </motion.div>
                )}

                {/* 2. TOPIC CLUSTERS (Discovery) */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-20"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-zinc-800" />
                        <h2 className="text-xl font-black text-zinc-500 uppercase tracking-[0.2em]">Konuları Keşfet</h2>
                        <div className="h-px flex-1 bg-zinc-800" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {TOPICS.map((topic, i) => (
                            <Link key={topic.id} href={`/makale?category=${topic.label}`} className="group block">
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className={cn(
                                        "relative h-36 rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col items-center justify-center gap-3 overflow-hidden",
                                        activeCategory === topic.label ? "bg-white" : "bg-[#202023] group-hover:bg-[#2a2a2d]"
                                    )}
                                >
                                    {/* Icon Circle */}
                                    <div className={cn(
                                        "w-12 h-12 rounded-full border-[2.5px] border-black flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-12",
                                        topic.color
                                    )}>
                                        <topic.icon className="w-6 h-6 text-black stroke-[2.5px]" />
                                    </div>

                                    <span className={cn(
                                        "font-black uppercase tracking-wide text-sm transition-colors",
                                        activeCategory === topic.label ? "text-black" : "text-zinc-400 group-hover:text-white"
                                    )}>
                                        {topic.label}
                                    </span>

                                    {/* Active Indicator */}
                                    {activeCategory === topic.label && (
                                        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#FACC15]" />
                                    )}
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.section>

                {/* 3. EDITORIAL GRID (Mixed Layout) */}
                <div className="flex items-center gap-4 mb-8">
                    <Clock className="w-6 h-6 text-[#FACC15]" />
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                        {activeCategory ? `${activeCategory} Arşivi` : "En Yeniler / Akış"}
                    </h2>
                </div>

                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {(activeCategory || sortParam !== 'latest' ? articles : gridArticles).map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                // Make every 4th item span 2 columns if on large screen (Pseudo-magazine layout)
                                className={cn(
                                    "col-span-1",
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
                        className="py-24 text-center bg-[#202023] border-[3px] border-dashed border-zinc-700 rounded-3xl"
                    >
                        <p className="text-zinc-400 font-bold text-lg mb-4">Bu sayıda içerik bulunamadı.</p>
                        <Link href="/makale">
                            <button className="px-6 py-3 bg-white text-black font-black uppercase tracking-wide rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                Kapağa Dön
                            </button>
                        </Link>
                    </motion.div>
                )}

                {/* 4. GOLDEN TICKET WRITER CTA */}
                <GoldenTicketCTA />

            </div>
        </main>
    );
}
