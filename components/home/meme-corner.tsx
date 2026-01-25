"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Share2, Sparkles, Atom } from "lucide-react";
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
        title: "Newton'un Kafası",
        content: "Newton: Elma düştü.\nEinstein: Uzay-zaman eğrildi, elma ne yapsın?\nBen: Elma bedava, yerim.",
        tag: "GRAVİTE"
    },
    {
        id: 3,
        title: "Yazılımcı vs Fizikçi",
        content: "Fizikçi: Evrenin sınırlarını zorluyorum, kara delikleri modelliyorum.\nYazılımcı: Div'i ortalayamadım.",
        tag: "TEKNİK"
    },
    {
        id: 4,
        title: "Termodinamik Yasası",
        content: "Odanın dağınıklığı entropi yasasıdır anne, ben yapmadım evren yaptı.",
        tag: "ENTROPİ"
    }
];

export function MemeCorner() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-advance removed for user control, but "Living" background added.

    const nextMeme = () => {
        setDirection(1);
        setIndex((prev) => (prev + 1) % MEMES.length);
    };

    const currentMeme = MEMES[index];

    return (
        <div className="relative w-full overflow-hidden rounded-3xl border-[3px] border-black bg-black shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] group">

            {/* 1. ANIMATED BACKGROUND (The "Vibe") */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#3B82F6_25%,transparent_25%,transparent_50%,#3B82F6_50%,#3B82F6_75%,transparent_75%,transparent)] bg-[length:40px_40px] animate-[slide_2s_linear_infinite]" />
            </div>

            {/* Floating Particles (N2O Molecules) */}
            <motion.div
                className="absolute top-2 right-2 text-white/10 font-black text-6xl pointer-events-none select-none z-0"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 20, repeat: Infinity }}
            >
                N₂O
            </motion.div>

            {/* 2. HEADER: QUANTUM HUMOR CONSOLE */}
            <div className="relative z-10 flex items-center justify-between bg-[#FFC800] border-b-[3px] border-black px-5 py-3">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Sparkles className="w-6 h-6 text-black fill-white" />
                    </motion.div>
                    <h2 className="font-black text-black tracking-tighter text-lg uppercase">
                        BİLİMİ Tİ'YE ALIYORUZ
                    </h2>
                </div>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-black border border-white" />
                    <div className="w-3 h-3 rounded-full bg-black/50 border border-white" />
                </div>
            </div>

            {/* 3. CONTENT STAGE */}
            <div className="relative z-10 p-8 min-h-[300px] flex flex-col items-center justify-center">

                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={index}
                        initial={{ x: 100, opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ x: -100, opacity: 0, scale: 0.9, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-full max-w-md"
                    >
                        {/* THE JOKE CARD */}
                        <div className="bg-white border-[3px] border-black p-6 pl-8 relative shadow-[0px_10px_20px_rgba(0,0,0,0.3)] rotate-1 transform transition-all hover:rotate-0 hover:scale-[1.02]">

                            {/* Tape Effect */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-blue-500/20 backdrop-blur-sm -rotate-2 border-l border-r border-white/30" />

                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-block bg-black text-[#FFC800] text-xs font-bold px-2 py-1 rounded-sm rotate-[-2deg]">
                                    #{currentMeme.tag}
                                </span>
                                <span className="text-4xl leading-[0]">❝</span>
                            </div>

                            <h3 className="text-2xl font-black text-black mb-3 underline decoration-[#FFC800] decoration-4 underline-offset-2">
                                {currentMeme.title}
                            </h3>

                            <p className="text-lg font-bold text-zinc-800 font-mono leading-relaxed whitespace-pre-line">
                                {currentMeme.content}
                            </p>

                            <div className="mt-4 text-right">
                                <span className="text-4xl leading-[0] text-gray-200">❞</span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>

            {/* 4. CONTROLS FOOTER */}
            <div className="relative z-10 bg-black/80 backdrop-blur-md border-t-[3px] border-black p-4 flex justify-between items-center gap-4">

                <div className="text-white text-xs font-mono opacity-50 hidden sm:block">
                    QUANTUM_HUMOR_V2.6 :: LAUGH_INITIATED
                </div>

                <div className="flex gap-3 ml-auto w-full sm:w-auto">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextMeme}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-400 text-white font-black uppercase text-sm px-6 py-3 border-[2px] border-white shadow-[4px_4px_0px_0px_#FFF] transition-all active:shadow-none active:translate-y-1 rounded-lg"
                    >
                        <RefreshCw className="w-4 h-4" />
                        SIRADAKİ DOZ
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
