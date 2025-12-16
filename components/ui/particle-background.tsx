"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ParticleBackgroundProps {
    density?: "low" | "medium" | "high";
    className?: string;
}

export function ParticleBackground({
    density = "medium",
    className = ""
}: ParticleBackgroundProps) {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

    useEffect(() => {
        const count = density === "low" ? 20 : density === "medium" ? 40 : 60;
        const mobile = window.innerWidth < 768;
        const actualCount = mobile ? Math.floor(count / 2) : count;

        const newParticles = Array.from({ length: actualCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 10 + 15,
        }));

        setParticles(newParticles);
    }, [density]);

    return (
        <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-primary/20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
