"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedStatCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    suffix?: string;
    color?: string;
    delay?: number;
}

export function AnimatedStatCard({
    icon,
    value,
    label,
    suffix = "",
    color = "text-primary",
    delay = 0
}: AnimatedStatCardProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100
    });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(value);
            }, delay);
        }
    }, [isInView, value, motionValue, delay]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            setDisplayValue(Math.round(latest));
        });
        return unsubscribe;
    }, [springValue]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group cursor-default"
        >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-transparent transition-all duration-500" />

                {/* Animated background particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                    {/* Icon */}
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 ${color}`}
                    >
                        {icon}
                    </motion.div>

                    {/* Animated Value */}
                    <div className="space-y-1">
                        <motion.div
                            className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                            initial={{ scale: 0.5 }}
                            animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: delay + 0.2
                            }}
                        >
                            {displayValue.toLocaleString('tr-TR')}{suffix}
                        </motion.div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {label}
                        </div>
                    </div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: delay + 0.3 }}
                />
            </div>
        </motion.div>
    );
}
