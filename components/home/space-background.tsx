"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SpaceBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            const count = 100; // Number of stars

            for (let i = 0; i < count; i++) {
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.3,
                    duration: Math.random() * 3 + 2,
                });
            }
            setStars(newStars);
        };

        generateStars();
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0a0a1a]">
            {/* Dark Space Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a3a]/20 to-[#0a0a1a]" />

            {/* Nebulas */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow delay-1000" />

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
        </div>
    );
}
