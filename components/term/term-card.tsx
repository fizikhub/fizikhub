"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link"; // [NEW]
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

    // Clean content for V9 Preview (Simple text stripping)
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
            <ViewTransitionLink href={`/makale/${article.slug}`} className="block h-full group">
                <article
                    className={cn(
                        "flex flex-col h-full relative overflow-hidden",
                        "border-3 border-black bg-white text-black",
                        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                        "dark:bg-zinc-900 dark:border-white dark:text-white",
                        "dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                        "hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-xl"
                    )}
                >
                    {/* TOP BANNER (Behaves like the Image in NexusCard) */}
                    <div className="relative aspect-video w-full overflow-hidden border-b-3 border-black dark:border-white bg-[#FFC800] dark:bg-[#FFC800] flex items-center justify-center">
                        {/* Huge Abstract Letter */}
                        <span className="font-heading font-black text-8xl md:text-9xl opacity-20 text-black select-none pointer-events-none mb-4">
                            {termName.charAt(0).toUpperCase()}
                        </span>

                        {/* NOISE TEXTURE ON BANNER */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply z-0"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                        />

                        {/* Top Left Badge inside Banner (Like NexusCard) */}
                        <div className="absolute top-2 left-2 z-10">
                            <span className="neo-badge bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                TERİM
                            </span>
                        </div>

                        {/* Top Right Floating Category */}
                        <div className="absolute top-2 right-2 z-10">
                            <span className="text-[10px] font-black uppercase text-black bg-white/50 px-2 py-1 border-2 border-black">
                                {relatedField}
                            </span>
                        </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="p-4 flex flex-col flex-grow bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 font-mono">
                            <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10">[ isim ]</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#23A9FA]" />
                            <span>/{termName.toLowerCase().replace(/\s/g, '-')}/</span>
                        </div>

                        <h3 className="font-heading font-black text-xl leading-tight mb-2 line-clamp-2 dark:text-white">
                            {termName}
                        </h3>

                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4 flex-grow">
                            {definition}
                        </p>

                        {/* FOOTER SECTION (Like NexusCard) */}
                        <div className="flex items-center justify-between text-xs font-bold border-t-2 border-dashed border-black/20 dark:border-white/20 pt-3">
                            <div className="flex items-center gap-2">
                                {article.author?.avatar_url && (
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-black dark:border-white relative">
                                        <img src={article.author.avatar_url} alt={article.author.full_name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <span className="dark:text-white truncate max-w-[100px]">{article.author?.full_name || "Sözlük"}</span>
                            </div>
                            <div className="flex items-center text-[#23A9FA] group-hover:translate-x-1 transition-transform">
                                <span className="uppercase text-[10px] font-black mr-1">Tümünü Oku</span>
                                →
                            </div>
                        </div>
                    </div>
                </article>
            </ViewTransitionLink>
        </motion.div>
    );
}
