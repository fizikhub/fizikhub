"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SpaceBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number; angle: number } | null>(null);
    const [ufo, setUfo] = useState<{ x: number; y: number; delay: number } | null>(null);

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

        const ufoInterval = setInterval(() => {
            setUfo({
                x: -10, // Start off-screen left
                y: Math.random() * 60 + 10, // Random height
                delay: 0
            });
            setTimeout(() => setUfo(null), 8000); // Should be enough time to cross screen
        }, 15000); // Every 15 seconds

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

            {/* UFO Animation */}
            {ufo && (
                <motion.div
                    initial={{
                        top: `${ufo.y}%`,
                        left: "-5%",
                        scale: 0.5,
                        rotate: 5
                    }}
                    animate={{
                        left: "105%", // Cross screen
                        y: [`${ufo.y}%`, `${ufo.y - 10}%`, `${ufo.y + 5}%`, `${ufo.y}%`], // Wobbly path
                        rotate: [5, -5, 5]
                    }}
                    transition={{ duration: 7, ease: "linear" }}
                    className="absolute z-20"
                >
                    <div className="relative w-12 h-8 sm:w-16 sm:h-10">
                        {/* Dome */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-cyan-300 rounded-full opacity-80 blur-[1px] border border-cyan-100/50" />
                        {/* Disc */}
                        <div className="absolute top-3 left-0 w-full h-full bg-slate-700 rounded-[50%] border-t border-slate-500 shadow-lg flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 opacity-50" />
                        </div>
                        {/* Lights */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-red-500"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            />
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-green-500"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                            />
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-yellow-500"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
