"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="group flex items-center gap-3 select-none cursor-pointer">
            {/* 1. APP-STYLE ICON CONTAINER */}
            <motion.div
                whileHover={{ rotate: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative w-10 h-10 sm:w-12 sm:h-12",
                    "bg-[#FFC800] border-[3px] border-black",
                    "shadow-[4px_4px_0px_0px_#000]",
                    "flex items-center justify-center shrink-0 overflow-hidden",
                    "group-hover:shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px]",
                    "transition-all duration-200"
                )}
            >
                {/* CUSTOM GRAFFITI/NEO-BRUTALIST ATOM SVG */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 stroke-black stroke-[2.5] z-10">
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" className="fill-white" />
                    <path d="M12 7v10M7 12h10" />
                    <path d="M17 17l-1.5-1.5" strokeLinecap="round" />
                    <circle cx="17" cy="7" r="2" className="fill-black" />
                </svg>

                {/* DECORATIVE CORNER PIXEL */}
                <div className="absolute top-0 right-0 w-2 h-2 bg-black/10" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-black/10" />
            </motion.div>

            {/* 2. TEXT LOCKUP */}
            <div className="flex flex-col items-start justify-center h-full">
                {/* MAIN TITLE */}
                <div className="relative">
                    <h1
                        className="text-2xl sm:text-3xl font-black text-black leading-[0.85] tracking-tighter"
                        style={{ fontFamily: 'var(--font-space)' }}
                    >
                        FIZIKHUB
                    </h1>
                    {/* GLITCH SHADOW (Optional, cleaner without heavy noise, but adds "Neo" feel) */}
                    <span
                        className="absolute top-0 left-0 -z-10 text-2xl sm:text-3xl font-black text-[#FF0055] leading-[0.85] tracking-tighter translate-x-[1px] translate-y-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ fontFamily: 'var(--font-space)' }}
                    >
                        FIZIKHUB
                    </span>
                </div>

                {/* SUBTITLE BADGE */}
                <div className="relative mt-1">
                    <div className={cn(
                        "bg-black border border-black",
                        "px-1.5 py-[2px]",
                        "transform -rotate-2 origin-left",
                        "group-hover:rotate-0 transition-transform duration-200 ease-out"
                    )}>
                        <span className="block text-[9px] sm:text-[10px] font-bold text-[#FFC800] leading-none tracking-widest uppercase">
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
