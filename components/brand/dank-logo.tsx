"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V24: THE 8-BIT LABORATORY
               - Font: Press Start 2P (Google Font)
               - Concept: Retro Gaming / Digital Science
               - Style: Pixel Art, Game HUD
            */}

            <motion.div
                className="flex items-center gap-2 bg-black px-3 py-2 border-[2px] border-black shadow-[2px_2px_0px_#000]"
                whileHover={{ y: -1, boxShadow: "4px 4px 0px #000" }}
                whileTap={{ y: 1, boxShadow: "0px 0px 0px #000" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* 8-BIT ICON (A pixelated flask or atom) */}
                <div className="relative h-4 w-4">
                    <div className="absolute inset-0 bg-[#4ADE80] shadow-[2px_0_0_#000,-2px_0_0_#000,0_2px_0_#000,0_-2px_0_#000]" />
                    <div className="absolute inset-0 bg-[#4ADE80] animate-pulse opacity-50" />
                </div>

                {/* PIXEL TEXT */}
                <div className="flex flex-col leading-none">
                    <h1
                        className="text-[10px] sm:text-xs text-[#4ADE80] tracking-widest"
                        style={{ fontFamily: 'var(--font-press-start)', textShadow: '2px 2px 0px #000' }}
                    >
                        FIZIK
                    </h1>
                    <h1
                        className="text-[10px] sm:text-xs text-white tracking-widest"
                        style={{ fontFamily: 'var(--font-press-start)', textShadow: '2px 2px 0px #000' }}
                    >
                        HUB
                    </h1>
                </div>

                {/* LEVEL INDICATOR */}
                <div className="hidden sm:block ml-1 h-full flex flex-col justify-between gap-0.5">
                    <div className="h-1 w-1 bg-[#FACC15]" />
                    <div className="h-1 w-1 bg-[#FACC15]" />
                    <div className="h-1 w-1 bg-[#FACC15]" />
                </div>

            </motion.div>

        </div>
    );
}
