"use client";

import { motion } from "framer-motion";
import { Lightbulb, Share2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const FACTS = [
    "Jüpiter'in içine yaklaşık 1.300 tane Dünya sığabilir. 🌍",
    "Bir çay kaşığı nötron yıldızı maddesi, Everest Dağı kadar ağırdır. ⚖️",
    "Işık Güneş'ten Dünya'ya 8 dakikada ulaşır, bu yüzden Güneş'e baktığınızda 8 dakika öncesini görürsünüz. ☀️",
    "Evrendeki atomların %90'ından fazlası hidrojendir. 💧",
    "Eğer bir karadeliğe düşseydiniz, zaman dışarıdaki gözlemciye göre durmuş gibi görünürdü. 🕳️",
    "İnsan DNA'sı, Güneş Sistemi'nin çapını 2 kez dolaşacak kadar uzundur. 🧬",
    "Venüs, Güneş Sistemi'ndeki diğer tüm gezegenlerin aksine saat yönünde döner. 🔄",
    "Satürn o kadar düşük yoğunlukludur ki, yeterince büyük bir okyanusa koysanız yüzerdi. 🪐",
    "Bir insan vücudundaki atom sayısı, evrendeki yıldız sayısından fazladır. ✨",
    "Tardigradlar uzay boşluğunda bile hayatta kalabilen tek mikroskobik canlılardır. 🦠",
    "Ahtapotların üç kalbi, dokuz beyni ve mavi kanı vardır. 🐙",
    "Bal güneş görmediği sürece asla bozulmaz, 3000 yıllık bal bile yenebilir. 🍯",
    "Muzlar radyoaktiftir ama süper gücünüz olması için milyonlarca yemeniz gerekir. 🍌",
    "Kediler, hayatlarının %70'ini uyuyarak geçirirler. 🐈",
    "Penguenler de insanlar gibi gıdıklanabilir. 🐧",
    "Bir bulutun ağırlığı ortalama 500.000 kilogramdır. ☁️",
    "Zürafaların ses telleri yoktur. 🦒",
    "Kutup ayılarının derisi siyahtır, tüyleri ise şeffaftır. 🐻‍❄️",
    "Sıcak su, soğuk sudan daha hızlı donar (Mpemba etkisi). 🧊",
    "Altın yenebilir bir metaldir. 🪙"
];

export function DailyFactCard({ index }: { index?: number }) {
    const [fact, setFact] = useState("");
    const [isShared, setIsShared] = useState(false);

    useEffect(() => {
        // Deterministic fact based on day or random
        const today = new Date().getDate();
        setFact(FACTS[today % FACTS.length]);
    }, []);

    const handleShare = () => {
        setIsShared(true);
        navigator.clipboard.writeText(`Bunları biliyor muydun? 🧠\n\n${fact}\n\nFizikhub'da daha fazlasını keşfet! 🚀`);
        setTimeout(() => setIsShared(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border-2 border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-sm"
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Lightbulb size={120} className="text-amber-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                        <Sparkles size={18} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                        Günün Bilgi Dozu
                    </span>
                </div>

                <p className="text-lg md:text-xl font-bold leading-relaxed mb-6 font-mono text-foreground/90">
                    "{fact}"
                </p>

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => {
                            const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
                            setFact(randomFact);
                        }}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                    >
                        Başka Bir Tane →
                    </button>

                    <button
                        onClick={handleShare}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            isShared
                                ? "bg-green-500/20 text-green-500"
                                : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                        )}
                    >
                        <Share2 size={14} />
                        {isShared ? "Kopyalandı!" : "Paylaş"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
