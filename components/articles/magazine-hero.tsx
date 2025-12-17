"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Article } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useState } from "react";

interface MagazineHeroProps {
    articles: Article[];
}

export function MagazineHero({ articles }: MagazineHeroProps) {
    if (!articles || articles.length === 0) return null;

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 3);

    const [mainImgSrc, setMainImgSrc] = useState(mainArticle.image_url || "/images/placeholder-hero.jpg");

    return (
        <section className="mb-10 sm:mb-14 md:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 h-auto lg:h-[520px]">
                {/* Main Featured Article */}
                <div className="lg:col-span-8 h-[380px] sm:h-[420px] lg:h-full relative group overflow-hidden border-2 border-white/10 hover:border-amber-500/50 transition-colors duration-300">
                    <Link href={`/blog/${mainArticle.slug}`} className="block h-full w-full">
                        <Image
                            src={mainImgSrc}
                            alt={mainArticle.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            priority
                            onError={() => setMainImgSrc("/images/placeholder-article.jpg")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-5 sm:p-7 md:p-9 w-full z-10">
                            {/* Category Tag - Brutalist */}
                            <span className="inline-block bg-amber-500 text-black font-bold text-xs sm:text-sm px-3 py-1 mb-3 uppercase tracking-wider">
                                {mainArticle.category}
                            </span>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 leading-[1.1] line-clamp-3">
                                {mainArticle.title}
                            </h2>

                            <p className="text-white/70 text-sm sm:text-base md:text-lg line-clamp-2 mb-4 max-w-2xl hidden sm:block font-normal leading-relaxed">
                                {mainArticle.summary}
                            </p>

                            <div className="flex items-center gap-4 text-white/60 text-xs sm:text-sm">
                                <span className="flex items-center gap-2">
                                    <div className="relative w-7 h-7 overflow-hidden border border-white/20">
                                        <Image
                                            src={mainArticle.author?.avatar_url || "/images/default-avatar.png"}
                                            alt="Author"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-amber-400 font-medium">{mainArticle.author?.full_name || mainArticle.author?.username || "Fizikhub"}</span>
                                </span>
                                <span className="text-white/30">•</span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDistanceToNow(new Date(mainArticle.created_at), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Read indicator */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-amber-500 text-black p-2">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Side Articles */}
                <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5 md:gap-6">
                    {sideArticles.map((article) => (
                        <SideArticleCard key={article.id} article={article} />
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
        <div className="relative flex-1 h-[200px] lg:h-auto group overflow-hidden border-2 border-white/10 hover:border-amber-500/50 transition-colors duration-300">
            <Link href={`/blog/${article.slug}`} className="block h-full w-full">
                <Image
                    src={imgSrc}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={() => setImgSrc("/images/placeholder-article.jpg")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 p-5 sm:p-6 w-full z-10">
                    <span className="inline-block bg-white/10 text-white font-semibold text-xs px-2 py-0.5 mb-2 uppercase tracking-wider backdrop-blur-sm">
                        {article.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/50 text-xs mt-2">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                    </div>
                </div>
            </Link>
        </div>
    );
}
