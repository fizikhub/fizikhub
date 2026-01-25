"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer">
            {/* 
        V18 "RETRO POP" LOGO 
        - Vibe: "Mosko Mappa" / "Standie Bold"
        - Style: Bubbly, 3D Extruded, Fun
        - Colors: Yellow Text, Deep Orange Shadow, Black Stroke
      */}
            <div className="relative z-10 px-1">
                <motion.h1
                    className="font-black text-3xl italic tracking-tighter leading-none text-[#FFC800] relative z-20"
                    style={{
                        WebkitTextStroke: "2px black",
                        fontFamily: "var(--font-heading)",
                        filter: "drop-shadow(4px 4px 0px #000)" // Hard Black Shadow
                    }}
                    whileHover={{
                        scale: 1.1,
                        rotate: -3,
                        filter: "drop-shadow(6px 6px 0px #000)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* Decorative Sparkles (from the images) */}
                <motion.div
                    className="absolute -top-2 -right-3 text-lg z-30"
                    animate={{ scale: [1, 1.5, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    ✨
                </motion.div>
            </div>

            {/* Subtitle - "Sticker" style */}
            <motion.div
                className="self-start -mt-0.5 ml-1 z-20"
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 2, scale: 1.1 }}
            >
                <span className="bg-[#FF69B4] border-[2px] border-black text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#000] tracking-wider inline-block transform rotate-1">
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
