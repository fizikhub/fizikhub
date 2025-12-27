"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Starry Background Component
const StarryBackground = () => {
    // Generate deterministic stars to avoid hydration mismatch
    // Using a fixed set of positions for simplicity and performance
    const stars = [
        { top: '10%', left: '20%', size: 2, delay: 0 },
        { top: '25%', left: '80%', size: 3, delay: 1 },
        { top: '60%', left: '15%', size: 2, delay: 2 },
        { top: '80%', left: '70%', size: 3, delay: 0.5 },
        { top: '40%', left: '50%', size: 2, delay: 1.5 },
        { top: '15%', left: '90%', size: 2, delay: 0.8 },
        { top: '70%', left: '30%', size: 3, delay: 2.2 },
        { top: '30%', left: '10%', size: 2, delay: 1.2 },
        { top: '90%', left: '90%', size: 2, delay: 0.3 },
        { top: '50%', left: '95%', size: 3, delay: 1.8 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Stars */}
            {stars.map((star, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/80 rounded-full shadow-[0_0_2px_rgba(255,255,255,0.8)]"
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
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Shooting Star 1 */}
            <motion.div
                className="absolute top-0 left-[30%] w-[80px] h-[1px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                    rotate: '45deg',
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}
                animate={{
                    x: [-100, 300],
                    y: [-100, 300],
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut"
                }}
            />

            {/* Shooting Star 2 */}
            <motion.div
                className="absolute top-[20%] left-[80%] w-[60px] h-[1px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.8), transparent)',
                    rotate: '135deg',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                }}
                animate={{
                    x: [100, -200],
                    y: [-100, 200],
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 7,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};

// Premium SVG UFO Component
const PremiumUFO = () => (
    <svg width="100%" height="100%" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="domeGrad" x1="50" y1="20" x2="50" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A5F3FC" stopOpacity="0.8" />
                <stop offset="1" stopColor="#0891B2" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="bodyGrad" x1="50" y1="40" x2="50" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E2E8F0" />
                <stop offset="1" stopColor="#94A3B8" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* Glow under */}
        <ellipse cx="50" cy="65" rx="35" ry="8" fill="#06B6D4" fillOpacity="0.4" filter="url(#glow)">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
            <animate attributeName="rx" values="35;38;35" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Dome */}
        <path d="M30 45 C30 20, 70 20, 70 45" fill="url(#domeGrad)" stroke="#22D3EE" strokeWidth="0.5" />

        {/* Alien Head */}
        <g>
            <circle cx="50" cy="35" r="7" fill="#4ADE80" />
            <ellipse cx="47" cy="34" rx="2" ry="3" fill="#1e293b" />
            <ellipse cx="53" cy="34" rx="2" ry="3" fill="#1e293b" />
            <path d="M49 40 Q50 41 51 40" stroke="#1e293b" strokeWidth="0.5" strokeLinecap="round" />
            <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; 0 1; 0 0"
                dur="2s"
                repeatCount="indefinite"
            />
        </g>

        {/* Saucer Body */}
        <ellipse cx="50" cy="50" rx="48" ry="14" fill="url(#bodyGrad)" stroke="#64748B" strokeWidth="1" />
        <path d="M10 50 Q50 62 90 50" fill="none" stroke="#64748B" strokeWidth="0.5" strokeOpacity="0.5" />

        {/* Lights */}
        {[15, 32, 50, 68, 85].map((cx, i) => (
            <circle key={i} cx={cx} cy={50 + (i === 2 ? 6 : i === 1 || i === 3 ? 4 : 0)} r="2.5" fill="#FBBF24" filter="url(#glow)">
                <animate attributeName="fill" values="#FBBF24;#EF4444;#FBBF24" dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
        ))}
    </svg>
);

import { StreakHeader } from "@/components/gamification/streak-header";

export function CompactHero() {
    // Only render stars on client to match hydration if we were using random, but here they are deterministic
    return (
        <div className="relative py-10 px-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] mb-8 shadow-2xl shadow-emerald-900/10">
            {/* Dynamic Starry Background */}
            <StarryBackground />

            {/* Streak Header - Absolute Top Left */}
            <div className="absolute top-4 left-6 z-20">
                <StreakHeader />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-6 mt-8 md:mt-0">
                {/* Slogan */}
                <div className="flex-1 max-w-xl">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-lg origin-left transform-gpu">
                        BİLİMİ Tİ'YE ALIYORUZ<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-md tracking-wider sm:tracking-normal inline-block mt-1">
                            AMA CİDDİLİ ŞEKİLDE.
                        </span>
                    </h1>
                    <p className="text-sm font-medium text-slate-400 mt-3 max-w-md leading-relaxed block">
                        Evrenin sırlarını çözmeye çalışan meraklı zihinlerin buluşma noktası.
                    </p>
                </div>

                {/* Premium UFO Animation */}
                <motion.div
                    className="flex-shrink-0 relative w-28 h-24 sm:w-36 sm:h-28"
                    animate={{
                        y: [0, -8, 0],
                        rotate: [0, 3, -3, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
                >
                    <PremiumUFO />
                </motion.div>
            </div>
        </div>
    );
}
