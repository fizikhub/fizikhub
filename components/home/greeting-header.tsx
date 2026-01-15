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

        // Select random fact based on day of year to keep it consistent for the day, or just random
        // Let's do random for delight
        setFact(SCIENTIFIC_FACTS[Math.floor(Math.random() * SCIENTIFIC_FACTS.length)]);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full pt-6 pb-2 px-2 sm:px-0">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col gap-2"
            >
                {/* Greeting Line */}
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                        {greeting}, <span className="text-muted-foreground">Kaşif.</span>
                    </h1>
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                        <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                    </motion.div>
                </div>

                {/* Daily Dose Card - Paper Strip Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative mt-2"
                >
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-full bg-primary/30 rounded-full" />
                    <div className="pl-3 py-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                            Günün Dozu
                        </p>
                        <p className="text-sm sm:text-base font-medium text-foreground/90 leading-tight italic">
                            "{fact}"
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
