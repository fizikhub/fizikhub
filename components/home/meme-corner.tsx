"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Skull, Brain, Atom, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";

const MEMES = [
    {
        id: 1,
        title: "Schrödinger",
        setup: "Kutuyu açtım...",
        punchline: "Hem ölü hem canlı? Yok artık!",
        icon: Ghost
    },
    {
        id: 2,
        title: "Heisenberg",
        setup: "Polis: Hızını biliyor musun?",
        punchline: "Hayır ama nerede olduğumu biliyorum!",
        icon: Zap
    },
    {
        id: 3,
        title: "Pascal",
        setup: "Newton, Einstein, Pascal saklambaç oynar...",
        punchline: "Pascal saklanır, Newton kare çizer!",
        icon: Brain
    }
];

export function MemeCorner() {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(MEMES[0]);

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);

        let spins = 0;
        const interval = setInterval(() => {
            setResult(MEMES[Math.floor(Math.random() * MEMES.length)]);
            spins++;
            if (spins > 10) {
                clearInterval(interval);
                setSpinning(false);
            }
        }, 100);
    };

    const Icon = result.icon;

    return (
        <div className="relative w-full overflow-hidden rounded-3xl border-[4px] border-black bg-zinc-900 shadow-[8px_8px_0px_0px_#000]">

            {/* Header */}
            <div className="bg-[#FFC800] border-b-[4px] border-black p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 border border-black animate-pulse" />
                    <h2 className="font-black text-black text-lg tracking-tight uppercase">MİZAH MAKİNESİ</h2>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-10 h-2 bg-black opacity-20 transform -skew-x-12" />)}
                </div>
            </div>

            {/* Display Screen */}
            <div className="p-6 relative min-h-[220px] flex items-center justify-center bg-[radial-gradient(circle_at_center,#222_0%,#000_100%)]">
                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

                <div className="relative z-10 text-center w-full">
                    <AnimatePresence mode="wait">
                        {!spinning && (
                            <motion.div
                                key={result.id}
                                initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="p-4 bg-zinc-800 border-[2px] border-[#3B82F6] rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                    <Icon className="w-12 h-12 text-[#3B82F6]" />
                                </div>

                                <div className="bg-black/80 border border-white/20 p-4 rounded-lg w-full backdrop-blur">
                                    <h3 className="text-[#FFC800] font-black uppercase text-sm mb-1">{result.setup}</h3>
                                    <p className="text-white font-bold text-lg font-mono">{result.punchline}</p>
                                </div>
                            </motion.div>
                        )}
                        {spinning && (
                            <motion.div
                                key="spinning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="text-4xl font-black text-white/20 animate-pulse">
                                    YÜKLENİYOR...
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-[#111] border-t-[4px] border-black p-4">
                <button
                    onClick={handleSpin}
                    disabled={spinning}
                    className="w-full bg-[#3B82F6] hover:bg-blue-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black uppercase text-xl py-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#FFF] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 rounded-xl group"
                >
                    <Atom className={cn("w-6 h-6", spinning && "animate-spin")} />
                    {spinning ? "HESAPLANIYOR..." : "ŞAKA ÜRET"}
                </button>
            </div>
        </div>
    );
}
