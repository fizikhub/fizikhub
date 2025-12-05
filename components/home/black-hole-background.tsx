"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BlackHoleBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Distant Singularity - Top Right */}
            <div className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] opacity-[0.03] dark:opacity-[0.08]">
                {/* Accretion Disk */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-radial from-transparent via-primary to-transparent blur-3xl"
                />

                {/* Inner Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[15%] rounded-full bg-gradient-radial from-transparent via-black to-transparent blur-2xl border-[50px] border-primary/20"
                />
            </div>

            {/* Distant Singularity - Bottom Left (Echo) */}
            <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] opacity-[0.02] dark:opacity-[0.05]">
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 250, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-radial from-transparent via-primary to-transparent blur-3xl"
                />
            </div>

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/20 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                        opacity: 0
                    }}
                    animate={{
                        y: [0, -100],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
}
