"use client";

import { m as motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ReadingProgress() {
    const { scrollYProgress } = useScroll();
    
    // Add physical weight to the progress bar filling up
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Color shift based on reading depth (Cold blue -> Hot Orange)
    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ["#23A9FA", "#FFC800", "#FF4500"]
    );

    // Glowing intense shadow that changes with scroll depth
    const boxShadow = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [
            "0px 0px 10px 0px rgba(35,169,250,0.5)", 
            "0px 4px 15px 2px rgba(255,200,0,0.6)", 
            "0px 6px 20px 4px rgba(255,69,0,0.8)"
        ]
    );

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-2 sm:h-3 origin-left z-[9999]"
            style={{ 
                scaleX, 
                backgroundColor,
                boxShadow,
                borderBottomRightRadius: '8px',
                borderTopRightRadius: '8px'
            }}
        />
    );
}
