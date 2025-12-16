"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SpaceBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number; hasGlow: boolean }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number; angle: number } | null>(null);
    const [ufo, setUfo] = useState<{ id: number } | null>(null);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            // OPTIMIZATION: Reduced star count from 150 to 70
            const count = 70;

            for (let i = 0; i < count; i++) {
                const size = Math.random() * 2 + 1; // 1px to 3px
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: size,
                    opacity: Math.random() * 0.8 + 0.2,
                    duration: Math.random() * 3 + 2,
                    // OPTIMIZATION: Only calculate glow flag once
                    hasGlow: size > 2.5
                });
            }
            setStars(newStars);
        };

        generateStars();
    }, []);

    useEffect(() => {
        const shootingStarInterval = setInterval(() => {
            const startX = Math.random() * 100;
            const startY = Math.random() * 50;
            const angle = 45;

            setShootingStar({
                x: startX,
                y: startY,
                delay: 0,
                angle: angle
            });

            setTimeout(() => setShootingStar(null), 1500);
        }, 8000); // OPTIMIZATION: Slower interval (5s -> 8s)

        // Initial UFO
        setTimeout(() => setUfo({ id: 1 }), 2000);

        const ufoInterval = setInterval(() => {
            setUfo({ id: Date.now() });
            setTimeout(() => setUfo(null), 10000);
        }, 20000); // OPTIMIZATION: Slower interval (15s -> 20s)

        return () => {
            clearInterval(shootingStarInterval);
            clearInterval(ufoInterval);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
            {/* Pure Black Background */}
            <div className="absolute inset-0 bg-black" />

            {/* Stars */}
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full animate-twinkle will-change-opacity"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                        // OPTIMIZATION: Only apply shadow to very large stars, and use simpler shadow
                        boxShadow: star.hasGlow ? `0 0 ${star.size}px rgba(255, 255, 255, 0.6)` : 'none',
                        '--twinkle-duration': `${star.duration}s`,
                        '--twinkle-delay': `-${Math.random() * 5}s`
                    } as React.CSSProperties}
                />
            ))}

            {/* Planets - Optimized: Reduced blur and complexity */}
            <motion.div
                className="absolute top-[10%] right-[5%] w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-full mix-blend-screen opacity-30 will-change-transform"
                style={{
                    // OPTIMIZATION: Simpler gradient, removed blur-md (expensive)
                    background: "radial-gradient(circle at 30% 30%, rgba(100, 100, 200, 0.4), transparent 70%)",
                    filter: "blur(20px)", // Fixed blur value is often cheaper than implicit heavy blur
                }}
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-[20%] left-[5%] w-[80px] h-[80px] sm:w-[150px] sm:h-[150px] rounded-full mix-blend-screen opacity-20 will-change-transform"
                style={{
                    // OPTIMIZATION: Simpler gradient
                    background: "radial-gradient(circle at 70% 30%, rgba(100, 200, 255, 0.4), transparent 70%)",
                    filter: "blur(20px)",
                }}
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Enhanced Shooting Star - Optimized */}
            {shootingStar && (
                <motion.div
                    key="shooting-star"
                    initial={{
                        top: `${shootingStar.y}%`,
                        left: `${shootingStar.x}%`,
                        opacity: 0,
                        transform: `rotate(${shootingStar.angle}deg) scale(0.5) translateX(0)`
                    }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        transform: `rotate(${shootingStar.angle}deg) scale(1) translateX(300px)`
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute z-0 pointer-events-none will-change-transform"
                    style={{
                        width: "150px",
                        height: "2px",
                        // OPTIMIZATION: Simpler gradient
                        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
                    }}
                >
                    {/* OPTIMIZATION: Removed box-shadow loop */}
                    <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
            )}

            {/* Realistic UFO Animation - Optimized */}
            {ufo && (
                <motion.div
                    key={ufo.id}
                    initial={{
                        top: "20%",
                        left: "-10%",
                        scale: 0.8,
                        rotate: 15
                    }}
                    animate={{
                        left: "110%",
                        top: ["20%", "60%", "30%", "50%"],
                        rotate: [15, -10, 20, 0],
                        scale: [0.8, 1.2, 0.9, 0.8]
                    }}
                    transition={{
                        duration: 8,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.7, 1]
                    }}
                    className="absolute z-20 will-change-transform"
                >
                    {/* Metallic Saucer Body - OPTIMIZATION: Removed expensive drop-shadow */}
                    <div className="relative w-24 h-10">
                        {/* Glass Dome - OPTIMIZATION: Removed backdrop-blur */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-6 bg-cyan-400/30 rounded-t-full border border-cyan-200/50 z-10" />

                        {/* Green Alien */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-5 z-10 flex flex-col items-center justify-end">
                            <div className="w-3 h-3 bg-green-500 rounded-full relative">
                                <div className="absolute top-1 left-0.5 w-0.5 h-1 bg-black rounded-full skew-x-12 opacity-80" />
                                <div className="absolute top-1 right-0.5 w-0.5 h-1 bg-black rounded-full -skew-x-12 opacity-80" />
                            </div>
                            <div className="w-2 h-2 bg-green-600 rounded-t-sm -mt-0.5" />
                        </div>

                        {/* Metallic Rim Top */}
                        <div className="absolute top-0 w-full h-full bg-slate-300 rounded-[50%] z-0 border-t border-slate-100/50"
                            style={{ background: 'linear-gradient(to bottom, #cbd5e1, #94a3b8)' }} />

                        {/* Engine Ring */}
                        <div className="absolute top-[40%] left-[5%] w-[90%] h-[60%] bg-slate-800 rounded-[50%] z-[-1] flex items-center justify-around px-4">
                            {/* Rotating Lights - OPTIMIZATION: Removed individual box-shadows, relied on simple opacity */}
                            {[0, 0.15, 0.3, 0.45].map((delay, i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-cyan-400"
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: delay }}
                                />
                            ))}
                        </div>

                        {/* Bottom Glow - OPTIMIZATION: Reduced blur radius */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-cyan-500/40 blur-sm rounded-[50%]" />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
