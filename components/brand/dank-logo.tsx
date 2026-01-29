"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V23: THE NEO-BRUTALIST BADGE (Master Card)
               - Font: Righteous (Google Font)
               - Concept: System UI Component
               - Style: Clean, White Card, System Compatible Borders/Shadows
            */}

            <motion.div
                className="flex items-center gap-1 bg-white px-3 py-1.5 border-[2px] border-black shadow-[2px_2px_0px_#000]"
                whileHover={{ y: -1, boxShadow: "4px 4px 0px #000" }}
                whileTap={{ y: 1, boxShadow: "0px 0px 0px #000" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* LOGO MARK: A simple geometric shape matching the font's corners */}
                <div className="h-6 w-6 bg-black flex items-center justify-center rounded-sm mr-1">
                    <div className="h-3 w-3 bg-white rounded-full" />
                </div>

                {/* TEXT CONTENT */}
                <div className="flex items-baseline tracking-tight leading-none">
                    <h1
                        className="text-2xl font-normal text-black"
                        style={{ fontFamily: 'var(--font-righteous)' }}
                    >
                        FIZIK
                    </h1>
                    <h1
                        className="text-2xl font-normal text-[#FACC15]"
                        style={{
                            fontFamily: 'var(--font-righteous)',
                            textShadow: '1.5px 1.5px 0px #000',
                            WebkitTextStroke: '0.5px black'
                        }}
                    >
                        HUB
                    </h1>
                </div>

            </motion.div>

        </div>
    );
}
