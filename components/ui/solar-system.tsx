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

            {/* THE SUN - Enhanced Glow */}
            <div className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-50 shadow-[0_0_80px_rgba(255,140,0,0.6)] z-50">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-600 rounded-full blur-[1px]" />
                <div className="absolute inset-[-4px] bg-orange-400/30 rounded-full blur-[6px] animate-pulse" />
            </div>

            {/* PLANETS */}
            {planets.map((planet, i) => (
                <div key={planet.name} className={cn("absolute rounded-full border border-white/[0.08]", planet.orbit)} style={{ transformStyle: 'preserve-3d' }}>
                    <motion.div
                        className="absolute w-full h-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: planet.duration, repeat: Infinity, ease: "linear" }}
                    >
                        {/* The Planet itself */}
                        <div
                            className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm", planet.size)}
                            style={{
                                backgroundColor: !planet.color.includes('gradient') ? 'currentColor' : undefined,
                            }}
                        >
                            {/* Planet Body with 3D Shader Effect - applies depth safely */}
                            <div className={cn("w-full h-full rounded-full", planet.color)} style={{
                                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 20%, rgba(0,0,0,0.1) 100%)`, // Highlight
                                boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.5)' // Shadow
                            }} />

                            {/* Saturn's Rings */}
                            {planet.hasRings && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240%] h-[240%] rounded-full border-[3px] border-stone-300/30 skew-x-12 scale-y-[0.3]" />
                            )}
                        </div>
                    </motion.div>
                </div>
            ))}

            {/* ASTEROID BELT - Refined */}
            <div className="absolute w-[320px] h-[320px] rounded-full border-[6px] border-dotted border-white/20 opacity-30 animate-[spin_240s_linear_infinite]"
                style={{ maskImage: 'radial-gradient(transparent 50%, black 100%)' }} />

        </div>
    );
}
