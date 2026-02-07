"use client";

import { motion } from "framer-motion";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import Link from "next/link";
import { Flame, Clock, PenTool, ArrowRight } from "lucide-react";

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
};

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
};

const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
};

const pillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 200, damping: 20 },
    },
};

export function ArticleFeed({ articles, categories, activeCategory, sortParam }: ArticleFeedProps) {
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

                {/* Animated Header */}
                <motion.header
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-6"
                >
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Makaleler
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {articles.length} bilimsel yazı
                    </p>
                </motion.header>

                {/* Filter Pills with staggered animation */}
                <motion.nav
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-2 mb-8 overflow-x-auto pb-3 scrollbar-hide -mx-3 px-3"
                >
                    <motion.div variants={pillVariants}>
                        <FilterPill href="/makale" active={!activeCategory && sortParam === 'latest'}>
                            <Clock className="w-3.5 h-3.5" /> Son
                        </FilterPill>
                    </motion.div>
                    <motion.div variants={pillVariants}>
                        <FilterPill href="/makale?sort=popular" active={sortParam === 'popular'}>
                            <Flame className="w-3.5 h-3.5" /> Trend
                        </FilterPill>
                    </motion.div>

                    {categories.length > 0 && (
                        <motion.div variants={pillVariants} className="flex items-center">
                            <div className="w-px h-5 bg-border mx-1" />
                        </motion.div>
                    )}

                    {categories.map((cat) => (
                        <motion.div key={cat} variants={pillVariants}>
                            <FilterPill href={`/makale?category=${cat}`} active={activeCategory === cat}>
                                {cat}
                            </FilterPill>
                        </motion.div>
                    ))}
                </motion.nav>

                {/* Article Grid with staggered reveal */}
                {articles.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-5"
                    >
                        {articles.map((article) => (
                            <motion.div
                                key={article.id}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <NeoArticleCard article={article} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-24 text-center"
                    >
                        <p className="text-muted-foreground">Bu kategoride içerik yok.</p>
                        <Link href="/makale" className="text-sm font-medium mt-3 inline-block text-primary hover:underline">
                            Tümüne dön →
                        </Link>
                    </motion.div>
                )}

                {/* Writer CTA with entrance animation */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 80 }}
                    className="mt-16"
                >
                    <Link
                        href="/yazar"
                        className="group block p-6 rounded-2xl bg-[#FFC800] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-black/60 text-xs font-bold uppercase tracking-widest mb-2">
                                    <PenTool className="w-4 h-4" />
                                    Yazarlık Programı
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-black">
                                    Sen de yazar ol
                                </h3>
                                <p className="text-sm text-black/70 mt-1">
                                    Araştırmalarını binlerce okuyucuyla paylaş.
                                </p>
                            </div>
                            <div className="hidden sm:flex w-12 h-12 rounded-full bg-black items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-5 h-5 text-[#FFC800] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}

function FilterPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all active:scale-95 ${active
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
        >
            {children}
        </Link>
    );
}
