"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Heart, MessageCircle, Bookmark } from "lucide-react";

interface PremiumArchiveCardProps {
    article: Article;
    className?: string;
    index?: number;
    variant?: 'lead' | 'horizontal' | 'grid';
}

export function PremiumArchiveCard({
    article,
    className,
    index = 0,
    variant = 'grid'
}: PremiumArchiveCardProps) {
    const authorName = article.author?.full_name || article.author?.username || "Anonim Araştırmacı";
    const authorAvatar = article.author?.avatar_url || "/images/default-avatar.png";

    const isHorizontal = variant === 'horizontal';
    const isLead = variant === 'lead';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "group relative flex bg-white dark:bg-zinc-900 border-[3px] border-black shadow-neo-sm hover:shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-sm overflow-hidden",
                isLead ? "flex-col md:flex-row md:col-span-2 min-h-[400px]" :
                    isHorizontal ? "flex-col md:flex-row" : "flex-col",
                className
            )}
        >
            <Link href={`/makale/${article.slug}`} className={cn(
                "flex flex-1",
                isLead || isHorizontal ? "flex-col md:flex-row" : "flex-col"
            )}>
                {/* Image Section */}
                <div className={cn(
                    "relative overflow-hidden bg-foreground/[0.03] border-black",
                    isLead ? "aspect-[16/9] md:aspect-auto md:w-1/2 border-b-[3px] md:border-b-0 md:border-r-[3px]" :
                        isHorizontal ? "aspect-[16/9] md:aspect-square md:w-72 border-b-[3px] md:border-b-0 md:border-r-[3px]" :
                            "aspect-[16/9] border-b-[3px]"
                )}>
                    <Image
                        src={article.cover_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 z-10 group-hover:rotate-2 transition-transform">
                        <span className="bg-[#FFC800] border-[2px] border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_#000]">
                            {article.category || "GENEL"}
                        </span>
                    </div>

                    {isLead && (
                        <div className="absolute bottom-4 right-4 z-10 hidden md:block">
                            <span className="bg-white border-[2px] border-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                                Öne Çıkan Çalışma
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className={cn(
                    "p-6 flex flex-col gap-4",
                    isLead ? "md:w-1/2 md:p-10 md:justify-center" :
                        isHorizontal ? "md:p-8 flex-1" : "p-6"
                )}>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 font-heading">
                            {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                        </span>
                        <ArrowUpRight className="w-5 h-5 text-foreground/20 group-hover:text-black dark:group-hover:text-[#FFC800] transition-colors" />
                    </div>

                    <h3 className={cn(
                        "font-display font-medium text-foreground leading-[1.1] tracking-tight group-hover:underline underline-offset-4 decoration-[3px] decoration-[#FFC800] transition-all",
                        isLead ? "text-4xl sm:text-5xl md:text-6xl" : "text-2xl sm:text-3xl"
                    )}>
                        {article.title}
                    </h3>

                    <p className={cn(
                        "font-serif text-foreground/70 line-clamp-3 leading-relaxed italic border-l-2 border-[#FFC800]/30 pl-4 py-1",
                        isLead ? "text-lg md:text-xl md:line-clamp-4" : "text-base"
                    )}>
                        {article.excerpt || article.summary || "Bu çalışma için henüz bir özet metni eklenmemiştir."}
                    </p>

                    {/* Editorial Strip (Internal for Lead/Horizontal, regular for others) */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                                <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-foreground uppercase tracking-wider leading-none">
                                    {authorName}
                                </span>
                                <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest">
                                    Editorial Staff
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="p-2 border border-black/10 rounded-full hover:bg-[#FFC800]/10 transition-colors">
                                <Heart className="w-4 h-4 text-foreground/40" />
                            </div>
                            <div className="p-2 border border-black/10 rounded-full hover:bg-cyan-400/10 transition-colors">
                                <MessageCircle className="w-4 h-4 text-foreground/40" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
