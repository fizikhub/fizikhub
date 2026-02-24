"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    color = "#38BDF8",
    children,
    controlsArea,
    theoryArea,
    missionsArea,
}: SimulationLayoutProps) {
    const [activeTab, setActiveTab] = useState<TabType>("controls");
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <div className="flex flex-col h-[100dvh] bg-[#09090b] text-zinc-50 font-[family-name:var(--font-outfit)] overflow-hidden">

            {/* Header / Topbar */}
            {!isFullscreen && (
                <header
                    className="relative z-50 flex items-center justify-between px-4 py-3 sm:py-4 border-b border-white/5"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10 w-full max-w-screen-2xl mx-auto">
                        <ViewTransitionLink href="/simulasyonlar">
                            <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-95">
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                        </ViewTransitionLink>

                        <h1 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter drop-shadow-md">
                            {title}
                        </h1>
                    </div>
                </header>
            )}

            {/* Main Stage */}
            <main className="flex-1 flex flex-col lg:flex-row relative">
                {/* Visual Area */}
                <section className={cn(
                    "relative flex-1 flex items-center justify-center p-2 sm:p-4 bg-[url('/noise.png')] bg-repeat shadow-inner transition-all",
                    isFullscreen ? "fixed inset-0 z-[100] p-0 bg-black" : "min-h-[50vh] lg:min-h-full"
                )}>
                    {/* The Canvas Frame */}
                    <div className={cn(
                        "relative w-full h-full overflow-hidden flex items-center justify-center bg-black backdrop-blur-3xl transition-all duration-500",
                        isFullscreen ? "rounded-none border-none shadow-none" : "rounded-3xl border border-white/5 shadow-2xl"
                    )}>
                        {children}

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className={cn(
                                "absolute z-50 w-10 h-10 rounded-xl bg-black/50 border border-white/10 backdrop-blur text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90",
                                isFullscreen ? "top-4 right-4 bg-white/10 hover:bg-white/30" : "top-4 right-4"
                            )}
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                    </div>
                </section>

                {/* Interaction Panel */}
                {!isFullscreen && (
                    <aside className="h-[45vh] lg:h-full lg:w-[420px] flex flex-col bg-zinc-950/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/5 z-40 relative shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                        {/* Tabs Header */}
                        <div className="flex items-center p-2 gap-1 bg-black/60 shrink-0 overflow-x-auto overflow-y-hidden hide-scrollbar border-b border-white/5">
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

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative">
                            <AnimatePresence mode="wait">
                                {activeTab === "controls" && (
                                    <motion.div
                                        key="controls"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full flex flex-col gap-6"
                                    >
                                        {controlsArea || <Placeholder text="Kontrol paneli entegre edilmedi." />}
                                    </motion.div>
                                )}
                                {activeTab === "theory" && (
                                    <motion.div
                                        key="theory"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full text-zinc-300 max-w-none text-sm leading-relaxed"
                                    >
                                        {theoryArea ? theoryArea : <Placeholder text="Teori içeriği bulunamadı." />}
                                    </motion.div>
                                )}
                                {activeTab === "missions" && (
                                    <motion.div
                                        key="missions"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
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
                "relative flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs font-bold transition-all duration-300 z-10 tracking-widest overflow-hidden",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{ backgroundColor: `${color}30` }} // 30 hex alpha
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            )}
            <span className="relative z-10">{icon}</span>
            <span className="relative z-10">{label}</span>
        </button>
    );
}

function Placeholder({ text }: { text: string }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 py-12">
            <div className="w-16 h-16 rounded-full border border-dashed border-zinc-700 bg-zinc-900/50 flex items-center justify-center" />
            <p className="text-sm font-medium tracking-wide uppercase">{text}</p>
        </div>
    );
}
