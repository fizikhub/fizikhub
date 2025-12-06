"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-blue-600 origin-left z-50 shadow-[0_0_10px_2px_rgba(6,182,212,0.5)]"
            style={{ scaleX }}
        >
            {/* Meteor Head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]" />

            {/* Trail Particles (Static for performance, could be animated) */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-300 rounded-full opacity-50" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-blue-300 rounded-full opacity-30" />
        </motion.div>
    );
}
