"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Article } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useState } from "react";
import { motion } from "framer-motion";

interface MagazineHeroProps {
    articles: Article[];
}

// Calculate reading time
function getReadingTime(content: string | null): number {
    if (!content) return 3;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function MagazineHero({ articles }: MagazineHeroProps) {
    if (!articles || articles.length === 0) return null;

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 3);

    const [mainImgSrc, setMainImgSrc] = useState(mainArticle.image_url || "/images/placeholder-hero.jpg");

    return (
        <section className="mb-12 sm:mb-16 md:mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 h-auto lg:h-[560px]">
                {/* Main Featured Article */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="lg:col-span-8 h-[400px] sm:h-[450px] lg:h-full relative group overflow-hidden border-2 border-white/10 hover:border-amber-500/60 transition-all duration-500"
                >
                    <Link href={`/blog/${mainArticle.slug}`} className="block h-full w-full">
                        <Image
                            src={mainImgSrc}
                            alt={mainArticle.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-110"
                            priority
                            onError={() => setMainImgSrc("/images/placeholder-article.jpg")}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        {/* Subtle grid pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

                        {/* Featured Badge */}
                        <div className="absolute top-5 left-5 z-20">
                            <div className="flex items-center gap-2 bg-amber-500 text-black px-3 py-1.5 font-bold text-xs uppercase tracking-widest">
                                <Sparkles className="w-3.5 h-3.5" />
                                Öne Çıkan
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-10 w-full z-10">
                            {/* Category */}
                            <span className="inline-block bg-white/10 backdrop-blur-sm text-white/90 font-semibold text-xs px-3 py-1 mb-4 uppercase tracking-wider border border-white/20">
                                {mainArticle.category}
                            </span>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-[1.05] line-clamp-3 drop-shadow-lg">
                                {mainArticle.title}
                            </h2>

                            <p className="text-white/60 text-sm sm:text-base md:text-lg line-clamp-2 mb-5 max-w-2xl hidden sm:block font-normal leading-relaxed">
                                {mainArticle.summary}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/50 text-xs sm:text-sm">
                                <span className="flex items-center gap-2">
                                    <div className="relative w-8 h-8 overflow-hidden border-2 border-amber-500/50">
                                        <Image
                                            src={mainArticle.author?.avatar_url || "/images/default-avatar.png"}
                                            alt="Author"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-amber-400 font-semibold">{mainArticle.author?.full_name || mainArticle.author?.username || "Fizikhub"}</span>
                                </span>
                                <span className="hidden sm:flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {formatDistanceToNow(new Date(mainArticle.created_at), { addSuffix: true, locale: tr })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    {getReadingTime(mainArticle.content)} dk okuma
                                </span>
                            </div>
                        </div>

                        {/* Hover Read Indicator */}
                        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                            <div className="bg-amber-500 text-black p-3 flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                                Oku
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Side Articles */}
                <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5 md:gap-6">
                    {sideArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className="flex-1"
                        >
                            <SideArticleCard article={article} />
                        </motion.div>
                    ))}

                    {sideArticles.length < 2 && (
                        <div className="flex-1 bg-white/5 flex items-center justify-center border-2 border-dashed border-white/10">
                            <span className="text-white/30 text-sm font-medium">Daha fazla içerik yakında...</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function SideArticleCard({ article }: { article: Article }) {
    const [imgSrc, setImgSrc] = useState(article.image_url || "/images/placeholder-article.jpg");

    return (
        <div className="relative h-full min-h-[200px] group overflow-hidden border-2 border-white/10 hover:border-amber-500/60 transition-all duration-500">
            <Link href={`/blog/${article.slug}`} className="block h-full w-full">
                <Image
                    src={imgSrc}
                    alt={article.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-110"
                    onError={() => setImgSrc("/images/placeholder-article.jpg")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 p-5 sm:p-6 w-full z-10">
                    <span className="inline-block bg-white/10 backdrop-blur-sm text-white font-semibold text-xs px-2 py-0.5 mb-2 uppercase tracking-wider border border-white/10">
                        {article.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-white/40 text-xs mt-3">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </span>
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {getReadingTime(article.content)} dk
                        </span>
                    </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-amber-500 rotate-45" />
                </div>
            </Link>
        </div>
    );
}
