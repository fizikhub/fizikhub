"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HeaderSpaceBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number; angle: number } | null>(null);

    useEffect(() => {
        // Ensure this runs on client and generates stars immediately
        const generateStars = () => {
            const newStars = [];
            const count = 200; // Increased star count for better density on PC

            for (let i = 0; i < count; i++) {
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2.5 + 1, // Slightly larger base size
                    opacity: Math.random() * 0.7 + 0.3, // Higher base opacity
                    duration: Math.random() * 3 + 2,
                });
            }
            setStars(newStars);
        };

        generateStars();
    }, []);

    // Shooting Star Logic - Frequent and visible
    useEffect(() => {
        const triggerShootingStar = () => {
            const startX = Math.random() * 60 + 20; // Start mostly in the middle-ish horizontally
            const startY = Math.random() * 40; // Top half
            const angle = 45;

            setShootingStar({
                x: startX,
                y: startY,
                delay: 0,
                angle: angle
            });

            // Clear after animation
            setTimeout(() => setShootingStar(null), 1200);
        };

        // Initial star
        setTimeout(triggerShootingStar, 1000);

        // Frequent shooting stars
        const interval = setInterval(triggerShootingStar, 1500 + Math.random() * 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
            {/* Pure Black Background with slight gradient for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)] opacity-40" />

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
                        boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, 0.8)`
                    }}
                    animate={{
                        opacity: [star.opacity, star.opacity * 1.5, star.opacity],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Realistic Shooting Star */}
            {shootingStar && (
                <motion.div
                    key="shooting-star"
                    initial={{
                        top: `${shootingStar.y}%`,
                        left: `${shootingStar.x}%`,
                        opacity: 1,
                        transform: `rotate(${shootingStar.angle}deg) translateX(0)`
                    }}
                    animate={{
                        opacity: [1, 1, 0],
                        transform: `rotate(${shootingStar.angle}deg) translateX(400px)` // Longer travel
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute z-10 pointer-events-none"
                    style={{
                        width: "120px",
                        height: "2px",
                        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 100%)",
                        boxShadow: "0 0 10px 1px rgba(255, 255, 255, 0.6)",
                    }}
                >
                    {/* Glowing Head */}
                    <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_3px_rgba(255,255,255,1)]" />
                </motion.div>
            )}
        </div>
    );
}
