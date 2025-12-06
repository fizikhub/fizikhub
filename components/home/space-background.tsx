"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SpaceBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number } | null>(null);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            const count = 150; // Increased star count

            for (let i = 0; i < count; i++) {
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.7 + 0.3, // Brighter stars
                    duration: Math.random() * 3 + 2,
                });
            }
            setStars(newStars);
        };

        generateStars();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setShootingStar({
                x: Math.random() * 100,
                y: Math.random() * 50, // Start from top half
                delay: Math.random() * 2 // Random delay
            });
            setTimeout(() => setShootingStar(null), 2000); // Reset after animation
        }, 4000); // New shooting star every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050511]">
            {/* Dark Space Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#02020a] via-[#1a1a3a]/20 to-[#050511]" />

            {/* Planet 1 - Large Gas Giant (Purple/Blue) */}
            <motion.div
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-30 blur-3xl mix-blend-screen"
                style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(120, 50, 255, 0.4), transparent 70%)",
                }}
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Planet 2 - Smaller Planet (Blue/Teal) */}
            <motion.div
                className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-2xl mix-blend-screen"
                style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(50, 200, 255, 0.3), transparent 70%)",
                }}
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Nebulas */}
            <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-purple-600/10 blur-[80px] rounded-full mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[25%] bg-blue-600/10 blur-[80px] rounded-full mix-blend-screen animate-pulse-slow delay-1000" />

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
                        boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)` // Star glow matches
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

            {/* Shooting Star */}
            {shootingStar && (
                <motion.div
                    key="shooting-star"
                    className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{
                        top: `${shootingStar.y}%`,
                        left: `${shootingStar.x}%`,
                        rotate: 315,
                        opacity: 0,
                        scale: 0.5
                    }}
                    animate={{
                        top: `${shootingStar.y + 20}%`,
                        left: `${shootingStar.x - 20}%`,
                        opacity: [0, 1, 0],
                        scale: 1
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                        boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.5)"
                    }}
                />
            )}

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}
