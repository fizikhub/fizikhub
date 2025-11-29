"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MagazineHeroProps {
    articles: Article[];
}

export function MagazineHero({ articles }: MagazineHeroProps) {
    if (!articles || articles.length === 0) return null;

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 3);

    return (
        <section className="mb-12 sm:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-auto lg:h-[500px]">
                {/* Main Featured Article (Large) */}
                <div className="lg:col-span-8 h-[400px] lg:h-full relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl">
                    <Link href={`/blog/${mainArticle.slug}`} className="block h-full w-full">
                        <Image
                            src={mainArticle.image_url || "/images/placeholder-hero.jpg"}
                            alt={mainArticle.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-10 w-full">
                            <Badge className="bg-primary hover:bg-primary/90 text-white border-0 mb-3 sm:mb-4 px-3 py-1 text-sm">
                                {mainArticle.category}
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg line-clamp-3">
                                {mainArticle.title}
                            </h2>
                            <p className="text-white/80 text-sm sm:text-base md:text-lg line-clamp-2 mb-4 max-w-2xl hidden sm:block">
                                {mainArticle.summary}
                            </p>
                            <div className="flex items-center gap-4 text-white/70 text-xs sm:text-sm font-medium">
                                <span className="flex items-center gap-1.5">
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/30">
                                        <Image
                                            src={mainArticle.author?.avatar_url || "/images/default-avatar.png"}
                                            alt="Author"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {mainArticle.author?.full_name || mainArticle.author?.username || "Fizikhub"}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDistanceToNow(new Date(mainArticle.created_at), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Side Articles (Stacked) */}
                <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
                    {sideArticles.map((article, index) => (
                        <div key={article.id} className="relative flex-1 h-[200px] lg:h-auto group overflow-hidden rounded-2xl shadow-lg">
                            <Link href={`/blog/${article.slug}`} className="block h-full w-full">
                                <Image
                                    src={article.image_url || "/images/placeholder-article.jpg"}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 p-5 sm:p-6 w-full">
                                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-0 mb-2 px-2 py-0.5 text-xs">
                                        {article.category}
                                    </Badge>
                                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug drop-shadow-md line-clamp-2 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-white/60 text-xs mt-2">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}

                    {/* "More" Link if needed, or just fill space */}
                    {sideArticles.length < 2 && (
                        <div className="flex-1 bg-muted/30 rounded-2xl flex items-center justify-center border-2 border-dashed border-muted">
                            <span className="text-muted-foreground text-sm">Daha fazla içerik yakında...</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
