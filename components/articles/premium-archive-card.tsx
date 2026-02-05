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
}

export function PremiumArchiveCard({ article, className, index = 0 }: PremiumArchiveCardProps) {
    const authorName = article.author?.full_name || article.author?.username || "Anonim Araştırmacı";
    const authorAvatar = article.author?.avatar_url || "/images/default-avatar.png";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "group relative flex flex-col bg-white dark:bg-zinc-900 border-[3px] border-black shadow-neo-sm hover:shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-sm overflow-hidden",
                className
            )}
        >
            <Link href={`/makale/${article.slug}`} className="block flex-1">
                {/* Image Frame - Journal Style */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/[0.03] border-b-[3px] border-black">
                    <Image
                        src={article.cover_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Category Overlay - Neo Tag */}
                    <div className="absolute top-4 left-4 z-10 group-hover:rotate-2 transition-transform">
                        <span className="bg-[#FFC800] border-[2px] border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_#000]">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                            {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                        </span>
                        <ArrowUpRight className="w-5 h-5 text-foreground/20 group-hover:text-black dark:group-hover:text-[#FFC800] transition-colors" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-medium text-foreground leading-[1.1] tracking-tight group-hover:underline underline-offset-4 decoration-[3px] decoration-[#FFC800] transition-all">
                        {article.title}
                    </h3>

                    <p className="text-base font-serif text-foreground/70 line-clamp-3 leading-relaxed italic border-l-2 border-[#FFC800]/30 pl-4 py-1">
                        {article.excerpt || article.summary || "Bu çalışma için henüz bir özet metni eklenmemiştir."}
                    </p>
                </div>
            </Link>

            {/* Editorial Footer - Interaction Strip */}
            <div className="px-6 py-4 border-t-[2px] border-dashed border-black/10 flex items-center justify-between mt-auto bg-foreground/[0.02]">
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
        </motion.div>
    );
}
