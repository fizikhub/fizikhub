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
                <div className="group relative h-full bg-card hover:bg-muted/30 border border-border/60 hover:border-primary/20 rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden flex flex-col justify-between">

                    {/* Dictionary Style Decoration - Top Right */}
                    <div className="absolute top-6 right-8 text-xs font-serif text-muted-foreground/20 font-bold select-none pointer-events-none">
                        [n.]
                    </div>

                    <div className="relative z-10 flex flex-col gap-3">
                        {/* Header: Field Badge - More subtle */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary/80 transition-colors">
                                {relatedField}
                            </span>
                        </div>

                        {/* Term Name & Content - Dictionary Style */}
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-3xl sm:text-4xl font-black font-serif text-foreground tracking-tight group-hover:text-primary transition-colors decoration-clone leading-tight">
                                    {termName}
                                </h3>
                                <div className="flex items-center gap-2 text-muted-foreground/50 text-sm font-serif italic">
                                    <span>/{termName.toLowerCase().replace(/\s/g, '-')}/</span>
                                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                    <span>isim</span>
                                </div>
                            </div>

                            <div className="relative mt-4">
                                <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed font-serif opacity-90 line-clamp-4 first-letter:float-left first-letter:text-3xl first-letter:pr-2 first-letter:font-black first-letter:text-foreground/20">
                                    {definition}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Minimalist */}
                    <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/10 group-hover:border-border/30 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border/50 shadow-sm bg-muted/50 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                {article.author?.avatar_url ? (
                                    <img
                                        src={article.author.avatar_url}
                                        alt={article.author.full_name || "Author"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-gray-500 to-slate-500 flex items-center justify-center text-[8px] text-white font-black uppercase">
                                        {article.author?.full_name?.[0] || "A"}
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                                {article.author?.full_name || article.author?.username || "Sözlük"}
                            </span>
                        </div>
                        <span className="text-xs font-serif text-muted-foreground/30 italic group-hover:text-primary/50 transition-colors">
                            bakınız &rarr;
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
