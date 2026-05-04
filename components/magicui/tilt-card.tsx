"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useTransform, m as motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    rotationFactor?: number; // How much it tilts (higher = more tilt)
}

export function TiltCard({
    children,
    className,
    rotationFactor = 15
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [canTilt, setCanTilt] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setCanTilt(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }, []);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(
        mouseYSpring,
        [-0.5, 0.5],
        [`${rotationFactor}deg`, `-${rotationFactor}deg`]
    );
    const rotateY = useTransform(
        mouseXSpring,
        [-0.5, 0.5],
        [`-${rotationFactor}deg`, `${rotationFactor}deg`]
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canTilt || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        if (!canTilt) return;
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY: canTilt ? rotateY : "0deg",
                rotateX: canTilt ? rotateX : "0deg",
                transformStyle: "preserve-3d",
            }}
            className={cn("relative w-full h-full", className)}
        >
            <div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full"
            >
                {children}
            </div>
        </motion.div>
    );
}
