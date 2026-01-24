"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
            <Card className="relative overflow-hidden group transition-all duration-300 bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] p-0">
                {/* Decoration: Colorful Stripes */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neo-pink via-neo-yellow to-neo-blue border-b-2 border-black" />

                <div className="p-4 md:p-6 space-y-4 relative z-10">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neo-purple text-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                                <FlaskConical className="h-4 w-4 stroke-[2.5px]" />
                                <span className="text-[11px] font-black uppercase tracking-widest font-mono">Deney #42</span>
                            </div>
                            <h3 className="font-black text-lg md:text-xl uppercase tracking-tight text-black dark:text-white flex items-center gap-2 font-heading pt-2">
                                <Sparkles className="h-5 w-5 text-neo-yellow fill-black stroke-black" />
                                Haftanın Hipotezi
                            </h3>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="relative pl-4 border-l-[6px] border-neo-blue bg-gray-50 dark:bg-white/5 p-4 rounded-r-xl border-y-2 border-r-2 border-black/10 dark:border-white/10">
                        <h3 className="text-xl sm:text-xl font-black leading-tight text-black dark:text-white font-heading">
                            "{questionTitle}"
                        </h3>
                    </div>

                    {/* Reward */}
                    <div className="flex items-center gap-3 p-3 bg-neo-yellow/20 border-2 border-black rounded-xl">
                        <div className="p-2 bg-neo-yellow border-2 border-black text-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                            <Atom className="h-5 w-5 stroke-[2.5px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase text-black/60 mb-0.5 tracking-wider font-mono">Ödül</p>
                            <p className="text-sm font-black text-black truncate">
                                En iyi teoriye <span className="text-neo-purple underline decoration-2 underline-offset-2">Einstein Rozeti</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link href={targetUrl} className="block group/btn">
                        <Button className="w-full gap-2 bg-black hover:bg-neo-green text-white hover:text-black font-black uppercase text-lg h-12 border-2 border-black transition-all shadow-[4px_4px_0px_0px_#888] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]">
                            <Microscope className="h-5 w-5 stroke-[2.5px]" />
                            <span>Analiz Başlat</span>
                            <ArrowRight className="h-5 w-5 ml-auto group-hover/btn:translate-x-1 transition-transform stroke-[3px]" />
                        </Button>
                    </Link>
                </div>
            </Card>
        </motion.div>
    );

}
