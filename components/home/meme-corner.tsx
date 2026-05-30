"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Dynamically import the heavy 3D canvas (loads cleanly in the background)
const MemeCornerCanvas = dynamic(() => import("@/components/home/meme-corner-canvas"), {
    ssr: false,
});

export function MemeCorner() {
    const [load3D, setLoad3D] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Framer Motion Spring Values for 3D Tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 15, mass: 0.5 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 15, mass: 0.5 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

    useEffect(() => {
        // Skip only for users who prefer reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const enable3D = () => setLoad3D(true);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable3D, { timeout: 2500 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(enable3D, 1400);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        // Normalize coordinates to range [-0.5, 0.5]
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        
        x.set(nx);
        y.set(ny);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div 
            ref={containerRef}
            className="w-full relative group min-h-[180px] sm:min-h-[240px] perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className={cn(
                    "relative w-full h-[180px] sm:h-[240px] overflow-hidden cursor-pointer",
                    "rounded-none sm:rounded-none", // Brutalist hard corners
                    "border-2 sm:border-[3px] border-black",
                    "bg-zinc-950",
                    "bg-[radial-gradient(circle_at_50%_120%,rgba(60,0,120,0.5),transparent)]",
                    "noise-bg" // The new organic texture from globals.css
                )}
                style={{
                    rotateX,
                    rotateY,
                    transformPerspective: 1000,
                    transformStyle: "preserve-3d"
                }}
                whileHover={{ scale: 1.015, boxShadow: "8px 8px 0px 0px #000" }}
                initial={{ boxShadow: "4px 4px 0px 0px #000" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* 3D Canvas is deferred on desktop and skipped on mobile for faster first load. */}
                <div className="absolute inset-0 z-0">
                    {load3D && <MemeCornerCanvas />}
                </div>

                {/* Vignette - Simple overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

                {/* TEXT OVERLAY (Targeting this to be the fast LCP item) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-4 pb-6 sm:pb-10 text-center">

                    <p className="font-head text-[10px] sm:text-xs font-black tracking-[0.25em] text-blue-400/90 uppercase mb-1 sm:mb-2 drop-shadow-md">
                        BİLİMİ
                    </p>

                    <h1
                        className="font-head text-3xl xs:text-4xl sm:text-7xl font-black tracking-tighter leading-none bg-gradient-to-b from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)]"
                    >
                        <span className="sr-only">Fizikhub: Türkçe fizik, uzay ve bilim platformu - </span>
                        Tİ'YE ALIYORUZ
                    </h1>

                    <motion.div 
                        className="mt-3 sm:mt-4 origin-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <span className="inline-block bg-[#EAB308] border-[3px] border-black text-black px-3 py-1.5 sm:px-4 sm:py-2 font-black text-[9px] sm:text-xs uppercase shadow-[4px_4px_0px_0px_#000] tracking-wider relative overflow-hidden group/badge">
                            {/* Inner border dash accent for double-border handmade visual */}
                            <span className="absolute inset-[2px] border border-dashed border-black/20 pointer-events-none rounded-[1px]" />
                            AMA CİDDİLİ ŞEKİLDE
                        </span>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
}
