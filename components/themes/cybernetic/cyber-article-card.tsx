"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Bookmark, Heart, Share2, Terminal, Eye, Zap } from "lucide-react";

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
    const [scanlineOffset, setScanlineOffset] = useState(0);
    const randomId = Math.floor(Math.random() * 9999).toString().padStart(4, '0');

    // Scanline animation
    useEffect(() => {
        const interval = setInterval(() => {
            setScanlineOffset(prev => (prev + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <Link href={`/makale/${article.slug}`}>
            <motion.div
                className="group relative w-full bg-black/95 border border-cyan-500/30 overflow-hidden mb-4 hover:border-cyan-400/60 transition-all duration-300"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.005, boxShadow: "0 0 30px rgba(0, 240, 255, 0.3)" }}
            >
                {/* CYBER CORNERS */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20" />

                {/* ANIMATED SCANLINES */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-50"
                    style={{ transform: `translateY(${scanlineOffset}%)` }}
                />

                {/* GRID OVERLAY */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none z-0" />

                <div className="flex flex-col md:flex-row relative z-10">
                    {/* LEFT PANEL: IMAGE & TECH DATA */}
                    <div className="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-cyan-500/20 relative overflow-hidden">
                        {/* Image Container */}
                        <div className="relative h-48 md:h-full min-h-[200px] overflow-hidden">
                            {article.image_url ? (
                                <>
                                    <Image
                                        src={article.image_url}
                                        alt="Cover"
                                        fill
                                        className="object-cover transition-all duration-500 group-hover:scale-105"
                                    />
                                    {/* Holographic overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 mix-blend-overlay" />
                                    {/* Glitch effect on hover */}
                                    <motion.div
                                        className="absolute inset-0 bg-cyan-500/30"
                                        initial={{ opacity: 0, x: 0 }}
                                        animate={isHovered ? {
                                            opacity: [0, 0.3, 0],
                                            x: ['-100%', '0%', '100%']
                                        } : {}}
                                        transition={{ duration: 0.3 }}
                                    />
                                </>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-cyan-900/20 to-purple-900/20 flex items-center justify-center">
                                    <Terminal className="w-16 h-16 text-cyan-500/30" />
                                </div>
                            )}

                            {/* Tech overlay bottom */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3">
                                <div className="font-mono text-[9px] text-cyan-400/70 space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-2.5 h-2.5" />
                                        <span>ID: {randomId}</span>
                                    </div>
                                    <div>CAT: {article.category?.toUpperCase() || 'UNCATEGORIZED'}</div>
                                    <div>AUTH: {article.author?.username?.toUpperCase() || 'SYSTEM'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: CONTENT */}
                    <div className="flex-1 p-4 md:p-5 flex flex-col justify-between relative">
                        {/* Header Status Bar */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                                    {badgeLabel || "ARTICLE"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-cyan-500/50" />
                                <div className="w-1 h-1 bg-cyan-500/50" />
                                <div className="w-1 h-1 bg-red-500" />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-mono text-base md:text-xl text-cyan-50 font-bold leading-tight mb-3 group-hover:text-cyan-300 transition-colors uppercase tracking-tight">
                            {article.title}
                            <motion.span
                                className="inline-block ml-1 text-cyan-400"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                _
                            </motion.span>
                        </h3>

                        {/* Excerpt */}
                        <p className="font-mono text-xs text-cyan-400/60 line-clamp-2 mb-4 leading-relaxed">
                            <span className="text-cyan-500/80">&gt;</span> {article.excerpt || "NO_DATA_AVAILABLE. ACCESS_DENIED."}
                        </p>

                        {/* Stats HUD */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/10">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-600">
                                <Eye className="w-3 h-3" />
                                <span>{article.views || 0}</span>
                            </div>
                            <div className="w-px h-3 bg-cyan-500/20" />
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-600">
                                <Zap className="w-3 h-3" />
                                <span>{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center gap-2 mt-auto">
                            <button
                                onClick={onLike}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 border font-mono text-[10px] transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]",
                                    isLiked
                                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                                        : "text-cyan-500/70 border-cyan-500/30 hover:border-cyan-400"
                                )}
                            >
                                <Heart className={cn("w-3 h-3", isLiked && "fill-current")} />
                                <span>{likeCount}</span>
                            </button>

                            <button
                                onClick={onBookmark}
                                className={cn(
                                    "p-1.5 border transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]",
                                    isBookmarked
                                        ? "text-cyan-300 border-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                                        : "text-cyan-500/70 border-cyan-500/30 hover:border-cyan-400"
                                )}
                            >
                                <Bookmark className={cn("w-3 h-3", isBookmarked && "fill-current")} />
                            </button>

                            <button
                                onClick={onShare}
                                className="p-1.5 border border-cyan-500/30 text-cyan-500/70 hover:text-cyan-300 hover:border-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                            >
                                <Share2 className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Hover Access Indicator */}
                        <motion.div
                            className="absolute bottom-3 right-3 font-mono text-[9px] text-cyan-500"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        >
                            &gt;&gt; ACCESS
                        </motion.div>
                    </div>
                </div>

                {/* Data flow animation on hover */}
                <motion.div
                    className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    initial={{ width: "0%" }}
                    animate={isHovered ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 0.5 }}
                />
            </motion.div>
        </Link>
    );
}
