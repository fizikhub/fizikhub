"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface Particle {
    id: number;
    angle: number;
    distance: number;
    speed: number;
    size: number;
    opacity: number;
}

export function RealisticBlackHole() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Generate particles that will spiral inward
    const particles = useMemo(() => {
        const count = isMobile ? 30 : 60;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            angle: Math.random() * 360,
            distance: 80 + Math.random() * 120, // Start distance from center
            speed: 8 + Math.random() * 12, // Animation duration (seconds)
            size: 1 + Math.random() * 2,
            opacity: 0.4 + Math.random() * 0.6,
        }));
    }, [isMobile]);

    const containerSize = isMobile ? 280 : 400;
    const coreSize = isMobile ? 50 : 80;

    return (
        <div
            className="relative flex items-center justify-center pointer-events-none"
            style={{ width: containerSize, height: containerSize }}
        >
            {/* 1. OUTER GLOW - Gravitational lensing effect */}
            <div
                className="absolute rounded-full"
                style={{
                    width: containerSize * 0.9,
                    height: containerSize * 0.9,
                    background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, rgba(234,88,12,0.05) 40%, transparent 70%)',
                    filter: 'blur(20px)',
                }}
            />

            {/* 2. ACCRETION DISK - The iconic ring */}
            <div
                className="absolute"
                style={{
                    width: containerSize * 0.85,
                    height: containerSize * 0.85,
                    transform: 'rotateX(75deg)',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Main rotating disk */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(
                            from 0deg,
                            transparent 0%,
                            rgba(255,100,0,0.1) 10%,
                            rgba(255,150,50,0.6) 25%,
                            rgba(255,200,100,0.9) 35%,
                            rgba(255,255,200,1) 40%,
                            rgba(255,200,100,0.9) 45%,
                            rgba(255,150,50,0.6) 55%,
                            rgba(255,100,0,0.1) 70%,
                            transparent 100%
                        )`,
                        boxShadow: '0 0 60px rgba(255,150,50,0.4), 0 0 120px rgba(255,100,0,0.2)',
                    }}
                />

                {/* Inner disk cutout (to create ring shape) */}
                <div
                    className="absolute rounded-full bg-black"
                    style={{
                        top: '30%',
                        left: '30%',
                        width: '40%',
                        height: '40%',
                    }}
                />
            </div>

            {/* 3. PHOTON SPHERE - The bright ring around the event horizon */}
            <div
                className="absolute rounded-full"
                style={{
                    width: coreSize + 20,
                    height: coreSize + 20,
                    border: '1px solid rgba(255,200,150,0.4)',
                    boxShadow: '0 0 20px rgba(255,150,100,0.5), inset 0 0 10px rgba(255,150,100,0.3)',
                }}
            />

            {/* 4. EVENT HORIZON - The 3D spherical black core */}
            <div
                className="absolute rounded-full z-10"
                style={{
                    width: coreSize,
                    height: coreSize,
                    background: 'radial-gradient(circle at 30% 30%, #1a1a1a 0%, #000000 50%, #000000 100%)',
                    boxShadow: `
                        inset 0 0 ${coreSize / 4}px rgba(0,0,0,1),
                        0 0 ${coreSize / 2}px rgba(0,0,0,0.8),
                        0 0 ${coreSize}px rgba(0,0,0,0.5)
                    `,
                }}
            >
                {/* Subtle highlight for 3D effect */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at 25% 25%, rgba(60,60,60,0.3) 0%, transparent 50%)',
                    }}
                />
            </div>

            {/* 5. PARTICLES - Matter being sucked in */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-orange-300"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        opacity: particle.opacity,
                        boxShadow: `0 0 ${particle.size * 2}px rgba(255,150,50,0.8)`,
                    }}
                    animate={{
                        // Spiral inward
                        x: [
                            Math.cos(particle.angle * Math.PI / 180) * particle.distance,
                            Math.cos((particle.angle + 180) * Math.PI / 180) * (particle.distance * 0.6),
                            Math.cos((particle.angle + 360) * Math.PI / 180) * (particle.distance * 0.3),
                            0
                        ],
                        y: [
                            Math.sin(particle.angle * Math.PI / 180) * particle.distance,
                            Math.sin((particle.angle + 180) * Math.PI / 180) * (particle.distance * 0.6),
                            Math.sin((particle.angle + 360) * Math.PI / 180) * (particle.distance * 0.3),
                            0
                        ],
                        opacity: [particle.opacity, particle.opacity, particle.opacity * 0.5, 0],
                        scale: [1, 1.2, 0.8, 0],
                    }}
                    transition={{
                        duration: particle.speed,
                        repeat: Infinity,
                        ease: "easeIn",
                        delay: Math.random() * particle.speed,
                    }}
                />
            ))}

            {/* 6. FRONT ACCRETION ARC - Creates the "Einstein ring" effect */}
            <div
                className="absolute rounded-full z-20"
                style={{
                    width: coreSize + 30,
                    height: coreSize + 30,
                    borderTop: '2px solid rgba(255,200,150,0.3)',
                    borderLeft: '1px solid rgba(255,200,150,0.2)',
                    borderRight: '1px solid rgba(255,200,150,0.2)',
                    borderBottom: 'none',
                    filter: 'blur(1px)',
                    transform: 'rotate(-20deg)',
                }}
            />
        </div>
    );
}
