"use client";

import { motion, useAnimation } from "framer-motion";
import { Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CustomRocketIcon } from "@/components/ui/custom-rocket-icon";

const Particle = ({ delay }: { delay: number }) => {
    const [randoms, setRandoms] = useState({ x: 0, y: 0, delay: 0 });
    useEffect(() => {
        const timer = setTimeout(() => {
            setRandoms({
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40,
                delay: Math.random() * 0.2
            });
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="absolute left-1/2 top-1/2 w-1 h-1 bg-primary rounded-full"
            initial={{ x: randoms.x, y: randoms.y, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: randoms.delay }}
        />
    );
};

const SteamParticle = ({ delay }: { delay: number }) => {
    const [randomX, setRandomX] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            setRandomX((Math.random() - 0.5) * 20);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full blur-sm"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0, 2], y: -20, x: randomX }}
            transition={{ duration: 1, delay }}
        />
    );
};

export function Logo() {
    const [isLaunching, setIsLaunching] = useState(false);
    const [warpState, setWarpState] = useState<'idle' | 'charging' | 'warping' | 'cooldown'>('idle');
    const controls = useAnimation();

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
        setWarpState('charging');

        // 1. Charge Up Phase (1s)
        await controls.start({
            x: [0, -2, 2, -2, 2, 0],
            y: [0, 1, -1, 1, -1, 0],
            scale: [1, 0.9, 0.85],
            filter: ["brightness(1)", "brightness(1.5)", "brightness(2)"],
            transition: { duration: 1, ease: "easeInOut" }
        });

        setWarpState('warping');

        // 2. Warp Phase (0.5s) - Shoot forward
        await controls.start({
            x: [0, 300], // Shoot right
            scaleX: [0.85, 3], // Stretch
            scaleY: [0.85, 0.1], // Thin out
            opacity: [1, 0],
            transition: { duration: 0.2, ease: "easeIn" }
        });

        // 3. Teleport / Re-entry (0.5s)
        setWarpState('cooldown');
        controls.set({ x: -300, scaleX: 3, scaleY: 0.1, opacity: 0 }); // Reset to left side

        await controls.start({
            x: 0,
            scaleX: [3, 1],
            scaleY: [0.1, 1],
            opacity: [0, 1],
            transition: { duration: 0.4, ease: "easeOut" }
        });

        // 4. Cooldown / Steam
        await controls.start({
            filter: ["brightness(2)", "brightness(1)"],
            transition: { duration: 0.5 }
        });

        setWarpState('idle');
        setIsLaunching(false);
    };

    return (
        <div className="flex items-center gap-2 group select-none relative">
            <div className="relative z-50 cursor-pointer" onClick={handleLaunch}>
                <div className="relative w-10 h-10 flex items-center justify-center">

                    {/* Charge Up Particles */}
                    {warpState === 'charging' && (
                        <div className="absolute inset-0">
                            {[...Array(8)].map((_, i) => (
                                <Particle key={i} delay={i * 0.02} />
                            ))}
                        </div>
                    )}

                    <motion.div
                        animate={warpState === 'idle' ? { y: [0, -4, 0] } : controls}
                        transition={warpState === 'idle' ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
                        className="relative z-10"
                    >
                        {/* Rocket Container */}
                        <CustomRocketIcon className={`h-7 w-7 text-primary drop-shadow-[0_0_15px_rgba(234,88,12,0.6)] ${warpState === 'charging' ? 'animate-pulse' : ''}`} />

                        {/* Engine Glow */}
                        <motion.div
                            className="absolute bottom-1 left-1.5 w-4 h-4 bg-primary/50 rounded-full blur-md -z-10"
                            animate={{
                                scale: warpState === 'charging' ? [1, 2] : [0.6, 1, 0.6],
                                opacity: warpState === 'charging' ? [0.5, 1] : [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: warpState === 'charging' ? 0.1 : 2, repeat: Infinity }}
                        />
                    </motion.div>

                    {/* Warp Trail (Visual only during warp) */}
                    {warpState === 'warping' && (
                        <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 2, opacity: 1 }}
                            transition={{ duration: 0.1 }}
                        />
                    )}

                    {/* Cooldown Steam */}
                    {warpState === 'cooldown' && (
                        <>
                            {[...Array(3)].map((_, i) => (
                                <SteamParticle key={`steam-${i}`} delay={i * 0.1} />
                            ))}
                        </>
                    )}
                </div>
            </div>

            <Link href="/" className="flex flex-col cursor-pointer">
                <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-black to-black dark:from-white dark:to-white group-hover:from-primary group-hover:to-primary transition-all duration-300 pb-1">
                    FİZİKHUB
                </span>
            </Link>
        </div>
    );
}
