"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SolarSystem() {
    // Planets configuration: color, size, orbit size (radius), speed (duration)
    const planets = [
        { name: "Mercury", color: "bg-stone-300", size: "w-[4px] h-[4px]", orbit: "w-[120px] h-[120px]", duration: 8, zIndex: 10 },
        { name: "Venus", color: "bg-orange-200", size: "w-[8px] h-[8px]", orbit: "w-[160px] h-[160px]", duration: 12, zIndex: 10 },
        { name: "Earth", color: "bg-blue-500", size: "w-[9px] h-[9px]", orbit: "w-[210px] h-[210px]", duration: 20, zIndex: 20 },
        { name: "Mars", color: "bg-red-500", size: "w-[7px] h-[7px]", orbit: "w-[260px] h-[260px]", duration: 32, zIndex: 10 },
        { name: "Jupiter", color: "bg-orange-300", size: "w-[24px] h-[24px]", orbit: "w-[380px] h-[380px]", duration: 60, zIndex: 30 }, // Large
        { name: "Saturn", color: "bg-yellow-200", size: "w-[20px] h-[20px]", orbit: "w-[520px] h-[520px]", duration: 90, zIndex: 25, hasRings: true },
        { name: "Uranus", color: "bg-cyan-300", size: "w-[14px] h-[14px]", orbit: "w-[640px] h-[640px]", duration: 120, zIndex: 15 },
        { name: "Neptune", color: "bg-blue-600", size: "w-[14px] h-[14px]", orbit: "w-[740px] h-[740px]", duration: 160, zIndex: 15 },
    ];

    return (
        <div className="relative flex items-center justify-center w-[900px] h-[900px]" style={{ transformStyle: 'preserve-3d' }}>

            {/* THE SUN */}
            <div className="absolute w-16 h-16 rounded-full bg-orange-100 shadow-[0_0_100px_rgba(255,160,50,0.8)] z-50">
                <div className="absolute inset-0 bg-yellow-500 rounded-full blur-[2px] opacity-80" />
                <div className="absolute inset-[-4px] bg-orange-500 rounded-full blur-[8px] opacity-40 animate-pulse" />
            </div>

            {/* PLANETS */}
            {planets.map((planet, i) => (
                <div key={planet.name} className={cn("absolute rounded-full border border-white/5", planet.orbit)} style={{ transformStyle: 'preserve-3d' }}>
                    <motion.div
                        className="absolute w-full h-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: planet.duration, repeat: Infinity, ease: "linear" }}
                    >
                        {/* The Planet itself - Positioned at top of orbit loop (offset -50% for centering) */}
                        <div
                            className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg", planet.color, planet.size)}
                            style={{
                                boxShadow: `0 0 10px ${planet.color.replace('bg-', '')}` // Approximate glow
                            }}
                        >
                            {/* Saturn's Rings */}
                            {planet.hasRings && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full border-[3px] border-stone-400/60 skew-x-12 scale-y-50" />
                            )}
                        </div>
                    </motion.div>
                </div>
            ))}

            {/* ASTEROID BELT (Between Mars and Jupiter) */}
            <div className="absolute w-[320px] h-[320px] rounded-full border-[12px] border-dotted border-white/5 opacity-30 animate-[spin_200s_linear_infinite]" />

        </div>
    );
}
