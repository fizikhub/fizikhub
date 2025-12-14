"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Calendar, ChevronDown, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Article } from "@/lib/api";
import { formatReadingTime } from "@/lib/reading-time";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ArticleHeroProps {
    article: Article;
    readingTime: string;
}

export function ArticleHero({ article, readingTime }: ArticleHeroProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

    return (
        <div className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Back Button */}
            <div className="absolute top-6 left-4 sm:left-8 z-50">
                <Link href="/blog">
                    <Button variant="ghost" size="icon" className="rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border border-white/10 w-10 h-10 sm:w-12 sm:h-12">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                </Link>
            </div>

            {/* Parallax Background Image */}
            <motion.div
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src={article.cover_url || "/images/placeholder-hero.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 container max-w-4xl px-4 text-center space-y-6 sm:space-y-8 mt-20"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center gap-3"
                >
                    <Badge className="bg-primary/80 hover:bg-primary text-white border-0 backdrop-blur-md px-4 py-1.5 text-sm rounded-full shadow-lg shadow-primary/20">
                        {article.category}
                    </Badge>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white drop-shadow-2xl leading-[1.1]"
                >
                    {article.title}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/90 font-medium"
                >
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden ring-2 ring-white/20">
                            <Image
                                src={article.author?.avatar_url || "/images/default-avatar.png"}
                                alt={article.author?.full_name || "Yazar"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-sm sm:text-base">
                            {article.author?.full_name || article.author?.username || "Anonim"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm sm:text-base">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm sm:text-base">
                        <Clock className="w-4 h-4" />
                        <span>{readingTime} okuma</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
            >
                <ChevronDown className="w-8 h-8" />
            </motion.div>
        </div>
    );
}
