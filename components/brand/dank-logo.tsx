"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V28: THE PERIODIC BLOCK
               - Font: Rubik Mono One (Google Font)
               - Concept: Periodic Table / LEGO / Building Blocks
               - Style: Heavy, Interlocking, High Contrast
            */}

            <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* BLOCK 1: FIZIK (Yellow) */}
                <div className="flex items-center justify-center bg-[#FACC15] border-[2px] border-black px-2 py-1 shadow-[2px_2px_0px_#000] z-10 -mr-1">
                    <h1
                        className="text-xs sm:text-sm text-black uppercase leading-none"
                        style={{ fontFamily: 'var(--font-rubik)' }}
                    >
                        FIZIK
                    </h1>
                </div>

                {/* BLOCK 2: HUB (Black) */}
                <div className="flex items-center justify-center bg-black border-[2px] border-black px-2 py-1 shadow-[2px_2px_0px_#000] relative top-1">
                    <h1
                        className="text-xs sm:text-sm text-white uppercase leading-none"
                        style={{ fontFamily: 'var(--font-rubik)' }}
                    >
                        HUB
                    </h1>
                </div>

            </motion.div>

        </div>
    );
}
