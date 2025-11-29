"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, HelpCircle, Sparkles, ArrowRight } from "lucide-react";
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
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background">
                {/* Animated Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />

                <CardHeader className="flex flex-row items-center gap-2 pb-2 relative z-10">
                    <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <Trophy className="h-5 w-5 text-amber-500" />
                    </div>
                    <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
                        Haftanın Sorusu
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-base font-semibold leading-snug">
                            {questionTitle}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            En iyi cevabı veren <span className="font-medium text-amber-500">"Einstein Rozeti"</span> kazanacak!
                        </p>
                    </div>

                    <Link href={targetUrl} className="block">
                        <Button className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 group">
                            <HelpCircle className="h-4 w-4" />
                            Cevapla
                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    );
}
