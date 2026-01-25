"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none">
            {/* 
        V15 LOGO (RESTORED)
        - Thick Black Outline (WebkitTextStroke)
        - Gradient Fill (Yellow -> Orange)
        - Hard Drop Shadow
      */}
            <div className="relative z-10">
                <motion.h1
                    className="font-black text-3xl italic tracking-tighter leading-none text-[#FFC800]"
                    style={{
                        WebkitTextStroke: "1.5px black",
                        textShadow: "3px 3px 0px #000",
                        fontFamily: "var(--font-heading)",
                    }}
                    animate={{
                        y: [0, -2, 0],
                        rotate: [0, 1, 0, -1, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* Shine Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[200%] -translate-x-full animate-[shimmer_3s_infinite]" />
            </div>

            {/* Subtitle Badge */}
            <motion.div
                className="self-start -mt-0.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
            >
                <span className="bg-white border-2 border-black text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm shadow-[2px_2px_0px_0px_#000] tracking-wider transform -rotate-2 inline-block">
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
