"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-1">

            {/* 
               V8: THE BUNGEE SIGN (Urban/Street)
               - Font: Bungee (Vertical/Urban)
               - Style: High Contrast (White Text / Black Stroke / Magenta Shadow)
            */}

            <div className="relative flex flex-col items-center">

                {/* HEADLINE: FIZIKHUB */}
                <div className="relative">
                    {/* Hard Neon Shadow Layer */}
                    <h1
                        className="absolute left-[3px] top-[3px] z-0 select-none text-3xl sm:text-5xl text-[#d946ef]" // Fuchsia-500
                        style={{
                            fontFamily: 'var(--font-bungee)',
                            WebkitTextStroke: '2px black', // Thick stroke on shadow too
                        }}
                        aria-hidden="true"
                    >
                        FIZIKHUB
                    </h1>

                    {/* Main Text (White with Black Outline) */}
                    <motion.h1
                        className="relative z-10 select-none text-3xl sm:text-5xl text-white"
                        style={{
                            fontFamily: 'var(--font-bungee)',
                            WebkitTextStroke: '2px black',
                            filter: 'drop-shadow(0px 0px 0px black)'
                        }}
                        whileHover={{
                            x: -2,
                            y: -2,
                            filter: 'drop-shadow(2px 2px 0px black)' // Double depth on hover
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        FIZIKHUB
                    </motion.h1>
                </div>

                {/* SUB-ELEMENT: BILIM PLATFORMU (Caution Tape) */}
                <motion.div
                    className="relative z-20 -mt-2 sm:-mt-3"
                    initial={{ rotate: 2 }}
                    whileHover={{ rotate: -2, scale: 1.1 }}
                >
                    <div className="flex items-center justify-center border-[2px] border-black bg-[#d946ef] px-4 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white sm:text-[12px]"
                            style={{ fontFamily: 'var(--font-heading)' }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </motion.div>

            </div>

            {/* DECORATION: BOLTS */}
            <div className="absolute left-0 top-1/2 h-1.5 w-1.5 rounded-full border border-black bg-white" />
            <div className="absolute right-0 top-1/2 h-1.5 w-1.5 rounded-full border border-black bg-white" />

        </div>
    );
}
