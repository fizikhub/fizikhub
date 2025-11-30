"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxCoverProps {
    gradient: string;
    children?: React.ReactNode;
}

export function ParallaxCover({ gradient, children }: ParallaxCoverProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 300], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

    return (
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <motion.div
                style={{ y, opacity }}
                className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
            >
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                {/* Floating orbs */}
                <motion.div
                    className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </motion.div>
            {children}
        </div>
    );
}
