"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HeaderSpaceBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number; angle: number } | null>(null);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            const count = 150; // Slightly fewer stars for the smaller header area

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

        return () => {
            clearInterval(shootingStarInterval);
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

            {/* Planets - Scaled down for header */}
            <motion.div
                className="absolute top-[10%] right-[5%] w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] rounded-full mix-blend-screen opacity-40 blur-md"
                style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(100, 100, 200, 0.5), rgba(50, 50, 100, 0.2) 60%, transparent 80%)",
                }}
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-[20%] left-[5%] w-[40px] h-[40px] sm:w-[80px] sm:h-[80px] rounded-full mix-blend-screen opacity-30 blur-sm"
                style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(100, 200, 255, 0.5), rgba(50, 100, 150, 0.2) 60%, transparent 80%)",
                }}
                animate={{
                    y: [0, 10, 0],
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
        </div>
    );
}
