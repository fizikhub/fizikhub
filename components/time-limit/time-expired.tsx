"use client";

import { motion } from "framer-motion";
import { Clock, Moon, Timer, Hourglass } from "lucide-react";

interface TimeExpiredProps {
    hoursUntilReset: number;
    minutesUntilReset: number;
}

export function TimeExpired({ hoursUntilReset, minutesUntilReset }: TimeExpiredProps) {
    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center">
            {/* Animated starfield background */}
            <div className="absolute inset-0">
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Nebula glow effects */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-gradient-radial from-red-500/20 via-transparent to-transparent blur-3xl"
                    style={{ left: '10%', top: '20%' }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-orange-500/20 via-transparent to-transparent blur-3xl"
                    style={{ right: '10%', bottom: '20%' }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                />
            </div>

            {/* Main content */}
            <motion.div
                className="relative z-10 text-center px-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Mocking hourglass animation - time running out */}
                <div className="relative inline-block mb-8">
                    {/* Falling sand particles */}
                    <div className="absolute inset-0 flex justify-center">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-amber-400 rounded-full"
                                style={{
                                    left: `${45 + Math.random() * 10}%`,
                                }}
                                animate={{
                                    y: [0, 100, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeIn"
                                }}
                            />
                        ))}
                    </div>

                    {/* Main hourglass with shake animation */}
                    <motion.div
                        className="relative"
                        animate={{
                            rotate: [0, -10, 10, -10, 10, 0],
                            scale: [1, 1.1, 1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                    >
                        <div className="absolute inset-0 bg-red-500/40 blur-3xl rounded-full scale-150" />
                        <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-6 rounded-full">
                            <Hourglass className="w-16 h-16 text-white" />
                        </div>
                    </motion.div>
                </div>

                {/* Main message - Mocking style */}
                <motion.h1
                    className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Süreniz <span className="text-red-400">Doldu</span>
                </motion.h1>

                {/* Mocking sareler text with bounce */}
                <motion.p
                    className="text-3xl md:text-4xl font-black text-amber-400 mb-6"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: 1,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        delay: 0.4,
                        scale: {
                            duration: 0.5,
                            repeat: Infinity,
                            repeatDelay: 2
                        }
                    }}
                >
                    SARELER 🎉
                </motion.p>

                {/* Mocking subtitle */}
                <motion.p
                    className="text-lg text-white/50 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    10 dakikanız puf oldu! 💨
                </motion.p>

                {/* Dramatic timer death animation */}
                <motion.div
                    className="flex justify-center gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    {["0", "0", ":", "0", "0"].map((char, i) => (
                        <motion.span
                            key={i}
                            className="text-4xl font-mono font-bold text-red-500"
                            animate={{
                                opacity: [1, 0.3, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Reset countdown */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 inline-block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
                        <Moon className="w-4 h-4" />
                        <span>Süre yenilenene kadar</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white">{hoursUntilReset}</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider">Saat</div>
                        </div>
                        <span className="text-2xl text-white/20">:</span>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white">{minutesUntilReset}</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider">Dakika</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

