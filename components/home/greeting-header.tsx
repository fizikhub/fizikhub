"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const SCIENTIFIC_FACTS = [
    "Işık fotonlarının kütlesi yoktur, bu yüzden evrenin hız sınırında seyahat edebilirler.",
    "Bir çay kaşığı nötron yıldızı maddesi, Everest Dağı kadar ağırdır.",
    "Evrenin %95'i göremediğimiz karanlık madde ve karanlık enerjiden oluşur.",
    "DNA'nız açılıp uç uca eklenseydi, Güneş'e 600 kez gidip gelebilirdi.",
    "Satürn o kadar düşük yoğunlukludur ki, yeterince büyük bir suya atsanız yüzerdi.",
    "Zaman, kütleçekimin yoğun olduğu yerlerde daha yavaş akar.",
    "Vücudunuzdaki atomların çoğu yıldızların içinde üretildi.",
    "Muz antimmadde üretir (çok az miktarda pozitron yayar).",
    "Bal, asla bozulmayan tek besindir.",
];

export function GreetingHeader() {
    const [greeting, setGreeting] = useState("");
    const [fact, setFact] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) setGreeting("Günaydın");
        else if (hour >= 12 && hour < 18) setGreeting("Tünaydın");
        else if (hour >= 18 && hour < 22) setGreeting("İyi Akşamlar");
        else setGreeting("İyi Geceler");

        setFact(SCIENTIFIC_FACTS[Math.floor(Math.random() * SCIENTIFIC_FACTS.length)]);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full pt-6 pb-2 px-4 sm:px-0">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col gap-4"
            >
                {/* Greeting Line */}
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground drop-shadow-sm">
                        {greeting}, <span className="text-muted-foreground bg-black/5 dark:bg-white/10 px-2 rounded-lg">Kaşif.</span>
                    </h1>
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                        <Sparkles className="w-8 h-8 text-amber-500 fill-amber-400" strokeWidth={2.5} />
                    </motion.div>
                </div>

                {/* Daily Dose Card - Neo Brutalist Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative mt-2 group"
                >
                    <div className="absolute inset-0 bg-black dark:bg-white rounded-xl translate-x-[4px] translate-y-[4px] transition-transform group-hover:translate-x-[6px] group-hover:translate-y-[6px]" />
                    <div className="relative bg-amber-50 dark:bg-zinc-900 border-2 border-black dark:border-white rounded-xl p-4 sm:p-5">
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2">
                                <span className="bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
                                    Günün Dozu
                                </span>
                                <div className="h-0.5 flex-1 bg-black/10 dark:bg-white/10" />
                            </div>
                            <p className="text-lg sm:text-lg font-bold text-foreground leading-snug font-serif italic">
                                "{fact}"
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
