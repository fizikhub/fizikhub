"use client";

import { motion } from "framer-motion";
import { Moon, Hourglass, Frown, ThumbsDown, Ban, Skull, XCircle } from "lucide-react";

interface TimeExpiredProps {
    hoursUntilReset: number;
    minutesUntilReset: number;
}

export function TimeExpired({ hoursUntilReset, minutesUntilReset }: TimeExpiredProps) {
    // Mocking emoji array for floating animation
    const mockingEmojis = ["😂", "🤣", "😭", "💀", "🫵", "👋", "⏰", "🚫", "❌", "🪦"];

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

            {/* Floating mocking emojis around the screen */}
            {mockingEmojis.map((emoji, i) => (
                <motion.div
                    key={i}
                    className="absolute text-4xl md:text-6xl"
                    style={{
                        left: `${10 + (i * 8)}%`,
                        top: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{
                        y: [0, -30, 0, 30, 0],
                        x: [0, 20, 0, -20, 0],
                        rotate: [0, 15, 0, -15, 0],
                        scale: [1, 1.2, 1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                    }}
                >
                    {emoji}
                </motion.div>
            ))}

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
                className="relative z-10 text-center px-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Mocking hourglass animation - time running out */}
                <div className="relative inline-block mb-6">
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

                    {/* Main hourglass with crazy shake animation */}
                    <motion.div
                        className="relative"
                        animate={{
                            rotate: [0, -20, 20, -20, 20, -10, 10, 0],
                            scale: [1, 1.2, 0.9, 1.2, 0.9, 1.1, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0.5
                        }}
                    >
                        <div className="absolute inset-0 bg-red-500/40 blur-3xl rounded-full scale-150" />
                        <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-6 rounded-full">
                            <Hourglass className="w-16 h-16 text-white" />
                        </div>
                    </motion.div>
                </div>

                {/* Main message with letter animation */}
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="text-5xl md:text-7xl font-black text-white tracking-tight flex flex-wrap justify-center gap-1">
                        {"Süren Doldu".split("").map((letter, i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    y: [0, -10, 0],
                                    color: ["#fff", "#ef4444", "#fff"],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.05,
                                    repeatDelay: 2
                                }}
                            >
                                {letter === " " ? "\u00A0" : letter}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* ILGIN VEYA SARE text with rainbow shake */}
                <motion.div
                    className="text-4xl md:text-6xl font-black mb-6"
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{
                        opacity: 1,
                        scale: [1, 1.15, 1, 1.15, 1],
                        rotate: [0, -5, 5, -5, 5, 0],
                    }}
                    transition={{
                        delay: 0.4,
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 1
                    }}
                >
                    <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                        ILGIN
                    </span>
                    <motion.span
                        className="text-white mx-2"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        VEYA
                    </motion.span>
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        SARE
                    </span>
                </motion.div>

                {/* Mocking messages rotating */}
                <motion.div
                    className="text-xl md:text-2xl text-white/60 mb-6 h-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {["10 dakikanız puf oldu! 💨", "Süre bitti, bay bay! 👋", "Zaman senin dostun değilmiş 😂", "Hadi yürü git! 🚶‍♂️"].map((text, i) => (
                        <motion.span
                            key={i}
                            className="absolute left-0 right-0"
                            animate={{
                                opacity: [0, 1, 1, 0],
                                y: [20, 0, 0, -20],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 3,
                                times: [0, 0.1, 0.9, 1],
                            }}
                        >
                            {text}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Dramatic timer death animation with explosion effect */}
                <motion.div
                    className="flex justify-center gap-2 mb-8 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    {/* Explosion particles */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-red-500 rounded-full"
                            animate={{
                                x: [0, Math.cos(i * 30 * Math.PI / 180) * 80],
                                y: [0, Math.sin(i * 30 * Math.PI / 180) * 80],
                                opacity: [1, 0],
                                scale: [1, 0],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatDelay: 2,
                            }}
                        />
                    ))}

                    {["0", "0", ":", "0", "0"].map((char, i) => (
                        <motion.span
                            key={i}
                            className="text-5xl font-mono font-bold text-red-500"
                            animate={{
                                opacity: [1, 0.2, 1],
                                scale: [1, 0.8, 1],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Mocking icons row */}
                <motion.div
                    className="flex justify-center gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {[ThumbsDown, Ban, Skull, XCircle, Frown].map((Icon, i) => (
                        <motion.div
                            key={i}
                            className="text-red-400"
                            animate={{
                                rotate: [0, -20, 20, -20, 20, 0],
                                scale: [1, 1.3, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        >
                            <Icon className="w-8 h-8" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Reset countdown */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 inline-block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
                        <Moon className="w-4 h-4" />
                        <span>Süre yenilenene kadar bekle 😏</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                            <motion.div
                                className="text-4xl font-bold text-white"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                {hoursUntilReset}
                            </motion.div>
                            <div className="text-xs text-white/40 uppercase tracking-wider">Saat</div>
                        </div>
                        <span className="text-2xl text-white/20">:</span>
                        <div className="text-center">
                            <motion.div
                                className="text-4xl font-bold text-white"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                            >
                                {minutesUntilReset}
                            </motion.div>
                            <div className="text-xs text-white/40 uppercase tracking-wider">Dakika</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
