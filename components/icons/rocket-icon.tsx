"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export function RocketIcon({ className }: { className?: string }) {
    return (
        <div className="relative inline-block">
            <motion.div
                animate={{
                    y: [0, -2, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={className}
            >
                <Rocket className="h-full w-full relative z-10 drop-shadow-sm" />

                {/* Fire Effect */}
                <div className="absolute top-[60%] left-[0%] z-0">
                    {/* Main flame glow */}
                    <motion.div
                        className="absolute -top-[2px] -left-[2px] w-[10px] h-[10px] bg-gradient-to-b from-orange-400 via-red-500 to-yellow-500 rounded-full blur-[4px]"
                        animate={{
                            opacity: [0.7, 1, 0.7],
                            scale: [0.9, 1.2, 0.9],
                        }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Inner bright core */}
                    <motion.div
                        className="absolute top-0 left-0 w-[6px] h-[6px] bg-yellow-300 rounded-full blur-[2px]"
                        animate={{
                            opacity: [0.9, 1, 0.9],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                    />

                    {/* Flame particles */}
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-[2px] h-[2px] rounded-full"
                            style={{
                                background: i % 2 === 0
                                    ? 'linear-gradient(to bottom, #fb923c, #ef4444)'
                                    : 'linear-gradient(to bottom, #fbbf24, #f97316)',
                            }}
                            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                            animate={{
                                opacity: [0, 0.9, 0],
                                scale: [0.3, 1, 0.5],
                                x: [-1, -4 - Math.random() * 3],
                                y: [1, 4 + Math.random() * 4],
                            }}
                            transition={{
                                duration: 0.5 + Math.random() * 0.3,
                                repeat: Infinity,
                                delay: i * 0.08,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
