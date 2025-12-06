"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SpaceBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number; angle: number } | null>(null);
    const [ufo, setUfo] = useState<{ id: number } | null>(null);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            const count = 250;

            for (let i = 0; i < count; i++) {
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1, // 1px to 3px
                    opacity: Math.random() * 0.8 + 0.2,
                    duration: Math.random() * 3 + 2,
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
        }, 5000);

        // Initial UFO
        setTimeout(() => setUfo({ id: 1 }), 2000);

        const ufoInterval = setInterval(() => {
            setUfo({ id: Date.now() });
            setTimeout(() => setUfo(null), 10000); // Allow time for full complex animation
        }, 15000);

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
                <motion.div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                        boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)` : 'none'
                    }}
                    animate={{
                        opacity: [star.opacity, star.opacity * 1.5, star.opacity],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Planets - Dimmed for darker theme */}
            <motion.div
                className="absolute top-[10%] right-[5%] w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-full mix-blend-screen opacity-40 blur-md"
                style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(100, 100, 200, 0.5), rgba(50, 50, 100, 0.2) 60%, transparent 80%)",
                }}
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-[20%] left-[5%] w-[80px] h-[80px] sm:w-[150px] sm:h-[150px] rounded-full mix-blend-screen opacity-30 blur-sm"
                style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(100, 200, 255, 0.5), rgba(50, 100, 150, 0.2) 60%, transparent 80%)",
                }}
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Enhanced Shooting Star */}
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
                    className="absolute z-0 pointer-events-none"
                    style={{
                        width: "150px",
                        height: "2px",
                        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
                        filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
                    }}
                >
                    <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full box-shadow-[0_0_10px_2px_rgba(255,255,255,1)]" />
                </motion.div>
            )}

            {/* Realistic UFO Animation */}
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
                        top: ["20%", "60%", "30%", "50%"], // Complex curved path
                        rotate: [15, -10, 20, 0], // Banking turns
                        scale: [0.8, 1.2, 0.9, 0.8] // Perspective shift
                    }}
                    transition={{
                        duration: 8,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.7, 1]
                    }}
                    className="absolute z-20"
                >
                    {/* Metallic Saucer Body */}
                    <div className="relative w-24 h-10 filter drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                        {/* Glass Dome */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-6 bg-gradient-to-b from-cyan-300/80 to-cyan-500/80 rounded-t-full border border-cyan-200/50 backdrop-blur-sm z-10" />

                        {/* Alien Silhouette inside dome (subtle) */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/60 rounded-full blur-[1px] z-10" />

                        {/* Metallic Rim Top */}
                        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 rounded-[50%] z-0 border-t border-slate-100/50" />

                        {/* Engine Ring */}
                        <div className="absolute top-[40%] left-[5%] w-[90%] h-[60%] bg-slate-800 rounded-[50%] z-[-1] flex items-center justify-around px-4">
                            {/* Rotating Lights */}
                            <motion.div
                                className="w-2 h-2 rounded-full bg-cyan-400 box-shadow-[0_0_10px_cyan]"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                                className="w-2 h-2 rounded-full bg-cyan-400 box-shadow-[0_0_10px_cyan]"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                            />
                            <motion.div
                                className="w-2 h-2 rounded-full bg-cyan-400 box-shadow-[0_0_10px_cyan]"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                            />
                            <motion.div
                                className="w-2 h-2 rounded-full bg-cyan-400 box-shadow-[0_0_10px_cyan]"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.45 }}
                            />
                        </div>

                        {/* Bottom Glow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-cyan-500/50 blur-md rounded-[50%]" />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
