"use client";

import { cn } from "@/lib/utils";
import { Settings2, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SimulationLayoutProps {
    children: React.ReactNode; // The Canvas / Simulation Area
    controls: React.ReactNode; // The Controls Sidebar Content
    title?: string;
    description?: string;
}

export function SimulationLayout({ children, controls, title, description }: SimulationLayoutProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] bg-neutral-900 overflow-hidden relative">

            {/* CANVAS AREA (Always Visible) */}
            <div className="flex-1 relative h-full w-full overflow-hidden">
                {children}

                {/* MOBILE: Settings Toggle Button */}
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="lg:hidden absolute bottom-6 right-6 z-50 w-12 h-12 bg-[#FFC800] border-[2px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                    <Settings2 className="w-6 h-6 text-black" />
                </button>
            </div>

            {/* DESKTOP: Sidebar (Visible on LG screens) */}
            <div className="hidden lg:flex w-80 bg-white dark:bg-zinc-900 border-l-[3px] border-black flex-col h-full overflow-y-auto z-20">
                {title && (
                    <div className="p-6 border-b-2 border-zinc-100 dark:border-zinc-800 pb-4">
                        <h2 className="font-black text-xl mb-1">{title}</h2>
                        {description && <p className="text-xs text-zinc-500 font-medium">{description}</p>}
                    </div>
                )}
                {controls}
            </div>

            {/* MOBILE: Bottom Sheet / Overlay for Controls */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="lg:hidden absolute inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="lg:hidden absolute bottom-0 left-0 right-0 h-[60vh] bg-white dark:bg-zinc-900 border-t-[3px] border-black z-50 flex flex-col shadow-[-10px_-10px_30px_rgba(0,0,0,0.5)] rounded-t-2xl overflow-hidden"
                        >
                            {/* Sheet Handle */}
                            <div className="flex items-center justify-between p-4 border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="font-black text-lg uppercase tracking-tight">Ayarlar</span>
                                <button
                                    onClick={() => setIsSettingsOpen(false)}
                                    className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Controls Content */}
                            <div className="flex-1 overflow-y-auto p-0 pb-20 safe-area-bottom">
                                {controls}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
