"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export function RealisticBlackHole() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const size = isMobile ? 340 : 540;
    const coreSize = isMobile ? 50 : 80;

    // A. STAR INFLOW PARTICLES (The "Sucked In" Effect)
    // Stars spiral in, stretch, and vanish into the event horizon
    const particles = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            angle: Math.random() * 360,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 2,
            distance: size * 0.4
        }));
    }, [size]);

    return (
        <div
            className="relative flex items-center justify-center transform hover:scale-105 transition-transform duration-1000"
            style={{ width: size, height: size, perspective: '1000px' }}
        >
            {/* 1. FAR GLOW - Radiated Heat */}
            <div className="absolute rounded-full opacity-20 animate-pulse"
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(255, 120, 50, 0.2) 0%, transparent 70%)',
                    filter: 'blur(60px)'
                }}
            />

            {/* 2. ACCRETION DISK (The 3D Swirl) */}
            <div className="absolute w-full h-full flex items-center justify-center" style={{ transform: 'rotateX(72deg) rotateZ(10deg)' }}>

                {/* Back of the disk (visible through transparency, slightly darker) */}
                <div className="absolute rounded-full"
                    style={{
                        width: '85%',
                        height: '85%',
                        background: 'conic-gradient(from 0deg, transparent 0%, rgba(200, 50, 0, 0.5) 50%, transparent 100%)',
                        filter: 'blur(10px)',
                        transform: 'rotate(180deg)'
                    }}
                />

                {/* Main Matter Stream */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute rounded-full"
                    style={{
                        width: '80%',
                        height: '80%',
                        background: 'conic-gradient(from 0deg, rgba(80,20,0,0) 0%, rgba(255,100,0,0.8) 10%, rgba(255,200,100,1) 15%, rgba(255,100,0,0.8) 20%, rgba(80,20,0,0.2) 40%, rgba(0,0,0,0) 100%)',
                        filter: 'blur(2px)',
                        boxShadow: '0 0 30px rgba(255, 100, 0, 0.4)'
                    }}
                />

                {/* Inner White-Hot Ring (Faster) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute rounded-full mix-blend-screen"
                    style={{
                        width: '40%',
                        height: '40%',
                        background: 'conic-gradient(from 0deg, transparent 0%, #fff 20%, transparent 40%, #fff 60%, transparent 100%)',
                        filter: 'blur(1px)',
                        opacity: 0.9
                    }}
                />
            </div>


            {/* 4. PHOTON SPHERE (The glowing ring around the shadow) */}
            <div className="absolute rounded-full z-20 border-[1px] border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                style={{
                    width: coreSize + 4,
                    height: coreSize + 4,
                    boxShadow: '0 0 15px #fff, inset 0 0 10px #fff'
                }}
            />

            {/* 5. EVENT HORIZON (The 3D Shadow Sphere) */}
            <div className="absolute rounded-full z-30 bg-black flex items-center justify-center overflow-hidden"
                style={{
                    width: coreSize,
                    height: coreSize,
                    boxShadow: '0 0 60px rgba(0,0,0,1)'
                }}
            >
                {/* 6. STAR EATER (The Sucking Animation) */}
                {/* Particles that spawn outside and get sucked into the black void */}
                {particles.map((p, i) => (
                    <motion.div
                        key={p.id}
                        className="absolute bg-white rounded-full"
                        style={{ width: 3, height: 3, opacity: 0 }}
                        animate={{
                            // Spiral inwards
                            x: [Math.cos(p.angle) * p.distance, 0],
                            y: [Math.sin(p.angle) * p.distance, 0],
                            // Scale distortion (Spaghettification) - distinct stretch as they enter
                            scaleX: [1, 1, 4, 10],
                            scaleY: [1, 1, 0.5, 0.1],
                            rotate: [p.angle, p.angle + 180 + Math.random() * 180], // Spin as they fall
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "circIn", // Accelerates drastically at the end
                            delay: p.delay
                        }}
                    />
                ))}
            </div>

            {/* 7. GRAVITATIONAL LENSING (The Bent Light Arcs) */}
            <div className="absolute z-10 flex flex-col items-center justify-between pointer-events-none" style={{ height: coreSize * 3.2 }}>
                {/* Top Arc - Light from behind bent over the top */}
                <div className="w-[160px] h-[60px] border-t-[4px] border-orange-200/40 rounded-[100%] blur-[4px]" />
                {/* Bottom Arc - Light from behind bent under */}
                <div className="w-[160px] h-[60px] border-b-[4px] border-orange-200/40 rounded-[100%] blur-[4px]" />
            </div>

        </div>
    );
}
