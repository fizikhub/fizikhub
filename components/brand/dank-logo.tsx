"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none flex-col items-center justify-center p-1 sm:p-2">

            {/* 
               CONCEPT: HEAVY 3D CARTOON (CHOMIY STYLE)
               - Font: Outfit (Rounded, Friendly but Heavy)
               - Effect: Deep CSS Stacked Shadow
            */}

            <div className="relative">
                {/* 
                    The Main 3D Text Block 
                    Using hard text-shadows for the extrusion effect to ensure consistency 
                    and better performance than multiple DOM elements.
                */}
                <motion.h1
                    className="relative z-10 text-4xl font-black italic tracking-tighter text-[#FFC800] sm:text-6xl"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        WebkitTextStroke: '2.5px black',
                        textShadow: `
                            1px 1px 0 #000,
                            2px 2px 0 #000,
                            3px 3px 0 #000,
                            4px 4px 0 #000,
                            5px 5px 0 #000,
                            6px 6px 0 #000
                        `
                    }}
                    whileHover={{
                        scale: 1.05,
                        textShadow: `
                            1px 1px 0 #000,
                            2px 2px 0 #000,
                            3px 3px 0 #000,
                            4px 4px 0 #000,
                            5px 5px 0 #000,
                            6px 6px 0 #000,
                            7px 7px 0 #000,
                            8px 8px 0 #000
                        `,
                        translateY: -2,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* 
                   DECORATION: Comic "Pow" Marks 
                   Simple SVG splats to reinforce the cartoon vibe
                */}
                <motion.div
                    className="absolute -right-4 -top-4 z-0 text-black hidden sm:block"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#84cc16" stroke="black" strokeWidth="2" className="drop-shadow-[2px_2px_0_#000]">
                        <path d="M12 2L14.5 9L22 9L16 13L18 20L12 16L6 20L8 13L2 9L9.5 9L12 2Z" />
                    </svg>
                </motion.div>
            </div>

            {/* 
               SUB-ELEMENT: BİLİM PLATFORMU
               - Style: Comic Book Speech Bubble / Burst
               - Position: Overlapping layout
            */}
            <motion.div
                className="absolute -bottom-2 -right-4 z-20 sm:-bottom-4 sm:-right-8"
                initial={{ rotate: -5, scale: 0.9 }}
                whileHover={{ rotate: 5, scale: 1.1 }}
            >
                {/* Comic Burst Shape Container */}
                <div className="relative">
                    {/* The Background Shape */}
                    <div className="absolute inset-0 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rotate-2 scale-110" />

                    {/* The Content */}
                    <div className="relative border-2 border-black bg-[#FF2E2E] px-2 py-0.5 shadow-[2px_2px_0px_0px_#000] -rotate-2">
                        <span className="text-[10px] font-black uppercase italic leading-none tracking-widest text-white sm:text-xs"
                            style={{ fontFamily: 'var(--font-heading)', textShadow: '1px 1px 0 #000' }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
