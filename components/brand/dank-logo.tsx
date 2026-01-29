"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               CONCEPT: THE SCIENTIFIC GLITCH
               - Font: Space Grotesk (Tech/Brutalist)
               - No boxes, just raw layered text
            */}

            <div className="relative">
                {/* Layer 1: The Shadow (Deep Void) */}
                <span className="absolute left-[3px] top-[3px] font-black tracking-tighter text-black opacity-100 sm:left-[5px] sm:top-[5px] text-3xl sm:text-5xl"
                    style={{ fontFamily: 'var(--font-space)' }}>
                    FIZIKHUB
                </span>

                {/* Layer 2: The Glitch (Cyan Offset) */}
                {/* Only visible on hover or slight permanent offset */}
                <motion.span
                    className="absolute left-[-2px] top-[-2px] -z-10 font-black tracking-tighter text-[#00FFFF] opacity-0 mix-blend-multiply group-hover:opacity-100 text-3xl sm:text-5xl"
                    style={{ fontFamily: 'var(--font-space)' }}
                    animate={{ x: [0, -2, 2, 0], y: [0, 1, -1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
                >
                    FIZIKHUB
                </motion.span>

                {/* Layer 3: The Glitch (Magenta Offset) */}
                <motion.span
                    className="absolute left-[2px] top-[2px] -z-10 font-black tracking-tighter text-[#FF00FF] opacity-0 mix-blend-multiply group-hover:opacity-100 text-3xl sm:text-5xl"
                    style={{ fontFamily: 'var(--font-space)' }}
                    animate={{ x: [0, 2, -2, 0], y: [0, -1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.25, repeatDelay: 3 }}
                >
                    FIZIKHUB
                </motion.span>

                {/* Layer 4: The Main Hull (White with Heavy Strokes) */}
                <motion.div
                    className="relative z-10"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <h1 className="text-3xl font-black italic tracking-tighter text-[#FFC800] sm:text-5xl"
                        style={{
                            fontFamily: 'var(--font-space)',
                            WebkitTextStroke: '2px black', // Thicker Stroke
                            textShadow: '4px 4px 0px #000000' // Hard Shadow built-in
                        }}>
                        FIZIKHUB
                    </h1>

                    {/* Inner White Fill for maximum contrast if needed, but #FFC800 is requested. 
                        Let's stick to the high contrast yellow/black.
                    */}
                </motion.div>

                {/* DECORTATION: CHAOS STARS */}
                <motion.div
                    className="absolute -right-4 -top-4 z-20 text-[#FF00FF]"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="2">
                        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
                    </svg>
                </motion.div>

                <motion.div
                    className="absolute -left-2 -bottom-2 z-20 text-[#00FFFF]"
                    animate={{ rotate: -360, scale: [1, 1.5, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </motion.div>
            </div>

            {/* 
               SUB-ELEMENT: BİLİM PLATFORMU
               - Style: Rotated Tape / Sticker
               - Position: Overlapping slightly
            */}
            <motion.div
                className="absolute -bottom-3 -right-2 z-30 sm:-bottom-4 sm:-right-8"
                initial={{ rotate: -5 }}
                whileHover={{ rotate: 5, scale: 1.1 }}
            >
                <div className="flex -skew-x-12 items-center justify-center border-2 border-black bg-[#F472B6] px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[10px] font-bold leading-none tracking-widest text-black sm:text-xs"
                        style={{ fontFamily: 'var(--font-space)' }}>
                        BİLİM_PLATFORMU
                    </span>
                </div>
            </motion.div>

        </div>
    );
}
