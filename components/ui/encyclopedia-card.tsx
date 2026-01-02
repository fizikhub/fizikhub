"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, BookOpen, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const uselessFacts = [
    "Bir bulutun ağırlığı ortalama 500.000 kilogramdır.",
    "Zürafaların ses telleri yoktur.",
    "Altın yenebilir bir metaldir.",
    "Kediler hayatlarının %70'ini uyuyarak geçirirler.",
    "Muzlar teknik olarak birer meyvedir ama çilekler değildir.",
    "Tardigradlar uzay boşluğunda bile hayatta kalabilen tek mikroskobik canlıdır.",
    "Bal güneş görmediği sürece asla bozulmaz, 3000 yıllık bal bile yenebilir.",
    "Ahtapotların üç kalbi, dokuz beyni ve mavi kanı vardır.",
    "İnsan DNA'sı, Güneş Sistemi'nin çapını 2 kez dolaşacak kadar uzundur.",
    "Venüs saat yönünde dönen tek gezegendir."
];

export function EncyclopediaCard() {
    const [index, setIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setIndex(Math.floor(Math.random() * uselessFacts.length));
    }, []);

    const nextFact = () => {
        setIndex((prev) => (prev + 1) % uselessFacts.length);
    };

    if (!isClient) return null;

    return (
        <div className="w-full my-8 px-4 sm:px-0">
            <div className="relative border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 sm:p-8 overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 border-b-2 border-foreground pb-4">
                    <div className="flex flex-col">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-foreground leading-none mb-1">
                            GEREKSİZ BİLGİLER
                        </h2>
                        <span className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest">
                            ANSİKLOPEDİSİ CİLT: {index + 1}
                        </span>
                    </div>
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-foreground hidden sm:block" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="relative min-h-[120px] flex items-center justify-center py-4">
                    <Quote className="absolute top-0 left-0 w-8 h-8 text-foreground/10 rotate-180" />
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                            transition={{ duration: 0.2 }}
                            className="text-lg sm:text-2xl font-bold text-center leading-snug font-serif italic text-foreground px-6"
                        >
                            "{uselessFacts[index]}"
                        </motion.p>
                    </AnimatePresence>
                    <Quote className="absolute bottom-0 right-0 w-8 h-8 text-foreground/10" />
                </div>

                {/* Footer / Action */}
                <div className="mt-8 flex justify-center border-t-2 border-foreground pt-6">
                    <Button
                        onClick={nextFact}
                        className="bg-foreground text-background hover:bg-foreground/90 font-mono text-sm font-bold uppercase tracking-wider rounded-none px-8 py-6 border-2 border-transparent hover:border-background transition-all active:translate-y-1 active:shadow-none"
                    >
                        <RotateCw className="w-4 h-4 mr-2" />
                        BİR TANE DAHA VER
                    </Button>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-foreground" />
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-foreground" />
            </div>
        </div>
    );
}
