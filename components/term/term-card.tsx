"use client";

import { cn } from "@/lib/utils";
import { BookType, Hash } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TermCardProps {
    article: any; // Using any for now to match other cards, but could be specific type
    index: number;
}

export function TermCard({ article, index }: TermCardProps) {
    // Extract metadata from content if available, or fallback
    const metadataMatch = article.content.match(/<!--meta (.*?) -->/);
    const metadata = metadataMatch ? JSON.parse(metadataMatch[1]) : {};

    // Fallback if metadata is missing (legacy support or safeguards)
    const termName = metadata.termName || article.title;
    const relatedField = metadata.relatedField || "Genel";

    // Clean content (remove metadata)
    const cleanContent = article.content.replace(/<!--meta .*? -->/, "").trim();
    // Get first paragraph or short snippet
    const definition = cleanContent.split('\n\n')[0] || cleanContent;

    return (
        <motion.div>
            <Link href={`/makale/${article.slug}`}>
                <div className="group relative bg-card hover:bg-muted/30 border border-border/50 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden">

                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />

                    <div className="flex flex-col gap-4 relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <BookType className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                        <Hash className="w-3 h-3" />
                                        {relatedField}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black font-heading text-foreground tracking-tight group-hover:text-blue-600 transition-colors">
                                        {termName}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3">
                                {definition}
                            </p>
                        </div>

                        {/* Footer / Author */}
                        <div className="flex items-center gap-2 mt-2 pt-4 border-t border-border/30">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Ekleyen: <span className="text-foreground">{article.author?.full_name || article.author?.username || "Anonim"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
