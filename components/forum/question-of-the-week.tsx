"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, HelpCircle, Sparkles, ArrowRight, AlertTriangle } from "lucide-react";
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
            <div className="bg-card border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden">
                {/* Decorative Striped Bar */}
                <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,black,black_10px,transparent_10px,transparent_20px)] dark:bg-[repeating-linear-gradient(45deg,white,white_10px,transparent_10px,transparent_20px)] opacity-20" />

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 border-b-2 border-black/10 dark:border-white/10 pb-4">
                        <div className="p-2 bg-primary text-primary-foreground border-2 border-black dark:border-white">
                            <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg uppercase tracking-tight leading-none">
                                HAFTANIN SORUSU
                            </h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                TOP SECRET // DOSYA NO: #42
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-bold leading-snug">
                            {questionTitle}
                        </h3>

                        <div className="flex items-start gap-2 p-3 bg-muted/50 border border-black/10 dark:border-white/10 text-xs font-medium text-muted-foreground">
                            <AlertTriangle className="h-4 w-4 text-primary shrink-0" />
                            <p>
                                DİKKAT: En iyi cevabı veren <span className="font-bold text-primary underline decoration-2 underline-offset-2">"Einstein Rozeti"</span> kazanacak!
                            </p>
                        </div>
                    </div>

                    <Link href={targetUrl} className="block pt-2">
                        <Button className="w-full h-12 gap-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:bg-primary hover:text-black transition-all border-2 border-transparent hover:border-black dark:hover:border-white group">
                            <HelpCircle className="h-4 w-4" />
                            CEVAPLA
                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
