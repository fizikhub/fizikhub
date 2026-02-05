"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";

interface PremiumArchiveCardProps {
    article: Article;
    className?: string;
    index?: number;
    size?: 'large' | 'medium' | 'small';
}

export function PremiumArchiveCard({
    article,
    className,
    index = 0,
    size = 'medium'
}: PremiumArchiveCardProps) {
    const authorName = article.author?.full_name || article.author?.username || "Anonim Araştırmacı";
    const authorAvatar = article.author?.avatar_url || "/images/default-avatar.png";

    const isLarge = size === 'large';
    const isSmall = size === 'small';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={cn(
                "group relative bg-white dark:bg-zinc-900 border-[3px] border-black shadow-neo-sm hover:shadow-neo hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300 rounded-sm overflow-hidden flex flex-col h-full",
                isLarge && "md:col-span-2 md:row-span-2",
                className
            )}
        >
            <Link href={`/makale/${article.slug}`} className="flex flex-col h-full">
                {/* 1. Image Section */}
                <div className={cn(
                    "relative overflow-hidden bg-[#FFC800]/5 border-b-[3px] border-black",
                    isLarge ? "aspect-[21/9] md:aspect-auto md:flex-1" : "aspect-[16/9]"
                )}>
                    <Image
                        src={article.cover_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Category Floating Tag */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-[#FFC800] border-[2px] border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_#000]">
                            {article.category || "GENEL"}
                        </span>
                    </div>

                    {isLarge && (
                        <div className="absolute bottom-6 left-6 z-10 hidden md:block">
                            <h2 className="text-5xl lg:text-7xl font-black text-white px-4 py-2 bg-black border-[3px] border-white shadow-[8px_8px_0px_0px_#FFC800] uppercase tracking-tighter leading-none italic">
                                MANŞET
                            </h2>
                        </div>
                    )}
                </div>

                {/* 2. Content Section */}
                <div className={cn(
                    "p-6 flex flex-col gap-3",
                    isLarge ? "md:p-10" : isSmall ? "p-4" : "p-6"
                )}>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 font-mono">
                        <span>{formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}</span>
                        <ArrowUpRight className="w-5 h-5 group-hover:text-black dark:group-hover:text-[#FFC800] transition-colors" />
                    </div>

                    <h3 className={cn(
                        "font-black text-foreground leading-[1] uppercase tracking-tighter group-hover:text-[#FFC800] dark:group-hover:text-[#FFC800] transition-colors",
                        isLarge ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
                    )}>
                        {article.title}
                    </h3>

                    {/* Excerpt - Only for Large/Medium */}
                    {!isSmall && (
                        <p className={cn(
                            "font-serif text-foreground/60 leading-relaxed line-clamp-2 italic border-l-4 border-[#FFC800] pl-4",
                            isLarge ? "text-lg md:text-xl md:line-clamp-3" : "text-sm"
                        )}>
                            {article.excerpt || article.summary || "Bu çalışma bilim dünyasında yeni bir pencere aralıyor."}
                        </p>
                    )}

                    {/* Metadata Footer */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t-[2px] border-dashed border-black/10">
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                                <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                            </div>
                            <span className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">
                                {authorName}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-4 h-4 hover:scale-125 transition-transform cursor-pointer" />
                            <MessageCircle className="w-4 h-4 hover:scale-125 transition-transform cursor-pointer" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
