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

    const size = isMobile ? 320 : 500;
    const coreSize = isMobile ? 45 : 70; // Slightly larger event horizon

    return (
        <div
            className="relative flex items-center justify-center transform hover:scale-105 transition-transform duration-700"
            style={{ width: size, height: size }}
        >
            {/* 1. FAR GLOW - The heat radiated into space */}
            <div className="absolute rounded-full opacity-30 animate-pulse"
                style={{
                    width: '90%',
                    height: '90%',
                    background: 'radial-gradient(circle, rgba(255, 100, 0, 0.2) 0%, transparent 70%)',
                    filter: 'blur(50px)'
                }}
            />

            {/* 2. ACCRETION DISK (The Flat Swirl) */}
            {/* Tilted container for 3D effect */}
            <div className="absolute w-full h-full flex items-center justify-center" style={{ transform: 'rotateX(70deg) rotateZ(10deg)' }}>

                {/* Outer Disk - Redder, colder */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute rounded-full mix-blend-screen"
                    style={{
                        width: '85%',
                        height: '85%',
                        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(200, 50, 0, 0.6) 60deg, rgba(255, 100, 20, 0.3) 120deg, transparent 180deg, rgba(200, 50, 0, 0.6) 240deg, transparent 360deg)',
                        filter: 'blur(8px)',
                        boxShadow: '0 0 50px rgba(255, 50, 0, 0.2)'
                    }}
                />

                {/* Main Disk - Orange/Yellow, Hot */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute rounded-full"
                    style={{
                        width: '70%',
                        height: '70%',
                        // Complex gradient for streaks
                        background: 'conic-gradient(from 0deg, #300 0%, #d00 10%, #f80 20%, #ffc 25%, #f80 30%, #400 40%, #000 50%, #500 60%, #fa0 70%, #fff 75%, #fa0 80%, #600 90%, #200 100%)',
                        maskImage: 'radial-gradient(circle, transparent 35%, black 40%)',
                        WebkitMaskImage: 'radial-gradient(circle, transparent 35%, black 40%)',
                        filter: 'blur(1px)',
                        boxShadow: '0 0 30px rgba(255, 140, 0, 0.6)'
                    }}
                />

                {/* Inner Edge - White Hot */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute rounded-full mix-blend-add"
                    style={{
                        width: '45%',
                        height: '45%',
                        background: 'conic-gradient(from 180deg, transparent 0%, #fff 15%, #ff8 30%, transparent 50%, #fff 65%, transparent 100%)',
                        filter: 'blur(4px)',
                        opacity: 0.8
                    }}
                />
            </div>


            {/* 3. DOPPLER BEAMING (Asymmetry) */}
            {/* The left side of the rotating disk approaching us is brighter */}
            <div className="absolute left-[20%] top-[40%] w-[20%] h-[20%] bg-white/40 blur-[20px] rounded-full mix-blend-overlay z-10" />


            {/* 4. PHOTON RING (The thin circle of light) */}
            <div
                className="absolute rounded-full z-20 border-[2px] border-white/90 shadow-[0_0_15px_rgba(255,200,200,0.8)]"
                style={{
                    width: coreSize + 6, // Just outside the event horizon
                    height: coreSize + 6,
                    boxShadow: '0 0 10px #fff, inset 0 0 5px #fff'
                }}
            />

            {/* 5. EVENT HORIZON (The Shadow) */}
            <div
                className="absolute rounded-full z-30 flex items-center justify-center bg-black"
                style={{
                    width: coreSize,
                    height: coreSize,
                    boxShadow: '0 0 50px rgba(0,0,0,1)' // Deep shadow eating the light
                }}
            >
                <div className="w-[90%] h-[90%] rounded-full bg-black shadow-[inset_0_0_20px_rgba(0,0,0,1)]" />
            </div>

            {/* 6. GRAVITATIONAL LENSING (Top/Bottom Arcs) */}
            {/* Represents the back of the disk bent over the top/bottom */}
            <div className="absolute z-10 flex flex-col items-center justify-between" style={{ height: coreSize * 2.5 }}>
                {/* Top Lens */}
                <div className="w-[120px] h-[30px] bg-gradient-to-t from-transparent via-orange-500/50 to-transparent blur-[8px] rounded-[100%] transform -translate-y-2 opacity-80" />
                {/* Bottom Lens */}
                <div className="w-[120px] h-[30px] bg-gradient-to-b from-transparent via-orange-500/50 to-transparent blur-[8px] rounded-[100%] transform translate-y-2 opacity-80" />
            </div>

        </div>
    );
}
