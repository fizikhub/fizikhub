"use client";

import { motion } from "framer-motion";

export function DankLogo() {
    return (
        <div className="group relative z-50 flex cursor-pointer select-none items-center justify-center p-1">

            {/* 
               V7: PREMIUM STRUCTURAL GRADIENT
               - Font: Outfit (Geometric, Bold, Premium)
               - style: Gradient Fill + Hard Shadow
            */}

            <div className="relative flex flex-col items-start leading-none">

                {/* HEADLINE: FIZIKHUB */}
                <div className="relative">
                    {/* Hard Shadow Layer (Crisp Vector Look) */}
                    <h1
                        className="absolute left-[3px] top-[3px] z-0 select-none text-3xl font-black italic tracking-tighter text-black sm:left-[4px] sm:top-[4px] sm:text-5xl"
                        style={{ fontFamily: 'var(--font-heading)' }}
                        aria-hidden="true"
                    >
                        FIZIKHUB
                    </h1>

                    {/* Main Text with Vertical Gradient */}
                    <motion.h1
                        className="relative z-10 select-none text-3xl font-black italic tracking-tighter sm:text-5xl text-transparent"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            backgroundImage: 'linear-gradient(to bottom, #FFD700 20%, #F59E0B 100%)', // Sunny to Amber
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextStroke: '1.5px black', // Thinner, more elegant stroke
                            filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0))' // Clean edges
                        }}
                        whileHover={{
                            scale: 1.02,
                            x: -1,
                            y: -1,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        FIZIKHUB
                    </motion.h1>
                </div>

                {/* SUB-ELEMENT: BILIM PLATFORMU (Structured Connector) */}
                <motion.div
                    className="relative z-20 mt-[-2px] ml-[2px] sm:mt-[-4px] sm:ml-[4px]"
                    initial={{ x: 0 }}
                    whileHover={{ x: 2 }}
                >
                    <div className="flex items-center gap-1">
                        {/* Connector Line */}
                        <div className="h-[2px] w-4 bg-black sm:w-8" />

                        {/* Badge */}
                        <div className="flex items-center justify-center rounded-sm border-[1.5px] border-black bg-black px-1.5 py-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#FFD700] sm:text-[10px]"
                                style={{ fontFamily: 'var(--font-heading)' }}>
                                BİLİM PLATFORMU
                            </span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* DECORATION: ACCENT DOT (Like a notification) */}
            <motion.div
                className="absolute right-0 top-0 h-2 w-2 rounded-full border border-black bg-[#EF4444]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />

        </div>
    );
}
