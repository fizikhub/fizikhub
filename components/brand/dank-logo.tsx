"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               V16: THE INDUSTRIAL STENCIL
               - Font: Saira Stencil One (Google Font)
               - Concept: Industrial Crate / Hazard Label
               - Style: Warning Stripes Background + Heavy Black Box
            */}

            <motion.div
                className="relative overflow-hidden border-[2px] border-black bg-[#FACC15] shadow-[3px_3px_0px_#000]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* HAZARD STRIPES BACKGROUND */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            -45deg,
                            #000,
                            #000 5px,
                            transparent 5px,
                            transparent 10px
                        )`
                    }}
                />

                {/* INNER CONTENT BOX */}
                <div className="relative z-10 m-1 flex flex-col items-center bg-black px-3 py-1">
                    {/* STENCIL TITLE */}
                    <div className="flex items-center gap-1">
                        <h1
                            className="text-2xl sm:text-3xl font-normal leading-none text-white tracking-tight"
                            style={{ fontFamily: 'var(--font-stencil)' }}
                        >
                            FIZIKHUB
                        </h1>
                    </div>

                    {/* CAUTION LABEL */}
                    <div className="mt-0.5 w-full border-t border-dashed border-[#FACC15]/50 pt-0.5 text-center">
                        <span className="text-[7px] font-bold text-[#FACC15] uppercase tracking-[0.2em]">
                            DİKKAT: BİLİM
                        </span>
                    </div>
                </div>

                {/* CORNER BRACKETS */}
                <div className="absolute top-0 left-0 h-1.5 w-1.5 border-b border-r border-black bg-[#FACC15] z-20" />
                <div className="absolute top-0 right-0 h-1.5 w-1.5 border-b border-l border-black bg-[#FACC15] z-20" />
                <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-t border-r border-black bg-[#FACC15] z-20" />
                <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-t border-l border-black bg-[#FACC15] z-20" />

            </motion.div>

        </div>
    );
}
