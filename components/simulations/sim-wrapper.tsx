"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, RotateCcw, Info, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { LandscapeGuard } from "@/components/ui/landscape-guard";
import confetti from "canvas-confetti";

export type SimTask = {
    id: string;
    description: string;
    hint?: string; // Görev ipucu
    isCompleted?: boolean;
    explanation?: string; // Görev tamamlanınca çıkacak kısa bilgi notu
};

interface SimWrapperProps {
    title: string;
    description: string;
    tasks?: SimTask[];
    currentTaskIndex?: number;
    controls: React.ReactNode;
    children: React.ReactNode;
    onReset?: () => void;
}

export function SimWrapper({
    title,
    description,
    tasks = [],
    currentTaskIndex = 0,
    controls,
    children,
    onReset,
}: SimWrapperProps) {
    const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false); // Mobile bottom sheet state
    const [showInfo, setShowInfo] = useState(false);
    const [showExplanation, setShowExplanation] = useState<string | null>(null);

    // Confetti Effect on Task Completion
    useEffect(() => {
        if (currentTaskIndex > 0) {
            const completedTask = tasks[currentTaskIndex - 1];
            if (completedTask && completedTask.isCompleted) {
                // Celebration!
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B']
                });

                // Show Explanation if available
                if (completedTask.explanation) {
                    setShowExplanation(completedTask.explanation);
                }
            }
        }
    }, [currentTaskIndex, tasks]);

    const currentTask = tasks[currentTaskIndex];

    return (
        <LandscapeGuard>
            <div className="h-[100dvh] w-screen flex flex-col lg:flex-row bg-[#09090b] text-white overflow-hidden font-sans">

                {/* --- HEADER --- */}
                <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#09090b]/80 backdrop-blur-md z-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <Link href="/simulasyonlar" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-xl">🔙</span>
                        </Link>
                        <div>
                            <h1 className="font-black text-sm tracking-wide uppercase">{title}</h1>
                            {/* Desktop Description */}
                            <p className="hidden lg:block text-[10px] text-zinc-500">{description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Task Progress Pill */}
                        {tasks.length > 0 && (
                            <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                                <div className="flex gap-1">
                                    {tasks.map((t, i) => (
                                        <div
                                            key={t.id}
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                                                t.isCompleted ? "bg-green-500 scale-110" : i === currentTaskIndex ? "bg-white animate-pulse" : "bg-white/20"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-mono text-zinc-400">
                                    {currentTaskIndex}/{tasks.length}
                                </span>
                            </div>
                        )}

                        <button onClick={onReset} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Sıfırla">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowInfo(true)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                            <Info className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">

                    {/* CANVAS AREA (Takes full remaining height on mobile) */}
                    <div className="flex-1 relative bg-black/50 touch-none no-select overflow-hidden">
                        {children}

                        {/* Active Task Overlay */}
                        <AnimatePresence>
                            {currentTask && !currentTask.isCompleted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm pointer-events-none z-10"
                                >
                                    <div className="bg-black/60 backdrop-blur-xl border border-green-500/30 p-4 rounded-xl shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                                        <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">GÖREV</h3>
                                        <p className="text-sm font-medium text-white">{currentTask.description}</p>
                                        {currentTask.hint && <p className="text-[10px] text-zinc-400 mt-1">{currentTask.hint}</p>}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Explanation Modal (Success) */}
                        <AnimatePresence>
                            {showExplanation && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-zinc-900 border border-yellow-500/30 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(234,179,8,0.2)] relative"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <CheckCircle2 className="w-6 h-6 text-yellow-500" />
                                            <h3 className="text-lg font-black text-white uppercase">Harika!</h3>
                                        </div>
                                        <p className="text-zinc-300 text-sm leading-relaxed mb-6">{showExplanation}</p>
                                        <button
                                            onClick={() => setShowExplanation(null)}
                                            className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 active:scale-95 transition-all"
                                        >
                                            Devam Et 🚀
                                        </button>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* --- DESKTOP SIDEBAR CONTROLS --- */}
                    <div className="hidden lg:flex w-[320px] bg-[#09090b] border-l border-white/10 flex-col shrink-0 z-20">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Kontrol Paneli</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {controls}
                        </div>
                    </div>

                    {/* --- MOBILE BOTTOM SHEET CONTROLS --- */}
                    <motion.div
                        className="lg:hidden absolute bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[60vh]"
                        initial={false}
                        animate={{ height: isMobileControlsOpen ? "60vh" : "120px" }} // Default height shows primary controls
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Drag Handle / Toggle */}
                        <div
                            className="w-full h-8 flex items-center justify-center cursor-pointer active:bg-white/5"
                            onClick={() => setIsMobileControlsOpen(!isMobileControlsOpen)}
                        >
                            <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 pt-0 pb-12">
                            {/* Hint for interaction */}
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Ayarlar</span>
                                <button onClick={() => setIsMobileControlsOpen(!isMobileControlsOpen)}>
                                    {isMobileControlsOpen ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronUp className="w-4 h-4 text-zinc-500" />}
                                </button>
                            </div>
                            {controls}
                        </div>
                    </motion.div>
                </div>

                {/* Info Modal */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setShowInfo(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                                className="bg-[#09090b] border border-white/10 p-6 rounded-2xl max-w-sm w-full"
                                onClick={e => e.stopPropagation()}
                            >
                                <h2 className="text-xl font-bold mb-2">{title}</h2>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-6">{description}</p>
                                <button
                                    onClick={() => setShowInfo(false)}
                                    className="w-full py-3 bg-white text-black font-bold rounded-xl"
                                >
                                    Anlaşıldı
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </LandscapeGuard>
    );
}
