"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer">
            {/* 
        V17 "WORLD CLASS" LOGO 
        - Base: V15 Stroke Style (User Liked this)
        - New: Glitch Interactivity + Rainbow Underline
      */}
            <div className="relative z-10">
                <motion.h1
                    className="font-black text-3xl italic tracking-tighter leading-none text-[#FFC800]"
                    style={{
                        WebkitTextStroke: "1.5px black",
                        textShadow: "3px 3px 0px #000",
                        fontFamily: "var(--font-heading)",
                    }}
                    whileHover={{
                        x: [0, -2, 2, -1, 0],
                        y: [0, 1, -1, 0],
                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{ duration: 0.2 }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* Rainbow Underline Animation */}
                <div className="h-1.5 w-full mt-1 rounded-full bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 border border-black shadow-[1px_1px_0px_0px_#000]" />
            </div>

            {/* Subtitle - Rotated Sticker */}
            <motion.div
                className="self-start -mt-2 ml-1 z-20"
                animate={{ rotate: [-2, -4, -2] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <span className="bg-white border-2 border-black text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm shadow-[2px_2px_0px_0px_#000] tracking-wider inline-block">
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
