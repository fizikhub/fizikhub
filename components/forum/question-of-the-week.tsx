"use client";

import { Button } from "@/components/ui/button";
import { Atom, ArrowRight, FlaskConical, Activity, Microscope } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface QuestionOfTheWeekProps {
    questionId?: number;
    questionSlug?: string;
}

export function QuestionOfTheWeek({ questionId, questionSlug }: QuestionOfTheWeekProps) {
    // If no ID provided, fallback to search for the title
    const questionTitle = "Işık hızıyla giden bir trende ileriye doğru fener tutarsak ışığın hızı ne olur?";
    const targetUrl = questionId
        ? `/forum/${questionId}`
        : `/forum?q=${encodeURIComponent(questionTitle)}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
        >
            <div className="bg-background/50 backdrop-blur-sm border border-black/20 dark:border-white/20 relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
                {/* Lab Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Animated Pulse Decoration */}
                <div className="absolute top-0 right-0 p-3">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                        <div className="relative w-2 h-2 bg-primary rounded-full" />
                    </div>
                </div>

                <div className="p-6 space-y-5 relative z-10">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-primary">
                                <FlaskConical className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Deney Protokolü #42</span>
                            </div>
                            <h3 className="font-black text-xl uppercase tracking-tight">
                                Haftanın Hipotezi
                            </h3>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="relative pl-4 border-l-2 border-primary/30">
                        <h3 className="text-lg font-medium leading-relaxed font-outfit">
                            "{questionTitle}"
                        </h3>
                    </div>

                    {/* Technical Data / Reward */}
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-black/5 dark:border-white/5">
                        <div className="p-2 bg-primary/10 rounded-md text-primary">
                            <Atom className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase text-muted-foreground mb-0.5">Ödül Verisi</p>
                            <p className="text-xs font-medium">
                                En iyi teoriye <span className="text-primary font-bold">"Einstein Rozeti"</span> tanımlanacak.
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link href={targetUrl} className="block pt-2">
                        <Button className="w-full h-12 gap-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:bg-primary hover:text-white transition-all border border-transparent hover:border-primary/50 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Microscope className="h-4 w-4" />
                            <span>Analiz Başlat</span>
                            <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                    </Link>
                </div>

                {/* Bottom Technical Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
            </div>
        </motion.div>
    );
}
