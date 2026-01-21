"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const facts = [
    "Bir nötron yıldızının bir çay kaşığı kadarı, Everest Dağı kadar ağırdır.",
    "Venüs'te bir gün, bir yıldan daha uzundur.",
    "Uzay aslında tamamen sessizdir, çünkü sesin yayılacağı bir ortam yoktur.",
    "Güneş sistemindeki kütlenin %99.86'sı Güneş'tedir.",
    "Satürn'ün halkaları o kadar incedir ki, oranlarsak bir kağıttan bile incedir.",
    "Işık Güneş'ten Dünya'ya 8 dakikada gelir, ama Güneş'in çekirdeğinden yüzeyine çıkması binlerce yıl sürer.",
    "Evrendeki yıldız sayısı, Dünya'daki tüm kumsallardaki kum tanesi sayısından fazladır.",
    "Bir kara deliğin olay ufkuna yaklaşırsanız, zaman sizin için yavaşlar.",
    "Tardigradlar uzay boşluğunda bile hayatta kalabilen mikroskobik canlılardır.",
    "Jüpiter o kadar büyüktür ki, içine 1300 tane Dünya sığabilir."
];

export function DidYouKnow() {
    const [index, setIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setIndex(Math.floor(Math.random() * facts.length));
    }, []);

    const nextFact = () => {
        setIndex((prev) => (prev + 1) % facts.length);
    };

    if (!isClient) return null;

    return (
        <div className="w-full max-w-sm md:max-w-md mx-auto my-12 px-2 perspective-1000">
            <motion.div
                initial={{ transform: "rotateX(5deg)" }}
                whileHover={{ transform: "rotateX(0deg) scale(1.02)" }}
                transition={{ duration: 0.5 }}
                className="relative group"
            >
                {/* Cosmic Glow Behind */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-40 group-hover:opacity-70 blur-xl transition-opacity duration-1000 animate-pulse" />

                <Card className="relative overflow-hidden border-0 bg-black/40 backdrop-blur-2xl rounded-2xl p-0 ring-1 ring-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,1)]">

                    {/* Glass Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />

                    {/* Content Container */}
                    <div className="relative p-6 md:p-8 flex flex-col items-start gap-4 z-10 w-full">
                        {/* Minimal Header */}
                        <div className="flex w-full items-center justify-between border-b border-white/5 pb-4 mb-2">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                                <span className="text-[10px] font-mono text-orange-500/80 uppercase tracking-[0.2em]">SİNGÜLARİTE VERİSİ</span>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={nextFact}
                                className="h-8 w-8 rounded-full p-0 text-zinc-600 hover:text-white hover:bg-white/5 transition-all hover:rotate-180 duration-500"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        {/* Fact Display */}
                        <div className="min-h-[100px] flex items-center w-full">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={index}
                                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="text-lg md:text-xl font-medium leading-relaxed text-zinc-100"
                                >
                                    {facts[index]}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        {/* Footer Decorative Tech */}
                        <div className="w-full flex items-center justify-between pt-2">
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-1 w-1 rounded-full bg-zinc-700 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                                ))}
                            </div>
                            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                                Veri Akışı: Aktif
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
