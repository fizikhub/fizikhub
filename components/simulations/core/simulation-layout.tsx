"use client";

import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Settings2, BookOpen, Target, ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { cn } from "@/lib/utils";

interface SimulationLayoutProps {
    title: string;
    color?: string;
    children: React.ReactNode;
    controlsArea?: React.ReactNode;
    theoryArea?: React.ReactNode;
    missionsArea?: React.ReactNode;
}

type TabType = "controls" | "theory" | "missions";

export function SimulationLayout({
    title,
    color = "#FACC15",
    children,
    controlsArea,
    theoryArea,
    missionsArea,
}: SimulationLayoutProps) {
    const [activeTab, setActiveTab] = useState<TabType>("controls");
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <div className="flex flex-col min-h-[100dvh] lg:h-[100dvh] bg-[#0a0a0a] text-zinc-50 font-[family-name:var(--font-sans)] lg:overflow-hidden">

            {/* ────────── HEADER ────────── */}
            {!isFullscreen && (
                <header className="relative z-50 flex items-center justify-between px-3 sm:px-5 py-3 border-b-[3px] border-black bg-[#0a0a0a] shrink-0">
                    {/* Noise Background */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    <div className="flex items-center gap-3 relative z-10 w-full">
                        <ViewTransitionLink href="/simulasyonlar">
                            <button className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-lg">
                                <ArrowLeft className="w-5 h-5 stroke-[3px]" />
                            </button>
                        </ViewTransitionLink>

                        <div className="flex items-center gap-2 overflow-hidden">
                            <div
                                className="w-3 h-8 sm:h-9 rounded-sm shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight truncate">
                                {title}
                            </h1>
                        </div>
                    </div>
                </header>
            )}

            {/* ────────── MAIN STAGE ────────── */}
            <main className="flex-1 flex flex-col lg:flex-row relative lg:overflow-hidden">
                {/* Visual / Canvas Area */}
                <section className={cn(
                    "relative flex items-center justify-center transition-all",
                    isFullscreen ? "fixed inset-0 z-[100] p-0 bg-black" : "h-[50vh] sm:h-[55vh] lg:flex-1 lg:h-auto lg:min-h-full p-2 sm:p-3 shrink-0"
                )}>
                    {/* The Canvas Frame */}
                    <div className={cn(
                        "relative w-full h-full overflow-hidden flex items-center justify-center bg-black transition-all",
                        isFullscreen
                            ? "rounded-none border-none"
                            : "rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]"
                    )}>
                        {children}

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className={cn(
                                "absolute z-50 top-3 right-3 w-9 h-9 sm:w-10 sm:h-10 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center rounded-md",
                            )}
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4 stroke-[2.5px]" /> : <Maximize2 className="w-4 h-4 stroke-[2.5px]" />}
                        </button>
                    </div>
                </section>

                {/* ────────── INTERACTION PANEL ────────── */}
                {!isFullscreen && (
                    <aside className="flex-1 lg:h-full lg:w-[400px] xl:w-[420px] flex flex-col bg-[#0a0a0a] border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-black z-40 relative shrink-0 pb-20 lg:pb-0">
                        {/* Tab Buttons */}
                        <div className="flex items-center gap-1 p-1.5 sm:p-2 bg-[#111] shrink-0 border-b-[3px] border-black">
                            <TabButton
                                isActive={activeTab === "controls"}
                                onClick={() => setActiveTab("controls")}
                                icon={<Settings2 className="w-4 h-4" />}
                                label="KONTROLLER"
                                color={color}
                            />
                            <TabButton
                                isActive={activeTab === "theory"}
                                onClick={() => setActiveTab("theory")}
                                icon={<BookOpen className="w-4 h-4" />}
                                label="TEORİ"
                                color={color}
                            />
                            <TabButton
                                isActive={activeTab === "missions"}
                                onClick={() => setActiveTab("missions")}
                                icon={<Target className="w-4 h-4" />}
                                label="GÖREVLER"
                                color={color}
                            />
                        </div>

                        {/* Tab Content (scrollable) */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-5 relative">
                            {/* Noise texture */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                            />
                            <AnimatePresence mode="wait">
                                {activeTab === "controls" && (
                                    <motion.div
                                        key="controls"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="relative z-10 flex flex-col gap-5"
                                    >
                                        {controlsArea || <Placeholder text="Kontrol paneli entegre edilmedi." />}
                                    </motion.div>
                                )}
                                {activeTab === "theory" && (
                                    <motion.div
                                        key="theory"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="relative z-10 text-zinc-300 max-w-none text-sm leading-relaxed"
                                    >
                                        {theoryArea ? theoryArea : <Placeholder text="Teori içeriği bulunamadı." />}
                                    </motion.div>
                                )}
                                {activeTab === "missions" && (
                                    <motion.div
                                        key="missions"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="relative z-10"
                                    >
                                        {missionsArea || <Placeholder text="Pedagojik görevler aktif değil." />}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </aside>
                )}
            </main>
        </div>
    );
}

function TabButton({ isActive, onClick, icon, label, color }: { isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black transition-all duration-200 tracking-widest uppercase rounded-lg border-[2px]",
                isActive
                    ? "bg-white text-black border-black shadow-[3px_3px_0px_0px_#000] -translate-x-[1px] -translate-y-[1px]"
                    : "border-transparent text-zinc-500 hover:text-white hover:bg-white/5"
            )}
        >
            <span className="relative z-10">{icon}</span>
            <span className="relative z-10 hidden sm:inline">{label}</span>
        </button>
    );
}

function Placeholder({ text }: { text: string }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 py-12">
            <div className="w-14 h-14 border-[3px] border-dashed border-zinc-700 bg-zinc-900/50 flex items-center justify-center rounded-lg" />
            <p className="text-xs font-black tracking-widest uppercase">{text}</p>
        </div>
    );
}
