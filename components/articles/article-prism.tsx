"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, Bookmark, Eye, Clock, MessageSquare, Newspaper } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ArticlePrismProps {
    article: Article;
    variant?: "large" | "medium" | "small";
    index?: number;
}

export function ArticlePrism({ article, variant = "medium", index = 0 }: ArticlePrismProps) {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const authorName = article.author?.full_name || article.profiles?.full_name || "Bilim İnsanı";
    const authorAvatar = article.author?.avatar_url || article.profiles?.avatar_url || "/images/default-avatar.png";
    const tldr = article.summary || article.content?.replace(/<[^>]+>/g, '').slice(0, 150) + "...";

    return (
        <motion.article
            ref={containerRef}
            layoutId={`article-${article.id}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "group relative bg-white dark:bg-neutral-950 rounded-[2.5rem] overflow-hidden border border-neutral-100 dark:border-white/5 shadow-sm transition-all duration-500",
                variant === "large" ? "md:col-span-4 lg:col-span-4 h-[600px]" :
                    variant === "medium" ? "md:col-span-2 lg:col-span-3 h-[500px]" :
                        "md:col-span-2 lg:col-span-2 h-[400px]",
                isHovered && "shadow-2xl border-amber-500/20"
            )}
        >
            <Link href={`/blog/${article.slug}`} className="block h-full relative">
                {/* Visual Media */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            isHovered ? "scale-105" : "scale-100"
                        )}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Multi-layered Overlays */}
                    <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/40 transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

                    {/* Scannable Lines (Science Theme) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                        <div className="absolute h-full w-px bg-white left-[10%] animate-pulse" />
                        <div className="absolute h-full w-px bg-white left-[90%] animate-pulse delay-700" />
                    </div>
                </div>

                {/* Content Layer */}
                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                    {/* Top Right Actions (Floating) */}
                    <div className="absolute top-8 right-8 flex flex-col gap-3">
                        <ActionButton icon={<Heart className="w-4 h-4" />} />
                        <ActionButton icon={<Bookmark className="w-4 h-4" />} />
                    </div>

                    {/* Metadata Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                            {article.category || "General"}
                        </span>
                        <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                        </span>
                    </div>

                    {/* Main Title */}
                    <h3 className={cn(
                        "font-black text-white leading-[0.9] tracking-tighter mb-4 transition-all duration-500",
                        variant === "large" ? "text-4xl md:text-6xl" : "text-3xl"
                    )}>
                        {article.title}
                    </h3>

                    {/* TL;DR Experience (Hover Only) */}
                    <AnimatePresence mode="wait">
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 border-t border-white/10 mt-2">
                                    <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase mb-3">
                                        <Newspaper className="w-3 h-3" />
                                        TL;DR SUMMARY
                                    </div>
                                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3 font-medium">
                                        {tldr}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden">
                                <Image src={authorAvatar} alt={authorName} width={32} height={32} className="object-cover" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white tracking-tight">{authorName}</p>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">Scientific Contributor</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-white/40 group-hover:text-amber-400/80 transition-colors">
                            <span className="flex items-center gap-1 text-[10px] font-bold">
                                <Eye className="w-3 h-3" />
                                {article.views || 0}
                            </span>
                            <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

function ActionButton({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-all duration-300">
            {icon}
        </button>
    );
}
