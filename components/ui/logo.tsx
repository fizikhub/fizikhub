"use client";

import { motion, useAnimation } from "framer-motion";
import { Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Logo() {
    const [isLaunching, setIsLaunching] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const controls = useAnimation();

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLaunch = async () => {
        if (isLaunching) return;
        setIsLaunching(true);

        const w = windowSize.width;
        const h = windowSize.height;

        // Calculate circular flight path
        const numPoints = 20;
        const xPath: number[] = [];
        const yPath: number[] = [];
        const rotatePath: number[] = [];

        // First circle
        const circle1CenterX = w * 0.25;
        const circle1CenterY = h * 0.2;
        const circle1Radius = Math.min(w, h) * 0.15;

        for (let i = 0; i <= 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            xPath.push(circle1CenterX + Math.cos(angle) * circle1Radius);
            yPath.push(circle1CenterY + Math.sin(angle) * circle1Radius);
            rotatePath.push(angle * (180 / Math.PI) + 90);
        }

        // Second circle (smaller, faster)
        const circle2CenterX = w * 0.55;
        const circle2CenterY = h * 0.25;
        const circle2Radius = Math.min(w, h) * 0.1;

        for (let i = 1; i <= 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            xPath.push(circle2CenterX + Math.cos(angle) * circle2Radius);
            yPath.push(circle2CenterY + Math.sin(angle) * circle2Radius);
            rotatePath.push(angle * (180 / Math.PI) + 90);
        }

        // Final dive to crash
        xPath.push(w * 0.75);
        yPath.push(h * 0.15);
        rotatePath.push(45);

        xPath.push(w * 0.85);
        yPath.push(h * 0.4);
        rotatePath.push(135);

        // Epic circular flight path
        await controls.start({
            x: xPath,
            y: yPath,
            rotate: rotatePath,
            scale: [1, ...Array(xPath.length - 2).fill(1.2), 0.3],
            opacity: [1, ...Array(xPath.length - 2).fill(1), 0],
            transition: {
                duration: 4,
                ease: "linear"
            }
        });

        // Trigger explosion
        setShowExplosion(true);

        // Screen shake effect
        const body = document.body;
        body.style.animation = 'shake 0.5s';
        setTimeout(() => {
            body.style.animation = '';
        }, 500);

        setTimeout(() => {
            setShowExplosion(false);
        }, 1200);

        setTimeout(() => {
            controls.set({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
            setIsLaunching(false);
        }, 2000);
    };

    return (
        <div className="flex items-center gap-2 group select-none relative">
            {/* Epic Explosion Effect */}
            {showExplosion && (
                <div
                    className="fixed z-[100] pointer-events-none"
                    style={{
                        left: windowSize.width * 0.85,
                        top: windowSize.height * 0.4 + 20
                    }}
                >
                    <div className="relative transform -translate-x-1/2 -translate-y-1/2">
                        {/* Shockwave ring */}
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: [0, 8, 12], opacity: [1, 0.3, 0] }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 w-40 h-40 border-4 border-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2"
                        />

                        {/* Main explosion core */}
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: [0, 6, 9], opacity: [1, 0.8, 0] }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0 w-40 h-40 bg-gradient-radial from-yellow-200 via-orange-500 to-red-600 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"
                        />

                        {/* Secondary explosion flash */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 4, 7], opacity: [1, 0.6, 0] }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="absolute inset-0 w-32 h-32 bg-yellow-300 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"
                        />

                        {/* Bright white flash */}
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: [0, 3, 0], opacity: [1, 0.9, 0] }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 w-24 h-24 bg-white rounded-full blur-lg -translate-x-1/2 -translate-y-1/2"
                        />

                        {/* Debris particles */}
                        {[...Array(16)].map((_, i) => {
                            const angle = (i / 16) * Math.PI * 2;
                            const distance = 150 + Math.random() * 100;
                            const x = Math.cos(angle) * distance;
                            const y = Math.sin(angle) * distance;

                            return (
                                <motion.div
                                    key={i}
                                    className="absolute w-3 h-3 bg-gray-700 rounded-sm"
                                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                                    animate={{
                                        x: x,
                                        y: y,
                                        opacity: [1, 1, 0],
                                        rotate: Math.random() * 720,
                                    }}
                                    transition={{
                                        duration: 1 + Math.random() * 0.5,
                                        ease: "easeOut"
                                    }}
                                />
                            );
                        })}

                        {/* Fire sparks */}
                        {[...Array(24)].map((_, i) => {
                            const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.5;
                            const distance = 80 + Math.random() * 120;
                            const x = Math.cos(angle) * distance;
                            const y = Math.sin(angle) * distance;

                            return (
                                <motion.div
                                    key={`spark-${i}`}
                                    className="absolute w-1 h-1 rounded-full"
                                    style={{
                                        background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#fb923c' : '#ef4444'
                                    }}
                                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                    animate={{
                                        x: x,
                                        y: y + 20,
                                        opacity: [1, 0.8, 0],
                                        scale: [1, 0.5, 0]
                                    }}
                                    transition={{
                                        duration: 0.6 + Math.random() * 0.4,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                />
                            );
                        })}

                        {/* Smoke clouds */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={`smoke-${i}`}
                                className="absolute w-16 h-16 bg-gray-600/60 rounded-full blur-xl"
                                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                                animate={{
                                    x: (Math.random() - 0.5) * 150,
                                    y: (Math.random() - 0.5) * 150 + 30,
                                    opacity: [0, 0.6, 0],
                                    scale: [0.5, 2.5, 3]
                                }}
                                transition={{
                                    duration: 1.2,
                                    delay: i * 0.1,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="relative z-50 cursor-pointer" onClick={handleLaunch}>
                <motion.div
                    animate={controls}
                    className={`relative ${isLaunching ? 'fixed z-[60] top-4 left-4' : ''}`}
                >
                    <motion.div
                        animate={!isLaunching ? {
                            y: [0, -2, 0],
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Rocket className="h-7 w-7 text-primary z-10 relative drop-shadow-lg" />

                        {/* Enhanced Fire Effect */}
                        <div className="absolute top-[18px] left-[4px] z-0">
                            {/* Main flame glow */}
                            <motion.div
                                className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-b from-orange-400 via-red-500 to-yellow-500 rounded-full blur-md"
                                animate={{
                                    opacity: [0.7, 1, 0.7],
                                    scale: [0.9, 1.2, 0.9],
                                }}
                                transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Inner bright core */}
                            <motion.div
                                className="absolute top-0 left-0 w-2 h-2 bg-yellow-300 rounded-full blur-sm"
                                animate={{
                                    opacity: [0.9, 1, 0.9],
                                    scale: [1, 1.3, 1],
                                }}
                                transition={{ duration: 0.2, repeat: Infinity }}
                            />

                            {/* Flame particles - more dynamic */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 rounded-full"
                                    style={{
                                        background: i % 2 === 0
                                            ? 'linear-gradient(to bottom, #fb923c, #ef4444)'
                                            : 'linear-gradient(to bottom, #fbbf24, #f97316)',
                                    }}
                                    initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                                    animate={{
                                        opacity: [0, 0.9, 0],
                                        scale: [0.3, 1, 0.5],
                                        x: [-1, -8 - Math.random() * 6],
                                        y: [1, 8 + Math.random() * 8],
                                    }}
                                    transition={{
                                        duration: 0.5 + Math.random() * 0.3,
                                        repeat: Infinity,
                                        delay: i * 0.08,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                />
                            ))}

                            {/* Smoke particles */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={`smoke-${i}`}
                                    className="absolute w-2 h-2 bg-gray-400/40 rounded-full blur-sm"
                                    initial={{ opacity: 0, scale: 0.5, x: -2, y: 2 }}
                                    animate={{
                                        opacity: [0, 0.4, 0],
                                        scale: [0.5, 1.5, 2],
                                        x: [-2, -12 - (i % 3) * 4],
                                        y: [2, 12 + (i % 2) * 6],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Link href="/" className="flex flex-col cursor-pointer">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                    Fizikhub
                </span>
            </Link>
        </div>
    );
}
