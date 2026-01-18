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
                "bg-card border-2 border-green-600/50 hover:border-green-500",
                "shadow-[4px_4px_0px_0px_rgba(22,163,74,0.4)] hover:shadow-[2px_2px_0px_0px_rgba(22,163,74,0.6)] hover:translate-x-[2px] hover:translate-y-[2px]"
            )}
        >
            {/* Header / Banner */}
            <div className="bg-green-600/10 border-b-2 border-green-600/20 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600">
                    <FlaskConical className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Bilimsel Deney</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto border-b-2 md:border-b-0 md:border-r-2 border-green-600/20 overflow-hidden">
                    <Link href={`/makale/${article.slug}`}>
                        <Image
                            src={article.image_url || "/images/placeholder-experiment.webp"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors" />
                    </Link>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 flex flex-col justify-between relative bg-gradient-to-br from-transparent to-green-500/5">
                    {/* Background decoration */}
                    <Atom className="absolute -bottom-4 -right-4 w-24 h-24 text-green-500/5 rotate-12" />

                    <div>
                        {/* Author & Time */}
                        <div className="flex items-center gap-2 mb-3">
                            <Avatar className="w-6 h-6 border border-green-500/30">
                                <AvatarImage src={article.author?.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] bg-green-100 text-green-700">
                                    {article.author?.full_name?.[0] || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-foreground leading-none">
                                    {article.author?.full_name || article.author?.username || "Anonim"}
                                </span>
                                <span className="text-[9px] text-muted-foreground leading-none mt-0.5">{timeAgo}</span>
                            </div>
                        </div>

                        <Link href={`/makale/${article.slug}`}>
                            <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                        </Link>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-medium leading-relaxed">
                            {article.summary}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-green-600/10">
                        <div className="flex gap-4 text-xs font-bold text-muted-foreground">
                            {/* Stats placeholders - data would come from article prop ideally */}
                            <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                                <Beaker className="w-3.5 h-3.5" />
                                <span>Gözlemle</span>
                            </div>
                        </div>

                        <Link href={`/makale/${article.slug}`}>
                            <button className="text-xs font-black uppercase tracking-wide bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-all hover:shadow-md flex items-center gap-2">
                                İncele <FlaskConical className="w-3 h-3" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
