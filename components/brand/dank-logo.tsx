"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               V6: THE CHOMIY REPLICA (PATTERN FILL)
               - Font: Carter One (Rounded Cartoon)
               - Technique: background-clip: text with CSS Gradient Stripes
            */}

            <div className="relative">
                {/* 
                   LAYER 1: DEEP EXTRUSION (Dark Green)
                   The physical block behind the text.
                */}
                <h1
                    className="absolute left-[4px] top-[4px] z-0 select-none text-4xl sm:left-[6px] sm:top-[6px] sm:text-6xl text-[#15803d]" // green-700
                    style={{
                        fontFamily: 'var(--font-carter)',
                        WebkitTextStroke: '2.5px black',
                    }}
                >
                    FIZIKHUB
                </h1>

                {/* 
                   LAYER 2: MAIN TEXT (Pattern Fill)
                   Yellow base with horizontal green stripes.
                   Using background-clip: text.
                */}
                <motion.h1
                    className="relative z-10 select-none text-4xl sm:text-6xl text-transparent"
                    style={{
                        fontFamily: 'var(--font-carter)',
                        WebkitTextStroke: '2.5px black',
                        backgroundImage: `repeating-linear-gradient(
                            180deg,
                            #FFD700 0%,      /* Stripe 1: Gold */
                            #FFD700 40%,
                            #4ade80 40%,     /* Stripe 2: Green */
                            #4ade80 60%,
                            #FFD700 60%,     /* Back to Gold */
                            #FFD700 100%
                        )`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0px 0px 0px black)' // Ensure stroke is distinct
                    }}
                    whileHover={{
                        scale: 1.05,
                        filter: 'drop-shadow(2px 2px 0px black)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* DECORATION: SHINIES (White Glints) */}
                <div className="absolute left-2 top-2 z-20 h-2 w-2 rounded-full bg-white opacity-80 sm:h-3 sm:w-3" />
                <div className="absolute right-8 top-3 z-20 h-1.5 w-1.5 rounded-full bg-white opacity-80 sm:h-2 sm:w-2" />
            </div>

            {/* 
               BILIM PLATFORMU: TOASTER TICKET
            */}
            <motion.div
                className="absolute -bottom-1 -right-4 z-30 sm:-bottom-3 sm:-right-8"
                initial={{ rotate: -8 }}
                whileHover={{ rotate: 8, scale: 1.1 }}
            >
                <div className="relative flex items-center justify-center border-2 border-black bg-[#FF6B6B] px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
                    {/* Inner Dashed Line for Ticket Look */}
                    <div className="absolute inset-0.5 border border-dashed border-white/50" />

                    <span className="relative z-10 text-[9px] font-black uppercase tracking-widest text-white sm:text-[11px]"
                        style={{ fontFamily: 'var(--font-outfit)' }}>
                        BİLİM PLATFORMU
                    </span>
                </div>
            </motion.div>

        </div>
    );
}
