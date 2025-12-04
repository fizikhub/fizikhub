"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Eye, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
            <section className="py-20 text-center">
                <div className="container">
                    <p className="text-muted-foreground">Henüz makale bulunmuyor.</p>
                </div>
            </section>
        );
    }

    const featuredArticle = articles[0];
    const otherArticles = articles.slice(1);

    return (
        <section className="py-12 sm:py-20 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10 will-change-transform" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -z-10 will-change-transform" />

            <div className="container px-4 md:px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center justify-between mb-10"
                >
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Son Yazılar</h2>
                        <p className="text-muted-foreground">Bilim dünyasından en son gelişmeler</p>
                    </div>
                    <Link href="/blog" className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group">
                        Tümünü Gör
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Featured Article - Large Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <Link href={`/blog/${featuredArticle.slug}`} className="group block relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.5/1]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                        {/* Image with Parallax Hover */}
                        <div className="absolute inset-0 overflow-hidden">
                            <Image
                                src={featuredArticle.image_url || "/placeholder-article.jpg"}
                                alt={featuredArticle.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20">
                            <div className="max-w-3xl">
                                <Badge className="mb-4 bg-primary/90 hover:bg-primary text-primary-foreground border-none backdrop-blur-md">
                                    {featuredArticle.category || "Genel"}
                                </Badge>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-primary/90 transition-colors">
                                    {featuredArticle.title}
                                </h3>
                                <p className="text-gray-200 text-sm sm:text-base md:text-lg line-clamp-2 mb-6 max-w-2xl">
                                    {featuredArticle.summary || featuredArticle.content.substring(0, 150)}...
                                </p>
                                <div className="flex items-center gap-4 text-gray-300 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
                                            {featuredArticle.profiles?.avatar_url && (
                                                <Image
                                                    src={featuredArticle.profiles.avatar_url}
                                                    alt={featuredArticle.profiles.username || ""}
                                                    width={24}
                                                    height={24}
                                                />
                                            )}
                                        </div>
                                        <span>{featuredArticle.profiles?.full_name || featuredArticle.profiles?.username}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDistanceToNow(new Date(featuredArticle.created_at), { addSuffix: true, locale: tr })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Grid for Other Articles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {otherArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/blog/${article.slug}`} className="group block h-full">
                                <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                                    <div className="aspect-[16/10] relative overflow-hidden">
                                        <Image
                                            src={article.image_url || "/placeholder-article.jpg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground hover:bg-background">
                                            {article.category || "Genel"}
                                        </Badge>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(article.created_at), { locale: tr })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {article.views || 0}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h4>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                            {article.summary || article.content.substring(0, 100)}...
                                        </p>
                                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                            Devamını Oku
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 text-center sm:hidden">
                    <Button variant="outline" className="w-full rounded-full" asChild>
                        <Link href="/blog">Tüm Yazıları Gör</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
