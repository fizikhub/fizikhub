"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               V14: THE LAB TAPE
               - Font: Chakra Petch (Technical/Futuristic)
               - Concept: Dymo Labeling Tape
               - Style: Overlapping Stips, Jagged Edges, Technical Vibe
            */}

            <motion.div
                className="relative flex flex-col items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* TAPE 1: FIZIK (Yellow) */}
                <div
                    className="relative z-10 -mb-2 rotate-[-2deg] bg-[#FACC15] px-3 py-1 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                    style={{
                        clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)', // Slight tear simulation
                    }}
                >
                    <h1
                        className="text-2xl sm:text-3xl font-bold tracking-tight text-black"
                        style={{ fontFamily: 'var(--font-chakra)' }}
                    >
                        FIZIK
                    </h1>
                </div>

                {/* TAPE 2: HUB (Black) */}
                <div
                    className="relative z-0 rotate-[1deg] bg-black px-4 py-1 pb-2 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                    style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)',
                    }}
                >
                    <h1
                        className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
                        style={{ fontFamily: 'var(--font-chakra)' }}
                    >
                        HUB
                    </h1>
                </div>

                {/* QC STICKER: BILLIM PLATFORMU */}
                <div className="absolute -bottom-1 -right-4 rotate-[-10deg] opacity-90">
                    <div className="border border-black bg-white px-1 shadow-sm">
                        <span className="text-[7px] font-bold text-black"
                            style={{ fontFamily: 'var(--font-chakra)' }}>
                            QC:PASSED
                        </span>
                    </div>
                </div>

            </motion.div>

        </div>
    );
}
