"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-1">

            {/* 
               V9: THE INDUSTRIAL HAZARD LABEL
               - Font: Space Grotesk (Technical/Scientific)
               - Style: Yellow Box, Thick Black Border, Technical Markings
               - Vibe: Nuclear Warning Sign / Off-White Label
            */}

            <motion.div
                className="relative bg-[#FACC15] border-[3px] border-black px-2 py-1 sm:px-3 sm:py-1.5 shadow-[4px_4px_0px_0px_#000]"
                whileHover={{
                    x: -2,
                    y: -2,
                    boxShadow: "6px 6px 0px 0px #000"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {/* TECHNICAL MARKINGS: CORNER CROSSHAIRS */}
                <div className="absolute left-0.5 top-0.5 h-2 w-2 border-l-[1.5px] border-t-[1.5px] border-black" />
                <div className="absolute right-0.5 top-0.5 h-2 w-2 border-r-[1.5px] border-t-[1.5px] border-black" />
                <div className="absolute bottom-0.5 left-0.5 h-2 w-2 border-b-[1.5px] border-l-[1.5px] border-black" />
                <div className="absolute bottom-0.5 right-0.5 h-2 w-2 border-b-[1.5px] border-r-[1.5px] border-black" />

                <div className="flex flex-col items-center leading-none">
                    {/* TINY LABEL TEXT */}
                    <div className="flex w-full justify-between px-0.5 pb-0.5">
                        <span className="text-[6px] font-bold uppercase tracking-tighter text-black" style={{ fontFamily: 'var(--font-space)' }}>
                            REF: 2026
                        </span>
                        <span className="text-[6px] font-bold uppercase tracking-tighter text-black" style={{ fontFamily: 'var(--font-space)' }}>
                            [TR]
                        </span>
                    </div>

                    {/* MAIN TEXT */}
                    <h1
                        className="text-2xl sm:text-4xl font-black tracking-tighter text-black uppercase mb-0.5"
                        style={{ fontFamily: 'var(--font-space)' }}
                    >
                        FIZIKHUB
                    </h1>

                    {/* SEPARATOR LINE */}
                    <div className="h-[1.5px] w-full bg-black my-0.5" />

                    {/* TAGLINE */}
                    <div className="flex w-full items-center justify-between">
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-black"
                            style={{ fontFamily: 'var(--font-space)' }}>
                            BİLİM PLATFORMU
                        </span>
                        {/* HAZARD ICON (Simplified) */}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="black" className="ml-1">
                            <path d="M12 2L2 22H22L12 2ZM12 6L19 20H5L12 6ZM11 10H13V15H11V10ZM11 17H13V19H11V17Z" />
                        </svg>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
