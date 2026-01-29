"use client";

import { motion } from "framer-motion";

export function ModernNeoLogo() {
    return (
        <div className="flex flex-col items-start select-none">
            {/* MAIN BRAND: FIZIKHUB */}
            <div className="relative z-10">
                {/* Visual Echo/Shadow for depth */}
                <h1 className="absolute top-[2px] left-[2px] text-l font-black tracking-tighter text-black/20 italic transform skew-x-[-10deg]">
                    FIZIKHUB
                </h1>

                <h1 className="relative text-2xl sm:text-3xl font-[900] tracking-tighter leading-none italic transform skew-x-[-10deg]">
                    <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] paint-order-stroke stroke-black stroke-[1.5px]">
                        FIZIK
                    </span>
                    <span className="text-[#FFC800] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] paint-order-stroke stroke-black stroke-[1.5px]">
                        HUB
                    </span>
                </h1>
            </div>

            {/* SUB BRAND: BILIM PLATFORMU */}
            <div className="relative mt-[2px] ml-[2px]">
                <div className="bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 border border-white/20 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transform -rotate-1">
                    BİLİM PLATFORMU
                </div>
            </div>
        </div>
    );
}
