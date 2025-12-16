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
    if (!articles.length) {
        return (
            <section className="py-24 bg-background border-b-2 border-border">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
                        Son Yazılar
                    </h2>
                    <p className="text-muted-foreground text-lg font-medium mb-8">
                        Henüz makale bulunmuyor. Yakında eklenecek!
                    </p>
                    <div className="p-12 border-2 border-dashed border-border rounded-3xl bg-card/50">
                        <p className="text-xl font-bold text-muted-foreground">Sinyal bulunamadı... 📡</p>
                    </div>
                </div>
            </section>
        );
    }

    const featuredArticle = articles[0];
    const sideArticles = articles.slice(1, 4);

    return (
        <section className="py-24 bg-background border-b-2 border-border">
            <div className="container px-4 mx-auto">
                <div className="flex items-end justify-between mb-12 border-b-2 border-black dark:border-white pb-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 uppercase">
                            Son Yazılar
                        </h2>
                        <p className="text-muted-foreground text-lg font-medium">
                            Bilim dünyasından en son gelişmeler ve analizler.
                        </p>
                    </div>
                    <Link href="/blog" className="hidden sm:flex items-center gap-2 font-bold hover:underline decoration-2 underline-offset-4">
                        TÜMÜNÜ GÖR
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Featured Article */}
                    <div className="lg:col-span-7">
                        <Link href={`/blog/${featuredArticle.slug}`} className="group block h-full">
                            <article className="h-full flex flex-col">
                                <div className="relative aspect-[16/9] w-full mb-6 overflow-hidden border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-300">
                                    <Image
                                        src={featuredArticle.image_url || "/placeholder-article.jpg"}
                                        alt={featuredArticle.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-primary text-primary-foreground font-bold text-xs uppercase border-2 border-black dark:border-white">
                                            {featuredArticle.category || "Genel"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight group-hover:text-primary transition-colors uppercase">
                                        {featuredArticle.title}
                                    </h3>
                                    <p className="text-muted-foreground text-lg mb-6 line-clamp-3 font-medium">
                                        {featuredArticle.summary || featuredArticle.content.substring(0, 150)}...
                                    </p>

                                    <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                                        <span className="text-foreground">
                                            {featuredArticle.profiles?.full_name || featuredArticle.profiles?.username}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {formatDistanceToNow(new Date(featuredArticle.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </div>

                    {/* Side Articles */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        {sideArticles.map((article) => (
                            <Link key={article.id} href={`/blog/${article.slug}`} className="group block flex-1">
                                <article className="flex flex-col sm:flex-row gap-6 h-full p-6 border-2 border-border hover:border-black dark:hover:border-white transition-all duration-300 bg-card hover:shadow-lg">
                                    <div className="relative w-full sm:w-32 aspect-square flex-shrink-0 border-2 border-black dark:border-white overflow-hidden">
                                        <Image
                                            src={article.image_url || "/placeholder-article.jpg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="mb-2">
                                            <span className="text-xs font-bold uppercase text-primary tracking-wider">
                                                {article.category || "Genel"}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold mb-3 line-clamp-2 group-hover:underline decoration-2 underline-offset-4 uppercase">
                                            {article.title}
                                        </h4>
                                        <div className="mt-auto text-xs font-bold text-muted-foreground">
                                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/blog" className="inline-block hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-full">
                        <div className="brutalist-button inline-flex px-8 py-3 items-center justify-center gap-2 w-full md:w-auto bg-primary text-primary-foreground font-bold uppercase tracking-wider border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                            DEVAMI
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
