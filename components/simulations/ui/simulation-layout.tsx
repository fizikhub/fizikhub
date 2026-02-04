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
    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-neutral-900 relative">

            {/* CANVAS AREA */}
            <div className="w-full lg:flex-1 relative h-[50vh] lg:h-auto overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-black z-10">
                {children}
            </div>

            {/* CONTROLS AREA */}
            <div className="w-full lg:w-80 bg-white dark:bg-zinc-900 flex flex-col z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] lg:shadow-none">
                {title && (
                    <div className="p-4 lg:p-6 border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <h2 className="font-black text-lg lg:text-xl mb-1 flex items-center gap-2">
                            {title}
                        </h2>
                        {description && <p className="text-xs text-zinc-500 font-medium leading-snug">{description}</p>}
                    </div>
                )}

                {/* Scrollable Controls */}
                <div className="flex-1 overflow-y-auto">
                    {controls}
                </div>
            </div>
        </div>
    );
}
