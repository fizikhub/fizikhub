"use client";

import { Button } from "@/components/ui/button";
import { Atom, ArrowRight, FlaskConical, Microscope, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface QuestionOfTheWeekProps {
    questionId?: number;
    questionSlug?: string;
}

export function QuestionOfTheWeek({ questionId, questionSlug }: QuestionOfTheWeekProps) {
    const questionTitle = "Işık hızıyla giden bir trende ileriye doğru fener tutarsak ışığın hızı ne olur?";
    const targetUrl = questionId
        ? `/forum/${questionId}`
        : `/forum?q=${encodeURIComponent(questionTitle)}`;

    // Generate stars on client-side only to avoid hydration mismatch
    const [stars, setStars] = useState<Array<{
        left: number;
        top: number;
        width: number;
        height: number;
        opacity: number;
        duration: number;
    }>>([]);

    useEffect(() => {
        setStars(
            Array.from({ length: 20 }, () => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                duration: Math.random() * 3 + 2,
            }))
        );
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
        >
            <div className="relative overflow-hidden group transition-all duration-300 bg-gradient-to-br from-black via-gray-900 to-black border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1">
                {/* Space Background with Stars */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50" />

                    {/* Animated stars */}
                    {stars.map((star, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full"
                            style={{
                                left: `${star.left}%`,
                                top: `${star.top}%`,
                                width: star.width,
                                height: star.height,
                                opacity: star.opacity,
                            }}
                            animate={{
                                opacity: [0.3, 0.8, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: star.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Animated Pulse Decoration */}
                <div className="absolute top-3 right-3 z-20">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                        <div className="relative w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                    </div>
                </div>

                <div className="p-4 md:p-5 space-y-4 relative z-10">
                    {/* Header Section - Brutalist */}
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/20 border border-primary/40 backdrop-blur-sm rounded-md">
                            <FlaskConical className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Deney #42</span>
                        </div>
                        <h3 className="font-black text-lg md:text-xl uppercase tracking-tight text-white flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Haftanın Hipotezi
                        </h3>
                    </div>

                    {/* Question Content - Enhanced */}
                    <div className="relative pl-3 border-l-2 border-primary/50 bg-white/5 backdrop-blur-sm p-3 rounded-r-xl">
                        <h3 className="text-sm md:text-base font-bold leading-relaxed text-white/90 line-clamp-3">
                            "{questionTitle}"
                        </h3>
                    </div>

                    {/* Technical Data / Reward - Brutalist Card */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-inner">
                        <div className="p-1.5 bg-primary/20 border border-primary/40 text-primary rounded-lg">
                            <Atom className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase text-primary mb-0.5 tracking-wider">Ödül</p>
                            <p className="text-xs font-medium text-white/80 truncate">
                                En iyi teoriye <span className="text-primary font-bold">Einstein Rozeti</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Button - Enhanced Brutalist */}
                    <Link href={targetUrl} className="block">
                        <Button size="sm" className="w-full h-10 gap-2 bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs sm:text-sm border-0 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group relative overflow-hidden rounded-xl">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Microscope className="h-4 w-4" />
                            <span className="relative z-10">Analiz Başlat</span>
                            <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                    </Link>
                </div>

                {/* Bottom Accent Bar - Brutalist */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
            </div>
        </motion.div>
    );
}
