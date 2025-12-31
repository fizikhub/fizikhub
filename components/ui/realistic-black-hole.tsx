"use client";

import { motion } from "framer-motion";

export function RealisticBlackHole() {
    return (
        <div className="relative flex items-center justify-center w-[600px] h-[600px] pointer-events-none">
            {/* 1. GRAVITATIONAL LENSING (Outer distortion) */}
            <div className="absolute inset-0 rounded-full bg-transparent opacity-20 blur-3xl shadow-[0_0_100px_rgba(234,88,12,0.3)] animate-pulse" />

            {/* 2. ACCRETION DISK (The spinning matter) */}
            {/* Uses a 3D transformed container to look like a disk */}
            <div className="absolute inset-[100px] perspective-[1000px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }} // Slow rotation
                    className="relative w-full h-full flex items-center justify-center"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: "rotateX(75deg)", // Tilt it to make it a disk/ring
                    }}
                >
                    {/* The Swirl Gradient */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: "conic-gradient(from 0deg, transparent 0%, rgba(234,88,12,0) 20%, rgba(234,88,12,0.8) 40%, rgba(253,224,71,1) 50%, rgba(234,88,12,0.8) 60%, rgba(234,88,12,0) 80%, transparent 100%)",
                            filter: "blur(4px)",
                            boxShadow: "0 0 40px rgba(234,88,12,0.4)"
                        }}
                    />
                    {/* Second Layer for complexity */}
                    <div
                        className="absolute inset-4 rounded-full"
                        style={{
                            background: "conic-gradient(from 180deg, transparent 0%, rgba(234,88,12,0) 10%, rgba(180,60,0,0.8) 45%, rgba(253,224,71,0.8) 50%, rgba(180,60,0,0.8) 55%, transparent 100%)",
                            filter: "blur(8px)",
                            opacity: 0.7
                        }}
                    />
                </motion.div>
            </div>

            {/* 3. EVENT HORIZON (The Black Sphere) */}
            {/* Sitting vertically in the middle, blocking the view */}
            <div className="relative w-32 h-32 bg-black rounded-full z-10 shadow-[0_0_50px_rgba(0,0,0,1)]">
                {/* Photon Ring (The thin bright ring immediately around the shadow) */}
                <div className="absolute inset-[-2px] rounded-full border-[1px] border-orange-200/40 blur-[1px] shadow-[0_0_15px_rgba(255,200,100,0.6)]" />

                {/* Inner Darkness gradient to give roundness */}
                <div className="absolute inset-0 rounded-full bg-radial-gradient from-black to-neutral-900" />
            </div>

            {/* 4. FRONT ACCRETION (The part of the disk 'in front' of the black hole) */}
            {/* Visual trick: We need a part of the disk to appear IN FRONT of the sphere. 
                But CSS 3D sorting is tricky. 
                Instead, we use a semi-transparent overlay or a second disk segment if needed.
                For now, the sphere (z-10) sits on top of the tilted disk.
                To make it look like Interstellar (disk goes BEHIND and IN FRONT), 
                we would need two half-disks. 
                Let's stick to a simpler "top down tilted" view or just a glowing halo for now.
             */}

            {/* Simulation of the "upper" arch of the photon sphere getting bent */}
            <div className="absolute -top-12 w-48 h-24 bg-orange-500/10 blur-2xl rounded-t-full z-0" />
        </div>
    );
}

// Interstellar-style complex implementation component
export function InterstellarBlackHole() {
    return (
        <div className="relative w-[800px] h-[800px] flex items-center justify-center overflow-hidden pointer-events-none perspective-[1000px]">
            {/* The Disk: Tilted */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="w-[600px] h-[600px]"
                >
                    <div className="w-full h-full rounded-full"
                        style={{
                            background: "radial-gradient(circle, transparent 30%, rgba(245,158,11,0.8) 35%, rgba(0,0,0,0) 70%)",
                            filter: "blur(20px)",
                            transform: "rotateX(70deg) scale(1.5)"
                        }}
                    />
                </motion.div>
            </div>

            <div className="absolute w-[200px] h-[200px] bg-black rounded-full shadow-[0_0_60px_rgba(245,158,11,0.6)] z-10 border border-white/10">
                <div className="absolute inset-[-4px] rounded-full border border-orange-100/30 blur-sm" />
            </div>

            {/* Warped Light Top */}
            <div className="absolute top-[280px] w-[300px] h-[150px] bg-orange-500/20 blur-2xl rounded-t-full z-0 transform -translate-y-1/2" />

            {/* Warped Light Bottom */}
            <div className="absolute bottom-[280px] w-[300px] h-[150px] bg-orange-500/20 blur-2xl rounded-b-full z-20 transform translate-y-1/2" />
        </div>
    );
}
