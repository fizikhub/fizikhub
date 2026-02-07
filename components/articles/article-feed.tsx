"use client";

import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Flame, Clock, Sparkles, ChevronRight } from "lucide-react";

interface ArticleFeedProps {
    articles: any[];
    categories: string[];
    activeCategory?: string;
    sortParam: string;
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam }: ArticleFeedProps) {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

                {/* Header with stagger animation */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6"
                >
                    <div className="flex items-end justify-between">
                        <div>
                            <motion.h1
                                className="text-2xl sm:text-3xl font-black tracking-tight"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                Makaleler
                            </motion.h1>
                            <motion.p
                                className="text-muted-foreground text-sm mt-0.5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {articles.length} yazı
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Sparkles className="w-5 h-5 text-[#FFC800]" />
                        </motion.div>
                    </div>
                </motion.header>

                {/* Filter tabs with slide-in */}
                <motion.nav
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="flex gap-2 mb-8 overflow-x-auto pb-3 scrollbar-hide -mx-3 px-3"
                >
                    <Tab href="/makale" active={!activeCategory && sortParam === 'latest'}>
                        <Clock className="w-3.5 h-3.5" /> Son
                    </Tab>
                    <Tab href="/makale?sort=popular" active={sortParam === 'popular'}>
                        <Flame className="w-3.5 h-3.5" /> Trend
                    </Tab>

                    <div className="w-px bg-border/50 mx-1 self-stretch" />

                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                        >
                            <Tab href={`/makale?category=${cat}`} active={activeCategory === cat}>
                                {cat}
                            </Tab>
                        </motion.div>
                    ))}
                </motion.nav>

                {/* Article list with staggered reveal */}
                {articles.length > 0 ? (
                    <div className="space-y-5">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.3 + index * 0.08,
                                    duration: 0.5,
                                    ease: [0.25, 0.1, 0.25, 1]
                                }}
                            >
                                <NeoArticleCard article={article} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center"
                    >
                        <p className="text-muted-foreground">Bu kategoride içerik yok.</p>
                        <Link href="/makale" className="text-sm font-medium mt-2 inline-block underline">
                            Tümüne dön
                        </Link>
                    </motion.div>
                )}

                {/* Writer CTA with hover effect */}
                <motion.aside
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="mt-12 group"
                >
                    <Link href="/yazar" className="block p-5 sm:p-6 rounded-2xl bg-[#FFC800] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-1">Yazarlık Programı</p>
                                <h3 className="text-lg sm:text-xl font-black text-black">Sen de yazar ol</h3>
                                <p className="text-sm text-black/70 mt-1">Bilgini paylaş, toplulukla büyü.</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </motion.aside>
            </div>
        </div>
    );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all active:scale-95 ${active
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
        >
            {children}
        </Link>
    );
}
