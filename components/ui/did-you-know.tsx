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
            <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-amber-500/10 p-1 shadow-2xl group">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] animate-shimmer" />

                <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-xl p-5 md:p-6 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-amber-500/10">
                                <Lightbulb className="h-4 w-4 text-amber-400" />
                            </div>
                            <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                                BUNU BİLİYOR MUYDUN?
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextFact}
                            className="h-8 w-8 rounded-full hover:bg-white/5 hover:rotate-180 transition-all duration-500"
                        >
                            <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
                        </Button>
                    </div>

                    <div className="min-h-[100px] flex items-center justify-center relative py-2">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="text-lg md:text-xl text-center font-medium leading-relaxed text-zinc-200"
                            >
                                &quot;{facts[index]}&quot;
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-[50px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 rounded-full blur-[40px] pointer-events-none" />
                </div>
            </Card>
        </div>
    );
}
