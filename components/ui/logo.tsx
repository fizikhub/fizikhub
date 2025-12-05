"use client";

import { motion, useAnimation } from "framer-motion";
import { Rocket } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function Logo() {
    const [isLaunching, setIsLaunching] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [randomValues, setRandomValues] = useState<{
        debris: { angle: number; distance: number; rotate: number; duration: number }[];
        sparks: { angle: number; distance: number; duration: number }[];
        smoke: { x: number; y: number }[];
        flames: { x: number; y: number; duration: number; delay: number }[];
        smokeParticles: { x: number; y: number }[];
    }>({ debris: [], sparks: [], smoke: [], flames: [], smokeParticles: [] });

    const controls = useAnimation();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);

        // Generate random values once on mount to avoid hydration mismatch
        setRandomValues({
            debris: Array.from({ length: 20 }).map(() => ({
                angle: Math.random() * Math.PI * 2,
                distance: 150 + Math.random() * 150,
                rotate: Math.random() * 720,
                duration: 1 + Math.random() * 0.8
            })),
            sparks: Array.from({ length: 30 }).map(() => ({
                angle: Math.random() * 0.8,
                distance: 100 + Math.random() * 150,
                duration: 0.5 + Math.random() * 0.5
            })),
            smoke: Array.from({ length: 8 }).map(() => ({
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200 + 50
            })),
            flames: Array.from({ length: 12 }).map(() => ({
                x: -10 - Math.random() * 8,
                y: 10 + Math.random() * 10,
                duration: 0.4 + Math.random() * 0.4,
                delay: Math.random() * 0.1
            })),
            smokeParticles: Array.from({ length: 5 }).map(() => ({
                x: -15 - Math.random() * 6,
                y: 15 + Math.random() * 8
            }))
        });

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Einstein Mode Trigger Logic
    const [tapCount, setTapCount] = useState(0);
    const tapTimeout = useRef<NodeJS.Timeout>(null);

    const handleTap = () => {
        // Request DeviceMotion permission on iOS 13+ on first tap
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (tapCount === 0 && typeof DeviceMotionEvent !== 'undefined' && (DeviceMotionEvent as any).requestPermission) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (DeviceMotionEvent as any).requestPermission()
                .then((response: string) => {
                    if (response === 'granted') {
                        console.log("Motion permission granted");
                    }
                })
                .catch(console.error);
        }

        setTapCount(prev => {
            const newCount = prev + 1;
            if (newCount === 5) {
                // Trigger Einstein Mode
                window.dispatchEvent(new Event("einstein-mode-trigger"));
                return 0;
            }
            return newCount;
        });

        // Reset tap count if not tapped again within 500ms
        if (tapTimeout.current) clearTimeout(tapTimeout.current);
        tapTimeout.current = setTimeout(() => {
            setTapCount(0);
        }, 500);
    };

    const handleLaunch = async () => {
        handleTap(); // Check for Einstein tap

        if (isLaunching) return;
        setIsLaunching(true);

        const w = windowSize.width;
        const h = windowSize.height;

        // Calculate orbital flight path
        const xPath: number[] = [];
        const yPath: number[] = [];
        const rotatePath: number[] = [];

        // Initial launch - straight up then curve
        xPath.push(0); yPath.push(0); rotatePath.push(0);
        xPath.push(20); yPath.push(-50); rotatePath.push(15);
        xPath.push(50); yPath.push(-150); rotatePath.push(30);

        // Orbital loop
        const centerX = w * 0.5;
        const centerY = h * 0.4;
        const radiusX = w * 0.4;
        const radiusY = h * 0.3;

        for (let i = 0; i <= 20; i++) {
            const angle = (i / 20) * Math.PI * 2 - Math.PI / 2; // Start from top
            const x = centerX + Math.cos(angle) * radiusX;
            const y = centerY + Math.sin(angle) * radiusY;

            // Adjust coordinates relative to start position
            xPath.push(x - 20); // Offset adjustments
            yPath.push(y);

            // Calculate rotation based on tangent
            const nextAngle = ((i + 1) / 20) * Math.PI * 2 - Math.PI / 2;
            const nextX = centerX + Math.cos(nextAngle) * radiusX;
            const nextY = centerY + Math.sin(nextAngle) * radiusY;
            const rotation = Math.atan2(nextY - y, nextX - x) * (180 / Math.PI) + 90;

            rotatePath.push(rotation);
        }

        // Final crash dive
        xPath.push(w * 0.8); yPath.push(h * 0.8); rotatePath.push(135);

        // Execute animation sequence
        await controls.start({
            x: xPath,
            y: yPath,
            rotate: rotatePath,
            scale: [1, 1.5, 1.5, 1.5, 0.5],
            opacity: [1, 1, 1, 1, 0],
            transition: {
                duration: 3.5,
                ease: "easeInOut",
                times: [0, 0.1, 0.2, 0.8, 1]
            }
        });

        // Trigger explosion
        setShowExplosion(true);

        // Screen shake effect
        const body = document.body;
        body.style.animation = 'shake 0.5s';
        setTimeout(() => {
            body.style.animation = '';
        }, 500);

        setTimeout(() => {
            setShowExplosion(false);
        }, 1200);

        setTimeout(() => {
            controls.set({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
            setIsLaunching(false);
        }, 2000);
    };

    return (
        <div className="flex items-center gap-2 group select-none relative">
            {/* Epic Explosion Effect */}
            {showExplosion && (
                <div
                    className="fixed z-[100] pointer-events-none"
                    style={{
                        left: windowSize.width * 0.8,
                        top: windowSize.height * 0.8
                    }}
                >
                    <div className="relative transform -translate-x-1/2 -translate-y-1/2">
                        {/* Shockwave ring */}
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: [0, 15], opacity: [1, 0] }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 w-20 h-20 border-4 border-primary rounded-full -translate-x-1/2 -translate-y-1/2"
                        />

                        {/* Main explosion core */}
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: [0, 8], opacity: [1, 0] }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 w-32 h-32 bg-gradient-radial from-white via-primary to-black rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"
                        />

                        {/* Debris particles - Industrial Squares */}
                        {randomValues.debris.map((val, i) => {
                            const x = Math.cos(val.angle) * val.distance;
                            const y = Math.sin(val.angle) * val.distance;

                            return (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-black dark:bg-white border border-primary"
                                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                                    animate={{
                                        x: x,
                                        y: y,
                                        opacity: [1, 1, 0],
                                        rotate: val.rotate,
                                    }}
                                    transition={{
                                        duration: val.duration,
                                        ease: "easeOut"
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="relative z-50 cursor-pointer" onClick={handleLaunch}>
                <motion.div
                    animate={controls}
                    className={`relative ${isLaunching ? 'fixed z-[60] top-4 left-4' : ''}`}
                >
                    {/* Idle Hover Animation */}
                    <motion.div
                        animate={!isLaunching ? {
                            y: [0, -3, 0],
                            rotate: [0, 2, -2, 0],
                        } : {}}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative"
                    >
                        <Rocket className="h-7 w-7 text-primary z-10 relative drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]" />

                        {/* Engine Idle Glow */}
                        {!isLaunching && (
                            <motion.div
                                className="absolute bottom-1 left-1.5 w-4 h-4 bg-primary/40 rounded-full blur-md"
                                animate={{
                                    opacity: [0.4, 0.8, 0.4],
                                    scale: [0.8, 1.2, 0.8],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}

                        {/* Enhanced Fire Effect (Only visible during launch or hover) */}
                        <div className={`absolute top-[20px] left-[5px] z-0 transition-opacity duration-300 ${isLaunching ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {/* Main flame jet */}
                            <motion.div
                                className="absolute -top-1 -left-1 w-4 h-8 bg-gradient-to-b from-primary via-orange-500 to-transparent rounded-full blur-sm"
                                animate={{
                                    height: [20, 35, 20],
                                    opacity: [0.8, 1, 0.8],
                                }}
                                transition={{ duration: 0.2, repeat: Infinity }}
                            />

                            {/* Particles */}
                            {randomValues.flames.map((val, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-primary rounded-sm"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        y: [0, 20 + val.y],
                                        x: [(Math.random() - 0.5) * 10],
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        delay: i * 0.05,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Link href="/" className="flex flex-col cursor-pointer">
                <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-black to-black dark:from-white dark:to-white group-hover:from-primary group-hover:to-primary transition-all duration-300 pb-1">
                    FİZİKHUB
                </span>
            </Link>
        </div>
    );
}
