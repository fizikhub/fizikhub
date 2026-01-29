"use client";

import { motion } from "framer-motion";
import { Atom } from "lucide-react";

export function DankLogo() {
    return (
        <div className="group flex items-center gap-2.5 select-none cursor-pointer">
            {/* LOGO ICON MARK - APP ICON STYLE */}
            <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-9 h-9 sm:w-10 sm:h-10 bg-[#FFC800] border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center shrink-0 overflow-hidden"
            >
                <Atom className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5px] text-black" />

                {/* Neo-Brutalist Shine/Glitch Detail */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-white border-2 border-black rotate-45" />
            </motion.div>

            {/* TEXT LOCKUP */}
            <div className="flex flex-col items-start leading-none justify-center">
                {/* LINE 1: FIZIKHUB */}
                <motion.h1
                    className="text-xl sm:text-2xl font-black text-black tracking-tight"
                    style={{ fontFamily: 'var(--font-space)' }}
                    whileHover={{ x: 2 }}
                >
                    FİZİKHUB
                </motion.h1>

                {/* LINE 2: BILIM PLATFORMU */}
                <div className="relative mt-[2px]">
                    <div className="bg-black px-1.5 py-[1px] transform -rotate-1 origin-left group-hover:rotate-0 transition-transform duration-200">
                        <span className="block text-[8px] sm:text-[9px] font-bold text-white tracking-widest uppercase whitespace-nowrap">
                            BİLİM PLATFORMU
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
