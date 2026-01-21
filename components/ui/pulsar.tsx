"use client";

import { motion } from "framer-motion";

export function Pulsar() {
    return (
        <div className="relative flex items-center justify-center w-[300px] h-[300px]">
            {/* 1. Core Glow (The Neutron Star) */}
            <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_40px_rgba(200,220,255,0.9)] z-20 animate-pulse" />

            {/* 2. Rapidly Rotating Beams (The Lighthouse Effect) */}
            <motion.div
                className="absolute w-full h-full flex items-center justify-center pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }} // Very fast rotation (600 RPM)
            >
                {/* Top Beam */}
                <div className="absolute top-1/2 left-1/2 w-[80px] h-[600px] -translate-x-1/2 -translate-y-full origin-bottom opacity-40"
                    style={{
                        background: 'linear-gradient(to top, rgba(200,230,255,0.8) 0%, rgba(100,150,255,0.1) 60%, transparent 100%)',
                        filter: 'blur(8px)',
                        clipPath: 'polygon(40% 100%, 60% 100%, 100% 0%, 0% 0%)'
                    }}
                />

                {/* Bottom Beam */}
                <div className="absolute top-1/2 left-1/2 w-[80px] h-[600px] -translate-x-1/2 origin-top opacity-40"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(200,230,255,0.8) 0%, rgba(100,150,255,0.1) 60%, transparent 100%)',
                        filter: 'blur(8px)',
                        clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)'
                    }}
                />
            </motion.div>

            {/* 3. Magnetic Field Rings (Accretion) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-[120px] h-[120px] rounded-full border border-blue-400/20 z-10"
                style={{ transform: 'rotateX(60deg)' }}
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-[180px] h-[180px] rounded-full border border-purple-400/10 z-10"
                style={{ transform: 'rotateX(60deg) rotateY(10deg)' }}
            />
        </div>
    );
}
