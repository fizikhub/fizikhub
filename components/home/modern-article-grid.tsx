"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    profiles?: {
        full_name: string | null;
        username: string | null;
        avatar_url: string | null;
    } | null;
}

export function ModernArticleGrid({ articles }: { articles: Article[] }) {
    if (!articles.length) return null;

    const featuredArticle = articles[0];
    const sideArticles = articles.slice(1, 3);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
                            Son Eklenenler
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Bilim dünyasından en güncel makaleler, keşifler ve analizler.
                        </p>
                    </div>
                    <Button variant="ghost" className="hidden sm:flex group" asChild>
                        <Link href="/blog">
                            Tümünü Gör
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Featured Article - Takes up 7 columns on large screens */}
                    <div className="lg:col-span-7">
                        <Link href={`/blog/${featuredArticle.slug}`} className="group block h-full">
                            <article className="relative h-full min-h-[400px] rounded-3xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="absolute inset-0">
                                    <Image
                                        src={featuredArticle.image_url || "/placeholder-article.jpg"}
                                        alt={featuredArticle.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <Badge className="mb-4 bg-primary text-primary-foreground border-none">
                                        {featuredArticle.category || "Genel"}
                                    </Badge>
                                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary/90 transition-colors font-heading">
                                        {featuredArticle.title}
                                    </h3>
                                    <p className="text-gray-300 line-clamp-2 mb-6 text-lg">
                                        {featuredArticle.summary || featuredArticle.content.substring(0, 150)}...
                                    </p>

                                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20">
                                                {featuredArticle.profiles?.avatar_url ? (
                                                    <Image
                                                        src={featuredArticle.profiles.avatar_url}
                                                        alt={featuredArticle.profiles.username || ""}
                                                        width={32}
                                                        height={32}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/20" />
                                                )}
                                            </div>
                                            <span className="font-medium text-white">
                                                {featuredArticle.profiles?.full_name || featuredArticle.profiles?.username}
                                            </span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-gray-500" />
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatDistanceToNow(new Date(featuredArticle.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </div>

                    {/* Side Articles - Stacked vertically, takes up 5 columns */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {sideArticles.map((article) => (
                            <Link key={article.id} href={`/blog/${article.slug}`} className="group block flex-1">
                                <article className="flex flex-col sm:flex-row gap-6 h-full p-5 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                                    <div className="relative w-full sm:w-40 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden flex-shrink-0">
                                        <Image
                                            src={article.image_url || "/placeholder-article.jpg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                            <Badge variant="secondary" className="text-[10px] px-2 h-5">
                                                {article.category || "Genel"}
                                            </Badge>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(article.created_at), { locale: tr })}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors font-heading">
                                            {article.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {article.summary || article.content.substring(0, 100)}...
                                        </p>
                                        <div className="mt-auto pt-2 flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Oku <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Button variant="outline" className="w-full rounded-full" asChild>
                        <Link href="/blog">Tüm Yazıları Gör</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
