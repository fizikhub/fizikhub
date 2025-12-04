"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Eye, Calendar, Sparkles } from "lucide-react";
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
        <section className="py-12 sm:py-24 relative overflow-hidden bg-background">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 will-change-transform" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -z-10 will-change-transform" />

            <div className="container px-4 md:px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-end justify-between mb-12"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary uppercase tracking-wider">Keşfet</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Son Yazılar</h2>
                    </div>
                    <Link href="/blog" className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium group">
                        Tümünü Gör
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Featured Article - Large Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <Link href={`/blog/${featuredArticle.slug}`} className="group block relative rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[2/1] md:aspect-[2.5/1] shadow-2xl shadow-black/20">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10" />

                        {/* Image with Parallax Hover */}
                        <div className="absolute inset-0 overflow-hidden">
                            <Image
                                src={featuredArticle.image_url || "/placeholder-article.jpg"}
                                alt={featuredArticle.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 z-20">
                            <div className="max-w-3xl">
                                <Badge className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground border-none px-4 py-1.5 text-sm backdrop-blur-md shadow-lg shadow-primary/20">
                                    {featuredArticle.category || "Genel"}
                                </Badge>
                                <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1] tracking-tight group-hover:text-primary/90 transition-colors">
                                    {featuredArticle.title}
                                </h3>
                                <p className="text-gray-300 text-base sm:text-lg md:text-xl line-clamp-2 mb-8 max-w-2xl font-light leading-relaxed">
                                    {featuredArticle.summary || featuredArticle.content.substring(0, 150)}...
                                </p>
                                <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 ring-2 ring-white/20">
                                            {featuredArticle.profiles?.avatar_url && (
                                                <Image
                                                    src={featuredArticle.profiles.avatar_url}
                                                    alt={featuredArticle.profiles.username || ""}
                                                    width={32}
                                                    height={32}
                                                />
                                            )}
                                        </div>
                                        <span>{featuredArticle.profiles?.full_name || featuredArticle.profiles?.username}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDistanceToNow(new Date(featuredArticle.created_at), { addSuffix: true, locale: tr })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Grid for Other Articles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/blog/${article.slug}`} className="group block h-full">
                                <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-[1.5rem] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                                    <div className="aspect-[16/10] relative overflow-hidden">
                                        <Image
                                            src={article.image_url || "/placeholder-article.jpg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground hover:bg-background border-none shadow-sm">
                                            {article.category || "Genel"}
                                        </Badge>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDistanceToNow(new Date(article.created_at), { locale: tr })}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                                <Eye className="w-3.5 h-3.5" />
                                                {article.views || 0}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                            {article.title}
                                        </h4>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                            {article.summary || article.content.substring(0, 100)}...
                                        </p>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-primary mt-auto">
                                            Devamını Oku
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center sm:hidden">
                    <Button variant="outline" className="w-full rounded-full h-12 text-base" asChild>
                        <Link href="/blog">Tüm Yazıları Gör</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
