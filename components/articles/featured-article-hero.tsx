"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface FeaturedArticleHeroProps {
    article: Article;
}

export function FeaturedArticleHero({ article }: FeaturedArticleHeroProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    if (!article) return null;

    return (
        <div className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden mb-12 sm:mb-20 rounded-[40px] mx-auto max-w-[98%] mt-4">
            {/* Parallax Background Image */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src={article.image_url || "/images/placeholder-hero.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 container max-w-5xl px-4 text-center space-y-6 sm:space-y-8"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-3"
                >
                    <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/20 backdrop-blur-md px-4 py-1.5 text-sm sm:text-base rounded-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Günün Makalesi
                    </Badge>
                    <Badge variant="outline" className="bg-background/20 backdrop-blur-md border-white/20 text-white px-4 py-1.5 text-sm sm:text-base rounded-full">
                        {article.category}
                    </Badge>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl leading-[1.1]"
                >
                    {article.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light"
                >
                    {article.summary}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <Link href={`/blog/${article.slug}`}>
                        <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-xl shadow-white/10">
                            Okumaya Başla <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2 text-white/60 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                        </span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
            >
                <span className="text-xs uppercase tracking-widest">Keşfet</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </motion.div>
        </div>
    );
}
