"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true);
        // Random start
        setIndex(Math.floor(Math.random() * facts.length));
    }, []);

    const nextFact = () => {
        setIndex((prev) => (prev + 1) % facts.length);
    };

    if (!isClient) return null;

    return (
        <div className="w-full max-w-md mx-auto my-8 px-4">
            <Card className="relative overflow-hidden border-orange-500/20 bg-black p-[2px] shadow-2xl group max-w-2xl mx-auto">
                {/* Event Horizon Glow (Subtle) */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative bg-black rounded-xl p-6 md:p-8 overflow-hidden border border-white/5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-orange-500/10 border border-orange-500/20">
                                <Lightbulb className="h-4 w-4 text-orange-400" />
                            </div>
                            <span className="font-black text-sm tracking-[0.2em] text-zinc-400 uppercase">
                                SİNGULARİTE VERİSİ
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextFact}
                            className="h-8 w-8 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="min-h-[120px] flex items-center justify-center relative py-2">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, filter: "blur(10px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(10px)" }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="text-xl md:text-2xl text-left font-bold leading-relaxed text-white drop-shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                            >
                                {facts[index]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Decorative Void Elements */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />
                </div>
            </Card>
        </div>
    );
}
