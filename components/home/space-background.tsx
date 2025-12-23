"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SpaceBackground() {
    // Keep high-level state for complex DOM-based animations
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number; angle: number } | null>(null);
    const [ufo, setUfo] = useState<{ id: number } | null>(null);

    // Canvas ref for high-performance stars
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Star properties
        const starCount = 100; // Increased count slightly since canvas is cheap
        const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];

        // Initialize stars
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2, // 0 to 2px
                opacity: Math.random(),
                speed: Math.random() * 0.05 // scintillation speed
            });
        }

        let animationFrameId: number;

        const render = () => {
            if (!canvas || !ctx) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw pure black background (optional, can be done with CSS)
            // ctx.fillStyle = 'black';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw stars
            ctx.fillStyle = 'white';
            stars.forEach(star => {
                // Twinkle effect
                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0.2) {
                    star.speed = -star.speed;
                }

                ctx.globalAlpha = Math.max(0.2, Math.min(1, star.opacity));
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        const shootingStarInterval = setInterval(() => {
            const startX = Math.random() * 100;
            const startY = Math.random() * 50;
            const angle = 45;

            setShootingStar({
                x: startX,
                y: startY,
                delay: 0,
                angle: angle
            });

            setTimeout(() => setShootingStar(null), 1500);
        }, 8000);

        // Initial UFO
        const ufoTimeout = setTimeout(() => setUfo({ id: 1 }), 2000);

        const ufoInterval = setInterval(() => {
            setUfo({ id: Date.now() });
            setTimeout(() => setUfo(null), 10000);
        }, 20000);

        return () => {
            clearInterval(shootingStarInterval);
            clearInterval(ufoInterval);
            clearTimeout(ufoTimeout);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
            {/* Canvas for Stars */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block w-full h-full"
                style={{ background: 'black' }}
            />

            {/* Planets - Optimized: Reduced blur and complexity */}
            <motion.div
                className="absolute top-[10%] right-[5%] w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-full mix-blend-screen opacity-30 will-change-transform"
                style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(100, 100, 200, 0.4), transparent 70%)",
                    filter: "blur(20px)",
                }}
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-[20%] left-[5%] w-[80px] h-[80px] sm:w-[150px] sm:h-[150px] rounded-full mix-blend-screen opacity-20 will-change-transform"
                style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(100, 200, 255, 0.4), transparent 70%)",
                    filter: "blur(20px)",
                }}
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Enhanced Shooting Star */}
            {shootingStar && (
                <motion.div
                    key="shooting-star"
                    initial={{
                        top: `${shootingStar.y}%`,
                        left: `${shootingStar.x}%`,
                        opacity: 0,
                        transform: `rotate(${shootingStar.angle}deg) scale(0.5) translateX(0)`
                    }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        transform: `rotate(${shootingStar.angle}deg) scale(1) translateX(300px)`
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute z-0 pointer-events-none will-change-transform"
                    style={{
                        width: "150px",
                        height: "2px",
                        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
                    }}
                >
                    <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
            )}

            {/* Realistic UFO Animation */}
            {ufo && (
                <motion.div
                    key={ufo.id}
                    initial={{
                        top: "20%",
                        left: "-10%",
                        scale: 0.8,
                        rotate: 15
                    }}
                    animate={{
                        left: "110%",
                        top: ["20%", "60%", "30%", "50%"],
                        rotate: [15, -10, 20, 0],
                        scale: [0.8, 1.2, 0.9, 0.8]
                    }}
                    transition={{
                        duration: 8,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.7, 1]
                    }}
                    className="absolute z-20 will-change-transform"
                >
                    {/* Metallic Saucer Body */}
                    <div className="relative w-24 h-10">
                        {/* Glass Dome */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-6 bg-cyan-400/30 rounded-t-full border border-cyan-200/50 z-10" />

                        {/* Green Alien */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-5 z-10 flex flex-col items-center justify-end">
                            <div className="w-3 h-3 bg-green-500 rounded-full relative">
                                <div className="absolute top-1 left-0.5 w-0.5 h-1 bg-black rounded-full skew-x-12 opacity-80" />
                                <div className="absolute top-1 right-0.5 w-0.5 h-1 bg-black rounded-full -skew-x-12 opacity-80" />
                            </div>
                            <div className="w-2 h-2 bg-green-600 rounded-t-sm -mt-0.5" />
                        </div>

                        {/* Metallic Rim Top */}
                        <div className="absolute top-0 w-full h-full bg-slate-300 rounded-[50%] z-0 border-t border-slate-100/50"
                            style={{ background: 'linear-gradient(to bottom, #cbd5e1, #94a3b8)' }} />

                        {/* Engine Ring */}
                        <div className="absolute top-[40%] left-[5%] w-[90%] h-[60%] bg-slate-800 rounded-[50%] z-[-1] flex items-center justify-around px-4">
                            {/* Rotating Lights */}
                            {[0, 0.15, 0.3, 0.45].map((delay, i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-cyan-400"
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: delay }}
                                />
                            ))}
                        </div>

                        {/* Bottom Glow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-cyan-500/40 blur-sm rounded-[50%]" />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
