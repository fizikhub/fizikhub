"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-1">

            {/* 
               V11: THE STACKED VARSITY BLOCK
               - Font: Passion One (900 Weight) - Condensed & Heavy
               - Layout: Stacked (Square Aspect Ratio)
               - Style: Varsity / Sports Team / Brand Mark
            */}

            <motion.div
                className="relative flex flex-col items-center leading-[0.8]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* TOP: FIZIK */}
                <h1
                    className="text-4xl sm:text-5xl text-[#FACC15]" // Gold
                    style={{
                        fontFamily: 'var(--font-passion)',
                        WebkitTextStroke: '2px black',
                        filter: 'drop-shadow(3px 3px 0px black)',
                        letterSpacing: '-0.02em'
                    }}
                >
                    FIZIK
                </h1>

                {/* BOTTOM: HUB */}
                <h1
                    className="text-4xl sm:text-5xl text-[#FACC15]" // Gold
                    style={{
                        fontFamily: 'var(--font-passion)',
                        WebkitTextStroke: '2px black',
                        filter: 'drop-shadow(3px 3px 0px black)',
                        letterSpacing: '-0.02em'
                    }}
                >
                    HUB
                </h1>

                {/* CURVED SLOGAN (Simulated via overlay for now, or straight ribbon) */}
                <div className="absolute -bottom-3 z-10 scale-75 sm:scale-90">
                    <div className="rotate-[-2deg] border-[2px] border-black bg-white px-2 py-[1px] shadow-[2px_2px_0px_0px_#000]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black"
                            style={{ fontFamily: 'var(--font-heading)' }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>

            </motion.div>

        </div>
    );
}
