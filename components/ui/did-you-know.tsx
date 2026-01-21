"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

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
        <div className="w-full max-w-md mx-auto my-8 px-4">
            {/* Simple, minimal card - no flashy effects */}
            <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                        Biliyor muydun?
                    </span>
                    <button
                        onClick={nextFact}
                        className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                </div>

                {/* Fact */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-base text-zinc-200 leading-relaxed"
                    >
                        {facts[index]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
}
