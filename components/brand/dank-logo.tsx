"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V25: THE CYBER-INDUSTRIAL PLATE
               - Font: Chakra Petch (Google Font)
               - Concept: Cyberpunk / Heavy Machinery Warning Label
               - Style: Chamfered Corners, High Contrast Yellow
            */}

            <motion.div
                className="relative flex items-center justify-center bg-[#FACC15] px-4 py-1.5"
                style={{
                    clipPath: "polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)",
                }}
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* INNER BORDER DECORATION */}
                <div
                    className="absolute inset-[2px] border-[1.5px] border-black opacity-80"
                    style={{
                        clipPath: "polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)",
                    }}
                />

                {/* TEXT CONTENT */}
                <div className="flex flex-col items-center leading-none relative z-10">
                    <div className="flex items-center gap-0.5">
                        <h1
                            className="text-lg sm:text-2xl font-bold text-black tracking-wide"
                            style={{ fontFamily: 'var(--font-chakra)' }}
                        >
                            FIZIK
                        </h1>
                        <h1
                            className="text-lg sm:text-2xl font-light text-black tracking-wide"
                            style={{ fontFamily: 'var(--font-chakra)' }}
                        >
                            HUB
                        </h1>
                    </div>

                    {/* SUB-TEXT */}
                    <span
                        className="text-[8px] font-bold text-black uppercase tracking-[0.2em] w-full text-center border-t border-black mt-[1px] pt-[1px]"
                        style={{ fontFamily: 'var(--font-chakra)' }}
                    >
                        SCI-CORE
                    </span>
                </div>

                {/* SCREW DETAILS */}
                <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black rounded-full" />
                <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-black rounded-full" />
                <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-black rounded-full" />
                <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-black rounded-full" />

            </motion.div>

        </div>
    );
}
