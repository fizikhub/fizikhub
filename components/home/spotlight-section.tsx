"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Article } from "@/lib/api";

interface SpotlightSectionProps {
    articles: Article[];
}

export function SpotlightSection({ articles }: SpotlightSectionProps) {
    if (!articles || articles.length === 0) return null;

    // Take top 5 for spotlight
    const spotlightItems = articles.slice(0, 5);

    return (
        <div className="w-full py-4 space-y-3">
            <div className="flex items-center justify-between px-2 sm:px-0">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Trending
                </h2>
                <span className="text-[10px] font-bold text-muted-foreground/60">TOP 5</span>
            </div>

            <div className="flex overflow-x-auto gap-4 px-4 sm:px-0 pb-6 -mx-4 sm:mx-0 snap-x snap-mandatory scrollbar-hide">
                {spotlightItems.map((article, index) => (
                    <Link
                        key={article.id}
                        href={`/blog/${article.slug}`}
                        className="flex-shrink-0 relative w-[85vw] sm:w-[320px] aspect-[4/3] snap-center group"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02, y: -4 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-full h-full rounded-2xl overflow-hidden shadow-md relative bg-muted"
                        >
                            {/* Image */}
                            <Image
                                src={article.image_url || "/images/placeholder-article.webp"}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col gap-2">
                                <span className={cn(
                                    "inline-flex self-start px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                    "bg-white/20 text-white backdrop-blur-sm border border-white/10"
                                )}>
                                    {article.category || "Genel"}
                                </span>

                                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                                    {article.title}
                                </h3>

                                <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium">
                                    <span>@{article.author?.username}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/40" />
                                    <span>Spotlight No. {index + 1}</span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
