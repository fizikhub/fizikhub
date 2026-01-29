"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center">

            {/* 
               V21: THE SOVIET SPACE BADGE
               - Font: Russo One (Google Font)
               - Concept: Constructivist / Space Race / Heavy Industry
               - Style: Geometric, Blocky, High-Contrast
            */}

            <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* ICON: RED STAR / GEOMETRY */}
                <div className="mr-2 flex items-center justify-center h-8 w-8 bg-black clip-path-polygon-[10%_0%,_100%_0%,_90%_100%,_0%_100%]">
                    <div className="h-3 w-3 bg-[#FACC15] rotate-45" />
                </div>

                {/* TEXT LOCKUP */}
                <div className="flex flex-col -space-y-1">
                    <div className="flex items-baseline leading-none">
                        <h1
                            className="text-2xl sm:text-3xl text-black tracking-normal uppercase"
                            style={{ fontFamily: 'var(--font-russo)' }}
                        >
                            FIZIK
                        </h1>
                        <h1
                            className="text-2xl sm:text-3xl text-[#FACC15] tracking-normal uppercase"
                            style={{
                                fontFamily: 'var(--font-russo)',
                                textShadow: '1px 1px 0px #000'
                            }}
                        >
                            HUB
                        </h1>
                    </div>

                    {/* SUBTITLE BAR */}
                    <div className="flex items-center justify-between w-full border-t-[2px] border-black pt-[2px]">
                        <span className="text-[9px] font-bold text-black uppercase tracking-widest leading-none">
                            BILIM. PLATFORMU.
                        </span>
                    </div>
                </div>

            </motion.div>

        </div>
    );
}
