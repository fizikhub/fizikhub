"use client";

import { motion } from "framer-motion";

export function Pulsar() {
    return (
        <div className="relative flex items-center justify-center w-[500px] h-[500px]">
            {/* 1. Ambient Glow (Large, soft blue atmosphere) */}
            <div className="absolute inset-0 rounded-full bg-blue-900/10 blur-[80px]" />

            {/* 2. Magnetic Rings (Slowly rotating, tilted) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <div className="w-[300px] h-[300px] rounded-full border border-blue-400/10 blur-[1px] skew-x-12 scale-y-75" />
                <div className="absolute w-[250px] h-[250px] rounded-full border border-purple-400/10 blur-[1px] skew-y-12 scale-75" />
            </motion.div>

            {/* 3. The Jet Beams (Cone shaped, soft, transparent) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full flex items-center justify-center pointer-events-none"
            >
                {/* North Jet */}
                <div
                    className="absolute top-1/2 left-1/2 w-[60px] h-[300px] origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                        background: 'conic-gradient(from 180deg at 50% 100%, transparent 160deg, rgba(150, 200, 255, 0.4) 180deg, transparent 200deg)',
                        filter: 'blur(20px)',
                    }}
                />
                {/* South Jet */}
                <div
                    className="absolute top-1/2 left-1/2 w-[60px] h-[300px] origin-top -translate-x-1/2"
                    style={{
                        background: 'conic-gradient(from 0deg at 50% 0%, transparent 160deg, rgba(150, 200, 255, 0.4) 180deg, transparent 200deg)',
                        filter: 'blur(20px)',
                    }}
                />
            </motion.div>

            {/* 4. Core Neutron Star (Small, dense, blindingly bright) */}
            <div className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_30px_rgba(100,200,255,1)] z-20 animate-pulse">
                {/* Inner Halo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-400/30 rounded-full blur-md" />
            </div>

            {/* 5. Accretion Disk (Small, intense ring near core) */}
            <div
                className="absolute w-16 h-16 rounded-full border-2 border-white/20 blur-[2px]"
                style={{ transform: 'rotateX(70deg)' }}
            />
        </div>
    );
}
