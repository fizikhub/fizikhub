"use client";

import { cn } from "@/lib/utils";
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
            <Link href={`/makale/${article.slug}`} className="block h-full group">
                <article
                    className={cn(
                        "flex flex-col h-full relative overflow-hidden",
                        // CONTAINER STYLE (V9 Standard)
                        "bg-white dark:bg-[#27272a]",
                        "border-[3px] border-black rounded-[8px]",
                        "shadow-[4px_4px_0px_0px_#000]",
                        // HOVER
                        "transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
                    )}
                >
                    {/* NOISE TEXTURE */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    {/* HEADER: Term Type / Category */}
                    <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-black bg-[#FF90E8] z-10 relative">
                        <span className="font-black text-xs uppercase tracking-widest text-black">
                            {relatedField}
                        </span>
                        <div className="bg-black text-[#FF90E8] px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase">
                            TERİM
                        </div>
                    </div>

                    {/* CONTENT BODY */}
                    <div className="flex-1 p-5 flex flex-col gap-4 z-10 relative">

                        {/* Term Name - Huge Type */}
                        <div>
                            <h3 className="font-[family-name:var(--font-outfit)] text-3xl font-black text-black dark:text-zinc-50 leading-none uppercase tracking-tighter mb-1 select-all hover:bg-[#FF90E8] hover:text-black inline-block transition-colors">
                                {termName}
                            </h3>
                            <div className="flex items-center gap-2 text-neutral-500 dark:text-zinc-500 text-xs font-mono font-bold mt-1">
                                <span>[ isim ]</span>
                                <span className="w-1 h-1 rounded-full bg-current" />
                                <span>/{termName.toLowerCase().replace(/\s/g, '-')}/</span>
                            </div>
                        </div>

                        {/* Definition Text */}
                        <p className="font-[family-name:var(--font-inter)] text-sm font-semibold text-neutral-700 dark:text-zinc-300 leading-relaxed font-mono-accent">
                            {definition}
                        </p>
                    </div>

                    {/* FOOTER - Simple */}
                    <div className="mt-auto px-5 py-3 border-t-[3px] border-black bg-neutral-50 dark:bg-[#18181b] flex items-center justify-between z-10 relative">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border-2 border-black overflow-hidden bg-white">
                                {article.author?.avatar_url ? (
                                    <img src={article.author.avatar_url} alt="A" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-black" />
                                )}
                            </div>
                            <span className="text-[10px] font-black uppercase text-black dark:text-zinc-400">
                                {article.author?.full_name || "Sözlük"}
                            </span>
                        </div>
                        <span className="text-xs font-black text-black dark:text-zinc-500 group-hover:translate-x-1 transition-transform">
                            →
                        </span>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
