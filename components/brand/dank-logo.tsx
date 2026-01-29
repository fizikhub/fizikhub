"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EarthIcon } from "./earth-icon";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer">
            {/* 
        V23 LOGO: MOSKO SCIENCE (Restored)
        - Mobile: text-2xl
        - Desktop: text-4xl
        - Style: Blocky Yellow Text with Thick Black Stroke
      */}
            <div className="relative z-10">
                <motion.h1
                    className="font-black text-2xl sm:text-4xl italic tracking-tighter leading-none text-[#FFC800] relative z-20"
                    style={{
                        WebkitTextStroke: "1.5px black",
                        fontFamily: "var(--font-heading)",
                        filter: "drop-shadow(3px 3px 0px #000)"
                    }}
                    whileHover={{
                        scale: 1.05,
                        filter: "drop-shadow(5px 5px 0px #000)"
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    FIZIKHUB
                </motion.h1>

                {/* 3D Realistic Earth Icon */}
                <motion.div
                    className="absolute -top-4 -right-5 w-10 h-10 sm:w-12 sm:h-12 z-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <EarthIcon className="w-full h-full" />
                </motion.div>
            </div>

            {/* Slogan */}
            <motion.div
                className="self-start sm:self-end -mt-0.5 sm:-mr-1 z-20"
                initial={{ rotate: -3 }}
                whileHover={{ rotate: 3 }}
            >
                <span className="bg-white border-[1.5px] border-black text-black text-[8px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 shadow-[2px_2px_0px_0px_#000] tracking-widest inline-block skew-x-[-10deg]">
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
