"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Share2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const MEMES = [
    {
        id: 1,
        title: "Schrödinger'in Kedisi",
        content: "Kutuyu açana kadar hem ölü hem canlıyım.\n(Spoiler: Açınca ölüyorum 💀)",
        tag: "KUANTUM"
    },
    {
        id: 2,
        title: "Newton vs Einstein",
        content: "Newton: Elma düştü.\nEinstein: Uzay-zaman eğrildi, elma ne yapsın?\nBen: Elma bedava, yerim.",
        tag: "GRAVİTE"
    },
    {
        id: 3,
        title: "Yazılımcı ve Fizikçi",
        content: "Fizikçi: Evrenin sınırlarını zorluyorum.\nYazılımcı: Div'i ortalayamadım.",
        tag: "TEKNİK"
    }
];

const FloatingUFO = () => (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        <path d="M22 24 C22 14, 42 14, 42 24" fill="#E0F2FE" stroke="#000" strokeWidth="2" />
        <ellipse cx="32" cy="26" rx="20" ry="6" fill="#FFF" stroke="#000" strokeWidth="2" />
        <circle cx="18" cy="26" r="2" fill="#000" />
        <circle cx="32" cy="28" r="2" fill="#000" />
        <circle cx="46" cy="26" r="2" fill="#000" />
        <circle cx="32" cy="19" r="3" fill="#10B981" />
    </svg>
);

export function MemeCorner() {
    const [index, setIndex] = useState(0);

    const nextMeme = () => setIndex((prev) => (prev + 1) % MEMES.length);
    const currentMeme = MEMES[index];

    return (
        <div className="relative group perspective-1000">
            {/* 
                V30: CLASSIC RESTORED (High Quality)
                - Style: Neo-Brutalist (Yellow/Black)
                - Vibe: Friendly, Scientific, Iconic.
                - Animations: Smooth Layout, Floating UFO.
            */}
            <motion.div
                className={cn(
                    "relative overflow-hidden",
                    "bg-[#FFC800] rounded-2xl", // The Classic Yellow
                    "border-[3px] border-black",
                    "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
                    "flex flex-col md:flex-row"
                )}
                whileHover={{ y: -2, boxShadow: "10px 10px 0px 0px rgba(0,0,0,1)" }}
            >
                {/* LEFT: BRANDING & UFO */}
                <div className="w-full md:w-1/3 bg-black p-6 flex flex-col items-center justify-center text-center relative overflow-hidden border-b-[3px] md:border-b-0 md:border-r-[3px] border-black">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 mb-4 scale-125"
                    >
                        <FloatingUFO />
                    </motion.div>

                    <h2 className="relative z-10 text-white font-black text-2xl uppercase leading-none tracking-tight">
                        BİLİMİ<br />Ti'YE<br />ALIYORUZ
                    </h2>
                    <span className="relative z-10 mt-2 bg-[#FFC800] text-black text-[10px] font-black px-2 py-0.5 transform -rotate-2 inline-block border border-white">
                        AMA CİDDİLİ ŞEKİLDE
                    </span>
                </div>

                {/* RIGHT: CONTENT STAGE */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center items-start bg-[#FFC800] relative">

                    {/* Tag */}
                    <div className="absolute top-4 right-4 opacity-50">
                        <Zap className="w-12 h-12 text-black/10 rotate-12" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <span className="inline-block bg-black/10 text-black text-[10px] font-bold px-2 py-1 mb-3 rounded-full uppercase tracking-wider">
                                #{currentMeme.tag}
                            </span>

                            <h3 className="text-xl sm:text-2xl font-black text-black mb-2 leading-tight">
                                {currentMeme.title}
                            </h3>

                            <div className="text-black font-bold font-mono text-sm sm:text-base leading-relaxed whitespace-pre-line border-l-4 border-black pl-4 mb-6">
                                "{currentMeme.content}"
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="mt-auto flex gap-3 z-10">
                        <button
                            onClick={nextMeme}
                            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase hover:bg-zinc-800 transition-transform active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Sıradaki
                        </button>
                        <button className="p-2.5 bg-white border-2 border-black rounded-lg hover:bg-zinc-100 transition-transform active:scale-95">
                            <Share2 className="w-4 h-4 text-black" />
                        </button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
