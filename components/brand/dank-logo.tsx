"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V29: THE QUANTUM SLICE (INNOVATION)
               - Font: Anton (Google Font)
               - Concept: Glitch in Reality / Sliced Atom
               - Technique: CSS clip-path masking
            */}

            <motion.div
                className="relative flex flex-col leading-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* 
                    LAYER 1: TOP HALF
                    - Color: Black
                    - Clip: Top 52%
                 */}
                <h1
                    className="text-4xl text-black tracking-wider relative z-20"
                    style={{
                        fontFamily: 'var(--font-anton)',
                        clipPath: 'polygon(0 0, 100% 0, 100% 52%, 0 52%)'
                    }}
                >
                    FIZIKHUB
                </h1>

                {/* 
                    LAYER 2: BOTTOM HALF (The Glitch)
                    - Color: Yellow (#FACC15) with Black Stroke
                    - Clip: Bottom 48%
                    - Position: Absolute, slightly shifted X and Y
                 */}
                <h1
                    className="text-4xl text-[#FACC15] tracking-wider absolute top-0 left-0 z-10"
                    style={{
                        fontFamily: 'var(--font-anton)',
                        clipPath: 'polygon(0 52%, 100% 52%, 100% 100%, 0 100%)',
                        WebkitTextStroke: '1px black',
                        transform: 'translate(4px, 2px)'
                    }}
                >
                    FIZIKHUB
                </h1>

                {/* DECORATIVE LINE (The "Cut") */}
                <div
                    className="absolute top-[52%] left-[-10%] w-[120%] h-[1px] bg-black z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                />

            </motion.div>

        </div>
    );
}
