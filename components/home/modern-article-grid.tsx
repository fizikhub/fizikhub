"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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

export function ModernArticleGrid({ articles }: { articles: Article[] }) {
    if (!articles.length) {
        return (
            <section className="py-16 md:py-24 border-y-4 border-black dark:border-white bg-background">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
                        Son Yazılar
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        Henüz makale bulunmuyor.
                    </p>
                    <div className="p-8 border-4 border-dashed border-muted">
                        <p className="text-xl font-bold text-muted-foreground">Sinyal bulunamadı... 📡</p>
                    </div>
                </div>
            </section>
        );
    }

    const featuredArticle = articles[0];
    const sideArticles = articles.slice(1, 4);
    const authorData = Array.isArray(featuredArticle.author) ? featuredArticle.author[0] : featuredArticle.author;

    return (
        <section className="py-16 md:py-24 border-y-4 border-black dark:border-white bg-background">
            <div className="container px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 pb-6 border-b-4 border-black dark:border-white">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                            // Güncel
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase">
                            Son Yazılar
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider hover:underline decoration-4 underline-offset-4"
                    >
                        Tümü
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Featured Article */}
                    <Link href={`/blog/${featuredArticle.slug}`} className="group block lg:row-span-2">
                        <article className="h-full border-4 border-black dark:border-white bg-card hover:bg-accent transition-colors duration-200">
                            {/* Image */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden border-b-4 border-black dark:border-white">
                                <Image
                                    src={featuredArticle.image_url || "/placeholder-article.jpg"}
                                    alt={featuredArticle.title}
                                    fill
                                    className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300 group-hover:scale-[1.02]"
                                />
                                {/* Category Tag */}
                                <div className="absolute top-0 left-0 bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-black uppercase tracking-wider">
                                    {featuredArticle.category || "Genel"}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                <h3 className="text-2xl md:text-3xl font-black leading-tight uppercase mb-4 group-hover:underline decoration-4 underline-offset-4">
                                    {featuredArticle.title}
                                </h3>

                                <p className="text-muted-foreground text-base leading-relaxed mb-6 line-clamp-3">
                                    {featuredArticle.content.replace(/<[^>]*>/g, '').substring(0, 180)}...
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t-2 border-border">
                                    <span className="font-bold text-sm">
                                        {authorData?.full_name || authorData?.username || "Anonim"}
                                    </span>
                                    <span className="text-xs font-mono text-muted-foreground uppercase">
                                        {formatDistanceToNow(new Date(featuredArticle.created_at), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Link>

                    {/* Side Articles */}
                    {sideArticles.map((article) => {
                        const articleAuthor = Array.isArray(article.author) ? article.author[0] : article.author;
                        return (
                            <Link key={article.id} href={`/blog/${article.slug}`} className="group block">
                                <article className="h-full border-4 border-black dark:border-white bg-card hover:bg-accent transition-colors duration-200 flex flex-col sm:flex-row">
                                    {/* Image */}
                                    <div className="relative w-full sm:w-40 md:w-48 aspect-square sm:aspect-auto flex-shrink-0 overflow-hidden border-b-4 sm:border-b-0 sm:border-r-4 border-black dark:border-white">
                                        <Image
                                            src={article.image_url || "/placeholder-article.jpg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-2 block">
                                                {article.category || "Genel"}
                                            </span>
                                            <h4 className="text-lg md:text-xl font-black leading-tight uppercase line-clamp-2 group-hover:underline decoration-2 underline-offset-4">
                                                {article.title}
                                            </h4>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-border text-xs">
                                            <span className="font-bold truncate mr-2">
                                                {articleAuthor?.full_name || articleAuthor?.username || "Anonim"}
                                            </span>
                                            <span className="font-mono text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-10 pt-8 border-t-4 border-black dark:border-white text-center">
                    <Link
                        href="/blog"
                        className="inline-block px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-wider border-4 border-black dark:border-white hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-colors duration-200"
                    >
                        Tüm Makaleler →
                    </Link>
                </div>
            </div>
        </section>
    );
}
