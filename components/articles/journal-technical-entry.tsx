"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Hash, Layers, User2, Zap } from "lucide-react";

interface JournalTechnicalEntryProps {
    article: Article;
    index?: number;
}

export function JournalTechnicalEntry({ article, index = 0 }: JournalTechnicalEntryProps) {
    const authorName = article.author?.full_name || article.author?.username || "ANONYMOUS_RESEARCHER";
    const doi_id = `10.10.26/HUB.${article.slug.slice(0, 8).toUpperCase()}`;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative grid grid-cols-1 md:grid-cols-12 border-b-[3px] border-black hover:bg-[#FAF9F6] dark:hover:bg-zinc-900/50 transition-colors"
        >
            {/* Visual Thumbnail Column */}
            <div className="md:col-span-3 border-r-[0px] md:border-r-[3px] border-black relative overflow-hidden aspect-[16/9] md:aspect-square group-hover:bg-[#FFC800]/5">
                <Image
                    src={article.cover_url || "/images/placeholder-article.webp"}
                    alt={article.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 mix-blend-multiply pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                    <Link href={`/makale/${article.slug}`} className="bg-[#FFC800] border-2 border-black px-4 py-2 font-black text-xs uppercase tracking-tighter shadow-neo-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                        VIEW_REPORT
                    </Link>
                </div>

                {/* Image Overlay Label */}
                <div className="absolute top-2 left-2 pointer-events-none">
                    <span className="bg-black text-white text-[8px] font-black px-1 py-0.5 tracking-widest uppercase">
                        PREVIEW_LENS
                    </span>
                </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-3">
                    <span className="bg-[#FFC800] border-2 border-black px-2 py-0.5 text-[8px] font-black text-black">
                        {article.category || "GENERAL_RESEARCH"}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-black/40 dark:text-white/20 uppercase tracking-widest">
                        DOC_TYPE: RESEARCH_ARTICLE
                    </span>
                </div>

                <Link href={`/makale/${article.slug}`}>
                    <h3 className="text-3xl md:text-5xl font-black font-head leading-[0.9] tracking-tighter text-black dark:text-white uppercase group-hover:text-[#FFC800] transition-colors">
                        {article.title}
                    </h3>
                </Link>

                <p className="font-serif text-lg text-black/60 dark:text-white/40 line-clamp-2 italic leading-relaxed md:max-w-xl">
                    {article.excerpt || article.summary || "This technical document explores complex physical interactions within the given research domain."}
                </p>

                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-black/40">
                        <User2 className="w-3 h-3" /> {authorName}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-black/40">
                        <Zap className="w-3 h-3 text-[#FFC800]" /> 2.4k VIEWS
                    </div>
                </div>
            </div>

            {/* Technical Metadata Column (Desktop Only) */}
            <div className="hidden md:flex md:col-span-3 border-l-[3px] border-black p-6 flex-col justify-between bg-black/[0.02] dark:bg-white/[0.01]">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-black/40 uppercase tracking-widest flex items-center gap-2">
                            <Hash className="w-2.5 h-2.5" /> DOI_REFERENCE
                        </div>
                        <div className="text-[10px] font-mono font-bold text-black dark:text-white truncate">
                            {doi_id}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-black/40 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-2.5 h-2.5" /> TIMESTAMP_SYS
                        </div>
                        <div className="text-[10px] font-mono font-bold text-black dark:text-white">
                            {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr }).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-black/10">
                    <div className="w-full h-8 bg-black/5 flex items-center justify-between px-3 text-[10px] font-mono font-black italic text-black/40">
                        <span>DATA_STABLE</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>
            </div>

            {/* Decorative Corner Arrow */}
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-8 h-8 text-[#FFC800] stroke-[3px]" />
            </div>
        </motion.div>
    );
}
