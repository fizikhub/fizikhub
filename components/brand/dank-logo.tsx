"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               V22: THE BLUEPRINT SCHEMATIC
               - Font: Share Tech Mono (Google Font)
               - Concept: Engineering / CAD / Technical Drawing
               - Style: Wireframe, Monospaced, Data-Rich
            */}

            <motion.div
                className="relative flex flex-col items-center p-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* BACKGROUND GRID (Blueprints) */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                        backgroundSize: '10px 10px'
                    }}
                />

                {/* TOP DIMENSION LINE */}
                <div className="flex w-full items-center justify-between mb-[2px]">
                    <div className="h-[3px] w-[1px] bg-black" />
                    <div className="h-[1px] flex-grow bg-black relative top-[1px]">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] font-mono text-black bg-white px-0.5">
                            56px
                        </span>
                    </div>
                    <div className="h-[3px] w-[1px] bg-black" />
                </div>

                {/* MAIN TEXT */}
                <div className="flex items-baseline relative z-10 border-[1px] border-dashed border-black/30 p-1 bg-white/50 backdrop-blur-[1px]">
                    <h1
                        className="text-xl sm:text-3xl text-black leading-none"
                        style={{ fontFamily: 'var(--font-share-tech)' }}
                    >
                        FIZIKHUB
                    </h1>
                </div>

                {/* BOTTOM TECHNICAL ANNOTATIONS */}
                <div className="flex w-full items-center justify-between mt-[2px] text-[7px] font-mono text-black/60">
                    <span className="flex items-center gap-0.5">
                        <span className="block w-1 h-1 bg-black rounded-full" />
                        FIG. 1
                    </span>
                    <span>
                        SCALE: 1:1
                    </span>
                </div>

                {/* CORNER MARKERS (CAD Style) */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-black" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-black" />
                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-black" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-black" />

            </motion.div>

        </div>
    );
}
