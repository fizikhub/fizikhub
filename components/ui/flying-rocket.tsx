"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SiteLogo } from "@/components/icons/site-logo";

interface FlyingRocketProps {
    onComplete: () => void;
    startRect: DOMRect | null;
}

export function FlyingRocket({ onComplete, startRect }: FlyingRocketProps) {
    const [mounted, setMounted] = useState(false);
    const [phase, setPhase] = useState<'launch' | 'orbit' | 'explode'>('launch');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Create container for portal if it doesn't exist (though usually we use body)
    if (!mounted || !startRect) return null;

    return createPortal(
        <AnimatePresence onExitComplete={onComplete}>
            <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
                {/* Rocket Animation */}
                {phase !== 'explode' && (
                    <motion.div
                        initial={{
                            x: startRect.left,
                            y: startRect.top,
                            scale: 1,
                            rotate: 0
                        }}
                        animate={phase === 'launch' ? {
                            x: [startRect.left, startRect.left + 100],
                            y: [startRect.top, startRect.top - 200],
                            scale: 1.5,
                            rotate: 45,
                            transition: { duration: 1, ease: "easeIn" }
                        } : {
                            x: [
                                startRect.left + 100,
                                window.innerWidth / 2,
                                window.innerWidth - 100,
                                window.innerWidth / 2,
                                startRect.left + 100
                            ],
                            y: [
                                startRect.top - 200,
                                100,
                                window.innerHeight / 2,
                                window.innerHeight - 100,
                                startRect.top - 200
                            ],
                            rotate: [45, 90, 180, 270, 360],
                            transition: {
                                duration: 3,
                                ease: "linear",
                                repeat: 2, // Do a couple of loops
                                times: [0, 0.25, 0.5, 0.75, 1]
                            }
                        }}
                        onAnimationComplete={(definition) => {
                            // Logic to transition phases
                            if (phase === 'launch') {
                                setPhase('orbit');
                            } else if (phase === 'orbit') {
                                setPhase('explode');
                            }
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute w-12 h-12"
                    >
                        <div className="relative w-full h-full">
                            <SiteLogo className="w-full h-full drop-shadow-[0_0_15px_rgba(255,100,0,0.8)]" />
                            {/* Thruster Flame */}
                            <motion.div
                                animate={{ height: [10, 20, 10], opacity: [0.8, 1, 0.8] }}
                                transition={{ repeat: Infinity, duration: 0.2 }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-t from-transparent to-orange-500 rounded-b-full blur-[2px]"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Explosion Effect */}
                {phase === 'explode' && (
                    <Explosion
                        x={startRect.left + 100} // Approximate end position of orbit
                        y={startRect.top - 200}
                        onComplete={onComplete}
                    />
                )}
            </div>
        </AnimatePresence>,
        document.body
    );
}

function Explosion({ x, y, onComplete }: { x: number, y: number, onComplete: () => void }) {
    const particleCount = 20;
    const colors = ["#ff0000", "#ffaa00", "#ffff00", "#ffffff"];

    useEffect(() => {
        const timer = setTimeout(onComplete, 1000); // Clean up after explosion
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="absolute" style={{ left: x, top: y }}>
            {Array.from({ length: particleCount }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                        x: (Math.random() - 0.5) * 300,
                        y: (Math.random() - 0.5) * 300,
                        scale: 0,
                        opacity: 0,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors[i % colors.length] }}
                />
            ))}
            <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white rounded-full blur-xl"
            />
        </div>
    );
}
