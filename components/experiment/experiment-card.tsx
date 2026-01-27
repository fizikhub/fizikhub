"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link"; // [NEW]
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, FlaskConical, Beaker, Atom } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ExperimentCardProps {
    article: any;
    index?: number;
}

export function ExperimentCard({ article, index = 0 }: ExperimentCardProps) {
    const timeAgo = formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr });
    const href = `/deney/${article.slug}`;

    return (
        <ViewTransitionLink href={href} className="block group">
            <article
                className={cn(
                    "relative flex flex-row overflow-hidden rounded-2xl transition-all duration-300",
                    "bg-card border-2 border-slate-200 dark:border-slate-800",
                    "hover:border-green-500/50 dark:hover:border-green-500/50",
                    "shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1"
                )}
            >
                {/* Decorative Elements - Subtle Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Left/Top: Image Section - Compact on Mobile */}
                <div className="relative w-32 sm:w-48 h-auto shrink-0 bg-muted flex items-center justify-center overflow-hidden border-r border-border/50">
                    <Image
                        src={article.cover_url || article.image_url || "/images/placeholder-experiment.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors duration-500" />

                    {/* Badge Overlay */}
                    <div className="absolute top-2 left-2 bg-green-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <FlaskConical className="w-3 h-3" />
                        <span>Deney</span>
                    </div>
                </div>

                {/* Scientific Decorations - Animated */}
                <div className="absolute right-2 bottom-20 opacity-10 pointer-events-none hidden sm:block">
                    <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                        <FlaskConical className="w-12 h-12 text-green-600" />
                    </motion.div>
                </div>
                <div className="absolute right-[-10px] top-[-10px] opacity-5 pointer-events-none">
                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                        <Atom className="w-24 h-24 text-green-600" />
                    </motion.div>
                </div>

                {/* Right/Bottom: Content Section */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between relative bg-gradient-to-br from-card to-green-50/50 dark:to-green-950/10 z-10">
                    <div>
                        {/* Header Info */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-5 h-5 border border-border">
                                    <AvatarImage src={article.author?.avatar_url || ""} />
                                    <AvatarFallback className="text-[9px] font-bold text-green-700 bg-green-100">
                                        {article.author?.full_name?.[0] || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-green-600 transition-colors">
                                    {article.author?.full_name || article.author?.username || "Anonim"}
                                </span>
                            </div>
                            <time className="text-[10px] font-bold text-muted-foreground/50 whitespace-nowrap hidden min-[350px]:block">
                                {timeAgo}
                            </time>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-lg font-bold font-heading leading-tight text-foreground group-hover:text-green-600 transition-colors mb-2 line-clamp-2">
                            {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium mb-3">
                            {article.excerpt || article.summary}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-dashed border-border/50">
                        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground/70">
                            <div className="flex items-center gap-1 group-hover:text-green-600 transition-colors">
                                <Beaker className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Gözlem</span>
                            </div>
                        </div>

                        <div className="flex items-center text-xs font-black uppercase tracking-wide text-green-600 group-hover:text-green-700 transition-colors">
                            İncele
                            <Atom className="w-3.5 h-3.5 ml-1 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </article>
        </ViewTransitionLink>
    );
}
