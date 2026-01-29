"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               V15: THE BRUTALIST SLAB
               - Font: Zilla Slab (700 Bold) - Industrial / Editorial
               - Concept: Manifesto Header / Metal Plate
               - Style: Solid Black Block with yellow accent text
            */}

            <motion.div
                className="relative flex items-center bg-black px-4 py-1 sm:py-2 border-[2px] border-black shadow-[4px_4px_0px_#FACC15]" // Yellow shadow
                whileHover={{ scale: 1.05, boxShadow: "6px 6px 0px #FACC15" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* TEXT CONTAINER */}
                <div className="flex items-baseline gap-1">
                    <h1
                        className="text-2xl sm:text-4xl leading-none text-[#FACC15]" // Yellow
                        style={{ fontFamily: 'var(--font-zilla)' }}
                    >
                        FIZIK
                    </h1>
                    <h1
                        className="text-2xl sm:text-4xl leading-none text-white"
                        style={{ fontFamily: 'var(--font-zilla)' }}
                    >
                        HUB
                    </h1>
                </div>

                {/* VERTICAL TAGLINE (Barcode style) */}
                <div className="ml-3 h-full flex flex-col justify-between border-l border-white/30 pl-1.5 py-0.5">
                    <span
                        className="text-[6px] sm:text-[8px] font-mono font-bold text-white/70 uppercase tracking-widest"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                        BİLİM PLATFORMU
                    </span>
                </div>

                {/* DECORATIVE CORNER SCREWS */}
                <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white/50 rounded-full" />
                <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-white/50 rounded-full" />
                <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white/50 rounded-full" />
                <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/50 rounded-full" />

            </motion.div>

        </div>
    );
}
