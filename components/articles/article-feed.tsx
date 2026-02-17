"use client";

import { motion } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import Link from "next/link";
import { Flame, Clock, PenTool, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function ArticleFeed({ articles, categories, activeCategory, sortParam }: ArticleFeedProps) {
    return (
        <main className="min-h-screen bg-[#27272a] relative selection:bg-yellow-500/30">
            {/* NOISE TEXTURE */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">

                {/* VIVID HEADER */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-8 flex items-start gap-4 md:gap-6"
                >
                    <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-[#FACC15] border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000] rotate-[-3deg]">
                        <Clock className="w-8 h-8 text-black stroke-[2.5px]" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="sm:hidden flex items-center justify-center w-10 h-10 bg-[#FACC15] border-[3px] border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                                <Clock className="w-5 h-5 text-black stroke-[2.5px]" />
                            </span>
                            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">
                                Makaleler
                            </h1>
                        </div>
                        <p className="text-zinc-400 font-bold text-lg max-w-lg leading-relaxed">
                            Bilim, teknoloji ve fizik dünyasından en güncel ve derinlemesine içerikler.
                        </p>
                    </div>
                </motion.header>

                {/* VIVID FILTER BAR */}
                <motion.nav
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-wrap gap-2 mb-10"
                >
                    <motion.div variants={itemVariants}>
                        <VividFilterPill
                            href="/makale"
                            active={!activeCategory && sortParam === 'latest'}
                            color="bg-[#FACC15]" // Yellow
                        >
                            <Clock className="w-3.5 h-3.5" /> Son Eklenenler
                        </VividFilterPill>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <VividFilterPill
                            href="/makale?sort=popular"
                            active={sortParam === 'popular'}
                            color="bg-[#FF0080]" // Pink
                        >
                            <Flame className="w-3.5 h-3.5" /> Trend
                        </VividFilterPill>
                    </motion.div>

                    {categories.length > 0 && (
                        <div className="w-px h-8 bg-zinc-700 mx-1 self-center hidden sm:block" />
                    )}

                    {categories.map((cat, i) => (
                        <motion.div key={cat} variants={itemVariants}>
                            <VividFilterPill
                                href={`/makale?category=${cat}`}
                                active={activeCategory === cat}
                                color={i % 2 === 0 ? "bg-[#23A9FA]" : "bg-[#16A34A]"} // Blue / Green
                            >
                                {cat}
                            </VividFilterPill>
                        </motion.div>
                    ))}
                </motion.nav>

                {/* ARTICLE GRID */}
                {articles.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-6"
                    >
                        {articles.map((article) => (
                            <motion.div
                                key={article.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <NeoArticleCard article={article} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-24 text-center bg-[#202023] border-[3px] border-dashed border-zinc-700 rounded-2xl"
                    >
                        <p className="text-zinc-400 font-bold text-lg mb-4">Bu kategoride henüz içerik yok.</p>
                        <Link href="/makale">
                            <button className="px-6 py-3 bg-white text-black font-black uppercase tracking-wide rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                Tümüne Dön
                            </button>
                        </Link>
                    </motion.div>
                )}

                {/* WRITER CTA (Refined) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
                    className="mt-20 mb-10"
                >
                    <Link
                        href="/yazar"
                        className="group block relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-[#FFC800] to-[#FFD54F] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 transform"
                    >
                        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="text-center sm:text-left">
                                <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full border border-black/10 text-black/80 text-xs font-black uppercase tracking-widest mb-3">
                                    <PenTool className="w-3.5 h-3.5" />
                                    Yazarlık Programı
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-black leading-none mb-2">
                                    SEN DE YAZAR OL.
                                </h3>
                                <p className="text-base sm:text-lg text-black/80 font-bold max-w-sm">
                                    Araştırmalarını binlerce okuyucuyla paylaş, topluluğa yön ver.
                                </p>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-black flex items-center justify-center group-hover:scale-110 group-hover:rotate-[-10deg] transition-all duration-300 border-[3px] border-white shadow-xl">
                                <ArrowRight className="w-8 h-8 text-[#FFC800]" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}

function VividFilterPill({ href, active, children, color }: { href: string; active: boolean; children: React.ReactNode, color: string }) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide rounded-xl border-2 transition-all active:scale-95 select-none",
                active
                    ? cn("border-black text-black shadow-[4px_4px_0px_0px_#000] -translate-y-1", color)
                    : "bg-[#18181b] border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white hover:bg-[#202023]"
            )}
        >
            {children}
        </Link>
    );
}
