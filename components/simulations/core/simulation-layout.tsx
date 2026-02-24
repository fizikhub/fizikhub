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
    color = "#FACC15",
    children,
    controlsArea,
    theoryArea,
    missionsArea,
}: SimulationLayoutProps) {
    const [activeTab, setActiveTab] = useState<TabType>("controls");
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <div className="flex flex-col h-[100dvh] bg-[#FFFDF0] text-black font-sans overflow-hidden selection:bg-black selection:text-white">

            {/* Header / Topbar */}
            {!isFullscreen && (
                <header
                    className="relative z-50 flex items-center justify-between px-4 py-3 sm:py-4 border-b-[4px] border-black"
                    style={{ backgroundColor: color }}
                >
                    {/* Retro Grid Background Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
                        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                    />

                    <div className="flex items-center gap-4 relative z-10 w-full max-w-[1400px] mx-auto">
                        <ViewTransitionLink href="/simulasyonlar">
                            <button className="flex items-center justify-center w-12 h-12 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group">
                                <ArrowLeft className="w-6 h-6 text-black group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </ViewTransitionLink>

                        <div className="bg-white border-[3px] border-black px-4 py-2 shadow-[4px_4px_0px_#000] rotate-1">
                            <h1 className="text-xl md:text-2xl font-black text-black uppercase tracking-tighter leading-none">
                                {title}
                            </h1>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Stage */}
            <main className="flex-1 flex flex-col lg:flex-row relative">

                {/* Visual Area */}
                <section className={cn(
                    "relative flex-1 flex items-center justify-center p-4 lg:p-8 transition-all",
                    isFullscreen ? "fixed inset-0 z-[100] p-0 bg-[#FFFDF0]" : "min-h-[50vh] lg:min-h-full"
                )}>
                    {/* The Canvas Frame */}
                    <div className={cn(
                        "relative w-full h-full overflow-hidden flex items-center justify-center transition-all duration-300",
                        isFullscreen
                            ? "rounded-none border-none shadow-none bg-black"
                            : "bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                    )}>
                        {/* Simulation Content */}
                        {children}

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className={cn(
                                "absolute z-50 w-12 h-12 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center hover:bg-black hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all",
                                isFullscreen ? "top-4 right-4" : "top-4 right-4"
                            )}
                        >
                            {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                        </button>
                    </div>
                </section>

                {/* Interaction Panel */}
                {!isFullscreen && (
                    <aside className="h-[45vh] lg:h-full lg:w-[450px] flex flex-col bg-white border-t-[4px] lg:border-t-0 lg:border-l-[4px] border-black z-40 relative shadow-[-8px_0_0px_rgba(0,0,0,1)]">
                        {/* Tabs Header */}
                        <div className="flex items-center p-4 gap-2 bg-[#f4f4f5] shrink-0 border-b-[4px] border-black overflow-x-auto overflow-y-hidden hide-scrollbar">
                            <TabButton
                                isActive={activeTab === "controls"}
                                onClick={() => setActiveTab("controls")}
                                icon={<Settings2 className="w-4 h-4" />}
                                label="KONTROL"
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
                                label="GÖREV"
                                color={color}
                            />
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative bg-[#FFFDF0]">
                            <AnimatePresence mode="wait">
                                {activeTab === "controls" && (
                                    <motion.div
                                        key="controls"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full flex flex-col gap-8"
                                    >
                                        {controlsArea || <Placeholder text="KONTROL PANELİ YOK" />}
                                    </motion.div>
                                )}
                                {activeTab === "theory" && (
                                    <motion.div
                                        key="theory"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full text-black max-w-none text-base font-medium leading-relaxed"
                                    >
                                        {theoryArea ? theoryArea : <Placeholder text="TEORİ EKLENMEDİ" />}
                                    </motion.div>
                                )}
                                {activeTab === "missions" && (
                                    <motion.div
                                        key="missions"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
                                    >
                                        {missionsArea || <Placeholder text="GÖREV TANIMLANMADI" />}
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
                "relative flex-1 flex items-center justify-center gap-2 px-4 py-3 border-[3px] border-black text-sm font-black uppercase tracking-tighter transition-all duration-200 shadow-[4px_4px_0px_#000] whitespace-nowrap",
                isActive
                    ? "text-black translate-y-[4px] translate-x-[4px] shadow-none"
                    : "bg-white text-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]"
            )}
            style={{ backgroundColor: isActive ? color : "white" }}
        >
            <span className="relative z-10">{icon}</span>
            <span className="relative z-10">{label}</span>
        </button>
    );
}

function Placeholder({ text }: { text: string }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-black space-y-6 py-12">
            <div className="w-24 h-24 border-[4px] border-dashed border-black bg-zinc-200 flex items-center justify-center rotate-3" />
            <p className="text-xl font-black tracking-tighter uppercase bg-white border-[3px] border-black px-4 py-2 shadow-[4px_4px_0px_#000] -rotate-2">{text}</p>
        </div>
    );
}
