"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnergyBeamProps {
    projectId?: string; // Kept for compatibility but unused
    className?: string;
}

const EnergyBeam: React.FC<EnergyBeamProps> = ({ className }) => {
    return (
        <div className={cn("relative w-full h-full min-h-[300px] flex items-center justify-center bg-black overflow-hidden", className)}>

            {/* 1. Background Star Noise */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at center, white 0.5px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* 2. Rotating Accretion Disk (Outer) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full opacity-60 blur-2xl"
                style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, #ff5c00 20%, #c084fc 40%, transparent 60%, #00b8ff 80%, transparent 100%)'
                }}
            />

            {/* 3. Rotating Accretion Disk (Inner - Faster) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-[220px] h-[220px] md:w-[260px] md:h-[260px] rounded-full opacity-80 blur-xl"
                style={{
                    background: 'conic-gradient(from 180deg, transparent 0%, #facc15 30%, #fb7185 50%, transparent 80%)'
                }}
            />

            {/* 4. The Event Horizon (Black Hole) */}
            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-black rounded-full shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 flex items-center justify-center">
                {/* Inner Shadow for Depth */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,1)]" />

                {/* Tiny Singularity or Reflection */}
                <div className="w-1 h-1 bg-white rounded-full opacity-50 blur-[1px]" />
            </div>

            {/* 5. Particle Effects (Orbiting Dots) */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
                    initial={{ rotate: i * 60 }}
                    animate={{ rotate: i * 60 + 360 }}
                    transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-2 h-2 bg-white rounded-full blur-[1px] absolute top-0 left-1/2 -translate-x-1/2" />
                </motion.div>
            ))}

            {/* 6. Horizontal Energy Beams (The "Jet") */}
            {/* Left Beam */}
            <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-[500px] h-1 bg-gradient-to-l from-white/80 via-blue-500/50 to-transparent blur-md mix-blend-screen" />
            <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-[300px] h-[1px] bg-gradient-to-l from-white via-cyan-400 to-transparent opacity-90" />

            {/* Right Beam */}
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[500px] h-1 bg-gradient-to-r from-white/80 via-purple-500/50 to-transparent blur-md mix-blend-screen" />
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[300px] h-[1px] bg-gradient-to-r from-white via-pink-400 to-transparent opacity-90" />

            {/* Overlay Gradient for seamless integration with container */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>
    );
};

export default EnergyBeam;
