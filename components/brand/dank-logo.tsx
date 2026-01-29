"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2" style={{ perspective: "1000px" }}>

            {/* 
               V10: THE PERSPECTIVE BLOCK
               - Font: Outfit Black (Structural)
               - Technique: CSS 3D Transform (Open Book / Corner Effect)
               - Vibe: Architectural, Solid
            */}

            <motion.div
                className="relative flex items-center transform-style-3d"
                whileHover={{ rotateX: 10, rotateY: -10 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                {/* LEFT FACE: FIZIK */}
                <div
                    className="flex h-10 items-center justify-center bg-[#FACC15] border-[2.5px] border-black px-2 shadow-[-3px_3px_0px_0px_#000]"
                    style={{
                        transform: "rotateY(15deg) skewY(-2deg)",
                        transformOrigin: "center right",
                        marginRight: "-2px" // Overlap slightly to hide seam
                    }}
                >
                    <h1
                        className="text-3xl font-black italic tracking-tighter text-black sm:text-4xl"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        FIZIK
                    </h1>
                </div>

                {/* RIGHT FACE: HUB */}
                <div
                    className="flex h-10 items-center justify-center bg-[#EAB308] border-[2.5px] border-black px-2 shadow-[4px_4px_0px_0px_#000]"
                    style={{
                        transform: "rotateY(-15deg) skewY(2deg)",
                        transformOrigin: "center left"
                    }}
                >
                    <h1
                        className="text-3xl font-black italic tracking-tighter text-white sm:text-4xl"
                        style={{ fontFamily: 'var(--font-heading)', WebkitTextStroke: '1px black' }}
                    >
                        HUB
                    </h1>
                </div>

                {/* DECORATION: CONNECTOR BAR */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full bg-black/20 blur-[2px]" />

                {/* TAGLINE: Sticker Slapped on Front */}
                <motion.div
                    className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2"
                    initial={{ y: 0, rotate: 0 }}
                    whileHover={{ y: 2, rotate: -2 }}
                >
                    <div className="flex whitespace-nowrap border-[1.5px] border-black bg-white px-1.5 py-[1px] shadow-[2px_2px_0px_0px_#000]">
                        <span className="text-[8px] font-black uppercase tracking-widest text-black sm:text-[9px]"
                            style={{ fontFamily: 'var(--font-heading)' }}>
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </motion.div>

            </motion.div>

        </div>
    );
}
