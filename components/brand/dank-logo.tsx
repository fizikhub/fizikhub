"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-1">

            {/* 
               V11FIX: RESIZED FOR MOBILE NAVBAR (56px)
               - Scaled down text to ensure it fits in h-14 (56px)
               - Badge moved up slightly to avoid clipping
            */}

            <motion.div
                className="relative flex flex-col items-center leading-[0.75]" // Tighter leading
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* TOP: FIZIK */}
                <h1
                    className="text-3xl sm:text-4xl text-[#FACC15]" // Resized: 30px mobile, 36px desktop
                    style={{
                        fontFamily: 'var(--font-passion)',
                        WebkitTextStroke: '1.5px black', // Thinner stroke for smaller text
                        filter: 'drop-shadow(2px 2px 0px black)',
                        letterSpacing: '-0.03em'
                    }}
                >
                    FIZIK
                </h1>

                {/* BOTTOM: HUB */}
                <h1
                    className="text-3xl sm:text-4xl text-[#FACC15]"
                    style={{
                        fontFamily: 'var(--font-passion)',
                        WebkitTextStroke: '1.5px black',
                        filter: 'drop-shadow(2px 2px 0px black)',
                        letterSpacing: '-0.03em'
                    }}
                >
                    HUB
                </h1>

                {/* CURVED SLOGAN */}
                <div className="absolute -bottom-1.5 z-10 scale-[0.65] sm:scale-75"> {/* Moved up (-bottom-1.5) and scaled down */}
                    <div className="rotate-[-2deg] border-[1.5px] border-black bg-white px-2 py-[0.5px] shadow-[1.5px_1.5px_0px_0px_#000]">
                        <span className="text-[9px] font-black uppercase tracking-widest text-black"
                            style={{ fontFamily: 'var(--font-heading)' }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>

            </motion.div>

        </div>
    );
}
