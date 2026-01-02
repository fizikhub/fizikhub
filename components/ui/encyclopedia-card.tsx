"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const uselessFacts = [
    "Bir bulutun ağırlığı ortalama 500.000 kilogramdır.",
    "Zürafaların ses telleri yoktur.",
    "Altın yenebilir bir metaldir.",
    "Kediler hayatlarının %70'ini uyuyarak geçirirler.",
    "Muzlar teknik olarak birer meyvedir ama çilekler değildir.",
    "Tardigradlar uzay boşluğunda bile hayatta kalabilen tek mikroskobik canlıdır.",
    "Bal güneş görmediği sürece asla bozulmaz, 3000 yıllık bal bile yenebilir.",
    "Ahtapotların üç kalbi, dokuz beyni ve mavi kanı vardır."
];

export function EncyclopediaCard() {
    const [index, setIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [colorTheme, setColorTheme] = useState(0);

    const colors = [
        "bg-[#FFD02E] text-black", // Vibrant Yellow
        "bg-[#FF5252] text-white", // Red
        "bg-[#448AFF] text-white", // Blue
        "bg-[#69F0AE] text-black"  // Mint
    ];

    useEffect(() => {
        setIsClient(true);
        setIndex(Math.floor(Math.random() * uselessFacts.length));
        setColorTheme(Math.floor(Math.random() * colors.length));
    }, []);

    const nextFact = () => {
        setIndex((prev) => (prev + 1) % uselessFacts.length);
        setColorTheme((prev) => (prev + 1) % colors.length);
    };

    if (!isClient) return null;

    return (
        <div className="w-full my-4">
            <div className={`relative rounded-xl overflow-hidden shadow-lg transition-colors duration-500 ${colors[colorTheme]} p-5`}>

                {/* Header */}
                <div className="flex items-center justify-between mb-3 border-b border-current/20 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-current/10 rounded-lg">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-wider opacity-90">
                            Gereksiz Bilgiler
                        </h2>
                    </div>
                    <span className="text-[10px] font-mono font-bold opacity-60">
                        #{100 + index}
                    </span>
                </div>

                {/* Content */}
                <div className="min-h-[80px] flex items-center justify-center py-2">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="text-lg md:text-xl font-bold text-center leading-tight font-heading"
                        >
                            {uselessFacts[index]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Footer Action - Compact */}
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={nextFact}
                        className="group flex items-center gap-2 px-4 py-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-xs font-bold transition-all active:scale-95"
                    >
                        <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                        <span>Sıradaki Bilgi</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
