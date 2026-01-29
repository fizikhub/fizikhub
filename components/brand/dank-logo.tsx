"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-1">

            {/* 
               V12: THE PHYSICS TOGGLE
               - Font: Outfit Black (Geometric)
               - Concept: Toggle Switch / Pill UI
               - Active State: FIZIK (Yellow)
               - Base State: HUB (Black)
            */}

            <motion.div
                className="relative flex items-center bg-black rounded-full p-1 border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* ACTIVE KNOB: FIZIK */}
                <motion.div
                    className="flex items-center justify-center bg-[#FACC15] rounded-full px-3 py-1 mr-[-10px] z-10 border-[1.5px] border-black shadow-[-1px_0px_2px_rgba(0,0,0,0.2)]"
                    whileHover={{ x: 2 }} // Small toggle movement
                >
                    <h1
                        className="text-xl sm:text-2xl font-black italic tracking-tighter text-black"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        FIZiK
                    </h1>
                </motion.div>

                {/* TRACK: HUB */}
                <div className="flex items-center justify-center px-4 py-1 pl-5 bg-black rounded-r-full">
                    <h1
                        className="text-xl sm:text-2xl font-black italic tracking-tighter text-white"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        HUB
                    </h1>
                </div>

                {/* LABEL: BILIM PLATFORMU */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="flex items-center justify-center border border-black bg-white px-1.5 rounded-[2px] shadow-[1px_1px_0px_0px_#000]">
                        <span className="text-[7px] font-black uppercase tracking-widest text-black"
                            style={{ fontFamily: 'var(--font-heading)' }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>

            </motion.div>

        </div>
    );
}
