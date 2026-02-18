"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Info, LayoutTemplate, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export type SimTask = {
    id: string;
    description: string;
    hint?: string;
    isCompleted?: boolean;
};

interface SimWrapperProps {
    title: string;
    description: string;
    tasks: SimTask[];
    currentTaskIndex: number;
    onReset: () => void;
    children: React.ReactNode;
    controls: React.ReactNode;
}

export function SimWrapper({
    title,
    description,
    tasks,
    currentTaskIndex,
    onReset,
    children,
    controls
}: SimWrapperProps) {
    const [showControls, setShowControls] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const activeTask = tasks[currentTaskIndex];

    useEffect(() => {
        if (activeTask?.isCompleted) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFC800', '#4169E1', '#FF90E8']
            });
        }
    }, [activeTask?.isCompleted]);

    return (
        <div className="h-screen flex flex-col bg-[#09090b] font-[family-name:var(--font-outfit)] overflow-hidden">
            {/* Navbar */}
            <header className="h-16 bg-zinc-900 border-b border-white/5 flex items-center justify-between px-4 z-50 shrink-0 shadow-sm relative">
                <div className="flex items-center gap-4">
                    <Link href="/simulasyonlar" className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors border border-white/10 group">
                        <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </Link>
                    <div>
                        <h1 className="text-white font-black text-sm sm:text-lg uppercase tracking-wider">{title}</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_8px_#4ADE80]" />
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Simülasyon Aktif</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowInfo(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-colors active:scale-95"
                    >
                        <Info className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onReset}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FF5757]/10 text-[#FF5757] hover:bg-[#FF5757]/20 transition-colors active:scale-95 border border-[#FF5757]/20"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
                {/* Canvas Area */}
                <div className="flex-1 relative bg-[#09090b] flex flex-col">
                    {/* Task Overlay (Top Center) */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-lg pointer-events-none">
                        <AnimatePresence mode="wait">
                            {activeTask && (
                                <motion.div
                                    key={activeTask.id}
                                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -20, opacity: 0, scale: 0.95 }}
                                    className={cn(
                                        "bg-zinc-900/80 backdrop-blur-md border px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 transition-colors duration-500",
                                        activeTask.isCompleted ? "border-[#4ADE80] bg-[#4ADE80]/10" : "border-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors duration-500 shadow-lg",
                                        activeTask.isCompleted
                                            ? "bg-[#4ADE80] border-[#4ADE80] text-black"
                                            : "bg-[#FFC800] border-[#FFC800] text-black"
                                    )}>
                                        {activeTask.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <div className="font-black text-lg">{currentTaskIndex + 1}</div>}
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">
                                            GÖREV {currentTaskIndex + 1}/{tasks.length}
                                        </div>
                                        <div className="text-sm sm:text-base font-bold text-white leading-tight">
                                            {activeTask.description}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Canvas Container */}
                    <div className="flex-1 relative overflow-hidden cursor-crosshair border-r border-white/5">
                        {children}
                    </div>
                </div>

                {/* Sidebar Controls (Desktop) */}
                <motion.div
                    initial={false}
                    animate={{
                        width: showControls ? "360px" : "0px",
                        opacity: showControls ? 1 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="hidden lg:flex flex-col border-l border-white/10 bg-zinc-950 overflow-hidden relative z-20 shadow-2xl"
                >
                    <div className="p-6 w-[360px] h-full overflow-y-auto custom-scrollbar">
                        <div className="mb-8 flex items-center justify-between">
                            <h3 className="text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4" />
                                KONTROL PANELİ
                            </h3>
                        </div>
                        {controls}
                    </div>
                </motion.div>

                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-zinc-800 text-white p-1 rounded-l-lg border-y border-l border-white/10 hover:bg-zinc-700 transition-all active:scale-95 shadow-xl"
                    style={{ right: showControls ? "360px" : "0" }}
                >
                    <LayoutTemplate className="w-5 h-5" />
                </button>

                {/* Mobile Controls Drawer */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: showControls ? "0%" : "85%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                        if (info.offset.y > 50) setShowControls(false);
                        if (info.offset.y < -50) setShowControls(true);
                    }}
                    className="lg:hidden absolute bottom-0 left-0 right-0 z-40 h-[80vh] bg-[#09090b] border-t border-white/10 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex flex-col"
                >
                    {/* Handle */}
                    <div
                        className="h-10 shrink-0 flex items-center justify-center cursor-pointer w-full"
                        onClick={() => setShowControls(!showControls)}
                    >
                        <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 pt-2 pb-24 overflow-y-auto custom-scrollbar">
                        <h3 className="text-zinc-500 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4" />
                            AYARLAR & KONTROLLER
                        </h3>
                        {controls}
                    </div>
                </motion.div>
            </div>

            {/* Info Modal */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowInfo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border-2 border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                <Info className="w-32 h-32" />
                            </div>

                            <h2 className="text-2xl font-black text-white uppercase italic mb-4 relative z-10">{title}</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10 font-medium">{description}</p>

                            <button
                                onClick={() => setShowInfo(false)}
                                className="w-full py-4 bg-[#4169E1] text-white font-black uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
                            >
                                Anlaşıldı
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
