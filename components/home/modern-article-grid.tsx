"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Article {
    id: number | string;
    title: string;
    slug: string;
    summary: string | null;
    content: string;
    created_at: string;
    image_url: string | null;
    views?: number;
    category?: string;
    author?: {
        full_name: string | null;
        username: string | null;
        avatar_url: string | null;
    }[] | null;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

export function ModernArticleGrid({ articles }: { articles: Article[] }) {
    if (!articles.length) {
        return (
            <section className="py-20 md:py-28">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                        Son Yazılar
                    </h2>
                    <p className="text-white/50 text-lg mb-8">
                        Henüz makale bulunmuyor. Yakında eklenecek!
                    </p>
                    <div className="p-12 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                        <p className="text-xl font-medium text-white/40">Sinyal bulunamadı... 📡</p>
                    </div>
                </div>
            </section>
        );
    }

    const featuredArticle = articles[0];
    const sideArticles = articles.slice(1, 4);
    const authorData = Array.isArray(featuredArticle.author) ? featuredArticle.author[0] : featuredArticle.author;

    return (
        <section className="py-20 md:py-28 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 md:mb-16"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                            <Sparkles className="w-4 h-4" />
                            Yeni Keşifler
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-br from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                            Son Yazılar
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-amber-400 transition-colors group"
                    >
                        TÜMÜNÜ KEŞFET
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
                >
                    {/* Featured Article - Big Card */}
                    <motion.div variants={itemVariants} className="lg:col-span-7">
                        <Link href={`/blog/${featuredArticle.slug}`} className="group block h-full">
                            <article className="relative h-full min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(245,158,11,0.15)]">
                                {/* Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={featuredArticle.image_url || "/placeholder-article.jpg"}
                                        alt={featuredArticle.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                    {/* Category Badge */}
                                    <div className="mb-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-black text-xs font-bold uppercase tracking-wider">
                                            <Sparkles className="w-3 h-3" />
                                            {featuredArticle.category || "Genel"}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-white mb-4 group-hover:text-amber-200 transition-colors duration-300">
                                        {featuredArticle.title}
                                    </h3>

                                    {/* Summary */}
                                    <p className="text-white/70 text-base md:text-lg line-clamp-2 mb-6 max-w-xl">
                                        {featuredArticle.summary || featuredArticle.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4">
                                        {authorData?.avatar_url && (
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                                                <Image
                                                    src={authorData.avatar_url}
                                                    alt={authorData.full_name || "Author"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-white font-semibold text-sm">
                                                {authorData?.full_name || authorData?.username || "Anonim"}
                                            </span>
                                            <span className="text-white/50 text-xs flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(featuredArticle.created_at), { addSuffix: true, locale: tr })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-amber-500">
                                    <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </article>
                        </Link>
                    </motion.div>

                    {/* Side Articles */}
                    <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
                        {sideArticles.map((article, index) => {
                            const articleAuthor = Array.isArray(article.author) ? article.author[0] : article.author;
                            return (
                                <motion.div key={article.id} variants={itemVariants}>
                                    <Link href={`/blog/${article.slug}`} className="group block">
                                        <article className="relative flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                                            {/* Image */}
                                            <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden">
                                                <Image
                                                    src={article.image_url || "/placeholder-article.jpg"}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                {/* Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col justify-center min-w-0">
                                                {/* Category */}
                                                <span className="text-amber-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1.5">
                                                    {article.category || "Genel"}
                                                </span>

                                                {/* Title */}
                                                <h4 className="text-base md:text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors duration-300 mb-2">
                                                    {article.title}
                                                </h4>

                                                {/* Meta */}
                                                <div className="flex items-center gap-2 text-white/40 text-xs">
                                                    <span className="font-medium text-white/60">
                                                        {articleAuthor?.full_name || articleAuthor?.username || "Anonim"}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-amber-500/20">
                                                <ArrowRight className="w-4 h-4 text-amber-400" />
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 md:mt-16 text-center"
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105"
                    >
                        <Sparkles className="w-4 h-4" />
                        Tüm Makaleleri Keşfet
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
