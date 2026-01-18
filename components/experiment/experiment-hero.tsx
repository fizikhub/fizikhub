"use client";

import { motion } from "framer-motion";
import { FlaskConical, TestTube2, Timer, User, Calendar, Atom, Beaker } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ExperimentHeroProps {
    article: any;
    readingTime: string;
    experimentMeta?: {
        purpose?: string;
        materials?: string[];
    };
}

export function ExperimentHero({ article, readingTime, experimentMeta }: ExperimentHeroProps) {
    return (
        <div className="relative w-full overflow-hidden bg-background border-b-2 border-green-900/10">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/5 via-background to-background" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container max-w-4xl mx-auto px-4 pt-24 pb-12 relative z-10">
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-6"
                >
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/10 border border-green-600/20 text-green-600 text-xs font-black uppercase tracking-widest">
                        <FlaskConical className="w-4 h-4" />
                        <span>Bilimsel Deney</span>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black text-center mb-8 uppercase tracking-tighter text-foreground leading-[0.9]"
                >
                    {article.title}
                </motion.h1>

                {/* Author & Meta */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-muted-foreground font-medium text-sm mb-12"
                >
                    <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                        <Avatar className="w-6 h-6 border border-green-500/30">
                            <AvatarImage src={article.author?.avatar_url} />
                            <AvatarFallback>{article.author?.full_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-foreground font-bold">{article.author?.full_name || "Anonim"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-green-600" />
                        <span>{readingTime}</span>
                    </div>
                </motion.div>

                {/* Experiment Meta Cards */}
                {experimentMeta && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {/* Purpose */}
                        {experimentMeta.purpose && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-green-600/20 hover:border-green-600/40 transition-colors shadow-[4px_4px_0px_0px_rgba(22,163,74,0.1)]"
                            >
                                <div className="flex items-center gap-3 mb-4 text-green-600">
                                    <Atom className="w-6 h-6" />
                                    <h3 className="font-black uppercase tracking-widest text-sm">Deneyin Amacı</h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed font-medium">
                                    {experimentMeta.purpose}
                                </p>
                            </motion.div>
                        )}

                        {/* Materials */}
                        {experimentMeta.materials && experimentMeta.materials.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-green-600/20 hover:border-green-600/40 transition-colors shadow-[4px_4px_0px_0px_rgba(22,163,74,0.1)]"
                            >
                                <div className="flex items-center gap-3 mb-4 text-green-600">
                                    <Beaker className="w-6 h-6" />
                                    <h3 className="font-black uppercase tracking-widest text-sm">Malzemeler</h3>
                                </div>
                                <ul className="grid grid-cols-2 gap-2">
                                    {experimentMeta.materials.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Cover Image */}
                {article.cover_url && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-background"
                    >
                        <Image
                            src={article.cover_url}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
