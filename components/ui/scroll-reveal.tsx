"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "fade";
}

export function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.05,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const variants = {
        up: { y: 25, opacity: 0 },
        down: { y: -25, opacity: 0 },
        left: { x: 25, opacity: 0 },
        right: { x: -25, opacity: 0 },
        fade: { opacity: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={variants[direction]}
            animate={isVisible ? { x: 0, y: 0, opacity: 1 } : variants[direction]}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: [0.19, 1, 0.22, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
