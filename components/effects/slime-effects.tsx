"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SlimeEffects() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || theme !== "slime") return null;

    // Generate random drips
    const drips = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        width: 10 + Math.random() * 40
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Top Ooze */}
            {/* Top Ooze Removed as per request */}
            {/*
            <div className="absolute top-0 left-0 w-full h-16 bg-[#78FF32] opacity-90"
                style={{
                    maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 1200 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 63.61-10.59 127.23-33.25 194.6-28.71 78.41 5.3 148.88 47.93 213 28.71V0H0z\' fill=\'%23000\'/%3E%3C/svg%3E")',
                    maskSize: 'cover',
                    WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 1200 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 63.61-10.59 127.23-33.25 194.6-28.71 78.41 5.3 148.88 47.93 213 28.71V0H0z\' fill=\'%23000\'/%3E%3C/svg%3E")',
                    WebkitMaskSize: 'cover'
                }}
            />
            */}

            {/* Dripping Snot Particles Removed as per request */}
            {/*
            {drips.map((drip) => (
                <motion.div
                    key={drip.id}
                    className="absolute top-0 rounded-b-full bg-[#78FF32] opacity-80"
                    style={{
                        left: `${drip.left}%`,
                        width: drip.width,
                        height: drip.width * 1.5,
                        filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.3))'
                    }}
                    initial={{ y: -50 }}
                    animate={{ y: '110vh' }}
                    transition={{
                        duration: drip.duration,
                        delay: drip.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                </motion.div>
            ))}
            */}

            {/* Random Splats on Screen */}
            <motion.div
                className="absolute w-32 h-32 bg-[#78FF32] opacity-40 rounded-full blur-md mix-blend-overlay"
                style={{ top: '30%', left: '20%' }}
                animate={{ scale: [1, 1.2, 1], borderRadius: ["50%", "40% 60% 70% 30%", "50%"] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
        </div>
    );
}
