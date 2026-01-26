"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DankLogo() {
    return (
        <div className="flex flex-col select-none relative group cursor-pointer items-center justify-center leading-none">
            {/* 
                V24 LOGO: MOSKO STYLE (Reference Image)
                - Chubby, Tight, Yellow Text
                - Hard Black Deep Shadow
                - Stacked Layout
            */}

            {/* TOP: FIZIKHUB */}
            <motion.div
                className="relative z-20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
            >
                <h1
                    className="font-black text-3xl sm:text-4xl tracking-tighter text-[#FFC800]"
                    style={{
                        textShadow: "4px 4px 0px #000",
                        transform: "scaleY(1.1)", // Make it chubby
                        WebkitTextStroke: "1px black" // Slight definition
                    }}
                >
                    FIZIKHUB
                </h1>
            </motion.div>

            {/* BOTTOM: BILIM PLATFORMU */}
            <motion.div
                className="relative z-10 -mt-1 sm:-mt-1.5"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
            >
                <span
                    className="block font-black text-[10px] sm:text-[12px] tracking-tight text-[#FFC800] w-full text-justify"
                    style={{
                        textShadow: "2px 2px 0px #000",
                        transform: "scaleY(1.1)", // Make it chubby
                        WebkitTextStroke: "0.5px black"
                    }}
                >
                    BİLİM PLATFORMU
                </span>
            </motion.div>
        </div>
    );
}
