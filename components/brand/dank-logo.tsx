"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V30: THE DIGITAL GLITCH
               - Font: Rubik Glitch (Google Font)
               - Concept: System Error / Static Noise / Entrophy
               - Style: Raw text, high contrast, blinking cursor
            */}

            <motion.div
                className="flex items-center leading-none tracking-widest"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* BLACK PART */}
                <h1
                    className="text-2xl sm:text-3xl text-black"
                    style={{ fontFamily: 'var(--font-rubik-glitch)' }}
                >
                    FIZIK
                </h1>

                {/* YELLOW PART */}
                <h1
                    className="text-2xl sm:text-3xl text-[#FACC15] ml-1"
                    style={{
                        fontFamily: 'var(--font-rubik-glitch)',
                        textShadow: '1px 1px 0px black'
                    }}
                >
                    HUB
                </h1>

                {/* BLINKING CURSOR */}
                <motion.div
                    className="w-2 h-[3px] bg-black ml-1 self-end mb-1.5"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                />

            </motion.div>

        </div>
    );
}
