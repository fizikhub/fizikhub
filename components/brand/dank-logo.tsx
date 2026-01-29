"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative flex cursor-pointer flex-col select-none items-start">

            {/* 
               LAYER 1: FIZIKHUB MAIN TEXT 
               - Font: Outfit (Heading)
               - Style: Massive, Heavy, Sticker-like
            */}
            <div className="relative z-10">
                <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Shadow Layer (Hard Drop) */}
                    <span className="absolute left-[3px] top-[3px] select-none text-2xl font-black italic tracking-tighter text-black sm:left-[4px] sm:top-[4px] sm:text-4xl"
                        style={{ fontFamily: "var(--font-heading)", WebkitTextStroke: "2px black" }}>
                        FIZIKHUB
                    </span>

                    {/* Stroke Layer (The Outline) */}
                    <span className="absolute left-0 top-0 select-none text-2xl font-black italic tracking-tighter text-black sm:text-4xl"
                        style={{ fontFamily: "var(--font-heading)", WebkitTextStroke: "4px black" }}>
                        FIZIKHUB
                    </span>

                    {/* Main Text Layer (The Color) */}
                    <h1
                        className="relative z-10 text-2xl font-black italic tracking-tighter text-[#FFC800] sm:text-4xl"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        FIZIKHUB
                    </h1>

                    {/* Star Accent (Animated) */}
                    <motion.div
                        className="absolute -right-3 -top-3 z-20 text-black drop-shadow-sm sm:-right-5 sm:-top-4"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b5cf6" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-8 sm:h-8 stroke-black stroke-[1.5px]">
                            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                        </svg>
                    </motion.div>
                </motion.div>
            </div>

            {/* 
               LAYER 2: BİLİM PLATFORMU
               - Style: Badge/Capsule, Rotated, Contrasting Color
            */}
            <motion.div
                className="relative z-20 -mt-1 ml-1 sm:-mt-2 sm:ml-2"
                initial={{ rotate: 2 }}
                whileHover={{ rotate: 0, scale: 1.1 }}
            >
                <div className="flex items-center justify-center rounded-sm bg-white border-[1.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-1 py-0.5 sm:px-2 sm:py-0.5">
                    <span className="text-[9px] font-black uppercase text-black sm:text-[11px]" style={{ fontFamily: "var(--font-heading)" }}>
                        BİLİM PLATFORMU
                    </span>
                </div>
            </motion.div>

        </div>
    );
}
