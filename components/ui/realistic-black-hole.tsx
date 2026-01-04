"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export function RealisticBlackHole() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Particle system - matter spiraling into the singularity
    const particles = useMemo(() => {
        if (!mounted) return [];
        const count = isMobile ? 40 : 80;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            startAngle: Math.random() * 360,
            startDistance: 100 + Math.random() * 150,
            duration: 6 + Math.random() * 8,
            size: 1 + Math.random() * 2.5,
            delay: Math.random() * 6,
            brightness: 0.5 + Math.random() * 0.5,
        }));
    }, [isMobile, mounted]);

    // Background stars
    const stars = useMemo(() => {
        if (!mounted) return [];
        return Array.from({ length: isMobile ? 30 : 60 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 0.5 + Math.random() * 1.5,
            duration: 2 + Math.random() * 3,
        }));
    }, [isMobile, mounted]);

    const size = isMobile ? 320 : 500;
    const coreSize = isMobile ? 40 : 60;

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Background Stars */}
            {stars.map((star) => (
                <motion.div
                    key={`star-${star.id}`}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Gravitational Lensing - Outer Distortion Glow */}
            <motion.div
                className="absolute rounded-full"
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    width: size * 0.9,
                    height: size * 0.9,
                    background: 'radial-gradient(circle, rgba(255,120,50,0.2) 0%, rgba(255,80,20,0.1) 30%, transparent 60%)',
                    filter: 'blur(30px)',
                }}
            />

            {/* ACCRETION DISK - Tilted Perspective */}
            <div
                className="absolute"
                style={{
                    width: size * 0.8,
                    height: size * 0.8,
                    transform: 'rotateX(75deg)',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Outer Ring - Slower */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(
                            from 0deg,
                            rgba(80,30,0,0.3) 0%,
                            rgba(150,60,10,0.5) 15%,
                            rgba(220,100,30,0.7) 30%,
                            rgba(255,150,50,0.9) 45%,
                            rgba(255,200,100,1) 50%,
                            rgba(255,150,50,0.9) 55%,
                            rgba(220,100,30,0.7) 70%,
                            rgba(150,60,10,0.5) 85%,
                            rgba(80,30,0,0.3) 100%
                        )`,
                        boxShadow: '0 0 80px rgba(255,120,50,0.5)',
                        filter: 'blur(3px)',
                    }}
                />

                {/* Inner Ring - Faster, Brighter */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute rounded-full"
                    style={{
                        top: '15%',
                        left: '15%',
                        width: '70%',
                        height: '70%',
                        background: `conic-gradient(
                            from 180deg,
                            rgba(255,200,150,0.2) 0%,
                            rgba(255,220,180,0.8) 20%,
                            rgba(255,255,220,1) 35%,
                            rgba(255,255,255,1) 50%,
                            rgba(255,255,220,1) 65%,
                            rgba(255,220,180,0.8) 80%,
                            rgba(255,200,150,0.2) 100%
                        )`,
                        filter: 'blur(2px)',
                    }}
                />

                {/* Disk Center Cutout */}
                <div
                    className="absolute rounded-full"
                    style={{
                        top: '32%',
                        left: '32%',
                        width: '36%',
                        height: '36%',
                        background: 'radial-gradient(circle, #000 60%, transparent 100%)',
                    }}
                />
            </div>

            {/* Doppler Beaming - Asymmetric Brightness (left side brighter) */}
            <motion.div
                className="absolute rounded-full"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    width: size * 0.6,
                    height: size * 0.15,
                    left: '5%',
                    top: '42%',
                    background: 'linear-gradient(90deg, rgba(255,200,150,0.6) 0%, transparent 60%)',
                    filter: 'blur(15px)',
                    transform: 'rotate(-10deg)',
                }}
            />

            {/* Photon Sphere - The bright ring at the edge of visibility */}
            <motion.div
                className="absolute rounded-full"
                animate={{
                    boxShadow: [
                        '0 0 20px rgba(255,180,120,0.6), inset 0 0 15px rgba(255,150,100,0.3)',
                        '0 0 35px rgba(255,180,120,0.8), inset 0 0 20px rgba(255,150,100,0.5)',
                        '0 0 20px rgba(255,180,120,0.6), inset 0 0 15px rgba(255,150,100,0.3)',
                    ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    width: coreSize + 25,
                    height: coreSize + 25,
                    border: '2px solid rgba(255,200,150,0.5)',
                }}
            />

            {/* EVENT HORIZON - The 3D Black Sphere */}
            <div
                className="absolute rounded-full z-20"
                style={{
                    width: coreSize,
                    height: coreSize,
                    background: `radial-gradient(
                        circle at 35% 35%,
                        #1a1a1a 0%,
                        #0a0a0a 30%,
                        #000000 60%,
                        #000000 100%
                    )`,
                    boxShadow: `
                        inset 5px 5px 20px rgba(40,40,40,0.3),
                        0 0 50px rgba(0,0,0,1),
                        0 0 100px rgba(0,0,0,0.8)
                    `,
                }}
            />

            {/* Einstein Ring Arc - Light bent around the back */}
            <motion.div
                className="absolute rounded-full z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    width: coreSize + 35,
                    height: coreSize + 35,
                    borderTop: '3px solid rgba(255,220,180,0.5)',
                    borderLeft: '2px solid rgba(255,200,150,0.3)',
                    borderRight: '2px solid rgba(255,200,150,0.3)',
                    borderBottom: 'none',
                    filter: 'blur(2px)',
                    transform: 'rotate(-25deg)',
                }}
            />

            {/* PARTICLE SYSTEM - Matter Spiraling In */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full z-30"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        background: `radial-gradient(circle, rgba(255,200,150,${particle.brightness}) 0%, rgba(255,120,50,${particle.brightness * 0.7}) 100%)`,
                        boxShadow: `0 0 ${particle.size * 3}px rgba(255,150,80,${particle.brightness})`,
                    }}
                    animate={{
                        x: [
                            Math.cos((particle.startAngle) * Math.PI / 180) * particle.startDistance,
                            Math.cos((particle.startAngle + 120) * Math.PI / 180) * (particle.startDistance * 0.65),
                            Math.cos((particle.startAngle + 240) * Math.PI / 180) * (particle.startDistance * 0.35),
                            Math.cos((particle.startAngle + 360) * Math.PI / 180) * (particle.startDistance * 0.1),
                            0,
                        ],
                        y: [
                            Math.sin((particle.startAngle) * Math.PI / 180) * particle.startDistance,
                            Math.sin((particle.startAngle + 120) * Math.PI / 180) * (particle.startDistance * 0.65),
                            Math.sin((particle.startAngle + 240) * Math.PI / 180) * (particle.startDistance * 0.35),
                            Math.sin((particle.startAngle + 360) * Math.PI / 180) * (particle.startDistance * 0.1),
                            0,
                        ],
                        scale: [1, 1.3, 1, 0.6, 0],
                        opacity: [0, particle.brightness, particle.brightness, particle.brightness * 0.5, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.2, 1], // Accelerating as it gets closer
                        delay: particle.delay,
                        times: [0, 0.3, 0.6, 0.85, 1],
                    }}
                />
            ))}

            {/* Jet Streams (Optional polar outflows) */}
            <motion.div
                className="absolute"
                animate={{ opacity: [0.1, 0.25, 0.1], scaleY: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    width: 4,
                    height: size * 0.35,
                    bottom: '60%',
                    left: '50%',
                    marginLeft: -2,
                    background: 'linear-gradient(to top, rgba(255,150,100,0.4) 0%, transparent 100%)',
                    filter: 'blur(3px)',
                }}
            />
            <motion.div
                className="absolute"
                animate={{ opacity: [0.1, 0.25, 0.1], scaleY: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                style={{
                    width: 4,
                    height: size * 0.35,
                    top: '60%',
                    left: '50%',
                    marginLeft: -2,
                    background: 'linear-gradient(to bottom, rgba(255,150,100,0.4) 0%, transparent 100%)',
                    filter: 'blur(3px)',
                }}
            />
        </div>
    );
}
