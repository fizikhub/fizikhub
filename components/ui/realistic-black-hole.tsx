"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export function RealisticBlackHole() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Particles system
    const particles = useMemo(() => {
        const count = isMobile ? 35 : 70;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            // Random start position around the circle
            angle: Math.random() * 360,
            distance: 140 + Math.random() * 100, // Start far out
            duration: 3 + Math.random() * 4,
            size: 1 + Math.random() * 2,
            brightness: 0.4 + Math.random() * 0.6,
            delay: Math.random() * 5,
        }));
    }, [isMobile]);

    const size = isMobile ? 320 : 500;
    const coreSize = size * 0.25; // The black sphere size

    return (
        <div
            className="relative flex items-center justify-center pointer-events-none select-none"
            style={{ width: size, height: size }}
        >
            {/* 1. LAYER: BACK ACCRETION DISK (Behind the sphere) */}
            <div
                className="absolute z-0"
                style={{
                    width: size * 0.9,
                    height: size * 0.9,
                    transform: 'rotateX(75deg)',
                    transformStyle: 'preserve-3d',
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(
                            from 0deg,
                            transparent 0%,
                            rgba(200,80,0,0.2) 20%,
                            rgba(255,140,0,0.6) 40%,
                            rgba(255,180,50,0.8) 50%, 
                            rgba(255,140,0,0.6) 60%,
                            rgba(200,80,0,0.2) 80%,
                            transparent 100%
                        )`,
                        boxShadow: '0 0 60px rgba(255,100,0,0.2)',
                        filter: 'blur(8px)',
                        opacity: 0.5 // Back is dimmer
                    }}
                />
            </div>

            {/* 2. LAYER: EVENT HORIZON SPHERE (The 3D Core) */}
            <div
                className="absolute z-10 rounded-full"
                style={{
                    width: coreSize,
                    height: coreSize,
                    background: 'radial-gradient(circle at 35% 35%, #2a2a2a 0%, #000000 40%, #000000 100%)',
                    boxShadow: `
                        0 0 50px rgba(255,120,50,0.15),
                        inset -5px -5px 20px rgba(255,100,50,0.1), 
                        inset 10px 10px 30px rgba(0,0,0,1)
                    `,
                }}
            >
                {/* Photon Ring (The thin glowing outline) */}
                <div className="absolute inset-[-1px] rounded-full border border-orange-100/30 blur-[0.5px] opacity-80" />
            </div>

            {/* 3. LAYER: FRONT ACCRETION ARC (In front of the sphere) */}
            {/* Visual trick: A "smile" shaped arc that sits on top to look like the front of the disk */}
            <div
                className="absolute z-20"
                style={{
                    top: '50%',
                    width: size * 0.94,
                    height: size * 0.35, // Flattened height
                    borderRadius: '50%',
                    borderBottom: '8px solid rgba(255,200,120,0.5)', // The bright front rim
                    borderLeft: '20px solid transparent', // Fade out sides
                    borderRight: '20px solid transparent',
                    transform: 'translateY(-10%)', // Align with the "equator" of the tilted disk
                    filter: 'blur(4px)',
                    boxShadow: '0 10px 40px rgba(255,150,50,0.3)',
                    opacity: 0.9,
                }}
            />

            {/* 4. LAYER: EINSTEIN RING (Top Arcs - Light bending) */}
            <div
                className="absolute z-0"
                style={{
                    top: '28%',
                    width: size * 0.6,
                    height: size * 0.4,
                    borderRadius: '50% 50% 0 0',
                    borderTop: '4px solid rgba(255,150,50,0.15)',
                    filter: 'blur(3px)',
                }}
            />

            {/* 5. PARTICLE SYSTEM (Spiraling In) */}
            <div className="absolute inset-0 z-30 flex items-center justify-center">
                {particles.map((p) => {
                    // Calculate spiral path
                    // We want them to start far and end at 0,0
                    return (
                        <motion.div
                            key={p.id}
                            className="absolute rounded-full bg-orange-100"
                            style={{
                                width: p.size,
                                height: p.size,
                                boxShadow: `0 0 ${p.size * 3}px rgba(255,200,100,0.8)`
                            }}
                            initial={{
                                x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                y: 0,
                                opacity: [0, p.brightness, 0],
                                scale: [1, 0.2]
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                ease: "easeIn", // Accelerates as it falls in
                                delay: p.delay,
                            }}
                        />
                    );
                })}
            </div>

            {/* Optional: Central Void Glow for extra punch */}
            <div className="absolute z-0 w-full h-full bg-orange-500/5 blur-3xl rounded-full animate-pulse" />
        </div>
    );
}
