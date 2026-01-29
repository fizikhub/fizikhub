"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-2">

            {/* 
               V19: THE PUNK STICKER
               - Font: Permanent Marker (Google Font)
               - Concept: Garage Science / DIY
               - Style: Masking Tape with Sharpie
            */}

            <motion.div
                className="relative"
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 1, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
            >
                {/* MASKING TAPE BACKGROUND */}
                <div
                    className="absolute inset-0 -mx-3 -my-1 bg-[#FEF08A] shadow-md transform skew-x-[-10deg] rotate-1" // Pale Yellow Tape
                    style={{
                        clipPath: 'polygon(2% 4%, 100% 0%, 98% 95%, 0% 100%)', // Rough edges
                        borderTopLeftRadius: '2px',
                        borderBottomRightRadius: '3px'
                    }}
                />

                {/* TORN TAPE ENDS (Visual Details) */}
                <div
                    className="absolute -left-4 top-0 bottom-0 w-4 bg-[#FEF08A] opacity-90"
                    style={{ clipPath: 'polygon(100% 0, 0% 15%, 100% 30%, 10% 50%, 100% 65%, 0% 85%, 100% 100%)' }} // Jagged left
                />
                <div
                    className="absolute -right-4 top-0 bottom-0 w-4 bg-[#FEF08A] opacity-90"
                    style={{ clipPath: 'polygon(0% 0%, 100% 15%, 0% 30%, 90% 50%, 0% 65%, 100% 85%, 0% 100%)' }} // Jagged right
                />

                {/* SHARPIE TEXT */}
                <div className="relative z-10 flex flex-col items-center">
                    <h1
                        className="text-2xl sm:text-3xl text-[#101010] leading-none"
                        style={{
                            fontFamily: 'var(--font-permanent)',
                            transform: 'rotate(-1deg)',
                            textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                        }}
                    >
                        FIZIKHUB
                    </h1>

                    {/* SCRAWLED UNDERLINE */}
                    <svg width="100%" height="6" viewBox="0 0 100 6" fill="none" className="mt-0.5 opacity-80">
                        <path d="M2 3C20 3 40 2 98 4" stroke="#101010" strokeWidth="2" strokeLinecap="round" />
                    </svg>

                    {/* TINY TAGLINE SCRAWL */}
                    <span
                        className="absolute -bottom-3 -right-2 text-[8px] font-bold text-black rotate-[-5deg] bg-white px-0.5 shadow-sm border border-black/20"
                        style={{ fontFamily: 'var(--font-permanent)' }}
                    >
                        bilim platformu
                    </span>
                </div>

            </motion.div>

        </div>
    );
}
