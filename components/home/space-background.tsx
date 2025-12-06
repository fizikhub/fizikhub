"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SpaceBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number; angle: number } | null>(null);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            const count = 200; // Increased star count further

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
        const interval = setInterval(() => {
            // Randomize starting position more effectively
            const startX = Math.random() * 100;
            const startY = Math.random() * 50; // Typically starts from upper half
            const angle = 45; // Fixed angle for consistent "falling" look, or randomize slightly: Math.random() * 30 + 30

            setShootingStar({
                x: startX,
                y: startY,
                delay: 0,
                angle: angle
            });

            setTimeout(() => setShootingStar(null), 1500); // Shorter duration for faster feel
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#03030a]">
            {/* Deep Space Background - Radial gradient for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(circle at 50% 50%, #0d0d26 0%, #03030a 100%)"
                }}
            />

            {/* Nebulas - Layer 1: Large soft clouds */}
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full mix-blend-screen opacity-20 blur-[120px]"
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{
                    background: "conic-gradient(from 0deg at 50% 50%, #4c1d95, #2563eb, #4c1d95)"
                }}
            />

            {/* Nebulas - Layer 2: Accent clouds */}
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen opacity-20 blur-[100px]"
                animate={{
                    rotate: [360, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                style={{
                    background: "conic-gradient(from 180deg at 50% 50%, #db2777, #7c3aed, #db2777)"
                }}
            />

            {/* Planets */}
            <motion.div
                className="absolute top-[10%] right-[5%] w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-full mix-blend-screen opacity-60 blur-md"
                style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.8), rgba(76, 19, 149, 0.4) 60%, transparent 80%)",
                    boxShadow: "0 0 60px rgba(139, 92, 246, 0.3)"
                }}
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-[20%] left-[5%] w-[80px] h-[80px] sm:w-[150px] sm:h-[150px] rounded-full mix-blend-screen opacity-50 blur-sm"
                style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(56, 189, 248, 0.8), rgba(14, 165, 233, 0.4) 60%, transparent 80%)",
                    boxShadow: "0 0 50px rgba(14, 165, 233, 0.2)"
                }}
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

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
                        boxShadow: star.size > 2 ? `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.9)` : 'none'
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
                        transform: `rotate(${shootingStar.angle}deg) scale(1) translateX(300px)` // Move generally diagonally right-down depending on rotation
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute z-0 pointer-events-none"
                    style={{
                        width: "150px",
                        height: "2px",
                        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)", // Tapered both ends
                        filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
                    }}
                >
                    {/* Head of the star */}
                    <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full box-shadow-[0_0_10px_2px_rgba(255,255,255,1)]" />
                </motion.div>
            )}
        </div>
    );
}
