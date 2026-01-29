"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <motion.div
            className="group flex items-center gap-3 select-none cursor-pointer"
            initial="idle"
            whileHover="hover"
            whileTap="tap"
        >
            {/* 1. APP ICON: THE "TARGET" */}
            <div className="relative">
                {/* Shadow Box */}
                <div className="absolute inset-0 bg-black translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[2px]" />

                {/* Main Container */}
                <div
                    className={cn(
                        "relative w-11 h-11 sm:w-12 sm:h-12",
                        "bg-[#FFC800] border-[3px] border-black",
                        "flex items-center justify-center overflow-hidden",
                        "transition-transform duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[2px]"
                    )}
                >
                    {/* CUSTOM SYMBOL: Abstract Physics Target / Scope */}
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 stroke-black stroke-[3]">
                        {/* Outer Circle */}
                        <circle cx="12" cy="12" r="9" />
                        {/* Crosshairs */}
                        <path d="M12 2v20" />
                        <path d="M2 12h20" />
                        {/* Center Dot */}
                        <circle cx="12" cy="12" r="2" className="fill-black stroke-none" />
                    </svg>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-black" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-black" />
                </div>
            </div>

            {/* 2. TYPOGRAPHY LOCKUP */}
            <div className="flex flex-col justify-center gap-0.5">
                {/* HEADING */}
                <div className="relative overflow-hidden">
                    <h1
                        className="text-[26px] leading-[0.8] font-black text-black tracking-tighter"
                        style={{ fontFamily: 'var(--font-space)' }}
                    >
                        FIZIKHUB
                    </h1>
                </div>

                {/* SUBTITLE STRIP */}
                <div className="flex items-center">
                    <motion.div
                        className="bg-black px-1.5 py-[2px] transform origin-left"
                        variants={{
                            hover: { rotate: -2, scale: 1.05 },
                            tap: { rotate: 0, scale: 0.95 }
                        }}
                    >
                        <span className="block text-[8px] sm:text-[9px] font-bold text-white tracking-[0.25em] leading-none uppercase">
                            BİLİM PLATFORMU
                        </span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
