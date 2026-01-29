"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V26: THE BUBBLEGUM BADGE (Soft Brutalism)
               - Font: Fredoka (Google Font)
               - Concept: Friendly, Light, Fun
               - Style: System Compatible Box, Colorful Interiors
            */}

            <motion.div
                className="flex items-center gap-1 bg-white px-3 py-1.5 border-[2px] border-black shadow-[2px_2px_0px_#000] rounded-full sm:rounded-none"
                whileHover={{ y: -1, boxShadow: "4px 4px 0px #000" }}
                whileTap={{ y: 1, boxShadow: "0px 0px 0px #000" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* DECORATIVE DOTS (The 'Fun' part) */}
                <div className="flex flex-col gap-1 mr-1">
                    <div className="w-1.5 h-1.5 bg-[#F472B6] rounded-full border border-black" />
                    <div className="w-1.5 h-1.5 bg-[#22D3EE] rounded-full border border-black" />
                </div>

                {/* TEXT CONTENT */}
                <div className="flex items-baseline tracking-normal leading-none">
                    <h1
                        className="text-xl sm:text-2xl font-semibold text-black"
                        style={{ fontFamily: 'var(--font-fredoka)' }}
                    >
                        Fizik
                    </h1>
                    <h1
                        className="text-xl sm:text-2xl font-semibold text-[#FACC15]"
                        style={{
                            fontFamily: 'var(--font-fredoka)',
                            textShadow: '1.5px 1.5px 0px #000',
                            WebkitTextStroke: '0.5px black'
                        }}
                    >
                        Hub
                    </h1>
                </div>

            </motion.div>

        </div>
    );
}
