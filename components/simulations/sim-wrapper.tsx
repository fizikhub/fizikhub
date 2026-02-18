"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Info, GripHorizontal, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { LandscapeGuard } from "@/components/ui/landscape-guard";

export type SimTask = {
    id: string;
    description: string;
    hint?: string;
    isCompleted?: boolean;
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
    onReset
}: SimWrapperProps) {
    const [showControls, setShowControls] = useState(true);
    const [showInfo, setShowInfo] = useState(false);

    // Confetti effect when task completes
    const currentTask = tasks[currentTaskIndex];

    // Check if task just completed
    // In a real app we'd track prev index to trigger only on change

    return (
        <LandscapeGuard>
            <div className="h-screen w-screen flex flex-col bg-[#09090b] text-white overflow-hidden font-sans">
                {/* Header */}
                <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#09090b] z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/simulasyonlar" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="font-bold text-sm tracking-wide">{title}</h1>
                            <p className="text-[10px] text-zinc-500 hidden sm:block">{description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Task Progress Pill */}
                        {tasks.length > 0 && (
                            <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-full mr-2">
                                <div className="flex gap-1">
                                    {tasks.map((t, i) => (
                                        <div
                                            key={t.id}
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full transition-colors",
                                                t.isCompleted ? "bg-[#4ADE80]" : i === currentTaskIndex ? "bg-white animate-pulse" : "bg-white/20"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-mono text-zinc-400">
                                    {tasks.filter(t => t.isCompleted).length}/{tasks.length}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={onReset}
                            className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                            title="Sıfırla"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowInfo(true)}
                            className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                            <Info className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Main Layout */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                    {/* Viewport (Canvas) */}
                    <div className="flex-1 relative bg-black/50 overflow-hidden touch-none no-select">
                        {children}

                        {/* Current Task Overlay */}
                        {tasks.length > 0 && currentTask && !currentTask.isCompleted && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={currentTask.id}
                                className="absolute top-4 left-4 max-w-[280px] sm:max-w-md pointer-events-none"
                            >
                                <div className="bg-[#09090b]/90 backdrop-blur-md border border-[#4ADE80]/30 p-4 rounded-2xl shadow-xl">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#4ADE80]/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white mb-1">Görev: {currentTask.description}</h3>
                                            {currentTask.hint && (
                                                <p className="text-xs text-zinc-400 leading-relaxed">{currentTask.hint}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Task Success Overlay */}
                        <AnimatePresence>
                            {tasks.some(t => t.isCompleted && t.id === tasks[Math.max(0, currentTaskIndex - 1)]?.id) && ( // Show confetti for just completed
                                <div />
                                // Logic for confetti is handled by effect usually, but we can do a toast here 
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Controls Sidebar */}
                    <motion.div
                        initial={false}
                        animate={{ width: showControls ? "320px" : "0px", opacity: showControls ? 1 : 0 }}
                        className="hidden lg:flex flex-col border-l border-white/10 bg-[#09090b]"
                    >
                        <div className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800">
                            {controls}
                        </div>
                    </motion.div>

                    {/* Mobile Controls Drawer */}
                    <motion.div
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 400 }}
                        initial={{ y: "calc(100% - 60px)" }}
                        whileTap={{ cursor: "grabbing" }}
                        className="lg:hidden absolute bottom-0 left-0 right-0 bg-[#09090b] border-t border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30"
                    >
                        <div className="w-full h-8 flex items-center justify-center cursor-grab active:cursor-grabbing">
                            <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
                        </div>
                        <div className="p-6 pt-2 h-[50vh] overflow-y-auto">
                            {controls}
                        </div>
                    </motion.div>

                    {/* Collapse Button (Desktop) */}
                    <button
                        onClick={() => setShowControls(!showControls)}
                        className="hidden lg:flex absolute right-[320px] top-1/2 -translate-y-1/2 translate-x-1/2 z-50 w-8 h-16 bg-[#09090b] border border-white/10 rounded-l-xl items-center justify-center hover:bg-zinc-900 transition-all"
                        style={{ right: showControls ? "320px" : "0" }}
                    >
                        {showControls ? <ChevronRight className="w-4 h-4 text-zinc-500" /> : <ChevronLeft className="w-4 h-4 text-zinc-500" />}
                    </button>
                </div>

                {/* Info Modal */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setShowInfo(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                className="bg-[#09090b] border border-white/10 p-6 rounded-2xl max-w-lg w-full shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <h2 className="text-xl font-bold mb-2">{title}</h2>
                                <p className="text-zinc-400 leading-relaxed mb-6">{description}</p>
                                <button
                                    onClick={() => setShowInfo(false)}
                                    className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200"
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
