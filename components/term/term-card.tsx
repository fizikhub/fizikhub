"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion } from "framer-motion";
import { Volume2, Copy } from "lucide-react";

interface TermCardProps {
    article: any;
    index: number;
}

export function TermCard({ article, index }: TermCardProps) {
    // Extract metadata
    const metadataMatch = article.content.match(/<!--meta (.*?) -->/);
    const metadata = metadataMatch ? JSON.parse(metadataMatch[1]) : {};

    // Fallback metadata
    const termName = metadata.termName || article.title;
    const relatedField = metadata.relatedField || "Genel";

    // Clean content for V9 Preview
    let cleanContent = article.content.replace(/<!--meta .*? -->/, "");
    cleanContent = cleanContent.replace(/<[^>]*>?/gm, " ");
    cleanContent = cleanContent.trim();
    const definition = cleanContent.slice(0, 160) + (cleanContent.length > 160 ? "..." : "");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="h-full"
        >
            <ViewTransitionLink href={`/makale/${article.slug}`} className="block h-full group perspective-1000">
                <article
                    className={cn(
                        "flex flex-col h-full relative overflow-hidden transition-all duration-300",
                        // CONTAINER STYLE - Cyber Dictionary
                        "bg-[#f0f0f0] dark:bg-[#18181b]",
                        "border-[3px] border-black rounded-[4px]",
                        "shadow-[5px_5px_0px_0px_#000]",
                        // HOVER
                        "group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_#000]"
                    )}
                >
                    {/* DECORATIVE: Left Stripe */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black z-10" />

                    {/* HEADER: Technical Metadata */}
                    <div className="flex items-center justify-between pl-5 pr-4 py-3 border-b-[3px] border-black bg-white dark:bg-black z-10 relative">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            ID: {article.id?.toString().padStart(4, '0')} // <span className="text-[#23A9FA]">{relatedField}</span>
                        </span>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                    </div>

                    {/* CONTENT BODY */}
                    <div className="flex-1 pl-6 pr-5 py-6 flex flex-col gap-3 z-10 relative bg-[#f8f9fa] dark:bg-[#202022]">

                        {/* Term Name & Phonetics */}
                        <div>
                            <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mb-1">
                                <h3 className="font-[family-name:var(--font-outfit)] text-4xl font-black text-black dark:text-white leading-none tracking-tight group-hover:bg-[#23A9FA] group-hover:text-black transition-colors px-1 -ml-1">
                                    {termName}
                                </h3>
                                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                    /{termName.toLowerCase().replace(/\s/g, '-')}/
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-3 border-b border-black/10 pb-3 border-dashed">
                                <span className="bg-black/5 px-1.5 py-0.5 rounded text-black dark:text-white dark:bg-white/10">isim</span>
                                <span>•</span>
                                <span>{relatedField}</span>
                            </div>
                        </div>

                        {/* Definition Text */}
                        <p className="font-serif text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 line-clamp-4 italic">
                            {definition}
                        </p>
                    </div>

                    {/* FOOTER - Action Bar */}
                    <div className="mt-auto pl-6 pr-5 py-3 border-t-[3px] border-black bg-white dark:bg-black flex items-center justify-between z-10 relative group-hover:bg-[#23A9FA] transition-colors duration-300">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 group-hover:text-black transition-colors">
                                SÖZLÜK GİRDİSİ
                            </span>
                        </div>
                        <Volume2 className="w-4 h-4 text-black opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                </article>
            </ViewTransitionLink>
        </motion.div>
    );
}
