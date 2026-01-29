"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V20: THE INTEGRATED MODULE
               - Font: Space Grotesk (System)
               - Concept: UI Control Module / CPU
               - Style: Clean, Boxed, System-Compatible
            */}

            <motion.div
                className="flex items-center gap-1.5 bg-white px-3 py-1 sm:py-1.5 border-[2px] border-black shadow-[2px_2px_0px_#000]"
                whileHover={{ y: -1, boxShadow: "4px 4px 0px #000" }}
                whileTap={{ y: 1, boxShadow: "0px 0px 0px #000" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* ICON / INDICATOR */}
                <div className="h-2.5 w-2.5 bg-[#FACC15] border-[1.5px] border-black" />

                {/* TEXT */}
                <div className="flex items-baseline gap-0.5">
                    <h1
                        className="text-lg sm:text-2xl font-bold tracking-tight text-black leading-none"
                        style={{ fontFamily: 'var(--font-space)' }}
                    >
                        FIZIK
                    </h1>
                    <h1
                        className="text-lg sm:text-2xl font-medium tracking-tight text-black leading-none"
                        style={{ fontFamily: 'var(--font-space)' }}
                    >
                        HUB
                    </h1>
                </div>

                {/* TAGLINE (Integrated) */}
                <div className="hidden sm:flex border-l-[1.5px] border-black/20 ml-2 pl-2">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                        PLATFORM
                    </span>
                </div>

            </motion.div>

        </div>
    );
}
