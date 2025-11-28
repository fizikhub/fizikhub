"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Article } from "@/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ArticleGridProps {
    articles: Article[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
    const [visibleCount, setVisibleCount] = useState(6);

    const showMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    const visibleArticles = articles.slice(0, visibleCount);
    const hasMore = visibleCount < articles.length;

    return (
        <section className="py-8 sm:py-12 md:py-16 bg-background/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Son Eklenenler</h2>
                    <Link href="/blog">
                        <Button variant="ghost" size="sm" className="sm:size-default">Tümünü Gör</Button>
                    </Link>
                </div>

                <div className="grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {visibleArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/blog/${article.slug}`}>
                                    <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                                        <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden">
                                            <Image
                                                src={(article.image_url && (article.image_url.startsWith('http') || article.image_url.startsWith('/')))
                                                    ? article.image_url
                                                    : "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop"}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white">
                                                {article.category}
                                            </div>
                                        </div>
                                        <CardHeader className="p-3 sm:p-4">
                                            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                                                {format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}
                                            </div>
                                            <CardTitle className="text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-4 pt-0 flex-1">
                                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="p-3 sm:p-4 pt-0">
                                            <div className="text-[10px] sm:text-xs font-medium text-primary">
                                                Yazar: {article.author?.full_name || article.author?.username || "Anonim"}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {hasMore && (
                    <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={showMore}
                            className="group gap-2 min-w-[180px] sm:min-w-[200px] rounded-full"
                        >
                            Daha Fazla Göster
                            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
