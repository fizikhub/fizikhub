"use client";

import { cn } from "@/lib/utils";
import { BookType, Hash, Quote } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

    // Clean content
    let cleanContent = article.content.replace(/<!--meta .*? -->/, "");
    // STRIP HTML TAGS (Crucial fix for <p> tags)
    cleanContent = cleanContent.replace(/<[^>]*>?/gm, " ");
    cleanContent = cleanContent.trim();

    // Get definition snippet
    const definition = cleanContent.slice(0, 160) + (cleanContent.length > 160 ? "..." : "");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -6 }}
            className="h-full"
        >
            <Link href={`/makale/${article.slug}`} className="block h-full">
                <div className="group relative h-full bg-card hover:bg-gradient-to-br hover:from-card hover:to-blue-500/5 dark:hover:to-blue-900/10 border border-border/50 hover:border-blue-500/30 rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden flex flex-col justify-between">

                    {/* Decorative Watermark - Serif Quote - ADJUSTED POSITION */}
                    <div className="absolute right-4 -top-2 text-[8rem] leading-none font-serif text-blue-500/5 rotate-12 select-none pointer-events-none group-hover:text-blue-500/10 transition-colors duration-500">
                        &rdquo;
                    </div>

                    {/* Subtle Background Blob */}
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col gap-5">
                        {/* Header: Field Badge */}
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/10 text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 group-hover:border-blue-500/30 transition-colors">
                                <Hash className="w-3 h-3" />
                                {relatedField}
                            </span>
                        </div>

                        {/* Term Name & Content */}
                        <div className="space-y-4">
                            <h3 className="text-2xl sm:text-4xl font-black font-heading text-foreground tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors decoration-clone leading-none">
                                {termName}
                            </h3>

                            <div className="relative pl-5 border-l-2 border-blue-500/30 group-hover:border-blue-500 transition-colors duration-300">
                                <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed italic opacity-90 line-clamp-4">
                                    {definition}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/20 group-hover:border-blue-500/10 transition-colors">
                        <div className="flex items-center gap-3">
                            {/* UPDATED AVATAR LOGIC */}
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border/50 shadow-sm bg-muted/50">
                                {article.author?.avatar_url ? (
                                    <img
                                        src={article.author.avatar_url}
                                        alt={article.author.full_name || "Author"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] text-white font-black uppercase">
                                        {article.author?.full_name?.[0] || "A"}
                                    </div>
                                )}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors flex flex-col justify-center">
                                <span className="text-blue-500/50 text-[9px] leading-none mb-0.5">TARAFINDAN</span>
                                {article.author?.full_name || article.author?.username || "Anonim"}
                            </div>
                        </div>
                        <BookType className="w-4 h-4 text-muted-foreground/30 group-hover:text-blue-500 transition-colors" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
