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
            Array.from({ length: 30 }, () => ({
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
        >
            <div className="relative overflow-hidden group transition-all duration-300 bg-gradient-to-br from-black via-gray-900 to-black border-2 border-white/20 rounded-lg shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-x-1 hover:-translate-y-1">
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
                <div className="absolute top-4 right-4 z-20">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                        <div className="relative w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-6 relative z-10">
                    {/* Header Section - Brutalist */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border-2 border-primary/40 backdrop-blur-sm">
                            <FlaskConical className="h-4 w-4 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Deney Protokolü #42</span>
                        </div>
                        <h3 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-primary" />
                            Haftanın Hipotezi
                        </h3>
                    </div>

                    {/* Question Content - Enhanced */}
                    <div className="relative pl-4 border-l-4 border-primary/50 bg-white/5 backdrop-blur-sm p-4 rounded-r-lg">
                        <h3 className="text-lg md:text-xl font-bold leading-relaxed text-white/90">
                            "{questionTitle}"
                        </h3>
                    </div>

                    {/* Technical Data / Reward - Brutalist Card */}
                    <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="p-3 bg-primary border-2 border-white/30 text-white">
                            <Atom className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black uppercase text-primary mb-1 tracking-wider">Ödül Verisi</p>
                            <p className="text-sm font-medium text-white/80">
                                En iyi teoriye <span className="text-primary font-bold">"Einstein Rozeti"</span> tanımlanacak.
                            </p>
                        </div>
                    </div>

                    {/* Action Button - Enhanced Brutalist */}
                    <Link href={targetUrl} className="block">
                        <Button className="w-full h-14 gap-3 bg-primary hover:bg-primary/90 text-white font-black uppercase text-base border-2 border-white/20 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none group relative overflow-hidden rounded-md">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Microscope className="h-5 w-5" />
                            <span className="relative z-10">Analiz Başlat</span>
                            <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                    </Link>
                </div>

                {/* Bottom Accent Bar - Brutalist */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
            </div>
        </motion.div>
    );
}
