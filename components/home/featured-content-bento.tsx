"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare, ThumbsUp, Eye, Clock, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

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

interface Question {
    id: number;
    title: string;
    created_at: string;
    votes: number;
    answer_count: number;
    profiles: {
        username: string | null;
        avatar_url: string | null;
    } | null;
}

export function FeaturedContentBento({
    articles,
    questions
}: {
    articles: Article[];
    questions: Question[];
}) {
    const featuredArticle = articles[0];
    const topQuestion = questions[0];
    const secondQuestion = questions[1];

    return (
        <section className="py-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary uppercase tracking-wider">Öne Çıkanlar</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                            Güncel İçerikler
                        </h2>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Featured Article - Large (spans 2 columns on lg) */}
                    {featuredArticle && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 lg:row-span-2"
                        >
                            <Link href={`/blog/${featuredArticle.slug}`} className="group block h-full">
                                <div className="relative h-full min-h-[500px] bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                                    {/* Image */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={featuredArticle.image_url || "/placeholder-article.jpg"}
                                            alt={featuredArticle.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <Badge className="mb-4 bg-primary/90 hover:bg-primary">
                                            {featuredArticle.category || "Genel"}
                                        </Badge>
                                        <h3 className="text-3xl font-bold text-white mb-4 line-clamp-2 group-hover:text-primary/90 transition-colors">
                                            {featuredArticle.title}
                                        </h3>
                                        <p className="text-gray-300 mb-6 line-clamp-2">
                                            {featuredArticle.summary || featuredArticle.content.substring(0, 120)}...
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {formatDistanceToNow(new Date(featuredArticle.created_at), { addSuffix: true, locale: tr })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                {featuredArticle.views || 0} görüntülenme
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* Top Question */}
                    {topQuestion && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-1"
                        >
                            <Link href={`/forum/${topQuestion.id}`} className="group block h-full">
                                <div className="h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">Top Question</span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 line-clamp-3 group-hover:text-primary transition-colors">
                                        {topQuestion.title}
                                    </h3>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="flex items-center gap-1.5 text-sm bg-muted/50 px-3 py-1.5 rounded-full">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span className="font-medium">{topQuestion.votes}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm bg-muted/50 px-3 py-1.5 rounded-full">
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="font-medium">{topQuestion.answer_count}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* Second Question */}
                    {secondQuestion && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-1"
                        >
                            <Link href={`/forum/${secondQuestion.id}`} className="group block h-full">
                                <div className="h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <span className="text-xs font-medium text-purple-500 uppercase tracking-wider">Trending</span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 line-clamp-3 group-hover:text-primary transition-colors">
                                        {secondQuestion.title}
                                    </h3>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="flex items-center gap-1.5 text-sm bg-muted/50 px-3 py-1.5 rounded-full">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span className="font-medium">{secondQuestion.votes}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm bg-muted/50 px-3 py-1.5 rounded-full">
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="font-medium">{secondQuestion.answer_count}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* More Articles/Forum CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-2 lg:col-span-3"
                    >
                        <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-border/50 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Daha Fazla Keşfet</h3>
                                <p className="text-muted-foreground">Binlerce makale ve soru seni bekliyor.</p>
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium group"
                                >
                                    Makaleleri Gör
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/forum"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-border hover:bg-muted transition-colors font-medium group"
                                >
                                    Foruma Git
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
