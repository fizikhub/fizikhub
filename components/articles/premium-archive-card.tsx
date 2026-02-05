"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

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
            className={cn("group relative block", className)}
        >
            <Link href={`/makale/${article.slug}`} className="block space-y-5">
                {/* Image Frame - Journal Style */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/[0.03] border border-foreground/5 rounded-sm">
                    <Image
                        src={article.cover_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Overlay */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-background/80 backdrop-blur-md border border-foreground/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-foreground shadow-sm">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                                {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                            </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-medium text-foreground leading-[1.15] tracking-tight group-hover:text-foreground/70 transition-colors">
                        {article.title}
                    </h3>

                    <p className="text-sm font-serif text-foreground/50 line-clamp-2 leading-relaxed italic">
                        {article.excerpt || article.summary || "Bu çalışma için henüz bir özet metni eklenmemiştir."}
                    </p>

                    {/* Author & Stats Line */}
                    <div className="pt-4 flex items-center justify-between border-t border-foreground/[0.05]">
                        <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-foreground/10">
                                <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                            </div>
                            <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">
                                {authorName}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
