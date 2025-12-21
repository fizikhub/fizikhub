"use client";

import { motion } from "framer-motion";
import { Clock, Sparkles, Moon, Stars } from "lucide-react";

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
                    className="absolute w-[600px] h-[600px] rounded-full bg-gradient-radial from-purple-500/20 via-transparent to-transparent blur-3xl"
                    style={{ left: '10%', top: '20%' }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-blue-500/20 via-transparent to-transparent blur-3xl"
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
                {/* Clock icon with glow */}
                <motion.div
                    className="relative inline-block mb-8"
                    animate={{
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <div className="absolute inset-0 bg-amber-500/30 blur-2xl rounded-full scale-150" />
                    <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-full">
                        <Clock className="w-16 h-16 text-white" />
                    </div>
                </motion.div>

                {/* Main message */}
                <motion.h1
                    className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Süreniz <span className="text-amber-400">Doldu</span>
                </motion.h1>

                <motion.p
                    className="text-xl text-white/60 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Bugünlük 10 dakikalık sürenizi kullandınız.
                </motion.p>

                {/* Reset countdown */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 inline-block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
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

                {/* Subtitle */}
                <motion.p
                    className="mt-8 text-lg text-white/40 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Sparkles className="w-5 h-5" />
                    Yarın tekrar görüşürüz!
                    <Sparkles className="w-5 h-5" />
                </motion.p>
            </motion.div>
        </div>
    );
}
