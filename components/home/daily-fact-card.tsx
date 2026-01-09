"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Share2, Zap, Atom, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const FACTS = [
    "Jüpiter'in içine yaklaşık 1.300 tane Dünya sığabilir.",
    "Bir çay kaşığı nötron yıldızı maddesi, Everest Dağı kadar ağırdır.",
    "Işık Güneş'ten Dünya'ya 8 dakikada ulaşır.",
    "Evrendeki atomların %90'ından fazlası hidrojendir.",
    "Karadeliklerde zaman, dışarıdaki gözlemciye göre durur.",
    "İnsan DNA'sı, Güneş Sistemi'nin çapını 2 kez dolaşacak kadar uzundur.",
    "Venüs, Güneş Sistemi'ndeki diğer tüm gezegenlerin aksine saat yönünde döner.",
    "Satürn o kadar düşük yoğunlukludur ki, yeterince büyük bir okyanusa koysanız yüzerdi.",
    "Bir insan vücudundaki atom sayısı, evrendeki yıldız sayısından fazladır.",
    "Tardigradlar uzay boşluğunda bile hayatta kalabilen tek mikroskobik canlılardır."
];

export function DailyFactCard({ index }: { index?: number }) {
    const [fact, setFact] = useState("");
    const [isShared, setIsShared] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Mobile toggle
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const today = new Date().getDate();
        setFact(FACTS[today % FACTS.length]);
    }, []);

    const handleShare = () => {
        setIsShared(true);
        navigator.clipboard.writeText(`GÜNÜN VERİSİ::\n\n${fact}\n\nFizikhub.com`);
        setTimeout(() => setIsShared(false), 2000);
    };

    if (!mounted) return null;

    return (
        <section className="font-mono w-full">
            {/* Mobile: Compact Ticker / Collapsible */}
            <div className="md:hidden border-b-2 border-primary bg-background p-3 flex flex-col gap-2">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2 text-primary">
                        <Zap size={16} className="animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-tighter">
                            GÜNÜN-VERİSİ.LOG
                        </span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="text-sm font-bold leading-tight py-2 border-l-2 border-accent pl-3 text-foreground">
                                {fact}
                            </p>
                            <button
                                onClick={handleShare}
                                className="text-[10px] uppercase border border-primary px-2 py-1 mt-2 active:bg-primary active:text-primary-foreground transition-colors"
                            >
                                {isShared ? "LOG KOPYALANDI" : "VERİYİ PAYLAŞ"}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop: Raw Index Card / HUD Element */}
            <div className="hidden md:flex relative border-2 border-primary bg-background p-0 shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100 cursor-default">
                {/* Left Side: Status Strip */}
                <div className="w-12 border-r-2 border-primary flex flex-col items-center justify-between py-4 bg-secondary">
                    <Atom className="text-primary w-6 h-6 animate-spin-slow" />
                    <div className="writing-vertical-lr text-[10px] font-black tracking-widest text-muted-foreground rotate-180">
                        FIZIKHUB::DATA
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-accent rounded-full" />
                    </div>

                    <h3 className="text-xs font-bold text-accent uppercase mb-2">Incoming Transmission</h3>
                    <p className="text-xl font-black leading-tight tracking-tight text-foreground mb-4">
                        "{fact}"
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                const random = FACTS[Math.floor(Math.random() * FACTS.length)];
                                setFact(random);
                            }}
                            className="text-xs font-bold hover:bg-primary hover:text-primary-foreground px-2 py-1 border border-transparent hover:border-primary transition-all uppercase"
                        >
                            [ SONRAKİ VERİ ]
                        </button>
                        <button
                            onClick={handleShare}
                            className="text-xs font-bold hover:text-accent flex items-center gap-2 uppercase"
                        >
                            <Share2 size={12} />
                            {isShared ? "Kopyalandı" : "Paylaş"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
