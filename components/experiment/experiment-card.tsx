"use client";

import Link from "next/link";
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

    return (
        <motion.div
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300",
                "bg-card border-2 border-green-600/30 hover:border-green-500",
                "shadow-[4px_4px_0px_0px_rgba(22,163,74,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(22,163,74,0.4)] hover:-translate-y-1"
            )}
        >
            {/* Bubbling Animation Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bottom-0 w-2 h-2 rounded-full bg-green-500/20"
                        style={{ left: `${Math.random() * 100}%` }}
                        animate={{
                            y: [0, -300],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.5]
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </div>

            {/* Header / Banner */}
            <div className="bg-green-600/10 border-b-2 border-green-600/20 px-4 py-2 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-green-600">
                    <FlaskConical className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Bilimsel Deney</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    <div className="w-2 h-2 rounded-full bg-green-500/30" />
                    <div className="w-2 h-2 rounded-full bg-green-500/30" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row h-full relative z-10 bg-gradient-to-br from-card to-green-500/5">
                {/* Image Section - Test Tube Shape Mask on Desktop? No, stick to clean geometry for consistency */}
                <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto border-b-2 md:border-b-0 md:border-r-2 border-green-600/20 overflow-hidden">
                    <Link href={`/makale/${article.slug}`}>
                        <Image
                            src={article.image_url || "/images/placeholder-experiment.webp"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-green-900/20 group-hover:bg-transparent transition-colors duration-500" />

                        {/* Overlay Icon */}
                        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Atom className="w-4 h-4 text-green-400" />
                        </div>
                    </Link>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 flex flex-col justify-between relative">
                    {/* Background decoration - Molecular Structure */}
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-500">
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
                            <circle cx="50" cy="50" r="10" />
                            <circle cx="80" cy="20" r="8" />
                            <circle cx="20" cy="80" r="8" />
                            <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" strokeWidth="4" />
                            <line x1="50" y1="50" x2="20" y2="80" stroke="currentColor" strokeWidth="4" />
                        </svg>
                    </div>

                    <div>
                        {/* Author & Time */}
                        <div className="flex items-center gap-2 mb-3">
                            <Avatar className="w-6 h-6 border-2 border-green-500/20">
                                <AvatarImage src={article.author?.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] bg-green-50 text-green-700 font-bold">
                                    {article.author?.full_name?.[0] || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-foreground leading-none">
                                    {article.author?.full_name || article.author?.username || "Anonim"}
                                </span>
                                <span className="text-[10px] text-muted-foreground leading-none mt-1 font-medium">{timeAgo}</span>
                            </div>
                        </div>

                        <Link href={`/makale/${article.slug}`}>
                            <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-3 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                                {article.title}
                            </h3>
                        </Link>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-medium leading-relaxed">
                            {article.summary}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-green-600/10 mt-auto">
                        <div className="flex gap-4 text-xs font-bold text-muted-foreground/80">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/5 group-hover:bg-green-500/10 transition-colors">
                                <Beaker className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-green-700 dark:text-green-400">Gözlem</span>
                            </div>
                        </div>

                        <Link href={`/makale/${article.slug}`}>
                            <button className="text-[10px] font-black uppercase tracking-wider bg-green-600 text-white px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(20,83,45,0.4)] hover:bg-green-700 hover:shadow-[1px_1px_0px_0px_rgba(20,83,45,0.4)] hover:translate-y-[1px] transition-all flex items-center gap-2 group/btn">
                                İncele <FlaskConical className="w-3 h-3 group-hover/btn:rotate-12 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
