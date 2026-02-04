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
            className="fixed top-0 left-0 right-0 h-2 bg-[#FACC15] origin-left z-50 border-b-2 border-black"
            style={{ scaleX }}
        >
            <div className="absolute top-0 right-0 w-2 h-full bg-white animate-pulse" />
        </motion.div>
    );
}
