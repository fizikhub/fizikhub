"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { Bookmark, Heart, Share2, Terminal } from "lucide-react";

interface CyberArticleCardProps {
    article: any;
    isLiked: boolean;
    isBookmarked: boolean;
    likeCount: number;
    onLike: (e: any) => void;
    onBookmark: (e: any) => void;
    onShare: (e: any) => void;
    badgeLabel?: string;
}

export function CyberArticleCard({
    article,
    isLiked,
    isBookmarked,
    likeCount,
    onLike,
    onBookmark,
    onShare,
    badgeLabel
}: CyberArticleCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const randomId = Math.floor(Math.random() * 9999).toString().padStart(4, '0');

    return (
        <Link href={`/makale/${article.slug}`}>
            <motion.div
                className="group relative w-full bg-black/80 border border-cyan-500/30 overflow-hidden mb-4"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.01 }}
            >
                {/* DECORATIVE CORNERS */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500 z-20" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500 z-20" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500 z-20" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500 z-20" />

                <div className="flex flex-col md:flex-row h-full">
                    {/* LEFT: TECH METADATA (Replaces Image as main visual) */}
                    <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-cyan-500/20 p-4 flex flex-col justify-between relative bg-cyan-950/10">
                        {/* Scanline overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-500/70">
                                <Terminal className="w-3 h-3" />
                                <span>SYS.LOG.{randomId}</span>
                            </div>

                            <div className="font-mono text-[10px] text-cyan-400/50 space-y-1">
                                <p>TARGET: {article.category || 'UNKNOWN'}</p>
                                <p>AUTHOR: {article.author?.full_name?.toUpperCase() || 'ANONYMOUS'}</p>
                                <p>DATE: {new Date(article.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Low-fi version of image filter */}
                        <div className="mt-4 relative h-32 w-full grayscale opacity-60 hover:opacity-100 transition-opacity overflow-hidden border border-cyan-900">
                            {article.image_url ? (
                                <Image
                                    src={article.image_url}
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-cyan-900/20" />
                            )}
                            {/* Glitch overlay */}
                            <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay" />
                        </div>
                    </div>

                    {/* RIGHT: CONTENT DATA */}
                    <div className="flex-1 p-5 relative">
                        {/* Header Line */}
                        <div className="flex items-center justify-between mb-3 border-b border-cyan-500/20 pb-2">
                            <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/40 text-[10px] font-mono text-cyan-400 uppercase">
                                {badgeLabel || "PUBLIC_ACCESS"}
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-1 h-1 ${i === 2 ? 'bg-red-500' : 'bg-cyan-500/50'}`} />
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-mono text-lg md:text-xl text-cyan-100 font-bold leading-tight mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                            {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="font-mono text-xs text-cyan-400/60 line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed">
                            {article.excerpt || "DATA_CORRUPTED_OR_MISSING_PREVIEW. ACCESS_FILE_TO_READ_FULL_CONTENTS."}
                        </p>

                        {/* ACTIONS HUD */}
                        <div className="flex items-center gap-4 mt-auto">
                            <button
                                onClick={onLike}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1 border border-cyan-500/30 text-[10px] font-mono transition-all hover:bg-cyan-500/20",
                                    isLiked ? "bg-cyan-500/20 text-cyan-300 border-cyan-400" : "text-cyan-500/60"
                                )}
                            >
                                <Heart className="w-3 h-3" />
                                <span>ACKL: {likeCount}</span>
                            </button>

                            <button
                                onClick={onBookmark}
                                className={cn(
                                    "p-1.5 border border-cyan-500/30 text-cyan-500/60 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all",
                                    isBookmarked && "text-cyan-300 border-cyan-400 bg-cyan-500/10"
                                )}
                            >
                                <Bookmark className="w-3 h-3" />
                            </button>
                        </div>

                        {/* HOVER DECORATION */}
                        <motion.div
                            className="absolute right-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ x: 10 }}
                            whileHover={{ x: 0 }}
                        >
                            <span className="text-[9px] font-mono text-cyan-500">ACCESS_&gt;</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
