"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// V32: THE SILENT HERO BANNER (NO JOKES)
// Restoring the specific "Bilimi Ti'ye Alıyoruz Ama Ciddili Şekilde" branding card.

const NeoUFO = () => (
    <svg width="100%" height="100%" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="glow-ufo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        {/* Beam */}
        <path d="M32 30 L42 48 L22 48 Z" fill="#FFC800" fillOpacity="0.15" className="animate-pulse">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Dome */}
        <path d="M22 24 C22 14, 42 14, 42 24" fill="#E0F2FE" stroke="#FFF" strokeWidth="1.5" />
        {/* Body */}
        <ellipse cx="32" cy="26" rx="20" ry="6" fill="#FFC800" stroke="#FFF" strokeWidth="1.5" />
        {/* Lights */}
        <circle cx="18" cy="26" r="1.5" fill="#000" />
        <circle cx="32" cy="28" r="1.5" fill="#000" />
        <circle cx="46" cy="26" r="1.5" fill="#000" />
        {/* Alien Head */}
        <circle cx="32" cy="19" r="2.5" fill="#10B981" />
    </svg>
);

export function MemeCorner() {
    return (
        <div className="relative group w-full">
            {/* 
                V32 DESIGN: The Classic Hero Banner
                - Black Background (Serious)
                - White Borders (Clean)
                - Yellow Shadow (Brand)
                - NO JOKES. Just the slogan.
            */}
            <motion.div
                className={cn(
                    "relative overflow-hidden",
                    "bg-[#050505] rounded-2xl",
                    "border-[3px] border-white",
                    "shadow-[4px_4px_0px_0px_#FFC800]",
                    "flex items-center justify-between",
                    "px-6 py-6 sm:px-8 sm:py-8"
                )}
                whileHover={{ y: -2, boxShadow: "6px 6px 0px 0px #FFC800" }}
            >
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '8px 8px' }}
                />

                <div className="relative z-10 flex flex-col justify-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tighter uppercase drop-shadow-md">
                        BİLİMİ<br className="sm:hidden" /> Tİ'YE ALIYORUZ
                    </h1>

                    <div className="flex">
                        <span className="bg-[#FFC800] text-black text-xs sm:text-sm font-black px-3 py-1 rounded-sm border-2 border-white shadow-[2px_2px_0px_0px_#fff] transform -rotate-1">
                            AMA CİDDİLİ ŞEKİLDE.
                        </span>
                    </div>
                </div>

                {/* Animated UFO */}
                <motion.div
                    className="flex-shrink-0 w-24 h-20 sm:w-32 sm:h-24 -mr-4 sm:mr-0"
                    animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <NeoUFO />
                </motion.div>

            </motion.div>
        </div>
    );
}
