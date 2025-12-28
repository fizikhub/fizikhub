"use client";

import { motion } from "framer-motion";

// Compact Premium UFO SVG
const CompactUFO = () => (
    <svg width="100%" height="100%" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ufoBody" x1="32" y1="20" x2="32" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E2E8F0" />
                <stop offset="1" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="ufoDome" x1="32" y1="10" x2="32" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22D3EE" stopOpacity="0.7" />
                <stop offset="1" stopColor="#0891B2" stopOpacity="0.4" />
            </linearGradient>
        </defs>

        {/* Glow under UFO */}
        <ellipse cx="32" cy="42" rx="20" ry="4" fill="#22D3EE" fillOpacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
        </ellipse>

        {/* Dome */}
        <path d="M20 26 C20 12, 44 12, 44 26" fill="url(#ufoDome)" stroke="#22D3EE" strokeWidth="0.5" />

        {/* Body */}
        <ellipse cx="32" cy="28" rx="28" ry="8" fill="url(#ufoBody)" stroke="#475569" strokeWidth="0.5" />

        {/* Lights */}
        <circle cx="14" cy="28" r="2" fill="#FBBF24">
            <animate attributeName="fill" values="#FBBF24;#EF4444;#FBBF24" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="32" r="2" fill="#FBBF24">
            <animate attributeName="fill" values="#EF4444;#FBBF24;#EF4444" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="28" r="2" fill="#FBBF24">
            <animate attributeName="fill" values="#FBBF24;#EF4444;#FBBF24" dur="1s" begin="0.3s" repeatCount="indefinite" />
        </circle>

        {/* Alien */}
        <circle cx="32" cy="18" r="4" fill="#4ADE80" />
        <ellipse cx="30" cy="17" rx="1.2" ry="1.8" fill="#1e293b" />
        <ellipse cx="34" cy="17" rx="1.2" ry="1.8" fill="#1e293b" />
    </svg>
);

export function CompactHero() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-4 border-primary rounded-2xl mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)]">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-orange-500/5 pointer-events-none" />

            {/* Stars Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Twinkling Stars */}
                {[
                    { top: '15%', left: '10%', size: 2 },
                    { top: '70%', left: '25%', size: 1 },
                    { top: '30%', left: '85%', size: 2 },
                    { top: '80%', left: '90%', size: 1 },
                    { top: '50%', left: '5%', size: 2 },
                    { top: '25%', left: '45%', size: 1 },
                    { top: '60%', left: '65%', size: 2 },
                    { top: '40%', left: '92%', size: 1 },
                    { top: '10%', left: '55%', size: 2 },
                    { top: '85%', left: '15%', size: 1 },
                    { top: '55%', left: '35%', size: 2 },
                    { top: '20%', left: '75%', size: 1 },
                ].map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/80 rounded-full"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                    />
                ))}

                {/* Shooting Star 1 */}
                <motion.div
                    className="absolute top-0 left-[20%] w-[60px] h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                        rotate: '45deg',
                        boxShadow: '0 0 8px rgba(255,255,255,0.5)'
                    }}
                    animate={{
                        x: [-80, 250],
                        y: [-80, 250],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeOut"
                    }}
                />

                {/* Shooting Star 2 */}
                <motion.div
                    className="absolute top-[15%] left-[70%] w-[50px] h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.8), transparent)',
                        rotate: '135deg',
                        boxShadow: '0 0 8px rgba(34, 211, 238, 0.5)'
                    }}
                    animate={{
                        x: [80, -200],
                        y: [-80, 200],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 6,
                        ease: "easeOut"
                    }}
                />
            </div>

            <div className="relative z-10 px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center justify-between gap-3">
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm sm:text-lg md:text-xl font-black text-white leading-tight tracking-tight uppercase">
                            BİLİMİ Tİ'YE ALIYORUZ
                        </h1>
                        <p className="text-xs sm:text-base md:text-lg font-black mt-0.5 text-cyan-400 uppercase tracking-tight">
                            AMA CİDDİLİ ŞEKİLDE.
                        </p>
                    </div>

                    {/* UFO Animation */}
                    <motion.div
                        className="flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16"
                        animate={{
                            y: [0, -4, 0],
                            rotate: [0, 2, -2, 0],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <CompactUFO />
                    </motion.div>
                </div>
            </div>

            {/* Bottom Accent Strip */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
    );
}
